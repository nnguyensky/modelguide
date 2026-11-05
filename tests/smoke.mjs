// Smoke test: load the page headless, open every tab, fail on any JS error
// and on broken data references (task picks / dashboard rows pointing at missing models).
// Run: node tests/smoke.mjs   (needs the `playwright` package + Chromium)
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));

await page.goto(url, { waitUntil: 'load' });

// Click through every tab
const tabs = await page.$$eval('.tab-btn[data-tab]', bs => [...new Set(bs.map(b => b.dataset.tab))]);
for (const t of tabs) {
  if (errors.length) break;
  await page.click(`.tab-btn[data-tab="${t}"]`);
  const len = await page.$eval(`#${t}`, el => el.innerText.trim().length);
  if (len < 20) errors.push(`tab ${t} rendered empty`);
}

// Run the finder with every task selected (skipped if the page already broke)
if (!errors.length) {
  await page.click('[data-tab="tab-finder"]');
  await page.$$eval('#finder-tasks input[type=checkbox]', cbs => cbs.forEach(c => { c.checked = true; }));
  await page.click('#fi-btn', { timeout: 5000 });
  const finderOut = await page.$eval('#fi-results-inner', el => el.innerText);
  if (!/1/.test(finderOut)) errors.push('finder returned no ranking');
}

// Data integrity
const dataErrors = errors.length ? [] : await page.evaluate(() => {
  if (typeof M === "undefined") return ["modelguide.js did not run (M is undefined)"];
  const out = [];
  const need = ['n', 'p', 'i', 'o', 'aa', 'v'];
  for (const [k, m] of Object.entries(M)) {
    for (const f of need) if (m[f] === undefined) out.push(`M.${k} missing ${f}`);
    if (m.priceChangeDate && (m.iAfter == null || m.oAfter == null)) out.push(`M.${k} has priceChangeDate without iAfter/oAfter`);
  }
  TG.forEach(g => g.tasks.forEach(t => {
    if (!M[t.pr.m]) out.push(`task "${t.t}" pick → unknown model ${t.pr.m}`);
    t.alts.forEach(a => { if (!M[a.m]) out.push(`task "${t.t}" alt → unknown model ${a.m}`); });
  }));
  [...DASH_ORDER, ...DASH_FREE_ORDER].forEach(k => { if (!M[k]) out.push(`dashboard → unknown model ${k}`); });
  return out;
});
errors.push(...dataErrors);

// Re-load on the day after every scheduled price change, so date-switched text paths run too
if (!errors.length) {
  const dates = await page.evaluate(() => [...new Set(Object.values(M).map(m => m.priceChangeDate).filter(Boolean))]);
  for (const d of dates) {
    const p2 = await browser.newPage();
    p2.on('pageerror', e => errors.push(`pageerror on ${d}: ${e.message}`));
    await p2.clock.setFixedTime(new Date(d + 'T12:00:00'));
    await p2.goto(url, { waitUntil: 'load' });
    for (const t of tabs) await p2.click(`.tab-btn[data-tab="${t}"]`);
    await p2.close();
  }
}

await browser.close();
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`✓ page loads, ${tabs.length} tabs render, finder works, data references OK, future-date views OK`);
