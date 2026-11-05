// Compare the prices in data.js with two open price databases:
//   LiteLLM  — github.com/BerriAI/litellm  model_prices_and_context_window.json
//   models.dev — github.com/sst/models.dev  providers/<file>.toml
// Each model's keys live in data.js as  ref: { lit, md }.
//
// Usage:  node tools/check-prices.mjs [--out report.md]
// Prints a Markdown report. In GitHub Actions it also writes `diffs=<n>` to $GITHUB_OUTPUT.
// Exit code is 0 unless the script itself fails (a price difference is a finding, not an error).
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LITELLM = 'https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json';
const MODELSDEV = 'https://raw.githubusercontent.com/sst/models.dev/dev/providers/';

// Load data.js the way the browser does (it assigns window.MG)
const ctx = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, 'data.js'), 'utf8'), ctx);
const MG = ctx.window.MG;
const today = new Date();
const past = (d) => !!d && today >= new Date(d + 'T00:00:00');
const priceNow = (m) => (past(m.priceChangeDate) ? { i: m.iAfter ?? m.i, o: m.oAfter ?? m.o } : { i: m.i, o: m.o });
const same = (a, b) => a != null && b != null && Math.abs(a - b) < 1e-6;
const fmt = (v) => (v == null ? '—' : '$' + (+v.toFixed(4)));

async function get(url, as = 'text') {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'model-guide-price-check' } });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return as === 'json' ? r.json() : r.text();
    } catch (e) {
      if (attempt === 3) throw new Error(`${url}: ${e.message}`);
      await new Promise((res) => setTimeout(res, 1000 * 2 ** attempt));
    }
  }
}

// Minimal reader for the models.dev cost fields. Two layouts exist:
//   [cost.text.input] price = 2        [cost.text.output] price = 10
//   [cost] input = 2  output = 10
function mdPrice(toml) {
  const section = (name) => {
    const m = new RegExp('^\\[' + name.replace(/\./g, '\\.') + '\\]\\s*$([\\s\\S]*?)(?=^\\[|$(?![\\s\\S]))', 'm').exec(toml);
    return m ? m[1] : null;
  };
  const num = (txt, key) => { const m = txt && new RegExp('^' + key + '\\s*=\\s*([0-9.]+)', 'm').exec(txt); return m ? parseFloat(m[1]) : null; };
  let i = num(section('cost.text.input'), 'price'), o = num(section('cost.text.output'), 'price');
  if (i == null || o == null) { const c = section('cost'); i = i ?? num(c, 'input'); o = o ?? num(c, 'output'); }
  return { i, o };
}

const lit = await get(LITELLM, 'json');
const rows = [], diffs = [], missing = [];
for (const [k, m] of Object.entries(MG.models)) {
  if (!m.ref) continue;
  const want = priceNow(m);
  const row = { k, n: m.n, want, lit: null, md: null };
  if (m.ref.lit) {
    const e = lit[m.ref.lit];
    if (e && e.input_cost_per_token != null) row.lit = { i: e.input_cost_per_token * 1e6, o: (e.output_cost_per_token ?? 0) * 1e6 };
    else missing.push(`${m.n}: not in LiteLLM as \`${m.ref.lit}\``);
  }
  if (m.ref.md) {
    const t = await get(MODELSDEV + m.ref.md + '.toml');
    if (t) row.md = mdPrice(t); else missing.push(`${m.n}: not in models.dev at \`${m.ref.md}\``);
  }
  for (const [src, p] of [['LiteLLM', row.lit], ['models.dev', row.md]]) {
    if (p && (!same(p.i, want.i) || !same(p.o, want.o))) diffs.push({ n: m.n, src, have: want, theirs: p });
  }
  rows.push(row);
}

const lines = [];
lines.push(`## Price check — ${today.toISOString().slice(0, 10)}`, '');
lines.push(`Compared ${rows.length} models in \`data.js\` (checked ${MG.checked}) with LiteLLM and models.dev.`, '');
if (diffs.length) {
  lines.push(`### ${diffs.length} difference${diffs.length > 1 ? 's' : ''}`, '', '| Model | Source | data.js (in / out) | Source (in / out) |', '|---|---|---|---|');
  diffs.forEach((d) => lines.push(`| ${d.n} | ${d.src} | ${fmt(d.have.i)} / ${fmt(d.have.o)} | ${fmt(d.theirs.i)} / ${fmt(d.theirs.o)} |`));
  lines.push('', 'A difference can mean the price changed, a promo started or ended, or the source is behind. Check the vendor page, then update `data.js` (prices, `v`, `MG.checked`).');
} else {
  lines.push('No differences: every price matches both sources.');
}
if (missing.length) { lines.push('', '### Not found in a source', ''); missing.forEach((x) => lines.push(`- ${x}`)); }
const report = lines.join('\n') + '\n';

process.stdout.write(report);
const outIdx = process.argv.indexOf('--out');
if (outIdx > 0) writeFileSync(process.argv[outIdx + 1], report);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `diffs=${diffs.length}\n`);
