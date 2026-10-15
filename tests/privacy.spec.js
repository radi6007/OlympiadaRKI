import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { saveAttempt, clearAfterConfirmedDatabaseSave } from '../src/tests/attempt-storage.js';

test('future confirmed-save cleanup removes personal data and prevents late autosave', () => {
  const items = new Map([['unrelated', 'keep']]);
  const storage = { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, value) };
  const attempt = { v:1, phase:'sending', sur:'Demo', name:'Participant', mail:'demo@example.test', answers:{1:'А'}, sid:'attempt-id', lang:'en', deadline:123, pos:4 };
  saveAttempt(storage, 'test-attempt', attempt);
  // Until a real success handler invokes cleanup, the recoverable draft remains.
  expect(JSON.parse(storage.getItem('test-attempt'))).toEqual(attempt);
  const next = clearAfterConfirmedDatabaseSave(storage, 'test-attempt', attempt);
  expect(next).toEqual({v:1,phase:'done',serverSaved:true,lang:'en'});
  expect(JSON.parse(storage.getItem('test-attempt'))).toEqual(next);
  saveAttempt(storage, 'test-attempt', attempt);
  expect(JSON.parse(storage.getItem('test-attempt'))).toEqual(next);
  expect(storage.getItem('unrelated')).toBe('keep');
  expect(() => clearAfterConfirmedDatabaseSave({setItem(){throw new Error('storage denied')}},'key',attempt)).toThrow('storage denied');
});

test('public document preserves supplied text and fits desktop and mobile', async ({page}) => {
  const expected = readFileSync('src/content/participant-data.md', 'utf8').trim().split(/\r?\n\s*\r?\n/).map(block=>block.replace(/^#{1,2} /,''));
  for (const width of [1440,375]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/data-processing');
    await expect(page.locator('.privacy-document > *')).toHaveText(expected);
    await expect(page.locator('article')).toHaveAttribute('lang','ru');
    await expect(page.locator('.privacy-demo-note')).toContainText('записи в базу нет');
    await page.getByRole('button',{name:'EN',exact:true}).click();
    await expect(page.locator('.privacy-document > *')).toHaveText(expected);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`test-results/privacy-${width}.png`,fullPage:true});
    await page.getByRole('button',{name:'RU',exact:true}).click();
  }
});

test('footer links on all pages and pre-form link open the document without losing a draft', async ({page,context}) => {
  for (const path of ['/','/rku-1','/rku-2','/rku-3','/rki-1','/rki-2','/rki-3','/rki-1/test/','/thanks/','/data-processing']) {
    await page.goto(path);
    const link = page.locator('footer a.privacy-link');
    await expect(link).toHaveAttribute('href','/data-processing');
    await expect(link).toHaveAttribute('target','_blank');
    await expect(link).toHaveAttribute('rel','noopener noreferrer');
  }
  await page.goto('/rki-1/test/');
  await page.locator('#inSur').fill('Demo draft');
  const link = page.locator('.form-privacy a');
  expect(await page.locator('.card.form').evaluate(el=>el.previousElementSibling.classList.contains('form-privacy'))).toBe(true);
  const popupPromise = context.waitForEvent('page');
  await link.click();
  const popup = await popupPromise;
  await expect(popup.locator('article h1')).toContainText('Обработка персональных данных');
  await popup.close();
  await expect(page.locator('#inSur')).toHaveValue('Demo draft');
  await page.reload();await expect(page.locator('#inSur')).toHaveValue('Demo draft');
  await expect(page.locator('#langEn')).toHaveCount(0);await expect(link).toHaveText('Обработка данных участников олимпиады');
});
