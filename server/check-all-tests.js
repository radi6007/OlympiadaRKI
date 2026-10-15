// Real end-to-end check. Creates ONE explicitly marked Google row per test.
// Run manually only: node --env-file=.env server/check-all-tests.js --confirm-google-write
// Requires the normal Vite + Node API + MySQL services to be running.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import { config } from './config.js';
import { createPool } from './db.js';
import { loadScoring } from './scoring.js';
if(!process.argv.includes('--confirm-google-write'))throw new Error('Pass --confirm-google-write to create six marked Google rows');
const base=process.env.CHECK_BASE_URL||'http://127.0.0.1:5173';
const cfg=config(),pool=createPool(cfg),scoring=loadScoring(cfg.source);
const report={checkedAt:new Date().toISOString(),base,marker:'__ТЕСТ_ВСЕХ_НАПРАВЛЕНИЙ__ / НЕ УЧАСТНИК',tests:[]};
mkdirSync('test-results',{recursive:true});
const output='test-results/all-tests-live-report.json';
const save=()=>writeFileSync(output,JSON.stringify(report,null,2)+'\n');
const browser=await chromium.launch();
try{
 const health=await fetch(base+'/api/health');assert.equal(health.status,200);assert.equal((await health.json()).ok,true);
 for(const slug of ['rki-1','rki-2','rki-3','rku-1','rku-2','rku-3']){
  const {TEST,PARTS,Q}=await import(`../src/tests/${slug}/data.js`);
  const key='olympiad_live_v1_'+TEST.id;
  const entry={testId:TEST.id,slug,status:'started'};report.tests.push(entry);save();
  const page=await browser.newPage({viewport:slug.startsWith('rku')?{width:375,height:812}:{width:1440,height:1000}});
  const errors=[],external=[];let submitted;
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',req=>{
   if(req.url().endsWith('/api/attempts')){submitted=req.postDataJSON();entry.sid=submitted.sid;save()}
   if(!req.url().startsWith(base+'/'))external.push(req.url());
  });
  const state=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  await page.goto(base+'/'+slug);await page.locator('#agree').check();await page.locator('#startBtn').click();
  await page.waitForURL('**/'+slug+'/test/**');await expect(page.locator('#start')).toBeVisible();
  await expect(page.locator('#demoBar')).toBeHidden();
  await page.locator('#inSur').fill('__ТЕСТ_ВСЕХ_НАПРАВЛЕНИЙ__');
  await page.locator('#inName').fill('НЕ УЧАСТНИК '+TEST.id);
  await page.locator('#inMail').fill('olympiad-all-tests@example.invalid');
  await page.locator('#inAgree').check();await page.locator('#btnStart').click();await page.locator('#mYes').click();
  const deadline=(await state()).deadline;
  await page.locator('.playbtn').click();await expect.poll(async()=>(await state()).pos).toBeGreaterThan(.1);
  for(let part=0;part<PARTS.length;part++){
   await page.locator(`[data-tab="${part}"]`).click();
   for(const n of PARTS[part].groups.flatMap(g=>g.qs)){
    const q=Q[n],box=page.locator('#q'+n);
    if(q.type==='match'){
     for(let i=0;i<q.left.length;i++){
      await box.locator('.ml .mitem').nth(i).click();await box.locator('.mr .mitem').nth(i).click();
     }
    }else if(q.type==='select')await box.locator('select').selectOption({index:1});
    else if(q.type==='gap'||q.type==='gap2')for(const input of await box.locator('input.gap').all())await input.fill('тест');
    else{
     await box.locator('.opt').first().click();
     if(q.type==='two'||q.type==='multi')await box.locator('.opt').nth(1).click();
    }
   }
   const answers=(await state()).answers;await page.reload();
   assert.deepEqual((await state()).answers,answers);assert.equal((await state()).deadline,deadline);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  await expect(page.locator('#navHint')).toHaveText('Все задания выполнены. Можно завершать тест.');
  await page.locator('#btnFinish').click();await page.locator('#mYes').click();await expect(page.locator('#stDone')).toBeVisible({timeout:30000});
  await expect(page.locator('#scoreBox')).toBeHidden();
  const expectedMarker={v:1,phase:'done',serverSaved:true,lang:'ru'};assert.deepEqual(await state(),expectedMarker);
  await page.reload();await expect(page.locator('#stDone')).toBeVisible();assert.deepEqual(await state(),expectedMarker);
  const get=async()=>(await pool.execute('SELECT * FROM olympiad_attempts WHERE sid=?',[entry.sid]))[0][0];
  const stored=await get();assert.deepEqual(stored.payload,submitted);assert.deepEqual(stored.answers,submitted.answers);
  const grade=scoring.grade(TEST.id,submitted.answers);
  assert.deepEqual(stored.score_per_question,grade.per);assert.deepEqual(stored.score_parts,grade.parts);
  assert.equal(stored.score_total,grade.total);assert.equal(stored.score_max,grade.max);
  assert.equal(Object.keys(stored.answers).length,Object.keys(Q).length);assert.equal(stored.audio_plays,1);
  // Wait for the real API's ordinary background worker, not a test substitute.
  await expect.poll(async()=>(await get()).sync_status,{timeout:150000,intervals:[1000,2000,5000]}).toBe('synced');
  const synced=await get();assert.equal(synced.sync_response.ok,true);
  // Server-side resend of exactly the saved payload verifies the actual row
  // exists in the corresponding sheet. No new sid or row is created.
  const response=await fetch(cfg.url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(stored.payload),signal:AbortSignal.timeout(cfg.syncTimeout)});
  assert.equal(response.ok,true);const receipt=await response.json();assert.equal(receipt.ok,true);assert.equal(receipt.dup,true);
  assert.equal(receipt.score,stored.score_total);assert.equal(receipt.max,stored.score_max);
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  Object.assign(entry,{status:'passed',sheet:stored.google_sheet,questionCount:Object.keys(stored.answers).length,
    mysqlRawDataVerified:true,gradesVerified:true,googleOk:true,googleDuplicateConfirmed:true,
    automaticSyncVerified:true,syncAttempts:synced.sync_attempts,browserCleared:true,scoreHidden:true,
    restoreVerified:true,audioVerified:true,mobile:slug.startsWith('rku')});
  save();console.log(JSON.stringify(entry));await page.close();
 }
}catch(err){report.error=String(err.message);save();throw err}
finally{await browser.close();await pool.end()}
