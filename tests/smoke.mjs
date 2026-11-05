// Smoke test: load the page headless, visit every route, click through every
// task / mode on Recommend, use Explore filters and the Value map toggles, and
// fail on any JS error or broken data reference. Also re-runs on each scheduled
// price-change date so date-switched text paths execute.
// Run: node tests/smoke.mjs   (needs the `playwright` package + Chromium)
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(path.join(root, 'index.html')).href;
const ROUTES = ['recommend', 'explore', 'compare', 'router', 'value', 'insights', 'changes', 'sheet'];
const require = createRequire(import.meta.url);
let axePath = null; try { axePath = require.resolve('axe-core/axe.min.js'); } catch (e) { /* optional */ }

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
      await page.waitForFunction((h) => h === 'sheet' ? !!document.querySelector('.sheet') : document.querySelector(`.nav a[data-route="${h}"]`)?.getAttribute('aria-current') === 'page', r, { timeout: 5000 });
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
  // Shareable link: opening it restores task + mode
  await page.click('[data-group="1"]'); await page.click('[data-mode="cheap"]');
  const shared = await page.evaluate(() => location.hash);
  if (!/^#recommend\/[a-z0-9-]+\/cheap$/.test(shared)) errors.push(`recommend link not shareable: ${shared}`);
  const p3 = await browser.newPage(); await p3.route('**/fonts.googleapis.com/**', (r) => r.abort());
  await p3.goto(url + shared);
  const pressed = await p3.$eval('[data-mode][aria-pressed="true"]', (b) => b.dataset.mode);
  if (pressed !== 'cheap') errors.push('opening a shared recommend link did not restore the mode');
  await p3.close();
  await page.click('#share');

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
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#csv')]);
  const csv = readFileSync(await dl.path(), 'utf8');
  if (!/^Model,Provider,/.test(csv) || csv.trim().split('\n').length < 10) errors.push('CSV export is empty or malformed');
  await page.click('#detail [data-cmp]');

  // Explore on a phone: tapping a row brings the details into view
  const ph = await browser.newPage({ viewport: { width: 390, height: 844 } }); await ph.route('**/fonts.googleapis.com/**', (r) => r.abort());
  await ph.goto(url + '#explore'); await ph.waitForSelector('#rows tr[data-k]');
  await ph.click('#rows tr[data-k]:nth-child(8)'); await ph.waitForTimeout(800);
  const inView = await ph.$eval('#detail', (el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
  if (!inView) errors.push('explore (phone): details not scrolled into view after tapping a row');
  await ph.close();

  // Compare: three models, calculator, long-prompt tier
  await page.evaluate(() => { location.hash = 'compare/gpt61sol,opus55,haiku55'; });
  await page.waitForSelector('.cmp-table');
  if ((await page.$$('.cmp-table thead th')).length !== 4) errors.push('compare did not show three models');
  await page.fill('#inTok', '300000');
  if (!(await page.$('#calc-out .tag.warn'))) errors.push('compare calculator did not apply the long-prompt price tier');
  await page.fill('#inTok', '20000');

  // Value map: both sources, 3D toggle
  await page.evaluate(() => { location.hash = 'value'; });
  await page.click('[data-src="dsw"]');
  if ((await page.$$('.vm-dot')).length < 10) errors.push('value map (DeepSWE) shows too few points');
  await page.click('[data-src="aa"]');
  if ((await page.$$('.vm-dot')).length < 10) errors.push('value map (AA) shows too few points');
  await page.click('#d3'); await page.click('#d3');
}

// 1a. Router, price history, cheat sheet
if (!errors.length) {
  await page.evaluate(() => { location.hash = 'router'; });
  await page.waitForSelector('#rt-out .kpis');
  await page.click('[data-preset="three"]');
  if ((await page.$$('.tier')).length !== 3) errors.push('router: three-step preset did not give 3 tiers');
  const before = await page.$eval('#rt-out .kpis b', (b) => b.textContent);
  await page.$eval('[data-ts="1"]', (el) => { el.value = '50'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  const after = await page.$eval('#rt-out .kpis b', (b) => b.textContent);
  if (before === after) errors.push('router: moving a share slider did not change the monthly cost');
  const share0 = await page.$eval('#rt-o0', (o) => parseInt(o.textContent, 10));
  const others = await page.$$eval('[data-ts]', (rs) => rs.reduce((a, r) => a + +r.value, 0));
  if (share0 + others !== 100) errors.push(`router: shares add up to ${share0 + others}%, not 100%`);
  await page.click('[data-rm="2"]');
  if ((await page.$$('.tier')).length !== 2) errors.push('router: removing a tier failed');
  await page.click('#rt-add');
  if ((await page.$$('.tier')).length !== 3) errors.push('router: adding a tier failed');
  const calc = await page.evaluate(() => window.MGApp.routerCalc());
  if (!(calc.month > 0) || !(calc.aa > 0)) errors.push('router: calculation returned no cost or score');

  await page.evaluate(() => { location.hash = 'explore/gptSol'; });
  await page.waitForSelector('#detail .hist svg');
  if ((await page.$$('#detail .hist-dot')).length < 3) errors.push('price history: GPT-5.6 Sol should show 3 price points');
  if (!(await page.$('#detail .hist-dot.future'))) errors.push('price history: scheduled change not marked');

  await page.evaluate(() => { location.hash = 'sheet'; });
  await page.waitForSelector('.sheet');
  await page.emulateMedia({ media: 'print' });
  const h = await page.$eval('.sheet', (el) => el.scrollHeight);
  if (h > 1125) errors.push(`cheat sheet is ${h}px tall in print — more than one A4 page (1123px)`);
  await page.emulateMedia({ media: 'screen' });
}

// 1a2. "New since your last visit": a visitor who last saw older data gets a badge
if (!errors.length) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { try { if (!sessionStorage.getItem('t')) { localStorage.setItem('mg-seen', JSON.stringify('2026-08-29')); sessionStorage.setItem('t', '1'); } } catch (e) { /* ignore */ } });
  const pv = await ctx.newPage(); await pv.route('**/fonts.googleapis.com/**', (r) => r.abort());
  await pv.goto(url);
  const want = await pv.evaluate(() => window.MG.timeline.filter((t) => t.added > '2026-08-29').length);
  const badge = await pv.$eval('.nav-badge', (b) => +b.textContent).catch(() => 0);
  if (!want || badge !== want) errors.push(`new-since-visit badge shows ${badge}, expected ${want}`);
  await pv.evaluate(() => { location.hash = 'changes'; });
  await pv.waitForSelector('.timeline');
  if ((await pv.$$('.timeline li.fresh')).length !== want) errors.push('changes page does not mark every new item');
  await ctx.close();
}

// 1b. Stale-data banner shows when the data is old, and not when it is fresh
if (!errors.length) {
  if (await page.$('.stale')) errors.push('stale banner shown on fresh data');
  const old = await page.evaluate(() => window.MG.checked);
  const p4 = await browser.newPage(); await p4.route('**/fonts.googleapis.com/**', (r) => r.abort());
  await p4.clock.setFixedTime(new Date(new Date(old + 'T12:00:00').getTime() + 45 * 864e5));
  await p4.goto(url);
  if (!(await p4.$('.stale'))) errors.push('stale banner missing 45 days after the data date');
  await p4.close();
}

// 1c. Accessibility (axe-core): no serious or critical issues on any page, light and dark
if (!errors.length && axePath) {
  for (const theme of ['light', 'dark']) {
    const pa = await browser.newPage({ colorScheme: theme }); await pa.route('**/fonts.googleapis.com/**', (r) => r.abort());
    await pa.goto(url);
    for (const r of ROUTES) {
      await pa.evaluate((h) => { location.hash = h; }, r);
      await pa.waitForTimeout(150);
      if (!(await pa.evaluate(() => !!window.axe))) await pa.addScriptTag({ path: axePath });
      const v = await pa.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations
        .filter((x) => x.impact === 'serious' || x.impact === 'critical')
        .map((x) => `${x.id} (${x.impact}) x${x.nodes.length}: ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`));
      v.forEach((x) => errors.push(`a11y ${theme} #${r}: ${x}`));
    }
    await pa.close();
  }
} else if (!axePath) console.warn('axe-core not installed — accessibility check skipped (npm install --no-save axe-core@4.14.0)');

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
    D.timeline.forEach((t) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(t.iso || '') || !/^\d{4}-\d{2}-\d{2}$/.test(t.added || '')) out.push(`timeline "${t.t}" needs iso and added dates`); });
    Object.entries(D.history || {}).forEach(([k, h]) => {
      if (!M[k]) out.push(`history for unknown model ${k}`);
      h.forEach((r) => { if (!/^~?\d{4}-\d{2}-\d{2}$/.test(r[0]) || typeof r[1] !== 'number' || typeof r[2] !== 'number') out.push(`history ${k}: bad row ${JSON.stringify(r)}`); });
      const last = h.filter((r) => r[0].replace('~', '') <= new Date().toISOString().slice(0, 10)).pop();
      const cur = window.MGApp.effPrice(k);
      if (last && (last[1] !== cur.i || last[2] !== cur.o)) out.push(`history ${k}: latest point ${last[1]}/${last[2]} differs from current price ${cur.i}/${cur.o}`);
    });
    (D.routerPresets || []).forEach((p) => p.tiers.forEach((t) => { if (!M[t[0]]) out.push(`router preset ${p.id}: unknown model ${t[0]}`); }));
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
console.log(`✓ all routes render, every task/mode works, share links, CSV, compare + calculator, router, price history, one-page cheat sheet, new-since-visit, phone details, stale banner${axePath ? ', accessibility (axe)' : ''}, data references, future-date views OK`);
