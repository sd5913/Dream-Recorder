-- Fixture for a local D1 database only. Replace neither real records nor schema.
INSERT OR IGNORE INTO community_posts
(id, owner_id, source_id, title, body, excerpt, display_name, mood, thumbnail, created_at)
VALUES
('81264dde-bc89-49d1-94bd-043c8c104c6f', '909001', 'local-fixture-moon',
 '海上的月亮', '我梦见一轮月亮挂在海上，纸鸟从海面飞过，风很轻。',
 '我梦见一轮月亮挂在海上，纸鸟从海面飞过，风很轻。', '夜航员', 'calm', '', 1795579200000),
('843dc9ad-9954-4618-90fb-a3c61723229e', '909001', 'local-fixture-stairs',
 'The staircase at night', 'The stairs curled around a tower. A little red door opened above the clouds.',
 'The stairs curled around a tower. A little red door opened above the clouds.', 'Night Owl', 'strange', '', 1795575600000);
