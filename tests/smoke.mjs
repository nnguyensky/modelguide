// Smoke test: load the page headless, visit every route, click through every
// task / mode on Recommend, use Explore filters and the Value map toggles, and
// fail on any JS error or broken data reference. Also re-runs on each scheduled
// price-change date so date-switched text paths execute.
// Run: node tests/smoke.mjs   (needs the `playwright` package + Chromium)
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;
const ROUTES = ['recommend', 'explore', 'value', 'insights', 'changes'];

const browser = await chromium.launch();
const errors = [];

async function visit(page, label) {
  page.on('pageerror', (e) => errors.push(`pageerror${label}: ${e.message}`));
  await page.route('**/fonts.googleapis.com/**', (r) => r.abort());
  await page.goto(url, { waitUntil: 'load' });
  if (!(await page.evaluate(() => !!window.MG && !!window.MGApp))) { errors.push(`data.js or app.js did not run${label}`); return; }
  for (const r of ROUTES) {
    await page.evaluate((h) => { location.hash = h; }, r);
    try {
      await page.waitForFunction((h) => document.querySelector(`.nav a[data-route="${h}"]`)?.getAttribute('aria-current') === 'page', r, { timeout: 5000 });
    } catch (e) { errors.push(`route ${r}${label} did not open`); return; }
    const len = await page.$eval('#app', (el) => el.innerText.trim().length);
    if (len < 200) errors.push(`route ${r}${label} rendered almost nothing (${len} chars)`);
  }
}

// 1. Normal day
const page = await browser.newPage();
await visit(page, '');

if (!errors.length) {
  // Recommend: every group, task and mode
  await page.evaluate(() => { location.hash = 'recommend'; });
  const groups = await page.$$eval('[data-group]', (b) => b.length);
  for (let g = 0; g < groups; g++) {
    await page.click(`[data-group="${g}"]`);
    const tasks = await page.$$eval('[data-task]', (b) => b.map((x) => x.dataset.task));
    for (const t of tasks) {
      await page.click(`[data-task="${t}"]`);
      for (const m of ['cheap', 'quality', 'balanced']) {
        await page.click(`[data-mode="${m}"]`);
        const name = await page.$eval('.pick-name', (el) => el.textContent.trim());
        if (!name) errors.push(`task ${t} / ${m}: no pick shown`);
      }
    }
  }
  for (const v of ['10', '1000', '100']) await page.click(`[data-vol="${v}"]`);

  // Explore: filters, search, sort, select a row
  await page.evaluate(() => { location.hash = 'explore'; });
  await page.waitForSelector('#rows tr[data-k]');
  for (const f of ['open', 'free', 'legacy', 'open', 'free', 'legacy']) await page.click(`[data-flag="${f}"]`);
  await page.fill('#q', 'sonnet');
  if ((await page.$$('#rows tr[data-k]')).length === 0) errors.push('explore search for "sonnet" found nothing');
  await page.fill('#q', '');
  for (const s of ['value', 'cost', 'price', 'aa']) await page.selectOption('#sort', s);
  await page.click('#rows tr[data-k]:nth-child(3)');
  if (!(await page.$('#detail .detail'))) errors.push('explore detail panel missing');

  // Value map: both sources, 3D toggle
  await page.evaluate(() => { location.hash = 'value'; });
  await page.click('[data-src="dsw"]');
  if ((await page.$$('.vm-dot')).length < 10) errors.push('value map (DeepSWE) shows too few points');
  await page.click('[data-src="aa"]');
  if ((await page.$$('.vm-dot')).length < 10) errors.push('value map (AA) shows too few points');
  await page.click('#d3'); await page.click('#d3');
}

// 2. Data integrity
if (!errors.length) {
  errors.push(...await page.evaluate(() => {
    const out = [], D = window.MG, M = D.models;
    for (const [k, m] of Object.entries(M)) {
      for (const f of ['n', 'p', 'i', 'o', 'v', 'mono', 'ctx']) if (m[f] === undefined) out.push(`model ${k} missing ${f}`);
      if (!('aa' in m)) out.push(`model ${k} missing aa (use null when not ranked)`);
      if (m.priceChangeDate && (m.iAfter == null || m.oAfter == null)) out.push(`model ${k}: priceChangeDate without iAfter/oAfter`);
      (m.ladder || []).forEach((l) => { if (l.length !== 3 || typeof l[1] !== 'number' || typeof l[2] !== 'number') out.push(`model ${k}: bad ladder row ${JSON.stringify(l)}`); });
    }
    D.groups.forEach((g) => g.tasks.forEach((t) => {
      if (!M[t.pr.m]) out.push(`task "${t.t}" pick → unknown model ${t.pr.m}`);
      t.alts.forEach((a) => { if (!M[a.m]) out.push(`task "${t.t}" alt → unknown model ${a.m}`); });
    }));
    D.watch.forEach((w) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(w.until)) out.push(`watch item "${w.t}" has a bad date`); });
    return out;
  }));
}

// 3. Each scheduled price-change date
if (!errors.length) {
  const dates = await page.evaluate(() => [...new Set(Object.values(window.MG.models).map((m) => m.priceChangeDate).concat(window.MG.watch.map((w) => w.until)).filter(Boolean))]);
  for (const d of dates) {
    const p2 = await browser.newPage();
    await p2.clock.setFixedTime(new Date(d + 'T12:00:00'));
    await visit(p2, ` on ${d}`);
    await p2.close();
  }
}

await browser.close();
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('✓ all routes render, every task/mode works, Explore + Value map controls work, data references OK, future-date views OK');
