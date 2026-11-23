import { readFile, writeFile, rm, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const required = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_D1_DATABASE_ID', 'CLOUDFLARE_WORKER_NAME', 'APP_URL', 'OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET', 'SESSION_SECRET'];
const missing = required.filter(name => !process.env[name]);
if (missing.length) throw new Error(`Missing deployment settings: ${missing.join(', ')}`);
const appUrl = new URL(process.env.APP_URL);
if (appUrl.protocol !== 'https:' || appUrl.pathname !== '/' || appUrl.search || appUrl.hash) throw new Error('APP_URL must be the HTTPS Worker origin');
if (process.env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');
if (!/^[a-zA-Z0-9_-]+$/.test(process.env.CLOUDFLARE_WORKER_NAME)) throw new Error('Invalid Worker name');
if (!/^[0-9a-fA-F-]{36}$/.test(process.env.CLOUDFLARE_D1_DATABASE_ID)) throw new Error('Invalid D1 database ID');
if (process.argv.includes('--check')) {
  console.log('Deployment configuration is complete. No credentials printed or remote actions performed.');
  process.exit(0);
}

const configPath = resolve('.wrangler-production.json');
const secretDir = await mkdtemp(join(tmpdir(), 'dream-recorder-secrets-'));
try {
  const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
  config.name = process.env.CLOUDFLARE_WORKER_NAME;
  config.d1_databases[0].database_id = process.env.CLOUDFLARE_D1_DATABASE_ID;
  config.vars = { APP_URL: appUrl.origin };
  config.secrets = { required: ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'SESSION_SECRET'] };
  await writeFile(configPath, JSON.stringify(config), { mode: 0o600 });
  const secretPath = join(secretDir, 'runtime.json');
  await writeFile(secretPath, JSON.stringify({
    GITHUB_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET
  }), { mode: 0o600 });
  const run = args => {
    const result = spawnSync('node_modules/.bin/wrangler', args, { stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Wrangler exited with status ${result.status}`);
  };
  run(['d1', 'migrations', 'apply', 'DB', '--remote', '--force', '--config', configPath]);
  run(['deploy', '--config', configPath, '--secrets-file', secretPath]);
} finally {
  await rm(configPath, { force: true });
  await rm(secretDir, { recursive: true, force: true });
}
