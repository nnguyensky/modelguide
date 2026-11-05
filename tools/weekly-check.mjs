// Weekly data check for Model Guide.
//
// Compares data.js with outside sources and writes a Markdown report:
//   Prices        LiteLLM, models.dev, Artificial Analysis API, Cursor docs
//   Long prompts  LiteLLM + models.dev long-context price tiers vs `long`
//   Scores        Artificial Analysis Intelligence Index + cost per task vs `aa` / `aaCost`
//   Coding        DeepSWE leaderboard vs MG.dsw
//   Free tier     OpenCode Zen free list vs models marked free (`fr: 2`)
//   New models    model IDs that appeared in LiteLLM / models.dev / AA / DeepSWE / Zen since the last run
//
// Options
//   --out <file>          write the report there (it is always printed too)
//   --apply               update data.js for price changes that two or more sources agree on
//   --update-snapshot     save today's model IDs to tools/known-models.json (for "new models")
//   --checks-out <file>   write a small status file the page shows (checks.js)
// Environment
//   AA_API_KEY            Artificial Analysis key (free tier is enough); without it AA is skipped
//   GITHUB_TOKEN          used to list models.dev files through the GitHub API
//   MG_DATA, MG_SNAPSHOT  paths to data.js and the model-ID snapshot (defaults: the repo files)
//   LITELLM_FILE, MODELSDEV_DIR, AA_FILE, DSW_FILE, ZEN_FILE, CURSOR_FILE   local files instead of the network (tests)
//   OFFLINE=1             skip every source that has no local file
// In GitHub Actions it writes findings=<n> and applied=<n> to $GITHUB_OUTPUT.
import { readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = process.env;
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const flag = (name) => process.argv.includes(name);
const DATA = env.MG_DATA || path.join(root, 'data.js');
const SNAP = env.MG_SNAPSHOT || path.join(root, 'tools', 'known-models.json');
const today = new Date().toISOString().slice(0, 10);

const loadMGText = (text) => { const ctx = { window: {} }; vm.runInNewContext(text, ctx); return ctx.window.MG; };
const loadMG = (file) => loadMGText(readFileSync(file, 'utf8'));
const MG = loadMG(DATA);
const M = MG.models;
const past = (d) => !!d && today >= d;
const priceNow = (m) => (past(m.priceChangeDate) ? { i: m.iAfter ?? m.i, o: m.oAfter ?? m.o } : { i: m.i, o: m.o });
// Equal within rounding (sources round differently, e.g. $0.435 vs $0.43)
const same = (a, b) => a != null && b != null && Math.abs(a - b) <= Math.max(1e-6, 0.012 * Math.max(Math.abs(a), Math.abs(b)));
const $ = (v) => (v == null ? '—' : '$' + (+(+v).toFixed(4)));
const norm = (s) => String(s).toLowerCase().replace(/\(.*?\)/g, '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^claude /, '');

// ── Fetch helpers ─────────────────────────────────────────────────
const status = {};
async function get(url, { json = false, headers = {} } = {}) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'model-guide-weekly-check', ...headers } });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return json ? r.json() : r.text();
    } catch (e) {
      if (attempt === 3) throw new Error(`${url}: ${e.message}`);
      await new Promise((res) => setTimeout(res, 1000 * 2 ** attempt));
    }
  }
}
async function source(name, file, fetcher) {
  try {
    if (file) { const v = await fetcher(file); status[name] = 'ok (local file)'; return v; }
    if (env.OFFLINE === '1') { status[name] = 'skipped (offline)'; return null; }
    const v = await fetcher(null); status[name] = v == null ? 'skipped' : 'ok'; return v;
  } catch (e) { status[name] = 'FAILED: ' + e.message; return null; }
}

// ── 1. LiteLLM ────────────────────────────────────────────────────
const lit = await source('LiteLLM', env.LITELLM_FILE, async (f) => (f ? JSON.parse(readFileSync(f, 'utf8'))
  : get('https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json', { json: true })));

// ── 2. models.dev ─────────────────────────────────────────────────
const MD_PROVIDERS = ['openai', 'anthropic', 'google', 'xai', 'deepseek', 'moonshotai', 'zai', 'mistral', 'alibaba', 'minimax', 'xiaomi', 'meta'];
function mdPrice(toml) {
  const section = (name) => { const m = new RegExp('^\\[' + name.replace(/\./g, '\\.') + '\\]\\s*$([\\s\\S]*?)(?=^\\[|$(?![\\s\\S]))', 'm').exec(toml); return m ? m[1] : null; };
  const num = (txt, key) => { const m = txt && new RegExp('^' + key + '\\s*=\\s*([0-9.]+)', 'm').exec(txt); return m ? parseFloat(m[1]) : null; };
  const tier = (txt) => { const m = txt && /context\s*=\s*\{\s*gt\s*=\s*([0-9_]+)\s*\}\s*\}\s*,\s*price\s*=\s*([0-9.]+)/.exec(txt); return m ? { over: +m[1].replace(/_/g, ''), price: +m[2] } : null; };
  const si = section('cost.text.input'), so = section('cost.text.output');
  let i = num(si, 'price'), o = num(so, 'price');
  if (i == null || o == null) { const c = section('cost'); i = i ?? num(c, 'input'); o = o ?? num(c, 'output'); }
  const ti = tier(si), to = tier(so);
  return { i, o, long: ti && to ? { over: ti.over, i: ti.price, o: to.price } : null };
}
let mdTreeError = null;
const md = await source('models.dev', env.MODELSDEV_DIR, async (dir) => {
  const out = { prices: {}, ids: [] };
  if (dir) {
    for (const p of MD_PROVIDERS) { const d = path.join(dir, p, 'models'); if (existsSync(d)) readdirSync(d).filter((f) => f.endsWith('.toml')).forEach((f) => out.ids.push(`${p}/${f.replace(/\.toml$/, '')}`)); }
    for (const m of Object.values(M)) { const f = m.ref?.md && path.join(dir, m.ref.md.replace('/models/', '/models/') + '.toml'); if (f && existsSync(f)) out.prices[m.ref.md] = mdPrice(readFileSync(f, 'utf8')); }
    return out;
  }
  // File list (for new-model detection). Optional: if it fails, prices are still checked.
  const treeUrl = 'https://api.github.com/repos/sst/models.dev/git/trees/dev?recursive=1';
  let tree = null;
  try { tree = await get(treeUrl, { json: true, headers: env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {} }); }
  catch (e) { try { tree = await get(treeUrl, { json: true }); } catch (e2) { mdTreeError = e2.message; } }
  if (tree?.tree) tree.tree.forEach((t) => { const m = /^providers\/([^/]+)\/models\/(.+)\.toml$/.exec(t.path); if (m && MD_PROVIDERS.includes(m[1])) out.ids.push(`${m[1]}/${m[2]}`); });
  else out.ids = null;
  for (const m of Object.values(M)) {
    if (!m.ref?.md) continue;
    const t = await get(`https://raw.githubusercontent.com/sst/models.dev/dev/providers/${m.ref.md}.toml`);
    if (t) out.prices[m.ref.md] = mdPrice(t);
  }
  return out;
});
if (mdTreeError && status['models.dev']?.startsWith('ok')) status['models.dev'] = 'ok (prices) · file list failed: ' + mdTreeError;

// ── 3. Artificial Analysis API (free tier) ────────────────────────
const aa = await source('Artificial Analysis API', env.AA_FILE, async (f) => {
  if (f) return JSON.parse(readFileSync(f, 'utf8')).data;
  if (!env.AA_API_KEY) return null;
  const rows = [];
  for (let page = 1; page <= 20; page++) {
    const r = await get(`https://artificialanalysis.ai/api/v2/language/models/free?page=${page}`, { json: true, headers: { 'x-api-key': env.AA_API_KEY } });
    if (!r || !Array.isArray(r.data)) throw new Error('unexpected response shape');
    rows.push(...r.data);
    if (!r.pagination?.has_more) break;
  }
  return rows;
});
if (!env.AA_API_KEY && !env.AA_FILE && status['Artificial Analysis API'] === 'skipped') status['Artificial Analysis API'] = 'skipped (add an AA_API_KEY repository secret to enable)';

// AA lists one row per effort setting ("GPT-6.1 Sol (max)"); match by base name, allowing a trailing date code ("0813")
function aaRowsFor(m) {
  if (!aa) return [];
  const want = norm(m.ref?.aaName || m.n);
  return aa.filter((r) => { const n = norm(r.name); return n === want || (n.startsWith(want + ' ') && /^\d{4}$/.test(n.slice(want.length + 1))); });
}

// ── 4. DeepSWE ────────────────────────────────────────────────────
const dsw = await source('DeepSWE', env.DSW_FILE, async (f) => {
  const html = f ? readFileSync(f, 'utf8') : await get('https://deepswe.datacurve.ai/');
  const best = {};
  for (const m of html.matchAll(/\{model:"([^"]+)"([^{}]*)\}/g)) {
    const kv = Object.fromEntries([...m[2].matchAll(/(\w+):("([^"]*)"|-?[0-9.e+-]+|null)/g)].map((x) => [x[1], x[3] ?? x[2]]));
    if (kv.pass_at_1 == null || kv.n_tasks_attempted == null) continue;
    const row = { id: m[1], s: +kv.pass_at_1 * 100, c: +kv.mean_cost_usd, e: kv.reasoning_effort };
    if (!best[row.id] || row.s > best[row.id].s) best[row.id] = row;
  }
  if (!Object.keys(best).length) throw new Error('no leaderboard rows found in the page');
  return best;
});

// ── 5. OpenCode Zen free list ─────────────────────────────────────
const zen = await source('OpenCode Zen', env.ZEN_FILE, async (f) => {
  const html = f ? readFileSync(f, 'utf8') : await get('https://opencode.ai/docs/zen');
  const free = [...html.matchAll(/<tr><td>([^<]+)<\/td><td>\s*Free\s*<\/td><td>\s*Free\s*<\/td>/g)].map((x) => x[1].trim());
  if (!free.length) throw new Error('no free models found in the page');
  return free;
});

// ── 6. Cursor docs (plan-pool prices) ─────────────────────────────
const cursor = await source('Cursor docs', env.CURSOR_FILE, async (f) => {
  const html = f ? readFileSync(f, 'utf8') : await get('https://cursor.com/docs/models');
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
});
function cursorPrice(name) {
  if (!cursor) return null;
  const re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+\\$\\s*([\\d.]+)\\s+(?:-|\\$\\s*[\\d.]+)\\s+\\$\\s*([\\d.]+)\\s+\\$\\s*([\\d.]+)');
  const m = re.exec(cursor); return m ? { i: +m[1], o: +m[3] } : null;
}

const snap = existsSync(SNAP) ? JSON.parse(readFileSync(SNAP, 'utf8')) : {};

// ── Checks ────────────────────────────────────────────────────────
const priceRows = [], priceDiffs = [], longDiffs = [], scoreDiffs = [], notFound = [], applied = [];
for (const [k, m] of Object.entries(M)) {
  const want = priceNow(m);
  const seen = [];
  const lp = m.ref?.lit && lit?.[m.ref.lit];
  if (m.ref?.lit && lit && !lp) notFound.push(`${m.n}: not in LiteLLM as \`${m.ref.lit}\``);
  if (lp && lp.input_cost_per_token != null) seen.push({ src: 'LiteLLM', i: lp.input_cost_per_token * 1e6, o: (lp.output_cost_per_token ?? 0) * 1e6 });
  const mp = m.ref?.md && md?.prices[m.ref.md];
  if (m.ref?.md && md && !mp) notFound.push(`${m.n}: not in models.dev at \`${m.ref.md}\``);
  if (mp && mp.i != null) seen.push({ src: 'models.dev', i: mp.i, o: mp.o });
  if (m.aa != null && !m.legacy) {
    const rows = aaRowsFor(m);
    if (aa && !rows.length) notFound.push(`${m.n}: not found in the Artificial Analysis API (set \`ref.aaName\` if AA names it differently)`);
    if (rows.length) {
      const pr = rows.find((r) => r.pricing?.price_1m_input_tokens != null);
      if (pr) seen.push({ src: 'Artificial Analysis', i: pr.pricing.price_1m_input_tokens, o: pr.pricing.price_1m_output_tokens });
      const ix = (r) => r.evaluations?.artificial_analysis_intelligence_index ?? -1, cx = (r) => r.artificial_analysis_intelligence_index_cost?.cost_per_task?.total_cost ?? Infinity;
      // best setting = highest index; on a tie, the cheaper one (same rule as data.js)
      const top = rows.reduce((b, r) => (ix(r) > ix(b) || (ix(r) === ix(b) && cx(r) < cx(b)) ? r : b), rows[0]);
      const idx = top.evaluations?.artificial_analysis_intelligence_index;
      const cpt = top.artificial_analysis_intelligence_index_cost?.cost_per_task?.total_cost;
      if (idx != null && Math.round(idx) !== m.aa) scoreDiffs.push(`${m.n}: AA ${m.aa} in data.js, ${Math.round(idx)} on Artificial Analysis (${top.name})`);
      if (cpt != null && m.aaCost && Math.abs(cpt - m.aaCost) / m.aaCost > 0.1) scoreDiffs.push(`${m.n}: $${m.aaCost.toFixed(2)}/task in data.js, $${cpt.toFixed(2)} on Artificial Analysis`);
    }
  }
  if (m.ref?.cursor) { const cp = cursorPrice(m.ref.cursor); if (cp) seen.push({ src: 'Cursor', ...cp }); else if (cursor) notFound.push(`${m.n}: "${m.ref.cursor}" not found on the Cursor models page`); }
  if (!seen.length) continue;
  priceRows.push(k);
  // A source that already shows the scheduled post-promo price is not a difference
  const pending = m.priceChangeDate && !past(m.priceChangeDate);
  const off = seen.filter((x) => (!same(x.i, want.i) || !same(x.o, want.o)) && !(pending && same(x.i, m.iAfter) && same(x.o, m.oAfter)));
  off.forEach((x) => priceDiffs.push({ k, n: m.n, src: x.src, have: want, theirs: x }));
  // Agreement: two or more sources report the same new price → safe to propose
  if (off.length >= 2 && off.every((x) => same(x.i, off[0].i) && same(x.o, off[0].o)) && !(m.priceChangeDate && !past(m.priceChangeDate))) {
    applied.push({ k, n: m.n, p: m.p, from: want, to: { i: off[0].i, o: off[0].o }, srcs: off.map((x) => x.src) });
  }
  // Long-prompt tiers
  const tiers = [];
  if (lp) for (const [key, v] of Object.entries(lp)) { const t = /^input_cost_per_token_above_(\d+)k_tokens$/.exec(key); if (t) tiers.push({ src: 'LiteLLM', over: +t[1] * 1000, i: v * 1e6, o: (lp[`output_cost_per_token_above_${t[1]}k_tokens`] ?? NaN) * 1e6 }); }
  if (mp?.long) tiers.push({ src: 'models.dev', ...mp.long });
  for (const t of tiers) {
    if (!m.long) { longDiffs.push(`${m.n}: ${t.src} has a long-prompt price over ${t.over / 1000}K (${$(t.i)} / ${isNaN(t.o) ? '?' : $(t.o)}); data.js has none`); continue; }
    if (t.over !== m.long.over || !same(t.i, m.long.i) || (!isNaN(t.o) && !same(t.o, m.long.o))) longDiffs.push(`${m.n}: data.js ${$(m.long.i)} / ${$(m.long.o)} over ${m.long.over / 1000}K · ${t.src} ${$(t.i)} / ${isNaN(t.o) ? '?' : $(t.o)} over ${t.over / 1000}K`);
  }
}
const appliedKeys = new Set(applied.map((a) => a.k));

// DeepSWE vs MG.dsw
const dswDiffs = [];
if (dsw) {
  const ours = Object.fromEntries(MG.dsw.map((d) => [d.id, d]));
  for (const [id, r] of Object.entries(dsw)) {
    const o = ours[id];
    if (!o) { dswDiffs.push(`New on DeepSWE: \`${id}\` — ${r.s.toFixed(1)}% at $${r.c.toFixed(2)}/task (${r.e})`); continue; }
    if (Math.abs(o.s - r.s) >= 0.5 || Math.abs(o.c - r.c) / o.c > 0.1) dswDiffs.push(`${o.n}: data.js ${o.s.toFixed(1)}% / $${o.c.toFixed(2)} · DeepSWE ${r.s.toFixed(1)}% / $${r.c.toFixed(2)} (${r.e})`);
  }
}

// Zen free list vs fr:2
const zenDiffs = [];
if (zen) {
  const freeSet = new Set(zen);
  for (const m of Object.values(M)) if (m.fr === 2 && m.ref?.zen && !freeSet.has(m.ref.zen)) zenDiffs.push(`${m.n} is marked free on Zen, but "${m.ref.zen}" is no longer in Zen's free list`);
  const known = new Set(Object.values(M).map((m) => m.ref?.zen).filter(Boolean));
  // Unlisted free models: shown once (first run); after that only new ones, via the model-ID snapshot
  if (!snap.zenFree) zen.filter((z) => !known.has(z)).forEach((z) => zenDiffs.push(`Free on Zen, not in data.js: ${z}`));
}

// New model IDs since the last run
const LIT_FAMILY = /^(gpt-[6-9]|gpt-5\.[6-9]|claude-(opus|sonnet|haiku|fable|mythos)-[5-9]|gemini-[3-9]|gemini\/gemini-[3-9]|xai\/grok-[4-9]|deepseek\/|moonshot\/kimi-k[3-9]|zai\/glm-[5-9]|mistral\/mistral-(large|medium|small)-[4-9]|xiaomi_mimo\/|meta\/muse|minimax\/minimax-m[3-9])/i;
const current = {
  litellm: lit ? Object.keys(lit).filter((k) => LIT_FAMILY.test(k)).sort() : null,
  modelsdev: md && md.ids ? [...md.ids].sort() : null,
  aa: aa ? [...new Set(aa.map((r) => r.slug || r.name))].sort() : null,
  dsw: dsw ? Object.keys(dsw).sort() : null,
  zenFree: zen ? [...zen].sort() : null,
};
const newIds = {};
for (const [src, ids] of Object.entries(current)) {
  if (!ids) continue;
  if (!snap[src] || !snap[src].length) { newIds[src] = null; continue; } // first run for this source = baseline
  const old = new Set(snap[src]); const fresh = ids.filter((x) => !old.has(x));
  if (fresh.length) newIds[src] = fresh;
}
// High-scoring AA models we don't list at all
const aaNew = [];
if (aa) {
  const ourNames = Object.values(M).map((m) => norm(m.ref?.aaName || m.n));
  const byBase = {};
  aa.forEach((r) => { const b = norm(r.name).replace(/ \d{4}$/, ''); const v = r.evaluations?.artificial_analysis_intelligence_index; if (v != null && (!byBase[b] || v > byBase[b].v)) byBase[b] = { v, name: r.name, slug: r.slug || r.name, creator: r.model_creator?.name }; });
  const seenAA = new Set(snap.aa || []);
  Object.entries(byBase).filter(([b, x]) => x.v >= 40 && !ourNames.includes(b) && !(snap.aa && seenAA.has(x.slug))).sort((a, b) => b[1].v - a[1].v).forEach(([, x]) => aaNew.push(`${x.name} (${x.creator || '?'}) — AA ${Math.round(x.v)}`));
}

// Upcoming scheduled changes (info)
const soon = MG.watch.filter((w) => !past(w.until) && (new Date(w.until) - new Date(today)) / 864e5 <= 14);

// ── Apply agreed price changes to data.js ─────────────────────────
function fmtD(iso) { return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }); }
function applyChanges(changes) {
  let t = readFileSync(DATA, 'utf8');
  const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const c of changes) {
    // 1) model entry (pretty-printed JSON inside data.js)
    const start = t.indexOf(`\n "${c.k}": {`); if (start < 0) throw new Error(`model ${c.k} not found in data.js`);
    const end = t.indexOf('\n }', start);
    let block = t.slice(start, end);
    block = block.replace(/\n  "i": [0-9.]+,/, `\n  "i": ${c.to.i},`).replace(/\n  "o": [0-9.]+,/, `\n  "o": ${c.to.o},`).replace(/\n  "v": "[0-9-]+",/, `\n  "v": "${today}",`);
    t = t.slice(0, start) + block + t.slice(end);
    // 2) price history
    const row = `['${today}', ${c.to.i}, ${c.to.o}, 'Price change (auto-detected)']`;
    const hl = new RegExp(`^ ${rx(c.k)}: \\[(.*)\\],$`, 'm');
    if (hl.test(t)) t = t.replace(hl, (m0, inner) => ` ${c.k}: [${inner}, ${row}],`);
    else t = t.replace(/MG\.history = \{\n/, (m0) => `${m0} ${c.k}: [${row}],\n`);
    // 3) timeline entry (drives "new since your last visit" and the RSS feed)
    const line = `    {d:'${fmtD(today)}', iso:'${today}', added:'${today}', p:'${c.p}', c:'gray', t:'${c.n} price change', b:'<strong>$${c.from.i}/$${c.from.o} → $${c.to.i}/$${c.to.o}</strong> per 1M tokens (in/out). Detected in ${c.srcs.join(' and ')} — confirm on the vendor page before merging.', n:1},\n`;
    t = t.replace(/MG\.timeline = \[\n/, (m0) => m0 + line); // function form: prices contain "$"
  }
  // Check the edited file parses and holds the new prices before writing it
  const check = loadMGText(t);
  for (const c of changes) if (!same(check.models[c.k].i, c.to.i) || !same(check.models[c.k].o, c.to.o)) throw new Error(`edit of ${c.k} did not apply`);
  writeFileSync(DATA, t);
}
if (flag('--apply') && applied.length) applyChanges(applied);

// ── Report ────────────────────────────────────────────────────────
const L = [];
const newIdCount = Object.values(newIds).filter(Array.isArray).reduce((a, x) => a + x.length, 0);
const priceOpen = priceDiffs.filter((d) => !appliedKeys.has(d.k));
const failed = Object.entries(status).filter(([, v]) => v.startsWith('FAILED'));
const findings = priceOpen.length + longDiffs.length + scoreDiffs.length + dswDiffs.length + zenDiffs.length + newIdCount + aaNew.length + failed.length;
L.push(`## Weekly data check — ${today}`, '', `Data in \`data.js\` was last checked by hand on ${MG.checked}.`, '');
L.push('| Check | Result |', '|---|---|');
L.push(`| Prices (${priceRows.length} models) | ${priceDiffs.length ? `${priceDiffs.length} difference${priceDiffs.length > 1 ? 's' : ''}` : 'all match'}${applied.length ? ` · ${applied.length} agreed change${applied.length > 1 ? 's' : ''} proposed in a PR` : ''} |`);
L.push(`| Long-prompt tiers | ${longDiffs.length ? longDiffs.length + ' to check' : 'all match'} |`);
L.push(`| AA scores / cost per task | ${aa ? (scoreDiffs.length ? scoreDiffs.length + ' changed' : 'no change') : 'not checked'} |`);
L.push(`| DeepSWE | ${dsw ? (dswDiffs.length ? dswDiffs.length + ' changed or new' : 'no change') : 'not checked'} |`);
L.push(`| Zen free list | ${zen ? (zenDiffs.length ? zenDiffs.length + ' changed' : 'no change') : 'not checked'} |`);
L.push(`| New model IDs | ${newIdCount ? newIdCount + ' new' : 'none'}${aaNew.length ? ` · ${aaNew.length} high-scoring on AA not listed` : ''} |`);
L.push('');
if (applied.length) { L.push('### Proposed price updates (two or more sources agree)', ''); applied.forEach((a) => L.push(`- **${a.n}**: $${a.from.i} / $${a.from.o} → **$${a.to.i} / $${a.to.o}** (${a.srcs.join(', ')})`)); L.push(''); }
if (priceOpen.length) { L.push('### Price differences', '', '| Model | Source | data.js (in / out) | Source (in / out) |', '|---|---|---|---|'); priceOpen.forEach((d) => L.push(`| ${d.n} | ${d.src} | ${$(d.have.i)} / ${$(d.have.o)} | ${$(d.theirs.i)} / ${$(d.theirs.o)} |`)); L.push('', 'A difference can mean a price change, a promo starting or ending, or a source that is behind. Check the vendor page.', ''); }
const section = (title, rows) => { if (rows.length) { L.push(`### ${title}`, ''); rows.forEach((r) => L.push(`- ${r}`)); L.push(''); } };
section('Long-prompt price tiers', longDiffs);
section('Scores (Artificial Analysis)', scoreDiffs);
section('High-scoring models on Artificial Analysis that data.js does not list', aaNew);
section('DeepSWE', dswDiffs);
section('OpenCode Zen free list', zenDiffs);
for (const [src, ids] of Object.entries(newIds)) if (ids) section(`New model IDs in ${src}`, ids.map((x) => `\`${x}\``));
section('Coming up in the next 14 days', soon.map((w) => `${w.d}: ${w.t} (${w.b}) — the page switches automatically`));
section('Not found in a source', notFound);
L.push('### Sources', '', '| Source | Status |', '|---|---|'); Object.entries(status).forEach(([k, v]) => L.push(`| ${k} | ${v} |`));
const baseline = Object.entries(newIds).filter(([, v]) => v === null).map(([k]) => k);
if (baseline.length) L.push('', `First run for: ${baseline.join(', ')} — today's model list is saved as the baseline; new IDs are reported from next week.`);
const report = L.join('\n') + '\n';

process.stdout.write(report);
if (arg('--out')) writeFileSync(arg('--out'), report);
if (flag('--update-snapshot')) {
  const next = { ...snap, updated: today };
  for (const [src, ids] of Object.entries(current)) if (ids) next[src] = ids;
  writeFileSync(SNAP, JSON.stringify(next, null, 1) + '\n');
}
if (arg('--checks-out')) {
  const summary = { date: today, prices: { models: priceRows.length, diffs: priceDiffs.length }, applied: applied.length, findings, sources: Object.fromEntries(Object.entries(status).map(([k, v]) => [k, v.startsWith('ok') ? 'ok' : v.startsWith('FAILED') ? 'failed' : 'skipped'])) };
  writeFileSync(arg('--checks-out'), `// Written by the weekly data check (tools/weekly-check.mjs). Do not edit by hand.\nwindow.MG_CHECKS = ${JSON.stringify(summary, null, 1)};\n`);
}
if (env.GITHUB_OUTPUT) appendFileSync(env.GITHUB_OUTPUT, `findings=${findings}\napplied=${applied.length}\n`);
