// Offline test for tools/weekly-check.mjs.
// Builds fake LiteLLM / models.dev / DeepSWE / Zen / Cursor sources from data.js itself,
// then checks that:
//   1. when every source matches, there are no findings;
//   2. a price that two sources agree on is applied to a copy of data.js correctly
//      (price, history row, timeline entry) and the file still loads;
//   3. a model marked free on Zen that left the free list is reported;
//   4. a new model ID is reported once a snapshot exists.
// Run: node tests/weekly-check.test.mjs
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (f) => { const c = { window: {} }; vm.runInNewContext(readFileSync(f, 'utf8'), c); return c.window.MG; };
const MG = load(path.join(root, 'data.js'));
const tmp = mkdtempSync(path.join(tmpdir(), 'mg-weekly-'));
const errors = [];
const today = new Date().toISOString().slice(0, 10);
const priceNow = (m) => (m.priceChangeDate && today >= m.priceChangeDate ? { i: m.iAfter, o: m.oAfter } : { i: m.i, o: m.o });

function fixtures(dir, { change = null, dropZen = null, extraLit = null } = {}) {
  mkdirSync(dir, { recursive: true });
  const lit = {}, mdDir = path.join(dir, 'md');
  for (const [k, m] of Object.entries(MG.models)) {
    let p = priceNow(m);
    if (change && change.k === k) p = change.to;
    if (m.ref?.lit) {
      lit[m.ref.lit] = { input_cost_per_token: p.i / 1e6, output_cost_per_token: p.o / 1e6 };
      if (m.long) Object.assign(lit[m.ref.lit], { [`input_cost_per_token_above_${m.long.over / 1000}k_tokens`]: m.long.i / 1e6, [`output_cost_per_token_above_${m.long.over / 1000}k_tokens`]: m.long.o / 1e6 });
    }
    if (m.ref?.md) {
      const f = path.join(mdDir, m.ref.md + '.toml'); mkdirSync(path.dirname(f), { recursive: true });
      const over = m.long ? `\noverrides = [{ when = { context = { gt = ${m.long.over} } }, price = ${m.long.i} }]` : '';
      const overO = m.long ? `\noverrides = [{ when = { context = { gt = ${m.long.over} } }, price = ${m.long.o} }]` : '';
      writeFileSync(f, `name = "${m.n}"\n\n[cost.text.input]\nprice = ${p.i}${over}\n\n[cost.text.output]\nprice = ${p.o}${overO}\n`);
    }
  }
  if (extraLit) lit[extraLit] = { input_cost_per_token: 1e-6, output_cost_per_token: 2e-6 };
  writeFileSync(path.join(dir, 'lit.json'), JSON.stringify(lit));
  const dswRows = MG.dsw.map((d) => `{model:"${d.id}",harness:"mini-swe-agent",reasoning_effort:"${d.e}",pass_at_1:${d.s / 100},mean_cost_usd:${d.c},n_tasks_attempted:113}`).join(',');
  writeFileSync(path.join(dir, 'dsw.html'), `<script>self.__data=[${dswRows}]</script>`);
  const zen = Object.values(MG.models).filter((m) => m.fr === 2 && m.ref?.zen && m.ref.zen !== dropZen).map((m) => `<tr><td>${m.ref.zen}</td><td>Free</td><td>Free</td><td>Free</td></tr>`).join('');
  writeFileSync(path.join(dir, 'zen.html'), `<table>${zen}</table>`);
  const cur = Object.values(MG.models).filter((m) => m.ref?.cursor).map((m) => `<tr><td>${m.ref.cursor}</td><td>$${m.i}</td><td>-</td><td>$0.1</td><td>$${m.o}</td></tr>`).join('');
  writeFileSync(path.join(dir, 'cursor.html'), `<table>${cur}</table>`);
  return { LITELLM_FILE: path.join(dir, 'lit.json'), MODELSDEV_DIR: mdDir, DSW_FILE: path.join(dir, 'dsw.html'), ZEN_FILE: path.join(dir, 'zen.html'), CURSOR_FILE: path.join(dir, 'cursor.html') };
}
function run(dir, srcEnv, args = []) {
  const data = path.join(dir, 'data.js'); copyFileSync(path.join(root, 'data.js'), data);
  const out = path.join(dir, 'gh-output.txt'); writeFileSync(out, '');
  const report = execFileSync(process.execPath, [path.join(root, 'tools/weekly-check.mjs'), ...args], {
    env: { ...process.env, ...srcEnv, OFFLINE: '1', AA_API_KEY: '', MG_DATA: data, MG_SNAPSHOT: path.join(dir, 'snap.json'), GITHUB_OUTPUT: out }, encoding: 'utf8',
  });
  const o = Object.fromEntries(readFileSync(out, 'utf8').trim().split('\n').map((l) => l.split('=')));
  return { report, findings: +o.findings, applied: +o.applied, data };
}

// 1. Everything matches → no findings (first run writes the baseline snapshot)
{
  const d = path.join(tmp, 'match'); const r = run(d, fixtures(d), ['--update-snapshot']);
  if (r.findings !== 0) errors.push(`matching sources gave ${r.findings} findings:\n${r.report}`);
  const r2 = run(d, fixtures(d)); // second run against the saved snapshot
  if (r2.findings !== 0) errors.push(`second matching run gave ${r2.findings} findings`);
}
// 2. Two sources agree on a new price → applied to data.js
{
  const d = path.join(tmp, 'apply'); const k = 'gpt61sol', to = { i: 3, o: 12 };
  const r = run(d, fixtures(d, { change: { k, to } }), ['--apply']);
  if (r.applied !== 1) errors.push(`expected 1 applied price change, got ${r.applied}`);
  const after = load(r.data);
  if (after.models[k].i !== 3 || after.models[k].o !== 12) errors.push('applied price not written to data.js');
  const h = after.history[k]; if (!h || h[h.length - 1][1] !== 3) errors.push('history row not added');
  if (!/GPT-6\.1 Sol price change/.test(after.timeline[0].t) || after.timeline[0].added !== today) errors.push('timeline entry not added');
  if (!/\$2\/\$10 → \$3\/\$12/.test(after.timeline[0].b)) errors.push(`timeline text wrong: ${after.timeline[0].b}`);
}
// 3. A free model drops off the Zen free list → reported
{
  const d = path.join(tmp, 'zen'); const gone = Object.values(MG.models).find((m) => m.fr === 2 && m.ref?.zen);
  const r = run(d, fixtures(d, { dropZen: gone.ref.zen }));
  if (!r.report.includes('no longer in Zen')) errors.push('model leaving the Zen free list was not reported');
}
// 4. New model ID after a baseline → reported
{
  const d = path.join(tmp, 'new');
  run(d, fixtures(d), ['--update-snapshot']);
  const r = run(d, fixtures(d, { extraLit: 'gpt-7-test' }));
  if (!r.report.includes('`gpt-7-test`')) errors.push('new LiteLLM model ID was not reported');
}

if (errors.length) { console.error(`✗ ${errors.length} problem(s):\n  ` + errors.join('\n  ')); process.exit(1); }
console.log('✓ weekly check: clean run, agreed price applied, Zen change and new model ID reported');
