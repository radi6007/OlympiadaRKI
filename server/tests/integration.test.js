import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import http from 'node:http';
import { createServer as createViteServer } from 'vite';
import { config } from '../config.js';
import { createPool, saveAttempt } from '../db.js';
import { loadScoring } from '../scoring.js';
import { validate, schemas } from '../validation.js';
import { synchronizeOne } from '../sync.js';
import { createApi } from '../api.js';
const cfg=config();cfg.mysql.database=process.env.TEST_MYSQL_DATABASE||'olympiad_test';
if(!cfg.mysql.database.endsWith('_test'))throw new Error('Test database must end in _test');
const pool=createPool(cfg),scoring=loadScoring(cfg.source);
const ids=[], delivered=new Map();let api,mock,apiURL,vite,uiURL,mode='ok',calls=0;
const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(`http://127.0.0.1:${server.address().port}`)));
const close=server=>new Promise(resolve=>server.close(resolve));
function attempt(testId='RKI-2-V1') {
 const id='LOCAL-QA-'+randomUUID();ids.push(id);
 return {testId,sid:id,surname:'LOCAL-QA',name:'Automated check',email:'qa@example.invalid',
  answers:Object.fromEntries(Object.keys(schemas[testId].Q).map(n=>[n,''])),startedAt:new Date(Date.now()-60000).toISOString(),finishedAt:new Date().toISOString(),seconds:60,auto:false,plays:0,lang:'ru',ua:'Local automated test'};
}
const row=async sid=>(await pool.execute('SELECT * FROM olympiad_attempts WHERE sid=?',[sid]))[0][0];
const post=async d=>{const r=await fetch(apiURL+'/api/attempts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});return {status:r.status,body:await r.json()}};
before(async()=>{
 await pool.query(readFileSync(new URL('../migrations/001_attempts.sql',import.meta.url),'utf8'));
 mock=http.createServer(async(req,res)=>{
  calls++;let raw='';for await(const c of req)raw+=c;const p=JSON.parse(raw);
  if(mode==='http'){res.writeHead(503);res.end('Unavailable');return}
  if(mode==='bad-json'){res.end('<html>Error</html>');return}
  if(mode==='false'){res.end(JSON.stringify({ok:false,error:'Sheet unavailable'}));return}
  const dup=delivered.has(p.sid);if(!dup)delivered.set(p.sid,p);
  const g=scoring.grade(p.testId,p.answers);
  res.end(JSON.stringify({ok:true,score:g.total,max:g.max,dup}));
 });
 cfg.url=await listen(mock);cfg.syncTimeout=1000;
 api=createApi(pool,scoring);apiURL=await listen(api);
 vite=await createViteServer({configFile:false,define:{'import.meta.env.VITE_RESULTS_MODE':'"api"'},server:{host:'127.0.0.1',port:5192,strictPort:true,fs:{deny:['**/.private/**','**/server/**','**/.env*','**/*.gs']}}});
 await vite.listen();uiURL='http://127.0.0.1:5192';
});
after(async()=>{
 for(const sid of ids)await pool.execute('DELETE FROM olympiad_attempts WHERE sid=?',[sid]);
 await vite.close();await close(api);await close(mock);await pool.end();
});
test('all six HTML schemas match private Code.gs; full, zero and partial credit',()=>{
 assert.deepEqual(Object.keys(scoring.tests).sort(),Object.keys(schemas).sort());
 for(const [testId,schema] of Object.entries(schemas)){
  const key=scoring.tests[testId].key;assert.deepEqual(Object.keys(key),Object.keys(schema.Q));
  const d=attempt(testId);
  for(const [n,k] of Object.entries(key)){
   assert.equal(k.p,schema.Q[n].pts);
   assert.equal(k.t||'one',schema.Q[n].type==='select'?'one':schema.Q[n].type||'one');
   d.answers[n]=k.t==='gap2'?k.a.map(a=>a[0]):k.t==='gap'?k.a[0]:k.a;
  }
  validate(d);const g=scoring.grade(testId,d.answers);assert.equal(g.total,g.max);assert.equal(g.parts.reduce((a,b)=>a+b,0),g.total);
  assert.equal(scoring.grade(testId,{}).total,0);
  // Derive expected accepted variants from the private source, never fixtures.
  for(const [n,k] of Object.entries(key))if(k.partial){assert.equal(scoring.grade(testId,{[n]:k.partial[0].a[0]}).per[n],k.partial[0].p)}
 }
});
test('MySQL preserves raw formats and scores; same sid is immutable, same email allowed',async()=>{
 const d=attempt();const key=scoring.tests[d.testId].key; Object.assign(d.answers,{'1':key[1].a,'9':key[9].a,'22':'  '+key[22].a[0].toUpperCase()+'  '});
 const results=await Promise.all([post(d),post(d)]);
 for(const r of results){assert.equal(r.status,200);assert.deepEqual(Object.keys(r.body).sort(),['ok','saved','sid','testId'])}
 const r=await row(d.sid);assert.deepEqual(r.payload,d);assert.deepEqual(r.answers,d.answers);
 const g=scoring.grade(d.testId,d.answers);assert.equal(r.score_total,g.total);assert.deepEqual(r.score_parts,g.parts);assert.deepEqual(r.score_per_question,g.per);
 assert.equal(r.sync_status,'pending');assert.equal(r.scoring_version,scoring.version);
 assert.equal((await post({...d,name:'Different'})).status,409);
 assert.equal((await post(attempt())).status,200);
 for(const testId of Object.keys(schemas)){const other=attempt(testId);assert.equal((await post(other)).status,200);assert.deepEqual((await row(other.sid)).payload,other)}
});
test('reject malformed formats and unavailable database without success',async()=>{
 const bad=attempt();bad.answers[9]=['А','Б'];assert.equal((await post(bad)).status,400);assert.equal(await row(bad.sid),undefined);
 const unavailable=createApi({execute:async()=>{throw new Error('Database offline')}},scoring);const url=await listen(unavailable);
 try{const r=await fetch(url+'/api/attempts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(attempt())});assert.equal(r.status,503);assert.equal((await r.json()).ok,false)}finally{await close(unavailable)}
});
test('Google failures retain MySQL; retries reuse sid, require JSON ok:true, lease recovers',async()=>{
 const d=attempt();await saveAttempt(pool,scoring,validate(d));
 for(const failure of ['http','bad-json','false']){
  mode=failure;assert.equal((await synchronizeOne(pool,cfg,{sid:d.sid,force:true})).status,'failed');
  const r=await row(d.sid);assert.deepEqual(r.payload,d);assert.equal(r.sync_status,'failed');assert.ok(r.sync_error);assert.ok(r.sync_last_attempt_at);
 }
 mode='ok';assert.equal((await synchronizeOne(pool,cfg,{sid:d.sid,force:true})).status,'synced');
 assert.deepEqual(delivered.get(d.sid),d);assert.equal((await row(d.sid)).sync_attempts,4);
 // Simulate crash after Sheets committed but before updating the MySQL receipt.
 await pool.execute("UPDATE olympiad_attempts SET sync_status='syncing',sync_lease_until=DATE_SUB(UTC_TIMESTAMP(3),INTERVAL 1 SECOND) WHERE sid=?",[d.sid]);
 await synchronizeOne(pool,cfg,{sid:d.sid,force:true});assert.equal((await row(d.sid)).sync_response.dup,true);
 const before=calls;await synchronizeOne(pool,cfg,{sid:d.sid,force:true});assert.equal(calls,before);
});
test('concurrent workers claim an attempt once; active lease cannot be overridden',async()=>{
 const d=attempt();await saveAttempt(pool,scoring,validate(d));mode='ok';
 const before=calls;await Promise.all([synchronizeOne(pool,cfg,{sid:d.sid,force:true}),synchronizeOne(pool,cfg,{sid:d.sid,force:true})]);
 assert.equal(calls,before+1);assert.equal((await row(d.sid)).sync_status,'synced');
});
test('live UI: DB failure retains answers, retry commits, clears browser data, survives reload',async()=>{
 const { chromium }=await import('playwright');const browser=await chromium.launch();
 const page=await browser.newPage();let fail=true,submission;
 const key='olympiad_live_v1_RKI-2-V1';
 try{
  await page.route('**/api/attempts',async route=>{
   submission=route.request().postDataJSON();if(!ids.includes(submission.sid))ids.push(submission.sid);
   if(fail){await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false})});return}
   const r=await post(submission);await route.fulfill({status:r.status,contentType:'application/json',body:JSON.stringify(r.body)});
  });
  await page.goto(uiURL+'/rki-2/test/');
  await page.locator('#inSur').fill('LOCAL-QA');await page.locator('#inName').fill('Browser check');await page.locator('#inMail').fill('qa@example.invalid');await page.locator('#inAgree').check();
  await page.locator('#btnStart').click();await page.locator('#mYes').click();
  await page.locator('#q1 .opt').first().click();await page.locator('[data-tab="2"]').click();await page.locator('#q22 input').fill('пример');
  await page.locator('#btnFinish').click();await page.locator('#mYes').click();await page.locator('#stError').waitFor({state:'visible'});
  const state=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.equal(state.phase,'error');assert.equal(state.answers[22],'пример');assert.equal(await row(submission.sid),undefined);
  const original=JSON.parse(JSON.stringify(submission));await page.reload();await page.locator('#stError').waitFor({state:'visible'});
  fail=false;await page.locator('#btnResend').click();await page.locator('#stDone').waitFor({state:'visible'});
  assert.deepEqual(submission,original);assert.deepEqual((await row(submission.sid)).payload,original);
  assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key),{v:1,phase:'done',serverSaved:true,lang:'ru'});
  assert.equal(await page.locator('#scoreBox').isVisible(),false);
  await page.reload();await page.locator('#stDone').waitFor({state:'visible'});
  assert.equal(await page.locator('#btnRestartDemo').isVisible(),false);
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).answers,key),undefined);
 }finally{await browser.close()}
});
