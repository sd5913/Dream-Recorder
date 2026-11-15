'use strict';
/* ---------- missing-word log: words the app did not understand, kept on this device so the lexicon can be improved after playtests ---------- */
const MISS_KEY='dream-recorder-misses-v1';
function missList(){try{return JSON.parse(localStorage.getItem(MISS_KEY)||'[]');}catch(e){return [];}}
function logMiss(c,why){
  if(!c)return;
  const list=missList();
  list.push({time:new Date().toISOString(),why,text:c.text,unmatched:c.dust,drew:c.names.slice(),fallback:!!c.names.fallback});
  try{localStorage.setItem(MISS_KEY,JSON.stringify(list.slice(-200)));}catch(e){}
}
/* paste the result into a file or message to share playtest findings:  copy(JSON.stringify(missList(),null,1)) */
