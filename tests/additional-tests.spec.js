import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const manifest=JSON.parse(readFileSync('tests/additional-source-integrity.json'));
const hash=x=>createHash('sha256').update(x).digest('hex');
for(const [slug,source] of Object.entries(manifest)){
 const { TEST,PARTS,Q }=await import(`../src/tests/${slug}/data.js`);
 const key='olympiad_demo_v1_'+TEST.id;
 const state=page=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 test(`${slug}: exact source tasks and audio`,()=>{
  expect(hash(readFileSync(`src/tests/${slug}/data.js`,'utf8').replace(/\nexport \{ TEST, PARTS, Q \};\n$/,''))).toBe(source.dataSha256);
  expect(hash(readFileSync(`public/assets/${slug}.mp3`))).toBe(source.audioSha256);
  expect(PARTS.flatMap(p=>p.groups.flatMap(g=>g.qs)).length).toBe(Object.keys(Q).length);
 });
 test(`${slug}: complete all formats, restore, audio limit, mobile, local completion`,async({page})=>{
  test.setTimeout(60000);
  const errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5174'))external.push(r.url())});
  await page.addInitScript(()=>{const Native=window.Audio;window.Audio=function(...args){window.qaAudio=new Native(...args);return window.qaAudio}});
  await page.goto(`/${slug}/test/?lang=en`);
  await expect(page.locator('html')).toHaveAttribute('lang','ru');
  await expect(page.locator('.lang')).toHaveCount(0);
  await expect(page.locator('#heroLvl')).toContainText(TEST.code);
  await page.locator('#inSur').fill('Демо');await page.locator('#inName').fill(slug);await page.locator('#inMail').fill('demo@example.test');
  await page.reload();await expect(page.locator('#inName')).toHaveValue(slug);
  await page.locator('#inAgree').check();await page.locator('#btnStart').click();await page.locator('#mYes').click();
  const deadline=(await state(page)).deadline;
  await page.locator('.playbtn').click();await expect.poll(()=>page.evaluate(()=>window.qaAudio.currentTime)).toBeGreaterThan(.1);
  await page.reload();await expect(page.locator('.ptitle')).toHaveText('Продолжить прослушивание');
  await page.locator('.playbtn').click();await expect.poll(()=>page.evaluate(()=>window.qaAudio.currentTime)).toBeGreaterThan(.1);
  expect((await state(page)).plays).toBe(1);
  for(let i=1;i<=TEST.maxPlays;i++){
   await page.evaluate(()=>{window.qaAudio.currentTime=window.qaAudio.duration-.1});
   await expect.poll(async()=>(await state(page)).playing).toBe(false);
   if(i<TEST.maxPlays){await page.locator('.playbtn').click();await expect.poll(async()=>(await state(page)).plays).toBe(i+1)}
  }
  await expect(page.locator('.playbtn')).toBeDisabled();
  for(let part=0;part<PARTS.length;part++){
   await page.locator(`[data-tab="${part}"]`).click();
   await page.setViewportSize({width:375,height:812});
   for(const n of PARTS[part].groups.flatMap(g=>g.qs)){
    const q=Q[n],box=page.locator('#q'+n);await expect(box.locator('.qstem')).toContainText(q.s);
    if(q.type==='match'){
     for(let i=0;i<q.left.length;i++){
      const left=box.locator('.ml .mitem').nth(i),right=box.locator('.mr .mitem').nth(i);
      // Real keyboard activation and mouse activation both use native buttons.
      await left.focus();await page.keyboard.press('Enter');await right.click();
     }
     await expect(box.locator('.mlines line')).toHaveCount(q.left.length);
     await page.screenshot({path:`test-results/${slug}-matching-mobile.png`,fullPage:true});
    }else if(q.type==='select'){await box.locator('select').selectOption({index:1})}
    else if(q.type==='gap'||q.type==='gap2'){
     for(const input of await box.locator('input.gap').all())await input.fill('пример');
     await box.locator('[data-kq]').click();await expect(page.locator('#kbd')).toBeVisible();
     await page.locator('#kbd button').filter({hasText:/^й$/i}).click();
    }else{
     await box.locator('.opt').first().click();
     if(q.type==='two')await box.locator('.opt').nth(1).click();
     if(q.type==='multi'){for(const opt of (await box.locator('.opt').all()).slice(1))await opt.click();expect((await state(page)).answers[n]).toHaveLength(q.o.length)}
    }
   }
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const answers=(await state(page)).answers;
   await page.reload();expect((await state(page)).answers).toEqual(answers);expect((await state(page)).deadline).toBe(deadline);
   expect((await state(page)).cur).toBe(part);
  }
  expect(Object.keys((await state(page)).answers)).toHaveLength(Object.keys(Q).length);
  await expect(page.locator('#navHint')).toHaveText('Все задания выполнены. Можно завершать тест.');
  await page.locator('#btnFinish').click();await page.locator('#mYes').click();
  await expect(page.locator('#stDone')).toContainText('ответы никуда не отправлены');await expect(page.locator('#scoreBox')).toBeHidden();
  await page.reload();await expect(page.locator('#stDone')).toBeVisible();
  await page.goto('/rki-1/test/');await expect(page.locator('#start')).toBeVisible();
  expect((await state(page)).phase).toBe('done');expect(errors).toEqual([]);expect(external).toEqual([]);
 });
}
