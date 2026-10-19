import { test, expect } from '@playwright/test';

for (const slug of ['rki-1','rki-2','rki-3','rku-1','rku-2','rku-3']) {
  test(`${slug}: completion warning counts incomplete tasks, not task numbers`, async ({ page }) => {
    const { PARTS, Q } = await import(`../src/tests/${slug}/data.js`);
    await page.goto(`/${slug}/test/`);
    await page.locator('#inSur').fill('ТЕХНИЧЕСКАЯ ПРОВЕРКА');
    await page.locator('#inName').fill('Предупреждение');
    await page.locator('#inMail').fill('technical-check@example.test');
    await page.locator('#inAgree').check();
    await page.locator('#btnStart').click();
    await page.locator('#mYes').click();
    for (let part=0; part<PARTS.length; part++) {
      await page.locator(`[data-tab="${part}"]`).click();
      for (const n of PARTS[part].groups.flatMap(g=>g.qs)) {
        const q=Q[n], box=page.locator(`#q${n}`);
        // Leave only question 10 incomplete, even though it may have one choice.
        if (n===10 && q.type!=='two') continue;
        if (q.type==='match') {
          for(let i=0;i<q.left.length;i++) {
            await box.locator('.ml .mitem').nth(i).click();
            await box.locator('.mr .mitem').nth(i).click();
          }
        } else if (q.type==='gap'||q.type==='gap2') {
          for(const input of await box.locator('input.gap').all()) await input.fill('пример');
        } else if (q.type==='select') {
          await box.locator('select').selectOption({index:1});
        } else {
          await box.locator('.opt').first().click();
          if(q.type==='two' && n!==10) await box.locator('.opt').nth(1).click();
        }
      }
    }
    await page.reload();
    await page.locator('#btnFinish').click();
    await expect(page.locator('#modalHost')).toContainText('Не завершено заданий: 1. Номера заданий: 10.');
    await page.locator('#mNo').click();
    await page.locator('[data-tab="1"]').click();
    await page.locator('#q10 .opt').nth(Q[10].type==='two'?1:0).click();
    await page.locator('[data-tab="2"]').click();
    await page.reload();
    await expect(page.locator('#navHint')).toHaveText('Все задания выполнены. Можно завершать тест.');
    await page.locator('#btnFinish').click();
    await expect(page.locator('#modalHost')).not.toContainText('Не завершено заданий');
    await expect(page.locator('#modalHost')).not.toContainText('Без ответа');
  });
}
