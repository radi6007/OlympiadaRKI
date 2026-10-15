// Explicit opt-in: this creates two marked rows in the organiser's spreadsheet
// and may trigger the organiser notification emails configured in Code.gs.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { createServer as createViteServer } from 'vite';
import { config } from './config.js';
import { createPool } from './db.js';
import { loadScoring } from './scoring.js';
import { createApi } from './api.js';
import { synchronizeOne } from './sync.js';
if(!process.argv.includes('--confirm-google-write'))throw new Error('Pass --confirm-google-write to create marked Google Sheet rows');
const cfg=config(),pool=createPool(cfg),scoring=loadScoring(cfg.source);
const api=createApi(pool,scoring);
await new Promise(resolve=>api.listen(0,'127.0.0.1',resolve));
const vite=await createViteServer({configFile:false,define:{'import.meta.env.VITE_RESULTS_MODE':'"api"'},server:{host:'127.0.0.1',port:5191,strictPort:true,
  proxy:{'/api':`http://127.0.0.1:${api.address().port}`},fs:{deny:['**/.private/**','**/server/**','**/.env*','**/*.gs']}}});
await vite.listen();
const browser=await chromium.launch();const report=[];
try{
 for(const scenario of ['normal','google-outage']){
  const page=await browser.newPage();let submitted;
  page.on('request',r=>{if(r.url().endsWith('/api/attempts'))submitted=r.postDataJSON()});
  await page.goto('http://127.0.0.1:5191/rki-2/test/');
  await page.locator('#inSur').fill('__ТЕСТ_ИНТЕГРАЦИИ__');
  await page.locator('#inName').fill('НЕ УЧАСТНИК '+scenario);
  await page.locator('#inMail').fill('olympiad-integration@example.invalid');await page.locator('#inAgree').check();
  await page.locator('#btnStart').click();await page.locator('#mYes').click();
  await page.locator('#q1 .opt').first().click();await page.locator('[data-tab="1"]').click();
  await page.locator('#q9 .ml .mitem').first().click();await page.locator('#q9 .mr .mitem').first().click();
  await page.locator('[data-tab="2"]').click();await page.locator('#q22 input.gap').fill('тестовая проверка');
  await page.locator('#btnFinish').click();await page.locator('#mYes').click();await page.locator('#stDone').waitFor({state:'visible'});
  assert.equal(await page.locator('#scoreBox').isVisible(),false);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('olympiad_live_v1_RKI-2-V1'))),{v:1,phase:'done',serverSaved:true,lang:'ru'});
  const get=async()=>(await pool.execute('SELECT * FROM olympiad_attempts WHERE sid=?',[submitted.sid]))[0][0];
  assert.deepEqual((await get()).payload,submitted);assert.deepEqual((await get()).answers,submitted.answers);
  let outageVerified=false;
  if(scenario==='google-outage'){
   const failed=await synchronizeOne(pool,{...cfg,url:'http://127.0.0.1:1',syncTimeout:1000},{sid:submitted.sid,force:true});
   assert.equal(failed.status,'failed');assert.equal((await get()).sync_status,'failed');
   await page.reload();assert.equal(await page.locator('#stDone').isVisible(),true);outageVerified=true;
  }
  const result=await synchronizeOne(pool,cfg,{sid:submitted.sid,force:true});
  let saved=await get();
  if(result?.status!=='synced')throw new Error(`Google sync failed for ${submitted.sid}: ${saved.sync_error}`);
  // Emulate a lost receipt and prove that Google recognizes the same persisted sid.
  await pool.execute("UPDATE olympiad_attempts SET sync_status='failed',sync_error='TEST: verifying idempotent retry' WHERE sid=?",[submitted.sid]);
  await synchronizeOne(pool,cfg,{sid:submitted.sid,force:true});saved=await get();
  assert.equal(saved.sync_status,'synced');assert.equal(saved.sync_response.dup,true);
  report.push({scenario,sid:submitted.sid,sheet:saved.google_sheet,syncStatus:saved.sync_status,syncAttempts:saved.sync_attempts,
    googleAcknowledged:true,googleDuplicateConfirmed:true,outageVerified,rawPayloadVerified:true,questionCount:Object.keys(saved.answers).length,
    gradeStored:!!saved.score_per_question,browserCleared:true});
  console.log(JSON.stringify(report.at(-1)));await page.close();
 }
}finally{
 mkdirSync('test-results',{recursive:true});writeFileSync('test-results/live-report.json',JSON.stringify(report,null,2));
 await browser.close();await vite.close();await new Promise(resolve=>api.close(resolve));await pool.end();
}
