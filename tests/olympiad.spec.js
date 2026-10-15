import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Q } from '../src/tests/rki-1/data.js';
const KEY='olympiad_demo_v1_RKI-1-V1';
const state=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),KEY);
async function start(page){
 await page.goto('/rki-1/test/');
 await page.locator('#inSur').fill('Демо'); await page.locator('#inName').fill('Проверка');
 await page.locator('#inMail').fill('demo@example.test'); await page.locator('#inAgree').check();
 await page.locator('#btnStart').click(); await page.locator('#mYes').click();
 await expect(page.locator('#test')).toBeVisible();
}
test('original task content and audio are byte-preserved',()=>{
 const expected=JSON.parse(readFileSync('tests/source-integrity.json'));
 const data=readFileSync('src/tests/rki-1/data.js','utf8').replace(/\nexport \{ TEST, PARTS, Q \};\n$/,'');
 expect(createHash('sha256').update(data).digest('hex')).toBe(expected.dataSha256);
 expect(createHash('sha256').update(readFileSync('public/assets/rki-1.mp3')).digest('hex')).toBe(expected.audioSha256);
 expect(Object.keys(Q)).toHaveLength(33);
});
test('six direct links, language persistence, age rules and available tests',async({page})=>{
 await page.goto('/');
 await expect(page.locator('a.stream')).toHaveCount(6);
 await expect(page.getByRole('link',{name:'Зарегистрироваться'}).first()).toHaveAttribute('href',/docs.google.com\/forms\/d\/e\/1FAIpQLSdMRSIZ4N1Kr61FnNSQhdmu2IG4AECOoAZC8qHZCM_gz6uwPg\/viewform/);
 for(const slug of ['rku-1','rku-2','rku-3','rki-1','rki-2','rki-3']){
  await page.goto('/'); await page.locator(`a[href="/${slug}"]`).click();
  await expect(page).toHaveURL(new RegExp('/'+slug+'$')); await page.reload();
  await expect(page.locator('.code-badge')).toContainText(slug.toUpperCase().replace('RKI','РКИ').replace('RKU','РКУ'));
  if(slug.startsWith('rki'))await expect(page.locator('.thero .sub')).not.toContainText(/10–12|13–15|16–18/);
  else await expect(page.locator('.thero .sub')).toContainText(/10–12|13–15|16–18/);
  await expect(page.locator('#startBtn')).toBeDisabled();
  await page.locator('#agree').check();await page.locator('#startBtn').click();
  await expect(page).toHaveURL(new RegExp('/'+slug+'/test/'));await expect(page.locator('#start')).toBeVisible();
  await page.goto('/'+slug);
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en');
  await page.getByRole('button',{name:'RU',exact:true}).click();
 }
 await page.goto('/rki-1');await page.locator('#agree').check();await page.locator('#startBtn').click();await expect(page.locator('#start')).toBeVisible();
});
test('full test, audio resume, timer, answers, keyboard, completion, no external traffic',async({page})=>{
 const external=[], errors=[]; page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5174')&&!r.url().startsWith('blob:'))external.push(r.url())});page.on('pageerror',e=>errors.push(e.message));
 await start(page);const deadline=(await state(page)).deadline;
 await page.locator('.playbtn').click();await expect.poll(async()=> (await state(page)).pos).toBeGreaterThan(1);
 expect((await state(page)).plays).toBe(1);
 await page.locator('#q1 .opt').first().click();await page.reload();await expect(page.locator('#q1 input').first()).toBeChecked();
 expect((await state(page)).deadline).toBe(deadline);await expect(page.locator('#timerTxt')).not.toHaveText('90:00');
 await expect(page.locator('.ptitle')).toHaveText('Продолжить прослушивание');
 const before=(await state(page)).pos;await page.locator('.playbtn').click();await expect.poll(async()=> (await state(page)).pos).toBeGreaterThan(before+.5);expect((await state(page)).plays).toBe(1);
 for(let part=0;part<3;part++){
  await page.locator(`[data-tab="${part}"]`).click();
  for(const q of await page.locator('.q').all()){
   const id=+(await q.getAttribute('id')).slice(1);await expect(q.locator('.qstem')).toContainText(Q[id].s);
   const gaps=q.locator('input.gap');
   if(await gaps.count()){for(const gap of await gaps.all())await gap.fill('пример')}
   else {const options=q.locator('.opt');await options.nth(0).click();if(Q[id].type==='two')await options.nth(1).click()}
  }
  if(part===1){await page.locator('#kbtn9').click();await expect(page.locator('#kbd')).toBeVisible();await page.locator('#q9 input.gap').first().focus();await page.locator('#kbd button').filter({hasText:/^й$/i}).click();}
  await page.reload();expect((await state(page)).cur).toBe(part);
 }
 expect(Object.keys((await state(page)).answers)).toHaveLength(33);
 await page.locator('#btnFinish').click();await page.locator('#mNo').click();await expect(page.locator('#test')).toBeVisible();
 await page.locator('#btnFinish').click();await page.locator('#mYes').click();
 await expect(page.locator('#stDone')).toBeVisible();await expect(page.locator('#stDone')).toContainText('ответы никуда не отправлены');await expect(page.locator('#scoreBox')).toBeHidden();
 expect((await state(page)).phase).toBe('done');await page.reload();await expect(page.locator('#stDone')).toBeVisible();
 await page.locator('#langEn').click();await expect(page.locator('#stDone')).toContainText('answers have not been sent');
 expect(external).toEqual([]);expect(errors).toEqual([]);
});
test('validation, form draft and expired deadline auto-finish after refresh',async({page})=>{
 await page.goto('/rki-1/test/');await page.locator('#btnStart').click();await expect(page.locator('#fMail')).toHaveClass(/bad/);await expect(page.locator('#test')).toBeHidden();
 await page.locator('#inSur').fill('Черновик');await page.reload();await expect(page.locator('#inSur')).toHaveValue('Черновик');
 await start(page);await page.clock.setFixedTime((await state(page)).deadline+1000);await page.reload();
 await expect(page.locator('#stDone')).toBeVisible();expect((await state(page)).auto).toBe(true);await expect(page.locator('#scoreBox')).toBeHidden();await expect(page.locator('#stDone')).toContainText('ответы никуда не отправлены');
});
test('mobile layout and keyboard at 375px, screenshots',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 for(const path of ['/','/rku-1','/rku-2','/rku-3','/rki-1','/rki-2','/rki-3']){
  await page.goto(path);await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.screenshot({path:'test-results/mobile-direction.png',fullPage:true});
 await start(page);await page.locator('[data-tab="1"]').click();await page.locator('#kbtn9').click();await expect(page.locator('#kbd')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/mobile-test.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');await page.screenshot({path:'test-results/desktop-home.png',fullPage:true});
});
test('audio plays twice and forbids third play',async({page})=>{
 // Observe the real Audio instance. Decode/play remain browser-native.
 await page.addInitScript(()=>{const NativeAudio=window.Audio;window.Audio=function(...args){window.qaAudio=new NativeAudio(...args);return window.qaAudio}});
 await start(page);await page.locator('.playbtn').click();await expect.poll(async()=>(await state(page)).plays).toBe(1);
 await expect.poll(()=>page.evaluate(()=>window.qaAudio.currentTime)).toBeGreaterThan(.1);
 await expect(page.locator('.playbtn')).toBeDisabled();
 await page.evaluate(()=>{window.qaAudio.currentTime=window.qaAudio.duration-.15});
 await expect.poll(async()=>(await state(page)).playing).toBe(false);
 await page.locator('.playbtn').click();await expect.poll(async()=>(await state(page)).plays).toBe(2);
 await page.evaluate(()=>{window.qaAudio.currentTime=window.qaAudio.duration-.15});
 await expect.poll(async()=>(await state(page)).playing).toBe(false);await expect(page.locator('.playbtn')).toBeDisabled();
 await page.reload();await expect(page.locator('.playbtn')).toBeDisabled();expect((await state(page)).plays).toBe(2);
});
test('unanswered completion, EN entry and key information is readable',async({page})=>{
 await page.goto('/rki-1');
 for(const sel of ['.types','.imp','.cta-box']){
  expect(await page.locator(sel).evaluate(el=>getComputedStyle(el).color)).not.toBe('rgb(255, 255, 255)');
 }
 await page.getByRole('button',{name:'EN',exact:true}).click();await page.locator('#agree').check();await page.locator('#startBtn').click();
 await expect(page.locator('#langEn')).toHaveAttribute('aria-pressed','true');
 await page.locator('#inSur').fill('Demo');await page.locator('#inName').fill('Test');await page.locator('#inMail').fill('demo@example.test');await page.locator('#inAgree').check();await page.locator('#btnStart').click();await page.locator('#mYes').click();
 await page.locator('[data-tab="2"]').click();await page.locator('#btnFinish').click();await expect(page.locator('#modalHost')).toContainText('Tasks left unanswered:');await page.locator('#mYes').click();
 await expect(page.locator('#stDone')).toContainText('No result is saved on a server');
});
test('audio error can be retried without consuming a play',async({page})=>{
 await page.route('**/assets/rki-1.mp3',route=>route.abort());await start(page);
 await page.locator('.playbtn').click();await expect(page.locator('#toast')).toContainText('Не удалось');await expect(page.locator('.playbtn')).toBeEnabled();expect((await state(page)).plays).toBe(0);
 await page.unroute('**/assets/rki-1.mp3');await page.locator('.playbtn').click();await expect.poll(async()=>(await state(page)).plays).toBe(1);
});
