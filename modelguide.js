// ═══════════════════════════════════════════════════════════════════
// MODEL SELECTION GUIDE v1.1 — DATA MODEL + RENDERERS
// ═══════════════════════════════════════════════════════════════════

// ─── Models ───
// aa = Artificial Analysis Intelligence Index (current version, best effort config, read Nov 5 2026).
// aa:null = listed but not ranked (legacy model, or no score on the current index).
// Prices $/MTok. Sources: Claude docs, Google Cloud pricing, xAI docs, DeepSeek docs, Z.ai docs,
// Cursor docs; OpenAI GPT-6, Kimi, Meta, Xiaomi, MiniMax, Mistral, Qwen from Artificial Analysis, each cross-checked
// against LiteLLM's open price database (github.com/BerriAI/litellm). openai.com sits behind a bot check.
const M = {
  // Anthropic — platform.claude.com
  opus55:    { n:'Opus 5.5',      p:'Anthropic',  i:4,   o:20,  aa:59, e:['low','med','high','xhigh','max'], b:'Best Claude. AA #2 (max). Fast mode $8/$40', t:'AA #2', c:'purple', fr:0, v:'2026-11-05', sn:'Sep 22' },
  sonnet55:  { n:'Sonnet 5.5',    p:'Anthropic',  i:2,   o:10,  aa:55, e:['low','med','high','xhigh','max'], b:'Best daily Claude. Writing, analysis', t:'Best daily', c:'green', fr:0, v:'2026-11-05', sn:'~Sep 28' },
  fable51:   { n:'Fable 5.1',     p:'Anthropic',  i:10,  o:50,  aa:50, e:['low','med','high','xhigh','max'], b:'Costliest Claude. Scores below Opus 5.5 on AA', t:'Premium', c:'purple', fr:0, v:'2026-11-05', sn:'Sep 1' },
  haiku55:   { n:'Haiku 5.5',     p:'Anthropic',  i:0.1, o:0.5, aa:36, e:['low','med','high','xhigh','max'], b:'Cheapest Claude. $0.50/$2.50 past 100K prompt', t:'Budget', c:'orange', fr:0, v:'2026-11-05', sn:'≤100K prompt; $0.50/$2.50 above' },
  opus5:     { n:'Opus 5',        p:'Anthropic',  i:5,   o:25,  aa:null, e:['low','med','high','xhigh','max'], b:'Legacy. Opus 5.5 is cheaper and better', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  fable5:    { n:'Fable 5',       p:'Anthropic',  i:10,  o:50,  aa:null, e:['low','med','high','xhigh','max'], b:'Legacy. Use Fable 5.1 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  sonnet5:   { n:'Sonnet 5',      p:'Anthropic',  i:2,   o:10,  aa:null, e:['low','med','high','xhigh','max'], b:'Legacy. Use Sonnet 5.5 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  opus48:    { n:'Opus 4.8',      p:'Anthropic',  i:5,   o:25,  aa:null, e:['low','med','high','xhigh','max'], b:'Legacy. Migrate to Opus 5.5', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },

  // OpenAI — GPT-6 family (prices via Artificial Analysis); GPT-5.6 prices confirmed on cursor.com
  gpt6astra: { n:'GPT-6 Astra',   p:'OpenAI',     i:10,  o:50,  aa:57, e:['low','med','high','xhigh','max'], b:'Top OpenAI. DeepSWE #1 (74.1%). $20/$75 past 272K', t:'DeepSWE #1', c:'blue', fr:0, v:'2026-11-05', sn:'Sep · $20/$75 &gt;272K' },
  gpt61sol:  { n:'GPT-6.1 Sol',   p:'OpenAI',     i:2,   o:10,  aa:55, e:['low','med','high','xhigh','max'], b:'Best value at the top: AA 55 for ~$1.27/task. $4/$15 past 272K', t:'Best value', c:'green', fr:0, v:'2026-11-05', sn:'Sep · $4/$15 &gt;272K' },
  gpt61terra:{ n:'GPT-6.1 Terra', p:'OpenAI',     i:1,   o:5,   aa:51, e:['none','low','med','high','xhigh','max'], b:'Budget OpenAI. AA 51 for ~$0.96/task. $2 input past 272K', t:'Budget', c:'green', fr:0, v:'2026-11-05', sn:'Oct · $2 input &gt;272K' },
  gpt6luna:  { n:'GPT-6 Luna',    p:'OpenAI',     i:0.1, o:0.5, aa:28, e:['none','low','med','high','xhigh','max'], b:'Cheapest OpenAI. Bulk, classify', t:'Cheapest', c:'orange', fr:0, v:'2026-11-05', sn:'Sep · $0.20/$0.75 &gt;272K' },
  gptSol:    { n:'GPT-5.6 Sol',   p:'OpenAI',     i:4,   o:20,  aa:null, e:['none','low','med','high','xhigh','max','ultra'], iAfter:5, oAfter:30, priceChangeDate:'2026-11-22', b:'Legacy. Promo $4/$20 thru Nov 21. Use GPT-6.1 Sol', bAfter:'Legacy. $5/$30 (promo ended Nov 21). Use GPT-6.1 Sol', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy · promo thru Nov 21 → $5/$30', snAfter:'legacy · promo ended Nov 21' },
  gptTerra:  { n:'GPT-5.6 Terra', p:'OpenAI',     i:2,   o:12,  aa:null, e:['none','low','med','high','xhigh','max'], b:'Legacy. GPT-6.1 Terra is cheaper', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  gptLuna:   { n:'GPT-5.6 Luna',  p:'OpenAI',     i:0.2, o:1.2, aa:null, e:['none','low','med','high','xhigh','max'], b:'Legacy. GPT-6 Luna is cheaper', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },

  // Google — cloud.google.com (Agent Platform pricing); Gemini 4 Carbon price via Artificial Analysis
  gemini4carbon:{ n:'Gemini 4 Carbon',p:'Google', i:4,   o:20,  aa:60, e:['low','med','high'], b:'AA #1 overall', t:'AA #1', c:'blue', fr:0, v:'2026-11-05', sn:'Oct' },
  gemini4argon:{ n:'Gemini 4 Argon',p:'Google',   i:2,   o:10,  aa:50, e:['high'], iAfter:4, oAfter:20, priceChangeDate:'2026-12-01', b:'Promo $2/$10 thru Nov 30, then $4/$20', bAfter:'Google flagship tier below Carbon', t:'Flagship', c:'cyan', fr:0, v:'2026-11-05', sn:'promo thru Nov 30 → $4/$20', snAfter:'standard since Dec 1' },
  gemini38f: { n:'Gemini 3.8 Flash',p:'Google',   i:0.75,o:3.75,aa:31, e:['low','med','high'], iAfter:1.5, oAfter:7.5, priceChangeDate:'2027-01-01', b:'Coding value: DeepSWE 73.8% (#2) at $2.36/task. Computer use, audio/video in', t:'Coding value', c:'cyan', fr:0, v:'2026-11-05', sn:'intro thru Dec 31 → $1.50/$7.50', snAfter:'standard since Jan 1' },
  gemini37f: { n:'Gemini 3.7 Flash',p:'Google',   i:0.75,o:3.75,aa:null, e:[], iAfter:1.5, oAfter:7.5, priceChangeDate:'2027-01-01', b:'Legacy. Use 3.8 Flash (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy · intro thru Dec 31', snAfter:'legacy' },
  gemini36f: { n:'Gemini 3.6 Flash',p:'Google',   i:0.75,o:3.75,aa:null, e:[], iAfter:1.5, oAfter:7.5, priceChangeDate:'2027-01-01', b:'Legacy. Use 3.8 Flash (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy · intro thru Dec 31', snAfter:'legacy' },
  gemini35f: { n:'Gemini 3.5 Flash',p:'Google',   i:1.5, o:9,   aa:null, e:[], b:'Legacy. Use 3.8 Flash', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  gemini31p: { n:'Gemini 3.1 Pro',  p:'Google',   i:2,   o:12,  aa:null, e:[], b:'Preview. Not on the current AA index', t:'Preview', c:'gray', fr:0, v:'2026-11-05', sn:'preview · $4/$18 &gt;200K' },

  // xAI — docs.x.ai; Cursor — cursor.com/docs/models
  grok47:    { n:'Grok 4.7',      p:'xAI',        i:2,   o:6,   aa:35, e:['low','med','high','xhigh'], b:'xAI flagship. 500K ctx. In Cursor plan pool', t:'xAI flagship', c:'orange', fr:0, v:'2026-11-05', sn:'Sep · $4/$12 &gt;200K' },
  grok46:    { n:'Grok 4.6',      p:'xAI',        i:2,   o:6,   aa:null, e:['low','med','high','xhigh'], b:'Legacy. Use Grok 4.7 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  grok45:    { n:'Grok 4.5',      p:'xAI',        i:2,   o:6,   aa:null, e:['low','med','high'], b:'Legacy. Use Grok 4.7 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  composer25:{ n:'Composer 2.5',  p:'Cursor',     i:0.5, o:2.5, aa:null, e:[], b:'Cheapest Cursor coding model. Cursor only (not on AA)', t:'Cursor $/task', c:'green', fr:0, cu:1, v:'2026-11-05', sn:'Cursor only' },

  // Other labs
  kimiK31pro:{ n:'Kimi K3.1 Pro', p:'Moonshot',   i:2,   o:10,  aa:46, e:[], b:'Strong non-US alternative. Proprietary', t:'Alt family', c:'purple', fr:0, v:'2026-11-05', sn:'Oct 23' },
  museWonder:{ n:'Muse Wonder',   p:'Meta',       i:4,   o:20,  aa:44, e:['low','med','high','max'], b:'Meta flagship (API). Full version AA 50, no public price', t:'Meta', c:'blue', fr:0, v:'2026-11-05', sn:'' },
  qwen38max: { n:'Qwen3.8 Max',   p:'Alibaba',    i:2,   o:6,   aa:34, e:['low','med','high','xhigh','max'], b:'Alibaba flagship. Pricey per task', t:'Alibaba', c:'cyan', fr:0, v:'2026-11-05', sn:'' },
  dsV41Flash:{ n:'DeepSeek V4.1 Flash',p:'DeepSeek',i:0.3,o:1.2, aa:33, e:['non-think','high','max'], b:'Open weights. Off-peak half price ($0.15/$0.60). Free on Zen (limited time)', t:'Open value', c:'green', fr:2, v:'2026-11-05', sn:'peak price · off-peak $0.15/$0.60' },
  dsV4Pro:   { n:'DeepSeek V4 Pro',p:'DeepSeek',  i:1.32,o:3.96,aa:23, e:['non-think','high','max'], b:'Open weights, MIT. Off-peak $0.66/$1.98. Flash scores higher', t:'MIT', c:'indigo', fr:0, v:'2026-11-05', sn:'peak price · off-peak $0.66/$1.98' },
  glm53:     { n:'GLM-5.3',       p:'Z.ai',       i:1.4, o:4.4, aa:32, e:['low','med','high','max'], b:'Top open-weight coder on DeepSWE (69%)', t:'Open coder', c:'indigo', fr:0, v:'2026-11-05', sn:'' },
  glm53f:    { n:'GLM-5.3-Flash', p:'Z.ai',       i:0.15,o:0.5, aa:28, e:[], b:'DeepSWE 63.4% at $0.24/task. MIT. Free on Zen (limited time)', t:'Budget open', c:'indigo', fr:2, v:'2026-11-05', sn:'' },
  glm52:     { n:'GLM-5.2',       p:'Z.ai',       i:1.4, o:4.4, aa:null, e:['low','med','high','max'], b:'Legacy. Use GLM-5.3 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  mimoV26pro:{ n:'MiMo V2.6 Pro', p:'Xiaomi',     i:0.435,o:0.87,aa:30, e:[], b:'Open weights. AA 30 for $0.26/task', t:'Open value', c:'cyan', fr:0, v:'2026-11-05', sn:'' },
  mimoV26f:  { n:'MiMo V2.6 Flash',p:'Xiaomi',    i:0.14,o:0.28,aa:27, e:[], b:'Open weights. Free on Zen (limited time; data may be used for training)', t:'Open budget', c:'cyan', fr:2, v:'2026-11-05', sn:'' },
  minimaxM31f:{ n:'MiniMax M3.1 Flash',p:'MiniMax',i:0.15,o:0.6, aa:29, e:[], b:'Open weights, 1M ctx', t:'Open', c:'purple', fr:0, v:'2026-11-05', sn:'' },
  mistralL4: { n:'Mistral Large 4',p:'Mistral',   i:0.7, o:2.1, aa:26, e:['med','high'], b:'Open weights (EU lab)', t:'EU open', c:'cyan', fr:0, v:'2026-11-05', sn:'' },
  mistralS4: { n:'Mistral Small 4',p:'Mistral',   i:0.15,o:0.6, aa:4,  e:[], b:'Small, Apache 2.0. Edge / simple tasks only', t:'Edge', c:'cyan', fr:0, v:'2026-11-05', sn:'' },
  qwen3827b: { n:'Qwen3.8 27B',   p:'Alibaba',    i:0.5, o:3,   aa:20, e:['low','med','xhigh'], b:'Open weights, 256K ctx. Best local-size model on AA', t:'Local', c:'cyan', fr:0, v:'2026-11-05', sn:'' },

  // Free on OpenCode Zen for a limited time (opencode.ai/docs/zen, Nov 5). fr:2 = free on Zen.
  nemotron35svl:{ n:'Nemotron 3.5 Super VL',p:'NVIDIA',i:0.2,o:0.5, aa:14, e:[], b:'Vision-language. Free on Zen (trial — no personal data)', t:'Free vision', c:'green', fr:2, v:'2026-11-05' },
  beam:      { n:'Beam 1.0',       p:'Reflection', i:0.4, o:1.2, aa:18, e:[], b:'Free on Zen. Not used for training; kept 30 days', t:'Free', c:'green', fr:2, v:'2026-11-05' },
  bigPickle: { n:'Big Pickle',     p:'OpenCode Zen',i:0, o:0,   aa:null, e:[], b:'Stealth model. Free on Zen; data may be used for training', t:'Smoke tests', c:'gray', fr:2, v:'2026-11-05' },
  // Self-host only
  northMini: { n:'North Mini Code',p:'Cohere',    i:0.2, o:0.8, aa:null, e:[], b:'Local coder. Fits RTX 4090. No longer on Zen', t:'Local', c:'purple', fr:0, v:'2026-08-29' },
  gemma431:  { n:'Gemma 4 31B',    p:'Google',    i:0.2, o:0.8, aa:null, e:[], b:'Apache 2.0, self-host friendly', t:'Apache 2.0', c:'cyan', fr:0, v:'2026-08-29' },
};
// After a scheduled price change, swap in the post-change description/note.
Object.values(M).forEach(x=>{ if(past(x.priceChangeDate)){ if(x.bAfter) x.b=x.bAfter; if(x.snAfter!==undefined) x.sn=x.snAfter; } });
// shortcut
const MArr = Object.keys(M).map(k=>({...M[k],k}));

// ─── Brand SVG Icons ───
const ICONS = {
  claude: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2l7 5v6l-7 5-7-5V7l7-5z"/></svg>',
  openai: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="3" r="1.8"/><circle cx="10" cy="17" r="1.8"/><circle cx="3" cy="10" r="1.8"/><circle cx="17" cy="10" r="1.8"/><circle cx="5" cy="5" r="1.8"/><circle cx="15" cy="15" r="1.8"/><circle cx="5" cy="15" r="1.8"/><circle cx="15" cy="5" r="1.8"/></svg>',
  gemini: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l2.5 5.5L18 10l-5.5 2.5L10 18l-2.5-5.5L2 10l5.5-2.5L10 2z"/></svg>',
  grok: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 4l12 12M16 4l-12 12"/></svg>',
  cursor: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3l13 8-4.5 1.5L11 17 4 3z"/></svg>',
  deepseek: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 4c-3 0-5 2-5 5v3c0 3 2 5 5 5s5-2 5-5v-1"/><path d="M5 13c-2 1-3 2.5-3 4"/><path d="M15 13c2 1 3 2.5 3 4"/></svg>',
  opensource: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="M10 4c0 0-1.5 6-1.5 7.5S9.5 17 10 17s1.5-3 1.5-4.5S10 4 10 4z"/></svg>',
};
// ponytail: injects size+shrink-0 into SVG tag for inline use. Two rungs: stdlib? No. One-liner? Yes.
function iconSvg(name, sz = 'w-4 h-4') {
  const s = ICONS[name];
  return s ? s.replace('<svg', `<svg class="${sz} shrink-0"`) : '';
}

// Price in effect today: switches to iAfter/oAfter on priceChangeDate (promo ends, intro pricing ends).
function effPrice(mk){
  const x=M[mk]; if(!x) return {i:0,o:0};
  const changed = x.priceChangeDate && new Date() >= new Date(x.priceChangeDate);
  return changed ? {i:x.iAfter??x.i, o:x.oAfter??x.o} : {i:x.i, o:x.o};
}
function cost(mk,inT,outT){ const p=effPrice(mk); return (inT/1e6)*p.i+(outT/1e6)*p.o; }
function past(d){ return !!d && new Date() >= new Date(d+'T00:00:00'); }
function fmtDate(d){ return new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
function tagH(c,t){ const map={green:'bg-green-50 text-green-800',blue:'bg-blue-50 text-blue-800',orange:'bg-orange-50 text-orange-800',purple:'bg-purple-50 text-purple-800',cyan:'bg-cyan-50 text-cyan-800',indigo:'bg-indigo-50 text-indigo-800',gray:'bg-gray-100 text-gray-700',red:'bg-red-50 text-red-800'}; return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold ${map[c]||map.blue}">${t}</span>`; }
function freeBadge(s){ return s===2?` <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-100 text-green-800">Free on Zen</span>`:s===1?` <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-100 text-green-800">Free</span>`:''; }
function priceHtml(mk){
  const x=M[mk]; if(!x) return {i:'',o:''};
  const changed = x.priceChangeDate && new Date() >= new Date(x.priceChangeDate);
  const i = x.iAfter!=null ? (changed?`$${x.iAfter}`:`$${x.i}→${x.iAfter}`) : (x.i?`$${x.i}`:'Free');
  const o = x.oAfter!=null ? (changed?`$${x.oAfter}`:`$${x.o}→${x.oAfter}`) : (x.o?`$${x.o}`:'Free');
  return {i,o};
}
// score bar gradient by color key, reused from M[].c
const barGrad = {purple:'linear-gradient(90deg,#7c3aed,#2962ff)',blue:'linear-gradient(90deg,#4f46e5,#2962ff)',green:'#a5b4fc',orange:'#818cf8',cyan:'#a5b4fc',indigo:'#a5b4fc',gray:'#818cf8'};

// ─── Task Groups (with 3 alternatives each) ───
// Costs: Artificial Analysis cost per task at that effort (Nov 5 2026), unless marked (DeepSWE) = Datacurve DeepSWE avg cost/task.
const TG = [
{name:'🛠️ Software Engineering',co:'border-l-[#2962ff]',hc:'text-[#2962ff]',hb:'bg-[#e8edff]',tasks:[
  {t:'Write routine code',pr:{m:'gpt61sol',e:'high',c:'~$0.59'},alts:[{m:'dsV41Flash',e:'high',r:1,l:'Open weights',c:'~$0.46'},{m:'sonnet55',e:'medium',r:2,l:'Claude alt',c:'~$0.78'},{m:'gemini38f',e:'high',r:3,l:'Strong coder',c:'~$2.36 (DeepSWE)'}]},
  {t:'Write critical code',pr:{m:'opus55',e:'xhigh',c:'~$6.05'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Near tier, 5× cheaper',c:'~$1.27'},{m:'gpt6astra',e:'xhigh',r:2,l:'DeepSWE #1',c:'~$3.66'},{m:'gemini4carbon',e:'high',r:3,l:'AA #1',c:'~$7.76'}]},
  {t:'Pipeline-critical multi-file',pr:{m:'gpt6astra',e:'xhigh',c:'~$4.43 (DeepSWE)'},alts:[{m:'gemini38f',e:'high',r:1,l:'DeepSWE #2, cheaper',c:'~$2.36 (DeepSWE)'},{m:'gpt61sol',e:'max',r:2,l:'Budget',c:'~$1.27'},{m:'opus55',e:'xhigh',r:3,l:'Claude alt',c:'~$6.05'}]},
  {t:'Debug a hard bug',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'dsV41Flash',e:'max',r:1,l:'Open budget',c:'~$0.60'},{m:'gpt61sol',e:'max',r:2,l:'Value',c:'~$1.27'},{m:'gpt6astra',e:'high',r:3,l:'Strong alt',c:'~$3.24'}]},
  {t:'Review / validate code',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'dsV41Flash',e:'max',r:1,l:'Open budget',c:'~$0.60'},{m:'gpt61sol',e:'xhigh',r:2,l:'Second opinion',c:'~$0.76'},{m:'kimiK31pro',e:'',r:3,l:'Different family',c:'~$3.68'}]},
  {t:'Multi-step agent workflow',pr:{m:'gpt61sol',e:'max',c:'~$1.27'},alts:[{m:'gpt61terra',e:'max',r:1,l:'Budget',c:'~$0.96'},{m:'opus55',e:'high',r:2,l:'Claude alt',c:'~$3.46'},{m:'gpt6astra',e:'xhigh',r:3,l:'Stronger',c:'~$3.66'}]},
  {t:'Coding in Cursor (daily)',pr:{m:'composer25',e:'',c:'~$0.44'},alts:[{m:'sonnet55',e:'medium',r:1,l:'Third-party (Premium+)',c:'~$0.78'},{m:'grok47',e:'low',r:2,l:'In plan pool',c:'~$2.92'},{m:'opus55',e:'high',r:3,l:'Best via Cursor',c:'~$3.46'}]},
]},
{name:'✍️ Content & Writing',co:'border-l-[#6366f1]',hc:'text-[#4338ca]',hb:'bg-[#e0e7ff]',tasks:[
  {t:'Write analysis / memo',pr:{m:'sonnet55',e:'high',c:'~$1.64'},alts:[{m:'haiku55',e:'high',r:1,l:'Budget',c:'~$0.16'},{m:'gpt61sol',e:'high',r:2,l:'Cheaper',c:'~$0.59'},{m:'opus55',e:'high',r:3,l:'Premium',c:'~$3.46'}]},
  {t:'Translation (bulk)',pr:{m:'haiku55',e:'medium',c:'~$0.09'},alts:[{m:'gpt6luna',e:'medium',r:1,l:'Cheapest',c:'~$0.04'},{m:'mimoV26f',e:'',r:2,l:'Open weights',c:'~$0.13'},{m:'sonnet55',e:'low',r:3,l:'Higher quality',c:'~$0.51'}]},
  {t:'Classify / extract / format',pr:{m:'haiku55',e:'low',c:'~$0.04'},alts:[{m:'gpt6luna',e:'low',r:1,l:'Cheapest',c:'~$0.01'},{m:'gpt61terra',e:'low',r:2,l:'Smarter',c:'~$0.07'},{m:'mimoV26f',e:'',r:3,l:'Open weights',c:'~$0.13'}]},
  {t:'Marketing / creative copy',pr:{m:'sonnet55',e:'high',c:'~$1.64'},alts:[{m:'haiku55',e:'high',r:1,l:'Budget',c:'~$0.16'},{m:'gpt61sol',e:'high',r:2,l:'Alt voice',c:'~$0.59'},{m:'opus55',e:'high',r:3,l:'Premium',c:'~$3.46'}]},
]},
{name:'📊 Data & Research',co:'border-l-[#0d9488]',hc:'text-[#0a6e65]',hb:'bg-[#d5f5f0]',tasks:[
  {t:'Analyze data / statistics',pr:{m:'gpt61sol',e:'max',c:'~$1.27'},alts:[{m:'dsV41Flash',e:'max',r:1,l:'Open budget',c:'~$0.60'},{m:'sonnet55',e:'high',r:2,l:'Claude alt',c:'~$1.64'},{m:'opus55',e:'high',r:3,l:'Premium',c:'~$3.46'}]},
  {t:'Research / lit review',pr:{m:'opus55',e:'xhigh',c:'~$6.05'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Budget',c:'~$1.27'},{m:'kimiK31pro',e:'',r:2,l:'Alt family',c:'~$3.68'},{m:'gemini4carbon',e:'high',r:3,l:'AA #1',c:'~$7.76'}]},
  {t:'Low-cost bulk processing',pr:{m:'gpt6luna',e:'medium',c:'~$0.04'},alts:[{m:'haiku55',e:'low',r:1,l:'Claude budget',c:'~$0.04'},{m:'mimoV26f',e:'',r:2,l:'Open weights',c:'~$0.13'},{m:'glm53f',e:'',r:3,l:'Free on Zen',c:'~$0'}]},
  {t:'Database query generation',pr:{m:'gpt61terra',e:'high',c:'~$0.26'},alts:[{m:'dsV41Flash',e:'high',r:1,l:'Open weights',c:'~$0.46'},{m:'glm53f',e:'',r:2,l:'Open budget',c:'~$0.58'},{m:'sonnet55',e:'medium',r:3,l:'Claude alt',c:'~$0.78'}]},
]},
{name:'🧠 Reasoning & Analysis',co:'border-l-[#d97706]',hc:'text-[#7a4a02]',hb:'bg-[#fef3cd]',tasks:[
  {t:'Math proof / hard reasoning',pr:{m:'gemini4carbon',e:'high',c:'~$7.76'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Budget',c:'~$1.27'},{m:'gpt6astra',e:'max',r:2,l:'Strong alt',c:'~$6.24'},{m:'opus55',e:'max',r:3,l:'Claude alt',c:'~$10.04'}]},
  {t:'Agent orchestration prompts',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Value',c:'~$1.27'},{m:'sonnet55',e:'high',r:2,l:'Budget Claude',c:'~$1.64'},{m:'kimiK31pro',e:'',r:3,l:'Alt family',c:'~$3.68'}]},
  {t:'Logic / puzzle solving',pr:{m:'gpt61sol',e:'max',c:'~$1.27'},alts:[{m:'dsV41Flash',e:'max',r:1,l:'Open budget',c:'~$0.60'},{m:'gpt6astra',e:'high',r:2,l:'Stronger',c:'~$3.24'},{m:'opus55',e:'xhigh',r:3,l:'Claude alt',c:'~$6.05'}]},
]},
{name:'🛡️ Security',co:'border-l-[#dc2626]',hc:'text-[#991b1b]',hb:'bg-[#fee2e2]',tasks:[
  {t:'Security code audit',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Value',c:'~$1.27'},{m:'gpt6astra',e:'xhigh',r:2,l:'DeepSWE #1',c:'~$3.66'},{m:'fable51',e:'xhigh',r:3,l:'Long runs',c:'~$10.85'}]},
  {t:'Vulnerability research / CVE',pr:{m:'gpt6astra',e:'max',c:'~$6.24'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Budget',c:'~$1.27'},{m:'kimiK31pro',e:'',r:2,l:'Alt family',c:'~$3.68'},{m:'opus55',e:'xhigh',r:3,l:'Claude alt',c:'~$6.05'}]},
  {t:'Secure code generation',pr:{m:'sonnet55',e:'high',c:'~$1.64'},alts:[{m:'dsV41Flash',e:'high',r:1,l:'Open weights',c:'~$0.46'},{m:'gpt61sol',e:'high',r:2,l:'Cheaper',c:'~$0.59'},{m:'opus55',e:'high',r:3,l:'Premium',c:'~$3.46'}]},
  {t:'Incident response / forensics',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Value',c:'~$1.27'},{m:'gpt6astra',e:'high',r:2,l:'Strong alt',c:'~$3.24'},{m:'gemini4carbon',e:'medium',r:3,l:'AA #1',c:'~$6.59'}]},
]},
{name:'👁️ Multimodal & Vision',co:'border-l-[#0891b2]',hc:'text-[#155e75]',hb:'bg-[#d5f6fc]',tasks:[
  {t:'Vision / chart reading',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'mimoV26pro',e:'',r:1,l:'Open budget',c:'~$0.26'},{m:'gpt61sol',e:'high',r:2,l:'Cheaper',c:'~$0.59'},{m:'gemini4carbon',e:'medium',r:3,l:'Top Google',c:'~$6.59'}]},
  {t:'Document OCR + analysis',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'haiku55',e:'high',r:1,l:'Budget',c:'~$0.16'},{m:'mimoV26pro',e:'',r:2,l:'Open budget',c:'~$0.26'},{m:'gpt61sol',e:'high',r:3,l:'Cheaper',c:'~$0.59'}]},
  {t:'Screenshot → code',pr:{m:'opus55',e:'high',c:'~$3.46'},alts:[{m:'gpt61sol',e:'max',r:1,l:'Value',c:'~$1.27'},{m:'gemini38f',e:'high',r:2,l:'Strong coder',c:'~$2.36 (DeepSWE)'},{m:'gpt6astra',e:'high',r:3,l:'Strong alt',c:'~$3.24'}]},
  {t:'Computer use / GUI',pr:{m:'gemini38f',e:'medium',c:'~$6.26'},alts:[{m:'gpt61sol',e:'high',r:1,l:'Cheaper',c:'~$0.59'},{m:'opus55',e:'high',r:2,l:'Better',c:'~$3.46'}]},
  {t:'Multimodal (img+audio+video)',pr:{m:'gemini38f',e:'medium',c:'~$6.26'},alts:[{m:'nemotron35svl',e:'',r:1,l:'Free vision (Zen)',c:'~$0'},{m:'gemini4carbon',e:'medium',r:2,l:'Top Google',c:'~$6.59'},{m:'opus55',e:'high',r:3,l:'Best img+txt',c:'~$3.46'}]},
]},
{name:'🔒 Local / Private',co:'border-l-[#7c3aed]',hc:'text-[#5b21b6]',hb:'bg-[#ede9fe]',tasks:[
  {t:'Local code agent (no cloud)',pr:{m:'qwen3827b',e:'xhigh',c:'~$0 (self-host)'},alts:[{m:'northMini',e:'',r:1,l:'Smaller GPU',c:'~$0 (self-host)'},{m:'gemma431',e:'',r:2,l:'Open alt',c:'~$0 (self-host)'},{m:'glm53f',e:'',r:3,l:'Bigger open model',c:'~$0 (self-host)'}]},
  {t:'On-device / edge inference',pr:{m:'gemma431',e:'',c:'~$0 (self-host)'},alts:[{m:'mistralS4',e:'',r:1,l:'Efficient',c:'~$0 (self-host)'},{m:'northMini',e:'',r:2,l:'Small GPU',c:'~$0 (self-host)'},{m:'qwen3827b',e:'medium',r:3,l:'Stronger',c:'~$0 (self-host)'}]},
]},
];

// Flatten for finder
const AFT = [];
TG.forEach(g=>{g.tasks.forEach(t=>{AFT.push({id:t.t.replace(/[^a-z0-9]/gi,'_'),label:t.t,group:g.name,pr:t.pr,alts:t.alts});});});

// ─── Sidebar Mobile Drawer & Tab switching ───
const sidebarPanel = document.getElementById('sidebar-panel');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');

function openSidebar(){
  if(sidebarPanel) sidebarPanel.classList.remove('-translate-x-full');
  if(sidebarBackdrop) sidebarBackdrop.classList.remove('hidden');
}

function closeSidebar(){
  if(sidebarPanel) sidebarPanel.classList.add('-translate-x-full');
  if(sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
}

if(sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
if(sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
if(sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

const tabBtns = document.querySelectorAll('.tab-btn');
function switchTab(el){
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(el.dataset.tab);
  if(target) target.classList.add('active');
  try{ localStorage.setItem('mg-active-tab', el.dataset.tab); }catch(e){}
  closeSidebar();
}
tabBtns.forEach(b=>{ b.addEventListener('click', ()=>switchTab(b)); });

// Keyboard shortcuts: Ctrl+1..0 (or Cmd+1..0)
document.addEventListener('keydown',e=>{
  // Ignore if typing in an input
  if(e.target.matches('input,textarea,select,button')) return;
  const n = parseInt(e.key);
  if(n>=1 && n<=9 && tabBtns[n-1]){ switchTab(tabBtns[n-1]); e.preventDefault(); }
  if(e.key==='0' && tabBtns[9]){ switchTab(tabBtns[9]); e.preventDefault(); }
});

// ─── Render Dashboard ───
// Explicit ordering for the main table (not pure AA sort — groups paid frontier/value tiers together).
const DASH_ORDER = ['gemini4carbon','opus55','gpt6astra','gpt61sol','sonnet55','gpt61terra','gemini4argon','fable51','kimiK31pro','museWonder','haiku55','grok47','qwen38max','dsV41Flash','glm53','gemini38f','mimoV26pro','gpt6luna','composer25','gptSol','opus5'];
const DASH_FREE_ORDER = ['glm53f','mimoV26f','beam','nemotron35svl','bigPickle'];
function renderDash(){
  const maxAa = Math.max(...MArr.filter(m=>m.aa!=null).map(m=>m.aa));
  function dashRow(mk,free){
    const m = M[mk]; if(!m) return '';
    const pr = priceHtml(mk);
    const scorePct = m.aa==null ? 0 : Math.round(m.aa/maxAa*100);
    const grad = free ? '#6ee7b7' : (barGrad[m.c]||'#a5b4fc');
    const bestFor = (m.t?tagH(m.c,m.t)+' ':'')+m.b;
    const rowCls = free ? 'bg-[#f0fdf4] hover:bg-[#e8f8f2] transition-colors' : 'hover:bg-[#f8f9fc] transition-colors';
    const nameCls = free ? 'p-2.5 sm:p-3 font-semibold border-l-3 border-[#0d9488] pl-3' : 'p-2.5 sm:p-3 font-semibold';
    return `<tr class="${rowCls}"><td class="${nameCls}">${m.n}</td><td class="p-2.5 sm:p-3 text-[#5a5f73]">${m.p}</td><td class="p-2.5 sm:p-3 font-mono">${pr.i}</td><td class="p-2.5 sm:p-3 font-mono">${pr.o}</td><td class="p-2.5 sm:p-3 font-semibold">${m.aa==null?'<span class="text-[#9aa0b0]" title="Not on the current AA index (legacy or not scored)">—</span>':m.aa}</td><td class="hidden md:table-cell p-2.5 sm:p-3"><div class="flex items-center gap-1.5"><div class="flex-1 h-1.5 bg-[#eceef4] rounded-full overflow-hidden"><div class="score-bar h-full rounded-full" style="width:${scorePct}%;background:${grad}"></div></div></div></td><td class="p-2.5 sm:p-3 text-[#5a5f73] text-xs">${bestFor}</td><td class="hidden lg:table-cell p-2.5 sm:p-3 text-[#6b7085] text-xs whitespace-nowrap">${m.v?fmtDate(m.v):'—'}</td></tr>`;
  }

  let html = '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="flex items-center gap-2 px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📊 All Models</h2><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">AA Intelligence Index (current)</span><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">Free highlighted</span></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[620px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Provider</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">In $/MTok</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Out $/MTok</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">AA</th><th class="hidden md:table-cell p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Score</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Best For</th><th class="hidden lg:table-cell p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Checked</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  DASH_ORDER.forEach(mk=>{html+=dashRow(mk,false);});
  DASH_FREE_ORDER.forEach(mk=>{html+=dashRow(mk,true);});
  html += '</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">* Green rows = free on OpenCode Zen for a limited time (checked Nov 5); paid price shown is the vendor API. Prices in $/MTok. AA = Artificial Analysis Intelligence Index, best effort setting. <code>$a→b</code> = scheduled price change. AA “—” = legacy or not on the current index (not ranked).</div></div>';

  // Pricing & CursorBench side-by-side
  html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">';
  html += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">💰 Pricing Tiers <span class="text-xs font-normal text-[#6b7085]">($/MTok in / out)</span></h2></div><div class="p-4 space-y-2">';
  const tiers=[['Free','$0 / $0','5%','bg-[#6ee7b7]','Zen free · self-host'],['Budget','$0.10–1 / $0.28–5','15%','bg-[#6366f1]','Haiku 5.5 · GPT-6 Luna · Terra · DS Flash'],['Mid','$2 / $6–10','35%','bg-[#d97706]','GPT-6.1 Sol · Sonnet 5.5 · Grok 4.7'],['Premium','$4 / $20','65%','bg-[#dc2626]','Opus 5.5 · Gemini 4 Carbon'],['Ceiling','$10 / $50','100%','bg-gradient-to-r from-red-500 to-purple-600','GPT-6 Astra · Fable 5.1']];
  tiers.forEach(t=>{html+=`<div class="flex items-center gap-3 text-sm"><span class="w-16 font-semibold text-[0.6875rem] uppercase tracking-wider text-[#5a5f73]">${t[0]}</span><div class="flex-1 h-2 bg-[#eceef4] rounded-full overflow-hidden"><div class="h-full rounded-full ${t[3]}" style="width:${t[2]}"></div></div><span class="text-xs text-[#6b7085] font-mono w-28">${t[1]}</span><span class="text-xs text-[#2962ff] font-medium w-36 text-right">${t[4]}</span></div>`;});
  html += '</div></div>';

  // Best cost per task — Artificial Analysis cost per task (their full index workload), Nov 5 2026
  const cb=[['GPT-6.1 Sol @ max ★',55,1.27],['GPT-6.1 Sol @ high',50,0.59],['GPT-6.1 Terra @ max',51,0.96],['GPT-6 Astra @ high',55,3.24],['Opus 5.5 @ high',52,3.46],['Opus 5.5 @ max',59,10.04],['Gemini 4 Carbon @ high',60,7.76],['DeepSeek V4.1 Flash @ max',33,0.60],['MiMo V2.6 Pro',30,0.26],['Haiku 5.5 @ high',30,0.16],['GPT-6 Luna @ max',28,0.15]];
  html += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">⚡ Best Cost/Task</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[400px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model @ effort</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">AA</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost/task</th><th class="hidden sm:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">$/pt</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  cb.forEach((r,i)=>{const hl=i===0?' bg-[#e8edff]':'';html+=`<tr class="hover:bg-[#f8f9fc]${hl}"><td class="p-2.5 font-medium${hl?' text-[#2962ff]':''}">${r[0]}</td><td class="p-2.5${hl?' text-[#2962ff] font-semibold':''}">${r[1]}</td><td class="p-2.5">$${r[2].toFixed(2)}</td><td class="hidden sm:table-cell p-2.5 text-[#6b7085]">$${(r[2]/r[1]).toFixed(3)}</td></tr>`;});
  html += '</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">Source: Artificial Analysis cost per task to run their full Intelligence Index (Nov 5, 2026). Composer 2.5 is not on AA (~$0.44/task on CursorBench, Aug).</div></div></div>';

  document.getElementById('dashboard-table').innerHTML = html;

  // Stat tile: #1 overall = highest AA among current (non-legacy, AA-scored) models
  const top = MArr.filter(m=>m.aa!=null && !m.aaT && !['Legacy','Superseded'].includes(m.t)).sort((a,b)=>b.aa-a.aa)[0];
  const tile = document.getElementById('tile-top');
  if(tile && top) tile.textContent = `${top.n} · AA ${top.aa}`;
}
renderDash();
// Static HTML with data-after="YYYY-MM-DD": swap to data-after-html once that date has passed.
// Repeat so a swapped-in snippet can carry its own later data-after step.
for(let i=0;i<3;i++) document.querySelectorAll('[data-after]').forEach(el=>{ if(past(el.dataset.after)){ el.removeAttribute('data-after'); el.innerHTML = el.dataset.afterHtml; } });

// ─── Render By Task ───
function renderByTask(){
  let h = '<div class="px-4 sm:px-5 py-2.5 text-xs text-[#6b7085] bg-[#f8f9fc] border border-[#e2e5ec] rounded-t-xl -mb-1">Costs = <strong>estimated $ per task</strong> at the listed effort, using current prices (Nov 5, 2026). "~" = rough estimate.</div>';
  TG.forEach(g=>{
    h += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm overflow-hidden ${g.co}" style="border-left-width:4px">`;
    h += `<div class="${g.hb} ${g.hc} px-4 sm:px-5 py-3 font-semibold text-sm sm:text-base flex items-center gap-2 border-b border-[#eceef4]"><span>${g.name}</span><span class="ml-auto text-xs font-medium opacity-60">${g.tasks.length} tasks</span></div>`;
    g.tasks.forEach(t=>{
      const pm = M[t.pr.m];
      h += `<div class="task-card px-4 sm:px-5 py-3 border-b border-[#eceef4] last:border-b-0 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">`;
      h += `<div><div class="font-medium text-sm">${t.t}</div>`;
      // Primary
      h += `<div class="flex items-center gap-2 mt-1.5 flex-wrap"><span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2962ff] text-white text-[0.6875rem] font-bold shrink-0">1</span><span class="text-sm font-semibold text-[#2962ff]">${pm.n}</span>`;
      if(t.pr.e) h += `<span class="text-xs font-mono text-[#6b7085] bg-[#f2f4f8] px-1.5 py-0.5 rounded">${t.pr.e}</span>`;
      h += `<span class="text-xs font-mono text-[#5a5f73]">${t.pr.c}</span>${freeBadge(pm.fr)}</div>`;
      // Alts
      h += `<div class="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">`;
      t.alts.sort((a,b)=>a.r-b.r).forEach(a=>{
        const am=M[a.m]; if(!am) return;
        const cc=a.r===1?'text-[#0d9488]':a.r===2?'text-[#6366f1]':'text-[#6b7085]';
        h += `<span class="text-xs"><span class="${cc} font-semibold">#${a.r}</span> ${am.n}`;
        if(a.e) h+=` <span class="text-[#6b7085]">@ ${a.e}</span>`;
        h += ` ${a.c} <span class="text-[#6b7085]">${a.l}</span>${freeBadge(am.fr)}</span>`;
      });
      h += `</div></div><div class="flex items-center gap-1.5 sm:text-right text-xs text-[#6b7085]">`;
      if(pm.fr) h += `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-100 text-green-800">${pm.fr===2?'Free on Zen':'Free'}</span>`;
      h += `</div></div>`;
    });
    h += `</div>`;
  });
  document.getElementById('bytask-content').innerHTML = h;
}
renderByTask();

// ─── Render Provider Tabs ───
function renderProviders(){
  const NEW='<span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span>';
  const card=(title,line1,body,code,warn)=>`<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">${title}</div><div class="text-xs text-[#5a5f73] mt-1">${line1}</div>${body?`<div class="text-xs text-[#5a5f73] mt-2">${body}</div>`:''}${code?`<div class="mt-2 text-xs bg-white border-l-3 border-[${warn?'#dc2626':'#2962ff'}] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">${code}</code></div>`:''}</div>`;
  const head=(icon,title,badges,note)=>`<div class="px-5 py-3.5 border-b border-[#eceef4] flex flex-wrap items-center gap-2">${iconSvg(icon,'w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">${title}</h2>${badges.map(b=>`<span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase ${b[1]}">${b[0]}</span>`).join('')}</div><div class="px-5 pt-2 text-[0.6875rem] text-[#6b7085]">${note}</div>`;
  const AA_NOTE='AA = Artificial Analysis Intelligence Index (current version, best effort setting). $/task = AA cost to run their full index at that effort.';

  // Claude
  document.getElementById('tab-claude-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
${head('claude','Claude Lineup',[['Paid','bg-indigo-50 text-indigo-800']],'Rates = <strong>$ per 1M tokens</strong> (input / output). Verified on platform.claude.com, Nov 5, 2026. Batch API = 50% off.')}
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
${card(`Opus 5.5 ${tagH('purple','AA #2')} ${NEW}`,'<strong class="text-green-700">$4/$20</strong> (−20% vs Opus 5) · AA 59 @ max · 1M ctx · 128K out · Sep 22','<strong>Effort → AA / $ per task:</strong> medium 48 / $2.45 · <strong class="text-[#2962ff]">high 52 / $3.46</strong> · xhigh 57 / $6.05 · max 59 / $10.04. Fast mode $8/$40.','Debug race condition, validate PR — Opus 5.5 @ high–xhigh')}
${card(`Sonnet 5.5 ${tagH('green','Best daily')} ${NEW}`,'<strong class="text-green-700">$2/$10</strong> · AA 55 @ max · 1M ctx · 128K out · ~Sep 28','<strong>Effort → AA / $ per task:</strong> medium 31 / $0.78 · <strong class="text-[#2962ff]">high 42 / $1.64</strong> · xhigh 50 / $4.09 · <span class="text-red-600">max 55 / $10.02 — costs as much as Opus 5.5 @ max</span>','Docs, marketing copy, CRUD — Sonnet 5.5 @ medium–high')}
${card(`Haiku 5.5 ${tagH('orange','Budget')} ${NEW}`,'<strong class="text-green-700">$0.10/$0.50</strong> up to 100K prompt · $0.50/$2.50 above · AA 36 @ max · ~Oct 7','<strong>Effort → AA / $ per task:</strong> low 19 / $0.04 · medium 25 / $0.09 · high 30 / $0.16 · max 36 / $0.41. Keep prompts under 100K.','Classify, extract, route, translate — Haiku 5.5 @ low–medium')}
${card(`Fable 5.1 ${tagH('purple','Premium')}`,'$10/$50 · AA 50 @ xhigh · 1M ctx · 128K out · Sep 1','<span class="text-red-600">Scores below Opus 5.5 and Sonnet 5.5 on AA</span> at 2–5× the price. Only for long autonomous runs where you have seen it do better.','Multi-day autonomous work — test against Opus 5.5 first')}
${card(`Opus 5 / Sonnet 5 / Fable 5 ${tagH('gray','Legacy')}`,'Still on the API. Opus 5 $5/$25 · Sonnet 5 $2/$10 · Fable 5 $10/$50.','No reason to stay: the 5.5 / 5.1 versions cost the same or less.','Migrate to claude-opus-5-5 / claude-sonnet-5-5 / claude-fable-5-1',1)}
${card(`Opus 4.8 ${tagH('gray','Legacy')}`,'$5/$25 · still available.','Two generations behind. Fallback only.','Fallback only — migrate now',1)}
</div><div class="px-5 pb-3 text-[0.6875rem] text-[#6b7085]">${AA_NOTE}</div></div>`;

  // OpenAI
  document.getElementById('tab-openai-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
${head('openai','GPT-6 Family',[['Paid','bg-indigo-50 text-indigo-800'],['Sep–Oct 2026','bg-pink-50 text-pink-800']],'Rates = <strong>$ per 1M tokens</strong>. GPT-6 prices from Artificial Analysis, matched by the LiteLLM price database and OpenCode list prices (openai.com sits behind a bot check). GPT-5.6 prices confirmed on cursor.com.')}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
${card(`GPT-6.1 Sol ${tagH('green','Best value')} ${NEW}`,'<strong class="text-green-700">$2/$10</strong> · AA 55 @ max · 1M ctx','<strong>Effort → AA / $ per task:</strong> low 35 / $0.16 · medium 46 / $0.36 · high 50 / $0.59 · xhigh 52 / $0.76 · <strong class="text-[#2962ff]">max 55 / $1.27</strong>. Same AA as Sonnet 5.5 @ max for 1/8 the cost.','Default for agents, data work, logic — GPT-6.1 Sol @ max')}
${card(`GPT-6 Astra ${tagH('blue','DeepSWE #1')} ${NEW}`,'$10/$50 · AA 57 @ max · 1M ctx · knowledge Apr 2026','DeepSWE 74.1% @ xhigh for $4.43/task — #1 on the board. <strong>Effort → AA / $:</strong> high 55 / $3.24 · xhigh 55 / $3.66 · max 57 / $6.24.','Hard multi-file coding — GPT-6 Astra @ xhigh')}
${card(`GPT-6.1 Terra ${tagH('green','Budget')} ${NEW}`,'<strong class="text-green-700">$1/$5</strong> · AA 51 @ max · 1M ctx','<strong>Effort → AA / $:</strong> low 29 / $0.07 · high 42 / $0.26 · xhigh 45 / $0.40 · max 51 / $0.96.','SQL, routine tasks — GPT-6.1 Terra @ high')}
${card(`GPT-6 Luna ${tagH('orange','Cheapest')} ${NEW}`,'<strong class="text-green-700">$0.10/$0.50</strong> · AA 28 @ max · 1M ctx','<strong>Effort → AA / $:</strong> low 10 / $0.01 · medium 18 / $0.04 · max 28 / $0.15.','Bulk classify / extract — GPT-6 Luna @ low–medium')}
</div>
<div class="px-4 pb-4">${card(`GPT-5.6 Sol / Terra / Luna ${tagH('gray','Legacy')}`,`Sol ${past('2026-11-22') ? '$5/$30 (promo ended Nov 21)' : '$4/$20 promo thru Nov 21 → $5/$30'} · Terra $2/$12 · Luna $0.20/$1.20. Not on the current AA index.`,'GPT-6.1 Sol / Terra and GPT-6 Luna cost less and score higher.','Migrate off gpt-5.6-* model IDs',1)}</div>
<div class="px-5 pb-3 text-[0.6875rem] text-[#6b7085]">${AA_NOTE}</div></div>`;

  // Gemini
  document.getElementById('tab-gemini-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
${head('gemini','Gemini Lineup',[['Paid','bg-indigo-50 text-indigo-800'],['4 Carbon · 4 Argon · 3.8 Flash','bg-green-50 text-green-800']],'Rates = <strong>$ per 1M tokens</strong>. Argon and Flash prices verified on cloud.google.com, Nov 5, 2026. Carbon price from Artificial Analysis (not on the Google Cloud page).')}
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
${card(`4 Carbon ${tagH('blue','AA #1')} ${NEW}`,'$4/$20 · AA 60 @ high · 1M ctx · Oct','Highest score on the AA index. <strong>Effort → AA / $:</strong> low 54 / $7.19 · medium 58 / $6.59 · high 60 / $7.76. Expensive per task.','Hardest reasoning / math — Gemini 4 Carbon @ high')}
${card(`4 Argon ${tagH('cyan','Flagship')} ${NEW}`,`${past('2026-12-01') ? '$4/$20' : '<strong class="text-green-700">$2/$10</strong> promo thru Nov 30 → $4/$20'} · AA 50 @ high · 1M ctx · ~Oct 13`,'Carbon scores higher at the same standard price. Failed completions over 32K tokens are billed (from Nov 13).','Use Carbon unless Argon is cheaper for you during the promo')}
${card(`3.8 Flash ${tagH('cyan','Coding value')} ${NEW}`,`${past('2027-01-01') ? '$1.50/$7.50' : '<strong class="text-green-700">$0.75/$3.75</strong> intro thru Dec 31 → $1.50/$7.50'} · AA 31 @ high · ~Sep 2`,'Low AA score but <strong>DeepSWE 73.8% (#2) at $2.36/task</strong>. Text, image, video and audio input; built-in computer use.','Coding agents, computer use — Gemini 3.8 Flash @ high')}
${card(`3.7 / 3.6 / 3.5 Flash · 3.1 Pro ${tagH('gray','Legacy')}`,`3.7 / 3.6 Flash: ${past('2027-01-01') ? '$1.50/$7.50' : '$0.75/$3.75 intro thru Dec 31'} · 3.5 Flash $1.50/$9 · 3.1 Pro (preview) $2/$12.`,'Not on the current AA index. 3.8 Flash costs the same and is better.','Migrate to gemini-3.8-flash',1)}
</div><div class="px-5 pb-3 text-[0.6875rem] text-[#6b7085]">${AA_NOTE}</div></div>`;

  // Grok
  document.getElementById('tab-grok-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
${head('grok','Grok 4.7',[['Paid','bg-indigo-50 text-indigo-800'],['Sep 2026','bg-pink-50 text-pink-800']],'Rates = <strong>$ per 1M tokens</strong>. Verified on docs.x.ai (last updated Sep 21) and cursor.com, Nov 5, 2026.')}
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
${card(`Grok 4.7 ${tagH('orange','xAI flagship')} ${NEW}`,'$2/$6 · 500K ctx · AA 35 @ xhigh · knowledge May 2026','<strong>Effort → AA / $:</strong> low 31 / $2.92 · high 35 / $6.18 · xhigh 35 / $7.77. <span class="text-red-600">Weak value on AA:</span> GPT-6.1 Sol scores higher for less.','Use inside Cursor (plan pool) rather than as an API default')}
${card(`Grok 4.6 / 4.5 ${tagH('gray','Legacy')}`,'$2/$6 · Grok 4.6 DeepSWE 67.5% @ medium ($3.45/task).','Still in the Cursor plan pool. Grok 4.7 costs the same.','Migrate to grok-4.7',1)}
</div>
<div class="px-5 pb-3 text-[0.6875rem] text-[#6b7085]">In Cursor: Grok 4.7 $2/$6 · Fast $4/$12 · 500K context $4/$12 (cursor.com). ${AA_NOTE}</div></div>`;

  // Cursor
  document.getElementById('tab-cursor-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
${head('cursor','Cursor Models',[['Cursor plan','bg-indigo-50 text-indigo-800']],'Verified on cursor.com/docs/models, Nov 5, 2026. Plan pool = Grok 4.7 / 4.6 / 4.5 + Composer 2.5. Third-party models (Claude, GPT, Gemini) at API list price on Premium and above.')}
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
${card(`Composer 2.5 ${tagH('green','Cursor $/task')}`,'$0.50/$2.50 (Fast $3/$15) · ~$0.44/task on CursorBench (Aug)','Cheapest coding model in the plan pool. Not on AA or DeepSWE, so no cross-vendor score.','Default for everyday Cursor edits')}
${card(`Grok 4.7 (Cursor) ${tagH('blue','Plan pool')}`,'$2/$6 · 256K context on Plus · Fast $4/$12','In the plan pool on every paid plan. Use for longer agent sessions when you don\'t want third-party billing.','Long agent runs inside the plan')}
${card(`Third-party in Cursor ${tagH('purple','Premium+')}`,'Opus 5.5 $4/$20 · Sonnet 5.5 $2/$10 · Gemini 3.8 Flash $0.75/$3.75 · GPT-5.6 Sol $4/$20','GPT-6 models were not in Cursor\'s list on Nov 5.','Opus 5.5 for hard tasks inside Cursor')}
</div></div>`;

  // Free / open
  document.getElementById('tab-free-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
${head('opensource','Free &amp; Open-Weight Models',[['Open weights','bg-green-50 text-green-800']],'Prices = <strong>$ per 1M tokens</strong> on the vendor API. Open-weight models can also be self-hosted. Zen free list checked on opencode.ai, Nov 5, 2026.')}
<div class="mx-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
  <div class="bg-[#f0fdf4] border border-green-200 rounded-lg p-3"><div class="font-semibold text-green-800 text-[0.6875rem] uppercase tracking-wider">🧘 OpenCode Zen Free</div><div class="text-green-700 mt-1">Free for a limited time, inside OpenCode only. Some free models may use your data for training — check before sending private code.</div></div>
  <div class="bg-[#fffbeb] border border-amber-200 rounded-lg p-3"><div class="font-semibold text-amber-800 text-[0.6875rem] uppercase tracking-wider">🔌 OpenRouter :free</div><div class="text-amber-700 mt-1">50 req/day default; 1,000 req/day after a one-time $10 credit. <em>As of Aug 29 — openrouter.ai not reachable to re-check.</em></div></div>
  <div class="bg-[#f8f9fc] border border-[#e2e5ec] rounded-lg p-3"><div class="font-semibold text-[#5a5f73] text-[0.6875rem] uppercase tracking-wider">💻 Self-Host (Ollama etc.)</div><div class="text-[#5a5f73] mt-1">No limits. Open-weight models only; needs your GPU/RAM.</div></div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
${card(`DeepSeek V4.1 Flash ${tagH('green','Open value')} ${NEW}${freeBadge(2)}`,'$0.30/$1.20 peak · <strong class="text-green-700">$0.15/$0.60 off-peak</strong> · 1M ctx · AA 33 · Oct 17','Peak = 01:00–04:00 and 06:00–10:00 UTC, Mon–Fri. V4 Flash is retired: <code>deepseek-v4-flash</code> now routes here.','')}
${card(`GLM-5.3 / 5.3-Flash ${tagH('indigo','Open coders')}${freeBadge(2)}`,'$1.40/$4.40 · Flash $0.15/$0.50 · AA 32 / 28','DeepSWE 69.0% (top open-weight) · Flash 63.4% at $0.24/task. MIT.','')}
${card(`MiMo V2.6 Pro / Flash ${tagH('cyan','Open budget')} ${NEW}${freeBadge(2)}`,'$0.435/$0.87 · Flash $0.14/$0.28 · AA 30 / 27','Pro: AA 30 for $0.26/task — best open value on AA.','')}
${card(`MiniMax M3.1 Flash ${tagH('purple','Open')} ${NEW}`,'$0.15/$0.60 · 1M ctx · AA 29','MiniMax M3 (AA 19, $0.30/$1.20) is now behind it.','')}
${card(`Qwen3.8 27B ${tagH('cyan','Local size')}`,'$0.50/$3 · 256K ctx · AA 20 @ xhigh','Best score on AA among models that fit one large GPU.','')}
${card(`Mistral Large 4 / Small 4 ${tagH('cyan','EU · open')}`,'Large $0.70/$2.10 (AA 26) · Small $0.15/$0.60 (AA 4)','Small 4 is for edge / simple tasks only.','')}
${card(`DeepSeek V4 Pro ${tagH('indigo','MIT')}`,'$1.32/$3.96 peak · $0.66/$1.98 off-peak · AA 23','Price went up since Aug ($0.435/$0.87) and V4.1 Flash now scores higher.','')}
${card(`Free on Zen ${freeBadge(2)}`,'DeepSeek V4.1 Flash · GLM-5.3-Flash · MiMo V2.6 Flash · Nemotron 3 Ultra / 3.5 Lightning / 3.5 Super VL · Beam · Flint 40B · Big Pickle · Crouton Alpha · Pulse Alpha','<strong>Limited time.</strong> No training on data: DeepSeek, GLM, Beam. May be used for training: MiMo, Big Pickle, Flint, Pulse. NVIDIA models are trial-only — no personal data. MiMo v2.5, North Mini Code and Hy3 are no longer free.','')}
</div>
<div class="px-5 pb-3 text-[0.6875rem] text-[#6b7085]">Kimi K3.1 Pro (AA 46, $2/$10) and Qwen3.8 Max (AA 34, $2/$6) are proprietary — see the Dashboard. ${AA_NOTE}</div></div>`;

  // Matrix — generated from TG so it never drifts from the By Task tab.
  // Budget = cheapest alternative (per-task cost estimate); Upgrade = highest-AA alternative that beats the pick.
  const FREE_B='<span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>';
  const blendP=mk=>{const p=effPrice(mk);return p.i+p.o*3;};
  const altTxt=a=>{const m=M[a.m]; return m.fr ? `${m.n} ${FREE_B}` : `${m.n} ${a.c||''}`;};
  const mx=AFT.map(t=>{
    const pm=M[t.pr.m];
    const alts=t.alts.filter(a=>M[a.m]&&a.m!==t.pr.m);
    // Compare by the per-task cost estimate when both have one, else by blended price per token
    const taskC=c=>{const m=/\$([0-9.]+)/.exec(c||''); return m?parseFloat(m[1]):null;};
    const costOf=(mk,c)=>{const v=taskC(c); return v!=null?v:blendP(mk);};
    const pc=costOf(t.pr.m,t.pr.c);
    const cheaper=alts.filter(a=>costOf(a.m,a.c)<pc).sort((x,y)=>costOf(x.m,x.c)-costOf(y.m,y.c))[0];
    const aaOf=k=>M[k].aa ?? -1;
    const better=alts.filter(a=>aaOf(a.m)>aaOf(t.pr.m)).sort((x,y)=>aaOf(y.m)-aaOf(x.m))[0];
    return [t.label, pm.n, t.pr.e||'—', pm.fr&&t.pr.c==='~$0'?FREE_B:t.pr.c, cheaper?altTxt(cheaper):'—', better?altTxt(better):'—'];
  });
  let mxHtml = `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">⚡ Quick Matrix</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[600px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Task</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Effort</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cheaper alt</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Better</th></tr></thead><tbody class="divide-y divide-[#eceef4]">`;
  mx.forEach(r=>{mxHtml+=`<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium">${r[0]}</td><td class="p-2.5 text-[#2962ff] font-medium">${r[1]}</td><td class="p-2.5 text-[#6b7085] font-mono">${r[2]}</td><td class="p-2.5">${r[3]}</td><td class="hidden md:table-cell p-2.5 text-[#5a5f73]">${r[4]}</td><td class="hidden md:table-cell p-2.5 text-[#5a5f73]">${r[5]}</td></tr>`;});
  mxHtml += `</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">Cost = estimated $/task at listed effort, current prices (Nov 5, 2026).</div></div>`;
  // Golden rules
  mxHtml += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">🥇 Golden Rules</h2></div><ol class="p-4 space-y-2 text-xs sm:text-sm"><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">1.</span><strong>Never let a thread validate its own work.</strong> Write with one family (e.g. GPT-6.1 Sol), review with another (Opus 5.5).</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">2.</span><strong>Escalate model, not effort.</strong> Sonnet 5.5 @ max costs $10.02/task on AA — the same as Opus 5.5 @ max, for a lower score.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">3.</span><strong>Start with GPT-6.1 Sol @ max.</strong> AA 55 for ~$1.27/task beats almost everything per dollar; move up only when it fails.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">4.</span><strong>Set effort explicitly on every call.</strong> Cost per task can change 10× between effort levels.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">5.</span><strong>Move off legacy IDs.</strong> Opus 5 / 4.8, GPT-5.6, Gemini 3.7 / 3.6, Grok 4.6 all have a newer model at the same or lower price.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">6.</span><strong>Coding ≠ AA score.</strong> Gemini 3.8 Flash has AA 31 but is #2 on DeepSWE (73.8%) — check the DeepSWE tab for coding agents.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">7.</span><strong>Run DeepSeek off-peak.</strong> Prices halve outside 01:00–04:00 and 06:00–10:00 UTC (Mon–Fri).</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">8.</span><strong>Free = good but not all the time.</strong> Free tiers change without notice; don't rely on them in production.</li></ol></div>`;
  // Effort ref
  mxHtml += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">Effort Levels Reference</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[400px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Level</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Effect</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Use</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost ×</th></tr></thead><tbody class="divide-y divide-[#eceef4]">`;
  const eff=[['low','Minimal thinking','Classification, formatting','1×'],['medium','Moderate reasoning','Routine coding, drafting','~1.5-2×'],['high','Full reasoning','<strong class="text-[#121420]">Default.</strong> Analysis, code','~3-4×'],['xhigh','Heavy reasoning','Pipeline-critical, hard agents','~6-9×'],['max','Unconstrained','Frontier problems only','~8-12×']];
  eff.forEach(r=>{const hl=r[0]==='high'?' text-[#2962ff]':'';mxHtml+=`<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium${hl}">${r[0]}</td><td class="p-2.5 text-[#5a5f73]">${r[1]}</td><td class="p-2.5 text-[#5a5f73]">${r[2]}</td><td class="p-2.5 font-mono">${r[3]}</td></tr>`;});
  mxHtml += `</tbody></table></div></div>`;
  document.getElementById('tab-matrix-inner').innerHTML = mxHtml;
}
renderProviders();

// ═══════════════════════════════════════════════════════════════════
// MODEL FINDER
// ═══════════════════════════════════════════════════════════════════

function renderFinderForm() {
  document.getElementById('finder-tasks').innerHTML = `
<div class="flex items-center gap-2 mb-2">
  <button id="fi-select-all" class="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#e2e5ec] text-[#2962ff] bg-white hover:bg-[#e8edff] transition-colors cursor-pointer">Select All</button>
  <button id="fi-clear-all" class="px-2.5 py-1 text-xs font-semibold rounded-md border border-[#e2e5ec] text-[#5a5f73] bg-white hover:bg-[#f2f4f8] transition-colors cursor-pointer">Clear All</button>
</div>` +
  AFT.map(t =>
    `<label class="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#e2e5ec] cursor-pointer hover:bg-[#f8f9fc] transition-colors text-sm has-[:checked]:bg-[#e8edff] has-[:checked]:border-[#2962ff] has-[:checked]:text-[#1a3da0]">
      <input type="checkbox" class="w-4 h-4 rounded border-[#d1d5db] text-[#2962ff] accent-[#2962ff]" data-task-id="${t.id}" value="${t.label}">
      <span class="flex-1">${t.label}</span>
      <span class="text-[0.6875rem] text-[#6b7085]">${t.group.replace(/^[^\s]+\s/,'')}</span>
    </label>`
  ).join('');
  document.getElementById('fi-select-all').addEventListener('click',()=>{
    document.querySelectorAll('#finder-tasks input[type="checkbox"]').forEach(cb=>cb.checked=true);
  });
  document.getElementById('fi-clear-all').addEventListener('click',()=>{
    document.querySelectorAll('#finder-tasks input[type="checkbox"]').forEach(cb=>cb.checked=false);
  });
}

function runFinder() {
  const sel = Array.from(document.querySelectorAll('#finder-tasks input:checked')).map(cb=>cb.value);
  if(!sel.length){
    document.getElementById('fi-results-inner').innerHTML = '<p class="text-[#6b7085]">Please select at least one task.</p>';
    return;
  }
  const pri = (document.querySelector('input[name="priority"]:checked')||{value:'balanced'}).value;

  // blended cost: input + 3× output $/MTok (rough real-world ratio)
  function blend(mk){ if(!M[mk]) return 999; const p=effPrice(mk); return p.i + p.o*3; }

  // Score all candidate models
  const scores = {};
  sel.forEach(label=>{
    const task = AFT.find(t=>t.label===label);
    if(!task) return;
    const all = [task.pr, ...task.alts];
    all.forEach(a=>{
      if(!scores[a.m]) scores[a.m]={mk:a.m,score:0,cnt:0};
      const b = blend(a.m);
      const quality = M[a.m] ? (M[a.m].aa ?? 0) : 0;
      const costScore = Math.max(0, 100 - b * 1.5); // cheaper = higher; blended rate ~$67/MTok floors the score at 0
      // ponytail: 0.6/0.4 quality/cost split for "balanced" is a hand-picked default, not derived. Revisit if users complain about ranking.
      scores[a.m].score += (pri==='cost' ? costScore : pri==='quality' ? quality : quality*0.6 + costScore*0.4);
      scores[a.m].cnt++;
    });
  });

  const ranked = Object.values(scores).sort((a,b)=>b.score-a.score).slice(0,5);

  // Render results
  let rh = '<div class="p-4 space-y-3">';
  if(!ranked.length) rh += '<p class="text-[#6b7085] text-center">No models found.</p>';
  else {
    const colors = ['border-l-[#2962ff] bg-[#e8edff]','border-l-[#6366f1] bg-[#eef0ff]','border-l-[#0d9488]','border-l-[#d97706]','border-l-[#6b7085]'];
    ranked.forEach((r,i)=>{
      const m = M[r.mk];
      if(!m) return;
      const pColor = i===0?'text-[#2962ff] font-bold':'';
      rh += `<div class="result-card border border-[#e2e5ec] rounded-lg p-3.5 ${colors[i]}" style="border-left-width:4px">`;
      rh += `<div class="flex items-center gap-2"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full ${i===0?'bg-[#2962ff] text-white':'bg-[#e2e5ec] text-[#5a5f73]'} text-xs font-bold">${i+1}</span><span class="font-semibold text-sm ${pColor}">${m.n}</span>${freeBadge(m.fr)}<span class="ml-auto text-xs text-[#6b7085]">${m.aa==null?'not on AA':'AA '+m.aa}</span></div>`;
      rh += `<div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#5a5f73]"><span>💰 <strong>$${effPrice(r.mk).i}</strong> / MTok in</span><span>💰 <strong>$${effPrice(r.mk).o}</strong> / MTok out</span><span>📊 <strong>$${blend(r.mk).toFixed(1)}</strong> blended $/MTok (in + 3× out)</span><span>🎯 ${m.b}</span></div>`;
      rh += `</div>`;
    });
  }
  rh += '</div>';
  document.getElementById('fi-results-inner').innerHTML = rh;
}

// Init finder
renderFinderForm();
document.getElementById('fi-btn').addEventListener('click', runFinder);

// ─── DeepSWE v1.1 Value Chart (Datacurve leaderboard, updated Sep 22 2026) ───
// One bubble = one model at its best-scoring effort config ("Best" view, 113 tasks).
// Encodes 4 dimensions: X = avg cost/task (log) · Y = agent steps · size = output tokens · color = DeepSWE score.
// Source: deepswe.datacurve.ai v1.1, updated Sep 22 2026 (read Nov 5). Best-scoring effort config per model.
const DSW = [
  {id:'gpt-6-astra', n:'GPT-6 Astra', p:'OpenAI', e:'xhigh', s:74.1, ci:'±3%', c:4.43, t:30, st:29},
  {id:'gemini-3-8-flash', n:'Gemini 3.8 Flash', p:'Google', e:'high', s:73.8, ci:'±1%', c:2.36, t:143, st:166},
  {id:'claude-opus-5', n:'Opus 5', p:'Anthropic', e:'max', s:73.6, ci:'±4%', c:11.84, t:118, st:99},
  {id:'gpt-5-6-sol', n:'GPT-5.6 Sol', p:'OpenAI', e:'max', s:72.7, ci:'±3%', c:6.46, t:60, st:61},
  {id:'claude-fable-5', n:'Fable 5', p:'Anthropic', e:'xhigh', s:69.9, ci:'±3%', c:13.41, t:80, st:68},
  {id:'gpt-5-6-terra', n:'GPT-5.6 Terra', p:'OpenAI', e:'max', s:69.6, ci:'±3%', c:3.96, t:72, st:76},
  {id:'glm-5-3', n:'GLM-5.3', p:'Z.ai', e:'max', s:69.0, ci:'±3%', c:3.99, t:80, st:124},
  {id:'kimi-k3', n:'Kimi K3', p:'Moonshot', e:'max', s:68.5, ci:'±5%', c:4.65, t:81, st:98},
  {id:'grok-4-6', n:'Grok 4.6', p:'xAI', e:'medium', s:67.5, ci:'±2%', c:3.45, t:50, st:70},
  {id:'gpt-5-6-luna', n:'GPT-5.6 Luna', p:'OpenAI', e:'max', s:67.2, ci:'±4%', c:0.61, t:73, st:102},
  {id:'gpt-5-5', n:'GPT-5.5', p:'OpenAI', e:'xhigh', s:67.0, ci:'±6%', c:7.23, t:46, st:82},
  {id:'gemini-3-7-flash', n:'Gemini 3.7 Flash', p:'Google', e:'medium', s:65.5, ci:'±3%', c:2.03, t:94, st:117},
  {id:'glm-5-3-flash', n:'GLM-5.3-Flash', p:'Z.ai', e:'max', s:63.4, ci:'±4%', c:0.24, t:73, st:123},
  {id:'deepseek-v4-pro', n:'DeepSeek V4 Pro', p:'DeepSeek', e:'max', s:62.8, ci:'±6%', c:1.67, t:106, st:155},
  {id:'claude-opus-4-8', n:'Opus 4.8', p:'Anthropic', e:'max', s:59.0, ci:'±2%', c:13.22, t:135, st:120},
  {id:'qwen3-8-max', n:'Qwen3.8-Max', p:'Alibaba', e:'xhigh', s:57.5, ci:'±3%', c:3.73, t:95, st:111},
  {id:'muse-spark-1-2', n:'Muse Spark 1.2', p:'Meta', e:'xhigh', s:54.9, ci:'±2%', c:3.70, t:99, st:101},
  {id:'claude-sonnet-5', n:'Sonnet 5', p:'Anthropic', e:'max', s:53.8, ci:'±4%', c:26.40, t:214, st:268},
  {id:'grok-4-5', n:'Grok 4.5', p:'xAI', e:'high', s:53.8, ci:'±2%', c:2.42, t:36, st:61},
  {id:'deepseek-v4-flash', n:'DeepSeek V4 Flash', p:'DeepSeek', e:'max', s:53.3, ci:'±4%', c:0.46, t:108, st:153},
  {id:'muse-spark-1-1', n:'Muse Spark 1.1', p:'Meta', e:'xhigh', s:53.3, ci:'±3%', c:2.36, t:74, st:96},
  {id:'gpt-5-4', n:'GPT-5.4', p:'OpenAI', e:'xhigh', s:51.8, ci:'±2%', c:5.65, t:71, st:70},
  {id:'gemini-3-6-flash', n:'Gemini 3.6 Flash', p:'Google', e:'high', s:46.7, ci:'±4%', c:2.21, t:96, st:117},
  {id:'glm-5-2', n:'GLM-5.2', p:'Z.ai', e:'max', s:43.8, ci:'±2%', c:3.92, t:78, st:129},
  {id:'gemini-3-5-flash', n:'Gemini 3.5 Flash', p:'Google', e:'high', s:36.1, ci:'±4%', c:3.45, t:76, st:105},
  {id:'kimi-k2-7-code', n:'Kimi K2.7 Code', p:'Moonshot', e:'—', s:30.5, ci:'±1%', c:2.82, t:59, st:149},
  {id:'claude-sonnet-4-6', n:'Sonnet 4.6', p:'Anthropic', e:'high', s:29.9, ci:'±4%', c:5.52, t:76, st:134},
  {id:'gemini-3-1-pro-preview', n:'Gemini 3.1 Pro', p:'Google', e:'high', s:11.7, ci:'±1%', c:2.14, t:28, st:76},
];
const DSW_PC = {Anthropic:'#c2410c', OpenAI:'#0d9488', xAI:'#18181b', Google:'#2563eb', Moonshot:'#7c3aed', 'Z.ai':'#6366f1', ZAI:'#6366f1', Meta:'#0891b2', DeepSeek:'#059669', Alibaba:'#f59e0b'};
// Value frontier = models no cheaper config out-scores (cost ↔ score Pareto front)
let _dswBest = -1; const DSW_FRONTIER = new Set();
[...DSW].sort((a,b)=>a.c-b.c).forEach(m=>{ if(m.s>_dswBest){ DSW_FRONTIER.add(m.id); _dswBest = m.s; } });
// Value Index (0-100): how much score a model delivers per dollar, per 1k output tokens, AND per agent step —
// each measured relative to the best model in that dimension, combined as a geometric mean. One number
// that folds cost + tokens + steps into a single "value" ranking.
const _dswEff = DSW.map(m=>({id:m.id, pc:m.s/m.c, pt:m.s/m.t, ps:m.s/m.st}));
const _maxPc = Math.max(..._dswEff.map(e=>e.pc)), _maxPt = Math.max(..._dswEff.map(e=>e.pt)), _maxPs = Math.max(..._dswEff.map(e=>e.ps));
const DSW_VAL = {}; _dswEff.forEach(e=>{ DSW_VAL[e.id] = Math.round(100*Math.cbrt((e.pc/_maxPc)*(e.pt/_maxPt)*(e.ps/_maxPs))); });
const DSW_RANK = [...DSW].sort((a,b)=>DSW_VAL[b.id]-DSW_VAL[a.id]).reduce((o,m,i)=>{o[m.id]=i+1;return o;},{});
function dswLerp(c1,c2,t){ return c1.map((v,i)=>Math.round(v+(c2[i]-v)*t)); }
function dswColor(s){ // score 10..80 → red → amber → green
  const t = Math.max(0, Math.min(1, (s-10)/70));
  const c = t<0.5 ? dswLerp([239,68,68],[245,158,11],t*2) : dswLerp([245,158,11],[34,197,94],(t-0.5)*2);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
let dswProv = null;
function renderDeepSWE(){
  const DW=960, DH=560, DL=62, DR=230, DT=24, DB=46, iw=DW-DL-DR, ih=DH-DT-DB, YMAX=300;
  const px = c => DL + (Math.log(c)-Math.log(0.4))/(Math.log(40)-Math.log(0.4))*iw;
  const py = st => DT + (1-st/YMAX)*ih;
  const rad = m => Math.min(28, 1.9*Math.sqrt(m.t));
  const dim = p => dswProv && p !== dswProv;

  let h = `<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
${[
  ['🏆','Top score','GPT-6 Astra @ xhigh','74.1% · $4.43/task · 29 steps'],
  ['💎','Value frontier','GLM-5.3-Flash → GPT-5.6 Luna → Gemini 3.8 Flash → GPT-6 Astra','Best score at every price point'],
  ['⚡','Cheapest ≥ 60%','GLM-5.3-Flash','63.4% for $0.24/task'],
  ['🆕','New since Aug 26','GPT-6 Astra · Gemini 3.8 Flash','Both beat Opus 5 (73.6%) for less'],
].map(s=>`<div class="bg-white border border-[#e2e5ec] rounded-xl p-4 shadow-sm"><div class="text-lg mb-1">${s[0]}</div><div class="text-[0.6875rem] uppercase tracking-wider font-semibold text-[#6b7085]">${s[1]}</div><div class="text-sm sm:text-base font-bold mt-0.5">${s[2]}</div><div class="text-xs text-[#5a5f73] mt-0.5">${s[3]}</div></div>`).join('')}
</div>`;

  h += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex flex-wrap items-center gap-2">
  <h2 class="text-lg sm:text-xl font-semibold tracking-tight">🎯 DeepSWE Value Chart</h2>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">v1.1 · Sep 22, 2026</span>
  <span class="text-xs text-[#6b7085]">113 tasks · ${DSW.length} models · each at its best effort</span>
</div>`;
  const provs = [...new Set(DSW.map(m=>m.p))];
  const chip = (label, prov, active) => `<button data-prov="${prov}" class="dsw-chip px-2.5 py-1 rounded-full border font-semibold transition-colors cursor-pointer ${active?'bg-[#2962ff] text-white border-[#2962ff]':'bg-white text-[#5a5f73] border-[#e2e5ec] hover:border-[#2962ff]'}">${label}</button>`;
  h += `<div class="flex flex-wrap items-center gap-1.5 px-4 pt-3 text-xs">` + chip('All ('+DSW.length+')','',!dswProv);
  provs.forEach(p=> h += chip(`${p} (${DSW.filter(m=>m.p===p).length})`, p, dswProv===p));
  h += '</div>';

  h += `<div id="dsw-chart" class="relative px-2 pt-2 pb-1">`;
  let svg = `<svg id="dsw-svg" viewBox="0 0 ${DW} ${DH}" class="w-full h-auto block" font-family="Inter,sans-serif">`;
  svg += `<defs><linearGradient id="dswScoreGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#f59e0b"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs>`;
  [0.5,1,2,4,8,16,32].forEach(v=>{ const x=px(v); svg+=`<line x1="${x}" y1="${DT}" x2="${x}" y2="${DT+ih}" stroke="#eceef4"/><text x="${x}" y="${DT+ih+15}" text-anchor="middle" font-size="10" fill="#9aa0b0">$${v}</text>`; });
  [0,60,120,180,240,300].forEach(v=>{ const y=py(v); svg+=`<line x1="${DL}" y1="${y}" x2="${DL+iw}" y2="${y}" stroke="#eceef4"/><text x="${DL-8}" y="${y+3}" text-anchor="end" font-size="10" fill="#9aa0b0">${v}</text>`; });
  svg += `<text x="${DL+iw/2}" y="${DH-14}" text-anchor="middle" font-size="11" fill="#6b7085">Avg cost per task → (log scale)</text>`;
  svg += `<text x="16" y="${DT+ih/2}" text-anchor="middle" font-size="11" fill="#6b7085" transform="rotate(-90 16 ${DT+ih/2})">Agent steps per task →</text>`;
  const fr = [...DSW_FRONTIER].map(id=>DSW.find(m=>m.id===id)).sort((a,b)=>a.c-b.c);
  if(fr.length>1){
    svg += `<path d="${fr.map((m,i)=>`${i?'L':'M'}${px(m.c).toFixed(1)} ${py(m.st).toFixed(1)}`).join(' ')}" fill="none" stroke="#2962ff" stroke-width="2" stroke-dasharray="6 4" opacity=".5"/>`;
    svg += `<g><line x1="${DL+4}" y1="${DT+13}" x2="${DL+40}" y2="${DT+13}" stroke="#2962ff" stroke-width="2" stroke-dasharray="6 4" opacity=".6"/><text x="${DL+48}" y="${DT+16}" font-size="10.5" font-weight="600" fill="#2962ff">Dashed = value frontier — best score at each price point (⭐ picks)</text></g>`;
    fr.forEach(m=> svg += `<circle cx="${px(m.c)}" cy="${py(m.st)}" r="4" fill="#fff" stroke="#2962ff" stroke-width="1.5"/>`);
  }
  // Label placement: most important first (frontier, then score); try right/left/above/below;
  // skip a label if every spot hits another label or bubble — it then shows on hover only.
  const LBL = {}, boxes = [];
  const bubbles = DSW.map(m=>({id:m.id,x:px(m.c),y:py(m.st),r:rad(m)}));
  const hitsBox = b => boxes.some(o=> b.x1<o.x2 && b.x2>o.x1 && b.y1<o.y2 && b.y2>o.y1);
  const hitsBub = (b,id) => bubbles.some(c=> c.id!==id && c.x+c.r>b.x1 && c.x-c.r<b.x2 && c.y+c.r>b.y1 && c.y-c.r<b.y2);
  [...DSW].filter(m=>!dim(m.p)).sort((a,b)=>(DSW_FRONTIER.has(b.id)-DSW_FRONTIER.has(a.id))||(b.s-a.s)).forEach(m=>{
    const x=px(m.c), y=py(m.st), r=rad(m);
    const sub = `${m.e} · $${m.c.toFixed(2)} · ${m.t}k tok · ${m.st} steps`;
    const w = Math.max(((DSW_FRONTIER.has(m.id)?3:0)+m.n.length)*6.6, sub.length*4.6), hgt = 24;
    const spots = [
      {lx:x+r+6, ly:y+2, a:'start', b:{x1:x+r+4, x2:x+r+6+w, y1:y-10, y2:y-10+hgt}},
      {lx:x-r-6, ly:y+2, a:'end',   b:{x1:x-r-6-w, x2:x-r-4, y1:y-10, y2:y-10+hgt}},
      {lx:x, ly:y-r-17, a:'middle', b:{x1:x-w/2, x2:x+w/2, y1:y-r-29, y2:y-r-29+hgt}},
      {lx:x, ly:y+r+12, a:'middle', b:{x1:x-w/2, x2:x+w/2, y1:y+r, y2:y+r+hgt}},
    ].filter(sp=> sp.b.x1>=DL-40 && sp.b.x2<=DW-4 && sp.b.y1>=DT && sp.b.y2<=DT+ih+4);
    const ok = spots.find(sp=>!hitsBox(sp.b) && !hitsBub(sp.b,m.id)) || (DSW_FRONTIER.has(m.id) || m.s===_dswBest ? spots.find(sp=>!hitsBox(sp.b)) : null);
    if(ok){ boxes.push(ok.b); LBL[m.id]={...ok, show:true}; }
    else { const sp = spots[0]||{lx:x+r+6,ly:y+2,a:'start'}; LBL[m.id]={...sp, show:false}; }
  });
  let lbls = '';  // labels go in a layer above all bubbles so no bubble covers a label
  DSW.forEach(m=>{
    const x=px(m.c), y=py(m.st), r=rad(m), o=dim(m.p)?0.12:1;
    svg += `<g class="dsw-bub" data-id="${m.id}" opacity="${o}">`;
    svg += `<circle class="dsw-fill" cx="${x}" cy="${y}" r="${r}" fill="${dswColor(m.s)}" fill-opacity=".85" stroke="${DSW_PC[m.p]}" stroke-width="2"/>`;
    if(DSW_FRONTIER.has(m.id)) svg += `<circle cx="${x}" cy="${y}" r="${r+3}" fill="none" stroke="#2962ff" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    if(r>13) svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="9.5" font-weight="700" fill="#fff" pointer-events="none">${m.s}</text>`;
    const L = LBL[m.id] || {lx:x+r+6, ly:y+2, a:'start', show:false};
    const lx=L.lx, ly=L.ly, anchor=L.a;
    lbls += `<g class="dsw-lbl${L.show?'':' dsw-lbl-hide'}" data-id="${m.id}" opacity="${o}">`;
    lbls += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="11.5" font-weight="600" fill="#3c4152" stroke="#fff" stroke-width="3" paint-order="stroke" pointer-events="none">${DSW_FRONTIER.has(m.id)?'⭐ ':''}${m.n}</text>`;
    lbls += `<text x="${lx}" y="${ly+12}" text-anchor="${anchor}" font-size="9" fill="#9aa0b0" stroke="#fff" stroke-width="2.5" paint-order="stroke" pointer-events="none">${m.e} · $${m.c.toFixed(2)} · ${m.t}k tok · ${m.st} steps</text></g>`;
    svg += `</g>`;
  });
  svg += `<g pointer-events="none">${lbls}</g></svg>`;
  h += svg;
  h += `<div id="dsw-tip" class="hidden absolute z-20 pointer-events-none bg-white border border-[#e2e5ec] rounded-xl shadow-xl p-3 w-64"></div>`;
  h += `<div class="px-5 py-3 border-t border-[#eceef4] flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#5a5f73]">
<span class="flex items-center gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider">Score</span><span class="inline-block w-24 h-2 rounded-full" style="background:linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)"></span><span>10% → 80%</span></span>
<span class="flex items-center gap-1.5"><span class="text-[10px] font-semibold uppercase tracking-wider">Out tok</span><span class="inline-block rounded-full bg-[#94a3b8]" style="width:12px;height:12px"></span>36k <span class="inline-block rounded-full bg-[#64748b]" style="width:22px;height:22px"></span>118k <span class="inline-block rounded-full bg-[#475569]" style="width:36px;height:36px"></span>276k</span>
<span class="flex items-center gap-1.5 flex-wrap"><span class="text-[10px] font-semibold uppercase tracking-wider">Provider</span>${Object.keys(DSW_PC).map(p=>`<span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full" style="background:${DSW_PC[p]}"></span>${p}</span>`).join('')}</span>
</div></div></div>`;

  h += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4">
<div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📖 How to use this chart</h2></div>
<div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
  <div>
    <div class="text-xs font-semibold uppercase tracking-wider text-[#6b7085] mb-2">4 dimensions in 1 chart</div>
    <ul class="space-y-1.5 text-[#3c4152]">
      <li>🎨 <strong>Color</strong> = DeepSWE score — greener solves more of the 113 real-world tasks.</li>
      <li>💰 <strong>X-axis</strong> = avg cost per task (log scale — $0.61 → $26.40).</li>
      <li>🪜 <strong>Y-axis</strong> = agent steps — higher = more loop iterations, more latency &amp; more chances to derail.</li>
      <li>🫧 <strong>Bubble size</strong> = output tokens per task — proxy for context load &amp; review cost.</li>
    </ul>
    <div class="text-xs font-semibold uppercase tracking-wider text-[#6b7085] mt-4 mb-2">4 steps to pick</div>
    <ol class="space-y-1.5 text-[#3c4152] list-decimal list-inside">
      <li>Set your minimum acceptable score.</li>
      <li>Find the cheapest bubble at/above it — it sits leftmost and green.</li>
      <li>Among ties, prefer the higher <strong>Value index</strong> (fewer steps + fewer tokens per score point).</li>
      <li>Hover any bubble for full stats plus the cheaper alternative that scores as high.</li>
    </ol>
  </div>
  <div>
    <div class="text-xs font-semibold uppercase tracking-wider text-[#6b7085] mb-2">How cost, tokens &amp; steps combine into "value"</div>
    <ol class="space-y-1.5 text-[#3c4152] list-decimal list-inside">
      <li><strong>Cost already prices the tokens.</strong> Every $/task number is token volume × price — so the X-axis folds the token bill into dollars.</li>
      <li><strong>Tokens stay visible as a second lens</strong> (bubble size): two models can cost the same, but one floods you with 3× the output to review and carry through your own pipeline.</li>
      <li><strong>Steps are the independent axis</strong> (Y): agent-loop iterations mean latency and derailment risk — a cost money doesn't capture.</li>
      <li><strong>Value = score per unit of all three.</strong> The <strong>Value index</strong> (table + tooltip, 0–100) takes score-per-$, score-per-1k-tokens and score-per-step, normalizes each against the best model in that dimension, and combines them with a geometric mean — so a model only scores high if it's efficient on cost <em>and</em> tokens <em>and</em> steps at once. A great chart pick still deserves a check of the raw columns.</li>
    </ol>
    <div class="text-xs font-semibold uppercase tracking-wider text-[#6b7085] mt-4 mb-2">Insights baked in</div>
    <ul class="space-y-1.5 text-[#3c4152]">
      <li>💎 <strong>Stay on the value frontier:</strong> GLM-5.3-Flash (63.4%, $0.24) → GPT-5.6 Luna (67.2%, $0.61) → Gemini 3.8 Flash (73.8%, $2.36) → GPT-6 Astra (74.1%, $4.43). Every other config has a cheaper pick that scores equal or higher.</li>
      <li>⚡ <strong>Top three tie:</strong> GPT-6 Astra, Gemini 3.8 Flash and Opus 5 all sit at ~74% — but Opus 5 costs $11.84/task vs $2.36 for Gemini 3.8 Flash.</li>
      <li>⚠️ <strong>Watch the trap configs:</strong> Sonnet 5 @ max ($26.40/task, 268 steps — most on the board) and Opus 4.8 @ max ($13.22 for 59%).</li>
      <li>🔎 <strong>Few steps:</strong> GPT-6 Astra finishes in ~29 steps — the fewest at the top, so lowest latency.</li>
      <li>⏳ <strong>Not on the board yet:</strong> Claude Opus / Sonnet 5.5, GPT-6.1 Sol / Terra, Gemini 4, Grok 4.7.</li>
    </ul>
  </div>
</div>
<div class="px-5 py-3 bg-[#f8f9fc] border-t border-[#eceef4] text-xs text-[#6b7085]">Data: <a class="text-[#2962ff] hover:underline" href="https://deepswe.datacurve.ai" target="_blank" rel="noopener noreferrer">deepswe.datacurve.ai</a> v1.1 · 113 tasks · updated Sep 22, 2026 (read Nov 5). Each model shown at its best-scoring effort config (leaderboard "Best" view); all models ran on <a class="text-[#2962ff] hover:underline" href="https://github.com/SWE-agent/mini-swe-agent" target="_blank" rel="noopener noreferrer">mini-swe-agent</a>. Costs are as measured by Datacurve.</div>
</div>`;

  h += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📋 All 18 configs</h2><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">Sorted by score</span></div>
<div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[640px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Effort</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Pass@1</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost/task</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Out tok</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Steps</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Value</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Better value</th></tr></thead><tbody class="divide-y divide-[#eceef4]">`;
  [...DSW].sort((a,b)=>b.s-a.s).forEach((m,i)=>{
    const onFr = DSW_FRONTIER.has(m.id);
    const alt = [...DSW].filter(a=>a.s>=m.s).sort((a,b)=>a.c-b.c)[0];
    const note = onFr ? '<span class="text-[#2962ff] font-semibold">⭐ Frontier</span>' : (alt && alt.id!==m.id ? `<span class="text-[#0d9488]">${alt.n} · $${alt.c.toFixed(2)}</span>` : '—');
    h += `<tr class="hover:bg-[#f8f9fc]${onFr?' bg-[#e8edff]':''}"><td class="p-2.5 font-medium">${i+1}. ${m.n}</td><td class="p-2.5 font-mono text-[#6b7085]">${m.e}</td><td class="p-2.5 font-semibold">${m.s}% <span class="text-[#a0a5b5] text-[10px]">${m.ci}</span></td><td class="p-2.5 font-mono">$${m.c.toFixed(2)}</td><td class="hidden md:table-cell p-2.5 font-mono">${m.t}k</td><td class="hidden md:table-cell p-2.5 font-mono">${m.st}</td><td class="hidden md:table-cell p-2.5 font-mono font-semibold ${DSW_VAL[m.id]>=50?'text-[#0d9488]':DSW_VAL[m.id]>=25?'text-[#d97706]':'text-red-600'}">${DSW_VAL[m.id]}</td><td class="p-2.5 text-xs">${note}</td></tr>`;
  });
  h += `</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">⚖️ <strong>Value index (0–100)</strong> = geometric mean of <em>score per $</em>, <em>score per 1k output tokens</em> and <em>score per agent step</em>, each normalized to the best model in that dimension — one number combining cost + tokens + steps. It ranks efficiency, not raw quality: always sanity-check against the raw columns.</div></div>`;

  document.getElementById('tab-deepswe-inner').innerHTML = h;

  // ── interactions ──
  const svgEl = document.getElementById('dsw-svg'), tip = document.getElementById('dsw-tip'), wrap = document.getElementById('dsw-chart');
  let hoverId = null;
  function showTip(m, cx, cy){
    const alt = [...DSW].filter(a=>a.s>=m.s).sort((a,b)=>a.c-b.c)[0];
    const onFr = DSW_FRONTIER.has(m.id);
    const verdict = onFr
      ? '<div class="mt-1.5 text-[11px] font-semibold text-[#2962ff]">💎 Value frontier — no cheaper model scores higher</div>'
      : (alt && alt.id!==m.id ? `<div class="mt-1.5 text-[11px] font-semibold text-[#0d9488]">⚠️ Cheaper pick: ${alt.n} @ $${alt.c.toFixed(2)} scores ${alt.s}% (or higher)</div>` : '');
    tip.innerHTML = `<div class="font-semibold text-sm">${m.n} <span class="text-[10px] font-mono text-[#6b7085]">@ ${m.e}</span></div>
<div class="text-[10px] text-[#a0a5b5] font-mono mt-0.5">${m.id} · ${m.p}</div>
<div class="mt-1.5 space-y-0.5 text-xs text-[#3c4152]">
<div>🎯 DeepSWE <strong>${m.s}%</strong> ${m.ci}</div>
<div>💰 <strong>$${m.c.toFixed(2)}</strong> / task</div>
<div>📝 ${m.t}k output tokens</div>
<div>🪜 ${m.st} agent steps</div>
<div>💱 $${(m.c/m.s).toFixed(3)} per score point</div>
<div>⚖️ Value <strong>${DSW_VAL[m.id]}/100</strong> · rank #${DSW_RANK[m.id]} of 18</div></div>${verdict}`;
    tip.classList.remove('hidden');
    const r = wrap.getBoundingClientRect();
    let tx = cx - r.left + 14, ty = cy - r.top - 10;
    if(tx + 260 > r.width) tx = cx - r.left - 272;
    if(ty < 6) ty = 6;
    tip.style.left = tx+'px'; tip.style.top = ty+'px';
  }
  svgEl.addEventListener('mousemove', ev=>{
    const r = svgEl.getBoundingClientRect();
    const vx = (ev.clientX-r.left)/r.width*DW, vy = (ev.clientY-r.top)/r.height*DH;
    let best = null, bd = 1e9;
    DSW.forEach(m=>{ const d = Math.hypot(vx-px(m.c), vy-py(m.st)); if(d<bd){ bd=d; best=m; } });
    const hit = best && bd < rad(best)+14 && !dim(best.p);
    document.querySelectorAll('.dsw-bub,.dsw-lbl').forEach(g=> g.classList.toggle('dsw-hov', hit && g.dataset.id===best.id));
    if(hit){ if(hoverId!==best.id){ hoverId=best.id; showTip(best, ev.clientX, ev.clientY); } else { const r2 = wrap.getBoundingClientRect(); tip.style.left=(ev.clientX-r2.left+14)+'px'; tip.style.top=(ev.clientY-r2.top-10)+'px'; } }
    else { hoverId=null; tip.classList.add('hidden'); }
  });
  svgEl.addEventListener('mouseleave', ()=>{ hoverId=null; tip.classList.add('hidden'); document.querySelectorAll('.dsw-bub,.dsw-lbl').forEach(g=>g.classList.remove('dsw-hov')); });
  document.querySelectorAll('.dsw-chip').forEach(b=> b.addEventListener('click', ()=>{ dswProv = b.dataset.prov || null; renderDeepSWE(); }));
}
renderDeepSWE();

// ─── Price Changes History (verified Nov 5, 2026) ───
function renderPriceHistory(){
  const NEW = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.625rem] font-bold uppercase bg-pink-50 text-pink-800 ml-1.5">New</span>';
  const tl = [
    {d:'Oct 26, 2026', p:'OpenCode Zen', c:'gray', t:'⚫ Zen free list reshuffled', b:'DeepSeek V4 Flash deprecated on Zen. Free now: <strong>DeepSeek V4.1 Flash, GLM-5.3-Flash, MiMo V2.6 Flash</strong>, NVIDIA Nemotron trio, Beam, Flint 40B, Big Pickle. MiMo v2.5, North Mini Code, Hy3 no longer free.', n:1},
    {d:'Oct 2026', p:'Google', c:'blue', t:'🔵 Gemini 4 Carbon', b:'<strong>$4/$20</strong>. AA #1 overall (60). Price via Artificial Analysis.', n:1},
    {d:'Oct 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-6.1 Terra', b:'<strong>$1/$5</strong> — half of GPT-5.6 Terra ($2/$12). AA 51 @ max.', n:1},
    {d:'Oct 2026', p:'Moonshot', c:'gray', t:'⚫ Kimi K3.1 Pro', b:'<strong>$2/$10</strong>, 1M ctx, proprietary. AA 46. Replaces Kimi K3 ($3/$15) as the Kimi pick.', n:1},
    {d:'~Oct 17, 2026', p:'DeepSeek', c:'blue', t:'🔵 V4.1 Flash · peak pricing live · V4 Pro price up', b:'<strong>V4.1 Flash $0.30/$1.20</strong> peak, <strong>$0.15/$0.60</strong> off-peak (V4 Flash retired; its ID routes here). Peak hours 01:00–04:00 &amp; 06:00–10:00 UTC Mon–Fri. <strong>V4 Pro</strong> now $1.32/$3.96 peak, $0.66/$1.98 off-peak (was $0.435/$0.87).', n:1},
    {d:'~Oct 13, 2026', p:'Google', c:'blue', t:'🔵 Gemini 4 Argon', b:'<strong>$2/$10</strong> promo (50% credit back) thru Nov 30, then <strong>$4/$20</strong>. AA 50.', n:1},
    {d:'~Oct 7, 2026', p:'Anthropic', c:'violet', t:'🟣 Haiku 5.5', b:'<strong>$0.10/$0.50</strong> for prompts up to 100K tokens, <strong>$0.50/$2.50</strong> above. AA 36. Replaces Haiku 4.5 ($1/$5).', n:1},
    {d:'~Sep 28, 2026', p:'Anthropic', c:'violet', t:'🟣 Sonnet 5.5', b:'<strong>$2/$10</strong> — same as Sonnet 5. AA 55 @ max.', n:1},
    {d:'Sep 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-6 Astra · GPT-6.1 Sol · GPT-6 Luna', b:'<strong>Astra $10/$50</strong> (AA 57, DeepSWE #1 74.1%) · <strong>6.1 Sol $2/$10</strong> (AA 55 for ~$1.27/task) · <strong>Luna $0.10/$0.50</strong>. GPT-5.6 becomes legacy.', n:1},
    {d:'Sep 22, 2026', p:'Anthropic', c:'violet', t:'🟣 Opus 5.5', b:'<strong>$4/$20</strong> — 20% cheaper than Opus 5 ($5/$25). AA 59 @ max (#2). Fast mode $8/$40.', n:1},
    {d:'Sep 22, 2026', p:'Datacurve', c:'blue', t:'🔵 DeepSWE v1.1 refresh', b:'28 models. GPT-6 Astra #1 (74.1%), Gemini 3.8 Flash #2 (73.8%), Opus 5 #3 (73.6%).', n:1},
    {d:'Sep 2026', p:'xAI', c:'gray', t:'⚫ Grok 4.7', b:'<strong>$2/$6</strong>, 500K ctx. AA 35. Same price as Grok 4.6.', n:1},
    {d:'~Sep 2, 2026', p:'Google', c:'blue', t:'🔵 Gemini 3.8 Flash', b:'<strong>$0.75/$3.75</strong> intro thru Dec 31, then $1.50/$7.50. DeepSWE 73.8%. Gemini 3.6 Flash moved to the same intro price.', n:1},
    {d:'Sep 1, 2026', p:'Anthropic', c:'violet', t:'🟣 Fable 5.1', b:'<strong>$10/$50</strong> unchanged. Cache hit drops $1 → $0.25.', n:1},
    {d:'Aug 26, 2026', p:'Datacurve', c:'blue', t:'🔵 DeepSWE v1.1 leaderboard refresh', b:'27 models. Opus 5 #1 at 73.6%.'},
    {d:'Aug 21, 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-5.6 Sol price cut', b:'<strong>Sol −20%/−33%:</strong> $5/$30 → <strong>$4/$20</strong> (promo thru Nov 21). First time Sol undercuts Opus 5 on both input AND output. Terra and Luna unchanged.'},
    {d:'Aug 13, 2026', p:'Google', c:'blue', t:'🔵 Gemini 3.7 Flash launch', b:'<strong>$0.75/$3.75</strong> intro thru Dec 31 — half the price of 3.6 Flash. DeepSWE 65.3%. 3.6 Flash superseded.'},
    {d:'Aug 12, 2026', p:'xAI', c:'gray', t:'⚫ Grok 4.6 launch', b:'<strong>$2/$6</strong> unchanged from 4.5. DeepSWE 65.9% (up from 4.5\'s 54%). Now operated under SpaceXAI name.'},
    {d:'Aug 10, 2026', p:'Anthropic', c:'violet', t:'🟣 Sonnet 5 $2/$10 made permanent', b:'Scheduled Sep 1 increase to $3/$15 <strong>cancelled</strong>. $2/$10 is now the standard price. Biggest pricing surprise of the month.'},
    {d:'Jul 31, 2026', p:'DeepSeek', c:'blue', t:'🔵 V4 Flash 0731 public beta', b:'Price unchanged <strong>$0.14/$0.28</strong> — but DeepSWE jumped <strong>7.3% → 54.4%</strong> (7×). V4 Pro confirmed at <strong>$0.435/$0.87</strong>. Legacy <code class="bg-[#eceef4] px-1 rounded">deepseek-chat</code> / <code class="bg-[#eceef4] px-1 rounded">deepseek-reasoner</code> aliases retired. Future <strong>2× peak-hour pricing</strong> announced (Beijing 09:00–12:00 &amp; 14:00–18:00), effective date TBA.'},
    {d:'Jul 30, 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-5.6 price cuts', b:'<strong>Luna −80%:</strong> $1/$6 → <strong>$0.20/$1.20</strong> · <strong>Terra −20%:</strong> $2.50/$15 → <strong>$2/$12</strong> · Sol unchanged at $5/$30. Priority Processing renamed <strong>Fast mode</strong> (2× price, 2.5× speed). Both cuts apply retroactively to usage from Jul 30.'},
    {d:'Jul 24, 2026', p:'Anthropic', c:'violet', t:'🟣 Opus 5 launch', b:'<strong>$5/$25</strong> — same price as Opus 4.8, massively better. <strong>Opus 4.8 is now superseded</strong> (keep only if Opus 5\'s safety classifier blocks a request).'},
    {d:'Jul 21, 2026', p:'Google', c:'blue', t:'🔵 Gemini 3.6 Flash launch', b:'<strong>$1.50/$7.50</strong>. Output −17% vs 3.5 Flash ($9.00) plus ~17% fewer output tokens → <strong>~31% lower real-world bill</strong>. 3.5 Flash superseded.'},
    {d:'Jul 9, 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-5.6 GA', b:'Sol <strong>$5/$30</strong> · Terra <strong>$2.50/$15</strong> · Luna <strong>$1/$6</strong> (pre-cut rates).'},
    {d:'Jul 8, 2026', p:'xAI', c:'gray', t:'⚫ Grok 4.5 launch', b:'<strong>$2/$6</strong>, 500K ctx, cached input $0.50/M. Best agentic $/task at launch ($1.51/task @ high).'},
    {d:'Jun 30, 2026', p:'Anthropic', c:'violet', t:'🟣 Sonnet 5 launch', b:'<strong>$2/$10</strong> (now permanent). New tokenizer adds ~30% tokens (code/JSON heaviest).'},
    {d:'May 28, 2026', p:'Anthropic', c:'violet', t:'🟣 Opus 4.8 launch', b:'<strong>$5/$25</strong>. Superseded by Opus 5 at the same price.'},
    {d:'Apr 24, 2026', p:'DeepSeek', c:'blue', t:'🔵 V4 Flash &amp; V4 Pro launch', b:'<strong>$0.14/$0.28</strong> and <strong>$0.435/$0.87</strong>, 1M ctx, MIT.'},
  ];
  // Snapshot — generated from M (prices in effect today). SNAP_EXTRA = priced models not in the catalog.
  const SNAP_EXTRA = [['GPT-6.1 Terra 1M ctx','$1','$5','same price at full context'],['GLM-5.3-FlashX','$0.37','$1.25','Z.ai'],['MiniMax M3','$0.30','$1.20','behind M3.1 Flash'],['Qwen3.8-Flash-Next','$0.15','$0.47','not on AA index']];
  const money=v=>v?('$'+(v<1?String(+v.toFixed(3)):v)):'Free';
  const snap = MArr.filter(m=>m.sn!==undefined).map(m=>{const p=effPrice(m.k);return [m.n,money(p.i),money(p.o),m.sn+(m.v?` <span class="text-[#a0a5b5]">· checked ${fmtDate(m.v)}</span>`:'')];}).concat(SNAP_EXTRA);
  const dot = {emerald:'bg-emerald-500',blue:'bg-blue-500',violet:'bg-violet-500',gray:'bg-gray-400'};
  let h = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📜 Price Changes History</h2></div><div class="px-5 py-3.5 border-b border-[#eceef4] bg-[#f8f9fc]"><p class="text-xs text-[#5a5f73] leading-relaxed"><strong class="text-[#121420]">What this is:</strong> a change log of every price move that affects the models in this guide — launches, cuts, and supersessions, newest first — so you can see why recommendations shifted and what the current rates are.</p><ul class="text-xs text-[#5a5f73] mt-2 space-y-1"><li>🕐 <strong>Timeline</strong> — launches and price changes, newest first. Items marked <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.625rem] font-bold uppercase bg-pink-50 text-pink-800">New</span> landed since recent releases.</li><li>🧾 <strong>Snapshot</strong> — today\'s list prices ($/MTok) for every model, with a note on what changed and when.</li><li>⏰ <strong>Watchlist</strong> — upcoming changes that will re-shape the recommendation (promo and intro prices ending; DeepSeek peak-hour pricing). Past items drop off automatically.</li></ul><p class="text-xs text-[#6b7085] mt-2">Prices checked <strong>Nov 5, 2026</strong>: Claude, Google, xAI, DeepSeek, Z.ai and Cursor on their own sites; GPT-6 family, Gemini 4 Carbon, Kimi, Meta, Xiaomi, MiniMax, Mistral, Qwen via Artificial Analysis. Zen free list checked Nov 5; OpenRouter free limits as of Aug 29.</p></div><div class="p-5">';
  tl.forEach(r=>{
    h += `<div class="relative pl-9 pb-5 last:pb-0"><span class="absolute left-0 top-1 h-2.5 w-2.5 rounded-full ${dot[r.c]} ring-4 ring-white"></span><span class="absolute left-[5px] top-5 bottom-0 w-px bg-[#eceef4] last:hidden"></span><div class="text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b7085]">${r.d} · ${r.p}${r.n?NEW:''}</div><div class="font-semibold text-sm mt-0.5">${r.t}</div><div class="text-xs text-[#5a5f73] mt-0.5 leading-relaxed">${r.b}</div></div>`;
  });
  h += '</div></div>';
  h += '<div class="space-y-4"><div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">🧾 Current Price Snapshot</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[480px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Input/MTok</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Output/MTok</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Note</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  snap.forEach(r=>{
    h += `<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium">${r[0]}</td><td class="p-2.5 font-mono">${r[1]}</td><td class="p-2.5 font-mono">${r[2]}</td><td class="p-2.5 text-[#6b7085]">${r[3]}</td></tr>`;
  });
  h += '</tbody></table></div></div>';
  h += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">⏰ Watchlist &amp; Gotchas</h2></div><ul class="p-4 space-y-2 text-xs sm:text-sm text-[#5a5f73]">'+(past('2026-11-22')?'':'<li>🔔 <strong>Nov 21:</strong> GPT-5.6 Sol promo pricing ($4/$20) expires → reverts to $5/$30. Re-check model selection then.</li>')+(past('2026-12-01')?'':'<li>🔔 <strong>Nov 30:</strong> Gemini 4 Argon promo ($2/$10) ends → $4/$20.</li>')+(past('2027-01-01')?'':'<li>🔔 <strong>Dec 31:</strong> Gemini 3.8 / 3.7 / 3.6 Flash intro pricing ($0.75/$3.75) ends → doubles to $1.50/$7.50.</li>')+'<li>🆓 <strong>Zen free models are limited-time</strong> and some use your data for training (MiMo, Big Pickle, Flint, Pulse) — avoid for private code.</li><li>⏰ <strong>Long-context surcharge:</strong> GPT-6 above 272K tokens ($4/$15 for 6.1 Sol, $20/$75 for Astra); Grok 4.7 above 200K ($4/$12).</li><li>⏰ <strong>DeepSeek peak pricing is live:</strong> 2× price 01:00–04:00 &amp; 06:00–10:00 UTC Mon–Fri. Batch jobs off-peak.</li><li>⚠️ <strong>Gemini 4:</strong> completions over 32K tokens are billed even if the request fails (from Nov 13).</li><li>🔍 <strong>Not on DeepSWE yet:</strong> Claude 5.5, GPT-6.1, Gemini 4, Grok 4.7 — coding picks for them use AA only.</li><li>📍 <strong>Pin your IDs:</strong> move off <code class="bg-[#eceef4] px-1 rounded">gpt-5.6*</code>, <code class="bg-[#eceef4] px-1 rounded">claude-opus-5</code>, <code class="bg-[#eceef4] px-1 rounded">grok-4.6</code>, <code class="bg-[#eceef4] px-1 rounded">gemini-3.7-flash</code>.</li><li>📍 <strong>Claude IDs:</strong> <code class="bg-[#eceef4] px-1 rounded">claude-opus-5-5</code> · <code class="bg-[#eceef4] px-1 rounded">claude-sonnet-5-5</code> · <code class="bg-[#eceef4] px-1 rounded">claude-haiku-5-5</code> · <code class="bg-[#eceef4] px-1 rounded">claude-fable-5-1</code>.</li><li>🔧 <strong>Corrections Nov 5:</strong> Mistral Large 4 is $0.70/$2.10 on the Mistral API ($1.36/$4.18 was a reseller price); all AA scores moved to the current AA index (old numbers were on an older scale); DeepSWE numbers re-read from Datacurve\'s own data (several Aug values were wrong, e.g. Grok 4.6 65.9% → 67.5%); GLM-5.2 $1.34/$4 → $1.40/$4.40; Qwen3.8 Max $1.65/$4.95 → $2/$6; Mistral Small 4 $0.20 → $0.15 input.</li></ul></div>';
  h += '</div></div>';
  document.getElementById('tab-price-inner').innerHTML = h;
}
renderPriceHistory();

// ─── References ───
function renderReferences(){
  const V = '2026-11-05';
  const off = [
    {u:'https://platform.claude.com/docs/en/about-claude/pricing',n:'Claude Platform Docs',d:'Claude 5.5 / 5.1 prices, model IDs, legacy list, context and output limits'},
    {u:'https://cloud.google.com/vertex-ai/generative-ai/pricing',n:'Google Cloud — Agent Platform pricing',d:'Gemini 4 Argon promo, Gemini 3.8 / 3.7 / 3.6 Flash intro prices, Gemini 3.1 Pro'},
    {u:'https://docs.x.ai/docs/models',n:'xAI API Docs',d:'Grok 4.7 price, 500K context, knowledge cutoff'},
    {u:'https://api-docs.deepseek.com/quick_start/pricing',n:'DeepSeek API Docs',d:'V4.1 Flash / V4 Pro peak and off-peak prices, peak hours, V4 Flash retirement'},
    {u:'https://docs.z.ai/guides/overview/pricing',n:'Z.ai (GLM) Docs',d:'GLM-5.3 / 5.3-Flash / 5.2 prices'},
    {u:'https://cursor.com/docs/models',n:'Cursor Docs',d:'Plan pool models (Grok 4.7, Composer 2.5) and third-party list prices, incl. GPT-5.6'},
    {u:'https://openai.com/api/pricing/',n:'OpenAI Pricing',d:'Not read (bot check) — GPT-6 prices from Artificial Analysis, matched by LiteLLM and OpenCode'},
    {u:'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json',n:'LiteLLM price database',d:'Open, community-maintained price list. Used to cross-check OpenAI, Moonshot (Kimi), Meta, Xiaomi, MiniMax, Mistral and long-context tiers (Nov 5)'},
    {u:'https://openrouter.ai',n:'OpenRouter',d:'Free model rate limits (as of Aug 29)'},
    {u:'https://opencode.ai/docs/zen',n:'OpenCode Console / Zen Docs',d:'Free model list, data policies, list prices incl. GPT-6 long-context tiers (Nov 5)'},
  ];
  const third = [
    {u:'https://artificialanalysis.ai',n:'Artificial Analysis (AA Index)',d:'Current Intelligence Index, cost per task by effort, and prices for GPT-6, Gemini 4 Carbon, Kimi, Meta, Xiaomi, MiniMax, Mistral and Qwen. Read Nov 5, 2026.'},
    {u:'https://deepswe.datacurve.ai',n:'DeepSWE v1.1 (Datacurve)',d:'Long-horizon agentic coding benchmark — 113 tasks, 28 models, updated Sep 22 2026 (read Nov 5). Source for the cost/task, output-token and agent-step data in the DeepSWE Value Chart tab.'},
    {u:'https://cursor.com/blog/cursorbench',n:'Cursor CursorBench 3.2 (BridgeMind)',d:'Agentic coding benchmark comparing models on task completion rate and cost per task. Source for the Composer 2.5 cost/task (Aug data).'},
    {u:'https://www.swebench.com',n:'SWE-Bench Verified / SWE-Pro',d:'Standardized software engineering benchmark. Scores cited for coding models across all provider tabs.'},
    {u:'https://livecodebench.github.io',n:'LiveCodeBench',d:'Community coding benchmark tracking top models. Used for secondary coding quality comparisons.'},
    {u:'https://github.com/idavidrein/gpqa',n:'GPQA (Graduate-Level Q&A)',d:'Hard science benchmark (physics, chemistry, biology). Cited for reasoning model comparisons.'},
    {u:'https://github.com/EleutherAI/lm-evaluation-harness',n:'AIME / MATH Benchmarks (EleutherAI)',d:'Mathematical reasoning benchmarks. Used for math-proof and hard-reasoning model recommendations.'},
    {u:'https://arcprize.org',n:'ARC-AGI',d:'Novel problem-solving benchmark measuring generalisation ability. Referenced for reasoning quality.'},
    {u:'https://lmarena.ai',n:'LM Arena (formerly LMSYS Chatbot Arena)',d:'Community Elo ratings providing user-preference signal. Secondary quality reference.'},
    {u:'https://github.com/anomalyco/opencode',n:'OpenCode GitHub (anomalyco/opencode)',d:'Source code and issue tracker for OpenCode. Zen rate limit documentation and free tier clarifications.'},
    {u:'https://costgoat.com',n:'Costgoat',d:'DeepSeek pricing calculator used to verify blended MTok rates and compare cost projections.'},
    {u:'https://deepseekai.guide',n:'DeepSeek AI Guide',d:'Community guide covering DeepSeek free tier, API limits, and model selection advice.'},
  ];
  function urlHost(u){return u.replace(/^https?:\/\//,'').replace(/\/$/,'');}
  function entry(r){
    return `<div class="px-5 py-3 hover:bg-[#f8f9fc] transition-colors">`+
      `<div class="flex items-center gap-2"><a href="${r.u}" target="_blank" rel="noopener noreferrer" class="font-semibold text-sm text-[#2962ff] hover:underline">${r.n}</a>`+
      `<svg class="w-3 h-3 text-[#6b7085] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></div>`+
      `<div class="text-xs text-[#a0a5b5] font-mono mt-0.5 break-all">${urlHost(r.u)}</div>`+
      `<div class="text-xs text-[#5a5f73] mt-1 leading-relaxed">${r.d}</div>`+
      `<div class="text-[0.6875rem] text-[#b0b5c5] mt-1 flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>✔ Verified ${V}</div>`+
      `</div>`;
  }
  let h = '<div class="grid grid-cols-1 md:grid-cols-2 gap-5">';
  // Official column
  h += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">';
  h += '<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2"><h2 class="text-lg sm:text-xl font-semibold">🏢 Official Sources</h2><span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">15 sources</span></div>';
  h += '<div class="divide-y divide-[#eceef4]">';
  off.forEach(r=>{h+=entry(r);});
  h += '</div></div>';
  // Third-party column
  h += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">';
  h += '<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2"><h2 class="text-lg sm:text-xl font-semibold">🔬 Third-Party &amp; Community</h2><span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-amber-50 text-amber-800">11 sources</span></div>';
  h += '<div class="divide-y divide-[#eceef4]">';
  third.forEach(r=>{h+=entry(r);});
  h += '</div></div>';
  h += '</div>';
  document.getElementById('tab-refs-inner').innerHTML = h;
}
renderReferences();
