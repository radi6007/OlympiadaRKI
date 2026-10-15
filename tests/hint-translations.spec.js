import {test,expect} from '@playwright/test';
test('local hints expand by keyboard without translating questions or losing answers',async({page})=>{
 await page.goto('/rki-2/test/?lang=en');
 await expect(page.locator('.lang')).toHaveCount(0);
 const help=page.locator('#rulesList .hint-language').first();
 await help.focus();await page.keyboard.press('Enter');await expect(help).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('#rulesList .hint-english').first()).toBeVisible();
 await page.keyboard.press('Space');await expect(help).toHaveAttribute('aria-expanded','false');
 await page.locator('#inSur').fill('Проверка');await page.locator('#inName').fill('Подсказок');await page.locator('#inMail').fill('hints@example.test');await page.locator('#inAgree').check();
 await page.locator('#btnStart').click();await page.locator('#mYes').click();
 await page.locator('[data-tab="1"]').click();
 const before=await page.locator('#q9 .qstem').innerText();
 await page.locator('#m9 .ml .mitem').first().click();await page.locator('#m9 .mr .mitem').first().click();
 const hint=page.locator('#q9 .mhint .hint-language');await hint.click();
 await expect(page.locator('#q9 .hint-english')).toContainText('Tap a sentence');
 await expect(page.locator('#m9 .ml .mitem').first()).toHaveAttribute('aria-pressed','true');
 expect(await page.locator('#q9 .qstem').innerText()).toBe(before);
 await page.setViewportSize({width:375,height:812});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.reload();await expect(page.locator('#m9 .ml .mitem').first()).toHaveAttribute('aria-pressed','true');
 for(const slug of ['rki-3','rku-1','rku-2','rku-3']){
 await page.goto('/'+slug+'/test/?lang=en');await expect(page.locator('.lang,.hint-language')).toHaveCount(0);
 }
});
