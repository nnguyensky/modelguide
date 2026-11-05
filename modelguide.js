// ═══════════════════════════════════════════════════════════════════
// MODEL SELECTION GUIDE v1.1 — DATA MODEL + RENDERERS
// ═══════════════════════════════════════════════════════════════════

// ─── Models ───
const M = {
  // Claude 5.5 family — prices from platform.claude.com (Nov 5, 2026). aa = estimate on this page's scale:
  // Artificial Analysis moved to index v4.3 (harsher, ~7 pts lower). v4.3 raw: Opus 5.5 58 · Sonnet 5.5 56 · Fable 5.1 53 · Haiku 5.5 43.
  opus55:    { n:'Opus 5.5',      p:'Anthropic',  i:4,   o:20,  aa:65, e:['low','med','high','xhigh','max'],     b:'New #1. Fable-level quality at Opus price. AA v4.3 = 58', t:'#1 overall', c:'purple', fr:0, v:'2026-11-05', sn:'Sep 22 · #1 overall' },
  fable51:   { n:'Fable 5.1',     p:'Anthropic',  i:10,  o:50,  aa:60, e:['low','med','high','xhigh','max'],     b:'Ceiling model. Long autonomy. AA v4.3 = 53', t:'Ceiling', c:'purple', fr:0, v:'2026-11-05', sn:'Sep 1' },
  sonnet55:  { n:'Sonnet 5.5',    p:'Anthropic',  i:2,   o:10,  aa:63, e:['low','med','high','xhigh','max'],     b:'Best daily driver. AA v4.3 = 56 (#2)', t:'Best daily', c:'green', fr:0, v:'2026-11-05', sn:'~Sep 28' },
  haiku55:   { n:'Haiku 5.5',     p:'Anthropic',  i:0.1, o:0.5, aa:50, e:['low','med','high'],                   b:'Cheapest Claude. $0.50/$2.50 past 100K prompt. AA v4.3 = 43', t:'Budget', c:'orange', fr:0, v:'2026-11-05', sn:'≤100K prompt; $0.50/$2.50 above' },
  opus5:     { n:'Opus 5',        p:'Anthropic',  i:5,   o:25,  aa:61, e:['low','med','high','xhigh','max'],     b:'Legacy. Opus 5.5 is cheaper and better', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  fable5:    { n:'Fable 5',       p:'Anthropic',  i:10,  o:50,  aa:60, e:['low','med','high','xhigh','max'],     b:'Legacy. Use Fable 5.1 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  sonnet5:   { n:'Sonnet 5',      p:'Anthropic',  i:2,   o:10,  aa:53, e:['low','med','high','xhigh','max'],     b:'Legacy. Use Sonnet 5.5 (same price)', t:'Legacy', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  opus48:    { n:'Opus 4.8',      p:'Anthropic',  i:5,   o:25,  aa:56, e:['low','med','high','xhigh','max'],     b:'Legacy. Migrate to Opus 5.5', t:'Superseded', c:'gray', fr:0, v:'2026-11-05', sn:'legacy' },
  gptSol:    { n:'GPT-5.6 Sol',   p:'OpenAI',     i:4,   o:20,  aa:59, e:['none','low','med','high','xhigh','max','ultra'], iAfter:5, oAfter:30, priceChangeDate:'2026-11-22', b:'Best agentic coding. TB leader. Promo $4/$20 thru Nov 21', bAfter:'Best agentic coding. TB leader. $5/$30 (promo ended Nov 21)', t:'AA Coding #1', c:'blue', fr:0, v:'2026-08-29', sn:'promo thru Nov 21 → $5/$30', snAfter:'promo ended Nov 21' },
  gptTerra:  { n:'GPT-5.6 Terra', p:'OpenAI',     i:2, o:12,  aa:55, e:['none','low','med','high','xhigh','max'], b:'Best value GPT-5.6 family', t:'Best value', c:'green', fr:0, v:'2026-08-29', sn:'cut Jul 30' },
  gptLuna:   { n:'GPT-5.6 Luna',  p:'OpenAI',     i:0.2, o:1.2, aa:51, e:['none','low','med','high','xhigh','max'], b:'Cost champ. ⚠️ Bad at long ctx', t:'Cost champ', c:'orange', fr:0, v:'2026-08-29', sn:'cut Jul 30' },
  grok45:    { n:'Grok 4.5',      p:'xAI',        i:2,   o:6,   aa:54, e:['low','med','high'],                    b:'Best agentic $/task', t:'Agentic value', c:'orange', fr:0, v:'2026-08-29', sn:'cached in $0.50' },
  gemini36f: { n:'Gemini 3.6 Flash',p:'Google',   i:0.75,o:3.75,aa:50, e:[], iAfter:1.5, oAfter:7.5, priceChangeDate:'2027-01-01', b:'Superseded. Use 3.8 Flash (same price)', t:'Superseded', c:'gray', fr:0, v:'2026-11-05', sn:'superseded · intro thru Dec 31', snAfter:'superseded' },
  gemini35f: { n:'Gemini 3.5 Flash',p:'Google',   i:1.5, o:9,   aa:50, e:[], b:'Superseded. Use 3.8 Flash', t:'Superseded', c:'gray', fr:0, v:'2026-11-05', sn:'superseded' },
  gemini31p: { n:'Gemini 3.1 Pro',  p:'Google',   i:2,   o:12,  aa:46, e:[], b:'Reasoning specialist (preview). GPQA 94.3%', t:'Reasoning', c:'orange', fr:0, v:'2026-11-05', sn:'$4/$18 &gt;200K' },
  composer25:{ n:'Composer 2.5',    p:'Cursor',    i:0.5, o:2.5, aa:62, aaT:'CAI', e:[], b:'Best coding $/task. Cursor-only', t:'Best $/task', c:'green', fr:0, cu:1, v:'2026-08-29', sn:'Cursor only' }, // ponytail: aa = Coding Agent Index (agent-level, not AA Intelligence Index) — labeled CAI in finder
  dsV4Flash: { n:'DeepSeek V4 Flash',p:'DeepSeek',i:0.14,o:0.28,aa:47, e:['non-think','high','max'], b:'Best free. Near Opus 4.8 quality', t:'Best free', c:'green', fr:2, v:'2026-08-29', sn:'' },
  dsV4Pro:   { n:'DeepSeek V4 Pro',p:'DeepSeek',  i:0.435, o:0.87, aa:44, e:['non-think','high','max'], b:'1.6T MoE, 1M ctx, MIT', t:'MIT', c:'indigo', fr:0, v:'2026-08-29', sn:'' },
  hy3Free:   { n:'Hy3 Free',       p:'Tencent',   i:0,   o:0,   aa:41, e:['no_think','low','high'], b:'295B MoE. Free tier may have expired', t:'Was free', c:'orange', fr:1, v:'2026-08-29' },
  mimoV25:   { n:'MiMo v2.5',      p:'Xiaomi',    i:0.14,o:0.28,aa:37, e:[], b:'Native multimodal. Free on Zen', t:'Multimodal', c:'cyan', fr:2, v:'2026-08-29' },
  northMini: { n:'North Mini Code',p:'Cohere',    i:0.2, o:0.8, aa:27.6,e:[], b:'Local coder. Fits RTX 4090', t:'Local', c:'purple', fr:2, v:'2026-08-29' },
  bigPickle: { n:'Big Pickle',     p:'OpenCode Zen',i:0, o:0,  aa:47, e:[], b:'Smoke tests. Routes DeepSeek V4', t:'Smoke tests', c:'gray', fr:1, v:'2026-08-29' },
  kimiK3:    { n:'Kimi K3',        p:'Moonshot',  i:3,   o:15,  aa:57, e:['low','med','high','max'], b:'Best OSS overall. 2.8T params', t:'Best OSS', c:'purple', fr:0, v:'2026-08-29', sn:'' },
  glm52:     { n:'GLM-5.2',        p:'Z.ai',      i:1.34,o:4,   aa:51, e:['low','med','high','max'], b:'Strongest OSS coder. 1M ctx MIT', t:'Top OSS coder', c:'indigo', fr:0, v:'2026-08-29', sn:'' },
  gemma431:  { n:'Gemma 4 31B',    p:'Google',    i:0.2, o:0.8, aa:43, e:[], b:'LCB 80%, AIME 89.2%, Apache 2.0', t:'Apache 2.0', c:'cyan', fr:0, v:'2026-08-29' },
  qwen3627:  { n:'Qwen3.6-27B',    p:'Alibaba',   i:0.25,o:1,   aa:42, e:[], b:'SWE-bench 77.2%, Apache 2.0', t:'Apache 2.0', c:'cyan', fr:0, v:'2026-08-29' },
  mistralS4: { n:'Mistral Small 4',p:'Mistral',   i:0.2, o:0.6, aa:36, e:[], b:'6B active, 256K ctx, Apache 2.0', t:'Apache 2.0', c:'cyan', fr:0, v:'2026-08-29' },
  minimaxM3: { n:'MiniMax M3',     p:'MiniMax',   i:0.3, o:1.2, aa:44, e:[], b:'GPQA 92.9%, multimodal, open', t:'Open', c:'purple', fr:0, v:'2026-08-29', sn:'' },
  grok46:    { n:'Grok 4.6',       p:'xAI',       i:2,   o:6,   aa:55, e:['low','med','high','xhigh'], b:'Updated xAI flagship. DeepSWE 65.9%', t:'Updated flagship', c:'orange', fr:0, v:'2026-08-29', sn:'Aug 12' },
  gemini37f: { n:'Gemini 3.7 Flash',p:'Google',    i:0.75,o:3.75,aa:52, e:[], iAfter:1.5, oAfter:7.5, priceChangeDate:'2027-01-01', b:'Superseded. Use 3.8 Flash (same price). DeepSWE 65.3%', t:'Superseded', c:'gray', fr:0, v:'2026-11-05', sn:'superseded · intro thru Dec 31', snAfter:'superseded' },
  gemini38f: { n:'Gemini 3.8 Flash',p:'Google',    i:0.75,o:3.75,aa:59, e:['low','med','high'], iAfter:1.5, oAfter:7.5, priceChangeDate:'2027-01-01', b:'Best Gemini. Intro $0.75/$3.75 thru Dec 31. Computer use', bAfter:'Best Gemini. Computer use', t:'Best value Gemini', c:'cyan', fr:0, v:'2026-11-05', sn:'intro thru Dec 31 → $1.50/$7.50', snAfter:'standard since Jan 1' }, // aa: AA article Sep 2 (same index version as the rest of this page)
  gemini4argon:{ n:'Gemini 4 Argon',p:'Google',     i:2,   o:10,  aa:null, e:[], iAfter:4, oAfter:20, priceChangeDate:'2026-12-01', b:'New Google flagship. Promo thru Nov 30, then $4/$20. AA v4.3 = 53 (not ranked: no score on this page\'s scale)', bAfter:'New Google flagship. AA v4.3 = 53 (not ranked: no score on this page\'s scale)', t:'Flagship', c:'cyan', fr:0, v:'2026-11-05', sn:'promo thru Nov 30 → $4/$20', snAfter:'standard since Dec 1' },
  glm53:     { n:'GLM-5.3',        p:'Z.ai',      i:1.4, o:4.4, aa:53, e:['low','med','high','max'], b:'Top Z.ai. DeepSWE 66.9%', t:'Top Z.ai', c:'indigo', fr:0, v:'2026-08-29', sn:'Aug 14' },
  glm53f:    { n:'GLM-5.3-Flash',  p:'Z.ai',      i:0.15,o:0.5, aa:48, e:[], b:'320B MoE. DeepSWE 63.4%. MIT', t:'Budget OSS', c:'indigo', fr:0, v:'2026-08-29' },
  qwen38max: { n:'Qwen3.8-Max',    p:'Alibaba',   i:1.65,o:4.95,aa:50, e:['low','med','high','xhigh','max'], b:'2.4T MoE. DeepSWE 56.6%', t:'OSS flagship', c:'cyan', fr:0, v:'2026-08-29', sn:'Aug 3' },
  qwen38fn:  { n:'Qwen3.8-Flash-Next',p:'Alibaba',i:0.15,o:0.5, aa:46, e:[], b:'125B. DeepSWE 58.7%. Apache 2.0', t:'Fast OSS', c:'cyan', fr:0, v:'2026-08-29' },
  muse12:    { n:'Muse Spark 1.2', p:'Meta',       i:0.1, o:0.2, aa:49, e:['low','med','high','xhigh'], b:'DeepSWE 59.3%. Budget coding', t:'Budget coding', c:'blue', fr:0, v:'2026-08-29', sn:'Aug 5' },
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
const TG = [
{name:'🛠️ Software Engineering',co:'border-l-[#2962ff]',hc:'text-[#2962ff]',hb:'bg-[#e8edff]',tasks:[
  {t:'Write routine code',pr:{m:'sonnet55',e:'medium',c:'~$0.80'},alts:[{m:'dsV4Flash',e:'high',r:1,l:'Cheaper free',c:'~$0'},{m:'gptTerra',e:'high',r:2,l:'Balanced',c:'~$0.71'},{m:'opus55',e:'high',r:3,l:'Best quality',c:'~$3.10'}]},
  {t:'Write critical code',pr:{m:'opus55',e:'xhigh',c:'~$5.90'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free alt',c:'~$0'},{m:'gptSol',e:'high',r:2,l:'Strong alt',c:'~$4.60'},{m:'fable51',e:'xhigh',r:3,l:'Ceiling',c:'~$14'}]},
  {t:'Pipeline-critical multi-file',pr:{m:'opus55',e:'xhigh',c:'~$5.90'},alts:[{m:'gptTerra',e:'high',r:1,l:'Budget',c:'~$0.71'},{m:'gptSol',e:'max',r:2,l:'Stronger',c:'~$6.40'},{m:'fable51',e:'max',r:3,l:'Best',c:'~$14'}]},
  {t:'Debug a hard bug',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free alt',c:'~$0'},{m:'sonnet55',e:'xhigh',r:2,l:'Budget',c:'~$1.50'},{m:'gptSol',e:'high',r:3,l:'Strong',c:'~$4.60'}]},
  {t:'Review / validate code',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free',c:'~$0'},{m:'glm53',e:'high',r:2,l:'Open alt',c:'~$0.85'},{m:'gptSol',e:'high',r:3,l:'Strong',c:'~$4.60'}]},
  {t:'Multi-step agent workflow',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'grok46',e:'high',r:1,l:'Best $/task',c:'~$1.51'},{m:'gptTerra',e:'xhigh',r:2,l:'Budget',c:'~$0.71-1.20'},{m:'gptSol',e:'high',r:3,l:'Stronger',c:'~$4.60'}]},
  {t:'Coding in Cursor (daily)',pr:{m:'composer25',e:'',c:'~$0.44'},alts:[{m:'grok46',e:'high',r:1,l:'Better score',c:'~$1.51'},{m:'sonnet55',e:'med',r:2,l:'Via API',c:'~$0.60'},{m:'opus55',e:'high',r:3,l:'Best via API',c:'~$3.10'}]},
]},
{name:'✍️ Content & Writing',co:'border-l-[#6366f1]',hc:'text-[#4338ca]',hb:'bg-[#e0e7ff]',tasks:[
  {t:'Write analysis / memo',pr:{m:'sonnet55',e:'high',c:'~$1.50'},alts:[{m:'gemini38f',e:'',r:1,l:'Cheaper',c:'~$0.40'},{m:'gptTerra',e:'high',r:2,l:'Alt',c:'~$0.71'},{m:'opus55',e:'high',r:3,l:'Premium',c:'~$3.10'}]},
  {t:'Translation (bulk)',pr:{m:'sonnet55',e:'low-med',c:'~$0.40-0.80'},alts:[{m:'dsV4Flash',e:'non-think',r:1,l:'Free',c:'~$0'},{m:'qwen3627',e:'',r:2,l:'Open multi-lang',c:'~$0.15'},{m:'gptLuna',e:'low',r:3,l:'Budget API',c:'~$0.03'}]},
  {t:'Classify / extract / format',pr:{m:'sonnet55',e:'low',c:'~$0.40'},alts:[{m:'dsV4Flash',e:'non-think',r:1,l:'Free',c:'~$0'},{m:'gptLuna',e:'low',r:2,l:'Budget',c:'~$0.03'},{m:'haiku55',e:'low',r:3,l:'Cheapest Claude',c:'~$0.02'}]},
  {t:'Marketing / creative copy',pr:{m:'sonnet55',e:'high',c:'~$1.50'},alts:[{m:'gptTerra',e:'high',r:1,l:'Creative alt',c:'~$0.71'},{m:'opus55',e:'high',r:2,l:'Premium',c:'~$3.10'},{m:'gemini38f',e:'',r:3,l:'Budget',c:'~$0.40'}]},
]},
{name:'📊 Data & Research',co:'border-l-[#0d9488]',hc:'text-[#0a6e65]',hb:'bg-[#d5f5f0]',tasks:[
  {t:'Analyze data / statistics',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'sonnet55',e:'high',r:1,l:'Budget',c:'~$1.50'},{m:'gptTerra',e:'high',r:2,l:'Alt',c:'~$0.71'},{m:'dsV4Flash',e:'max',r:3,l:'Free',c:'~$0'}]},
  {t:'Research / lit review',pr:{m:'opus55',e:'xhigh',c:'~$5.90'},alts:[{m:'gemini31p',e:'',r:1,l:'Budget',c:'~$2-4'},{m:'kimiK3',e:'max',r:2,l:'Open alt',c:'~$6'},{m:'fable51',e:'xhigh',r:3,l:'Best',c:'~$14'}]},
  {t:'Low-cost bulk processing',pr:{m:'dsV4Flash',e:'high',c:'~$0'},alts:[{m:'northMini',e:'',r:1,l:'Free local',c:'~$0'},{m:'gptLuna',e:'low',r:2,l:'API',c:'~$0.03'},{m:'mimoV25',e:'',r:3,l:'Free multi',c:'~$0'}]},
  {t:'Database query generation',pr:{m:'sonnet55',e:'med',c:'~$0.60'},alts:[{m:'dsV4Flash',e:'high',r:1,l:'Free',c:'~$0'},{m:'gptTerra',e:'med',r:2,l:'Alt',c:'~$0.56'},{m:'glm53',e:'med',r:3,l:'Open',c:'~$0.55'}]},
]},
{name:'🧠 Reasoning & Analysis',co:'border-l-[#d97706]',hc:'text-[#7a4a02]',hb:'bg-[#fef3cd]',tasks:[
  {t:'Math proof / hard reasoning',pr:{m:'opus55',e:'max',c:'~$6.60'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free',c:'~$0'},{m:'gptSol',e:'max',r:2,l:'Strong',c:'~$6.40'},{m:'fable51',e:'max',r:3,l:'Ceiling',c:'~$14'}]},
  {t:'Agent orchestration prompts',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'sonnet55',e:'high',r:1,l:'Budget',c:'~$1.50'},{m:'gptSol',e:'high',r:2,l:'Strong',c:'~$3.90'},{m:'glm53',e:'high',r:3,l:'Open',c:'~$0.85'}]},
  {t:'Logic / puzzle solving',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free',c:'~$0'},{m:'grok46',e:'high',r:2,l:'Value',c:'~$1.51'},{m:'kimiK3',e:'high',r:3,l:'Open',c:'~$6'}]},
]},
{name:'🛡️ Security',co:'border-l-[#dc2626]',hc:'text-[#991b1b]',hb:'bg-[#fee2e2]',tasks:[
  {t:'Security code audit',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'gptSol',e:'high',r:1,l:'TB leader',c:'~$4.60'},{m:'dsV4Flash',e:'max',r:2,l:'Free alt',c:'~$0'},{m:'fable51',e:'xhigh',r:3,l:'Ceiling',c:'~$14'}]},
  {t:'Vulnerability research / CVE',pr:{m:'gptSol',e:'max',c:'~$6.40'},alts:[{m:'opus55',e:'xhigh',r:1,l:'Strong reasoning',c:'~$5.90'},{m:'dsV4Flash',e:'max',r:2,l:'Free alt',c:'~$0'},{m:'kimiK3',e:'max',r:3,l:'Open alt',c:'~$6'}]},
  {t:'Secure code generation',pr:{m:'sonnet55',e:'high',c:'~$1.50'},alts:[{m:'dsV4Flash',e:'high',r:1,l:'Free',c:'~$0'},{m:'gptTerra',e:'high',r:2,l:'Budget',c:'~$0.71'},{m:'opus55',e:'high',r:3,l:'Premium',c:'~$3.10'}]},
  {t:'Incident response / forensics',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'gptSol',e:'high',r:1,l:'Strong alt',c:'~$4.60'},{m:'grok46',e:'high',r:2,l:'Best $/task',c:'~$1.51'},{m:'fable51',e:'xhigh',r:3,l:'Ceiling',c:'~$14'}]},
]},
{name:'👁️ Multimodal & Vision',co:'border-l-[#0891b2]',hc:'text-[#155e75]',hb:'bg-[#d5f6fc]',tasks:[
  {t:'Vision / chart reading',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'gemini38f',e:'',r:1,l:'Budget',c:'~$0.40'},{m:'mimoV25',e:'',r:2,l:'Free',c:'~$0'},{m:'kimiK3',e:'high',r:3,l:'Open',c:'~$6'}]},
  {t:'Document OCR + analysis',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'mimoV25',e:'',r:1,l:'Free',c:'~$0'},{m:'gemini38f',e:'',r:2,l:'Budget',c:'~$0.40'},{m:'minimaxM3',e:'',r:3,l:'Open',c:'~$0.30'}]},
  {t:'Screenshot → code',pr:{m:'opus55',e:'high',c:'~$3.10'},alts:[{m:'mimoV25',e:'',r:1,l:'Free',c:'~$0'},{m:'gemini38f',e:'',r:2,l:'Budget',c:'~$0.40'},{m:'gptSol',e:'high',r:3,l:'Strong',c:'~$4.60'}]},
  {t:'Computer use / GUI',pr:{m:'gemini38f',e:'',c:'~$0.40'},alts:[{m:'opus55',e:'high',r:1,l:'Better',c:'~$3.10'},{m:'gptSol',e:'high',r:2,l:'Alt',c:'~$3.90'}]},
  {t:'Multimodal (img+audio+video)',pr:{m:'mimoV25',e:'',c:'~$0'},alts:[{m:'gemini38f',e:'',r:1,l:'Budget',c:'~$0.40'},{m:'minimaxM3',e:'',r:2,l:'Open',c:'~$0.30'},{m:'opus55',e:'high',r:3,l:'Best img+txt',c:'~$3.10'}]},
]},
{name:'🔒 Local / Private',co:'border-l-[#7c3aed]',hc:'text-[#5b21b6]',hb:'bg-[#ede9fe]',tasks:[
  {t:'Local code agent (no cloud)',pr:{m:'northMini',e:'',c:'~$0'},alts:[{m:'qwen3627',e:'',r:1,l:'Stronger local',c:'~$0.15'},{m:'gemma431',e:'',r:2,l:'Open alt',c:'~$0.10'},{m:'opus55',e:'high',r:3,l:'Cloud (if ok)',c:'~$3.10'}]},
  {t:'On-device / edge inference',pr:{m:'gemma431',e:'',c:'~$0.10'},alts:[{m:'mistralS4',e:'',r:1,l:'Efficient',c:'~$0.08'},{m:'northMini',e:'',r:2,l:'Free',c:'~$0'},{m:'qwen3627',e:'',r:3,l:'Stronger',c:'~$0.15'}]},
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
const DASH_ORDER = ['opus55','sonnet55','fable51','gptSol','gemini38f','gptTerra','grok46','gptLuna','haiku55','kimiK3','glm53','gemini4argon','opus5'];
const DASH_FREE_ORDER = ['dsV4Flash','hy3Free','mimoV25','northMini'];
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
    return `<tr class="${rowCls}"><td class="${nameCls}">${m.n}</td><td class="p-2.5 sm:p-3 text-[#5a5f73]">${m.p}</td><td class="p-2.5 sm:p-3 font-mono">${pr.i}</td><td class="p-2.5 sm:p-3 font-mono">${pr.o}</td><td class="p-2.5 sm:p-3 font-semibold">${m.aa==null?'<span class="text-[#9aa0b0]" title="No score on this page\'s AA scale">—</span>':m.aa}</td><td class="hidden md:table-cell p-2.5 sm:p-3"><div class="flex items-center gap-1.5"><div class="flex-1 h-1.5 bg-[#eceef4] rounded-full overflow-hidden"><div class="score-bar h-full rounded-full" style="width:${scorePct}%;background:${grad}"></div></div></div></td><td class="p-2.5 sm:p-3 text-[#5a5f73] text-xs">${bestFor}</td><td class="hidden lg:table-cell p-2.5 sm:p-3 text-[#6b7085] text-xs whitespace-nowrap">${m.v?fmtDate(m.v):'—'}</td></tr>`;
  }

  let html = '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="flex items-center gap-2 px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📊 All Models</h2><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">Sorted by AA Index</span><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">Free highlighted</span></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[620px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Provider</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">In $/MTok</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Out $/MTok</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">AA</th><th class="hidden md:table-cell p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Score</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Best For</th><th class="hidden lg:table-cell p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Checked</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  DASH_ORDER.forEach(mk=>{html+=dashRow(mk,false);});
  DASH_FREE_ORDER.forEach(mk=>{html+=dashRow(mk,true);});
  html += '</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">* Green rows = free on OpenCode Zen. Prices in $/MTok. <code>$a→b</code> = scheduled price change. AA “—” = listed but not ranked.</div></div>';

  // Pricing & CursorBench side-by-side
  html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">';
  html += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">💰 Pricing Tiers <span class="text-xs font-normal text-[#6b7085]">($/MTok in / out)</span></h2></div><div class="p-4 space-y-2">';
  const tiers=[['Free','$0 / $0','5%','bg-[#6ee7b7]','DeepSeek V4 Flash'],['Budget','$0.10–1.50 / $0.50–7.50','15%','bg-[#6366f1]','Haiku 5.5 · Luna · Composer · Grok'],['Mid','$2–3 / $10–15','35%','bg-[#d97706]','Sonnet 5.5 · Terra'],['Premium','$4–5 / $20–30','65%','bg-[#dc2626]','Opus 5.5 · Sol'],['Ceiling','$10 / $50','100%','bg-gradient-to-r from-red-500 to-purple-600','Fable 5.1']];
  tiers.forEach(t=>{html+=`<div class="flex items-center gap-3 text-sm"><span class="w-16 font-semibold text-[0.6875rem] uppercase tracking-wider text-[#5a5f73]">${t[0]}</span><div class="flex-1 h-2 bg-[#eceef4] rounded-full overflow-hidden"><div class="h-full rounded-full ${t[3]}" style="width:${t[2]}"></div></div><span class="text-xs text-[#6b7085] font-mono w-28">${t[1]}</span><span class="text-xs text-[#2962ff] font-medium w-36 text-right">${t[4]}</span></div>`;});
  html += '</div></div>';

  // CursorBench table
  const cb=[['Composer 2.5','56.1%','<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">$0.44</span>','$0.008'],['GPT-5.6 Luna Medium †','47.7%','$0.08','$0.002'],['Grok 4.5 Low','63.5%','<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">$1.22</span>','$0.019'],['Grok 4.5 High ★','66.7%','<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">$1.51</span>','$0.023'],['GPT-5.6 Terra High †','54.2%','$0.71','$0.013'],['Opus 5 High','66.7%','$3.91','$0.059'],['Opus 5 Max','70.0%','$8.23','$0.118']];
  html += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">⚡ Best Cost/Task</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[400px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Score</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost/task</th><th class="hidden sm:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">$/pt</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  cb.forEach((r,i)=>{const hl=i===3?' bg-[#e8edff]':'';html+=`<tr class="hover:bg-[#f8f9fc]${hl}"><td class="p-2.5 font-medium${hl?' text-[#2962ff]':''}">${r[0]}</td><td class="p-2.5${hl?' text-[#2962ff] font-semibold':''}">${r[1]}</td><td class="p-2.5">${r[2]}</td><td class="hidden sm:table-cell p-2.5 text-[#6b7085]">${r[3]}</td></tr>`;});
  html += '</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">† GPT-5.6 costs scaled to post-Jul 30 prices (Terra/Luna) and post-Aug 21 prices (Sol promo $4/$20). CursorBench ran on Grok 4.5 / Opus 5; Grok 4.6 costs the same, Opus 5.5 is 20% cheaper.</div></div></div>';

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
  // Claude
  document.getElementById('tab-claude-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('claude','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Claude Lineup</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span></div><div class="px-5 text-[0.6875rem] text-[#6b7085]">Rates = <strong>$ per 1M tokens</strong> (input / output).</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Opus 5.5 ${tagH('blue','#1 overall')} <span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span></div><div class="text-xs text-[#5a5f73] mt-1"><strong class="text-green-700">$4/$20</strong> (−20% vs Opus 5) · AA v4.3 #1 (58) · 1M ctx · 128K out · Sep 22</div><div class="text-xs text-[#5a5f73] mt-2"><strong>Effort:</strong> default medium → <strong class="text-[#2962ff]">high</strong> (~$3.10/task) → xhigh (~$5.90) → max (rare). Fast mode $8/$40.</div><div class="mt-2 text-xs bg-white border-l-3 border-[#2962ff] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Debug race condition, validate PR — Opus 5.5 @ high–xhigh</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Sonnet 5.5 ${tagH('green','Best daily')} <span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span></div><div class="text-xs text-[#5a5f73] mt-1"><strong class="text-green-700">$2/$10</strong> · AA v4.3 #2 (56) · 1M ctx · 128K out · ~Sep 28</div><div class="text-xs text-[#5a5f73] mt-2"><strong>Effort:</strong> low → medium → <strong class="text-[#2962ff]">high</strong> (default) → <span class="text-red-600">avoid max</span> (AA cost/task at max $7.60 &gt; Opus 5.5 $5.98)</div><div class="mt-2 text-xs bg-white border-l-3 border-[#2962ff] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">API docs, marketing copy, CRUD — Sonnet 5.5 @ medium–high</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Haiku 5.5 ${tagH('orange','Budget')} <span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span></div><div class="text-xs text-[#5a5f73] mt-1"><strong class="text-green-700">$0.10/$0.50</strong> up to 100K prompt · $0.50/$2.50 above · AA v4.3 43 · ~Oct 7</div><div class="text-xs text-[#5a5f73] mt-2"><strong>Effort:</strong> default medium. Keep prompts under 100K to stay on the cheap tier.</div><div class="mt-2 text-xs bg-white border-l-3 border-[#2962ff] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Classify, extract, route, bulk format — Haiku 5.5 @ low</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Fable 5.1 ${tagH('purple','Ceiling')}</div><div class="text-xs text-[#5a5f73] mt-1">$10/$50 · AA v4.3 53 · 1M ctx · 128K out · Sep 1</div><div class="text-xs text-[#5a5f73] mt-2">Same price as Fable 5. Opus 5.5 matches it on most tasks for 60% less — use only for the hardest long runs.</div><div class="mt-2 text-xs bg-white border-l-3 border-[#2962ff] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Multi-day autonomous work — Fable 5.1 @ high</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Opus 5 / Sonnet 5 / Fable 5 ${tagH('gray','Legacy')}</div><div class="text-xs text-[#5a5f73] mt-1">Still on the API. Opus 5 $5/$25 · Sonnet 5 $2/$10 · Fable 5 $10/$50.</div><div class="text-xs text-[#5a5f73] mt-2">No reason to stay: 5.5 / 5.1 versions cost the same or less.</div><div class="mt-2 text-xs bg-white border-l-3 border-[#dc2626] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Migrate model IDs to claude-*-5-5 / claude-fable-5-1</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Opus 4.8 ${tagH('gray','Legacy')}</div><div class="text-xs text-[#5a5f73] mt-1">$5/$25 · Legacy (still available).</div><div class="text-xs text-[#5a5f73] mt-2">Two generations behind. Fallback only.</div><div class="mt-2 text-xs bg-white border-l-3 border-[#dc2626] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Fallback only — migrate now</code></div></div>
</div><div class="px-5 pb-3 text-[0.6875rem] text-[#6b7085]">AA = Artificial Analysis Intelligence Index. AA moved to v4.3 (scores ~7 pts lower than older v4 numbers on this page), so the AA value used for ranking in other tabs is an estimate on the old scale. Batch API = 50% off. Prices verified Nov 5, 2026 on platform.claude.com.</div></div>`;

  // OpenAI
  document.getElementById('tab-openai-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('openai','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">GPT-5.6 Family</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">GA Jul 9</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-50 text-green-800">Sol cut Aug 21</span></div>
<div class="p-4 text-xs sm:text-sm text-[#5a5f73] px-5">Three tiers: Sol (flagship), Terra (balanced), Luna (fast/cheap). Shared 1.05M context, 128K max output, Feb 16, 2026 cutoff. Prices = <strong>$ per 1M tokens</strong> (in / out). ${past('2026-11-22') ? '<strong class="text-[#121420]">Sol promo ended Nov 21:</strong> back to $5/$30.' : '<strong class="text-[#121420]">Sol cut Aug 21:</strong> $4/$20 (promo thru Nov 21).'} <strong class="text-[#121420]">Luna −80%, Terra −20% Jul 30.</strong></div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 pt-0">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Sol ${tagH('blue','Flagship')}</div><div class="text-xs text-[#5a5f73] mt-1">${past('2026-11-22') ? '$5/$30 (promo ended Nov 21)' : '<s>$5/$30</s> → <strong class="text-green-700">$4/$20</strong> promo thru Nov 21'} · AA 59 · AA Coding 80 (#1) · 6 levels + Ultra</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>Terminal-Bench 88.8% (91.9% Ultra)</li><li>DeepSWE 72.7% (v1.1)</li><li><span class="text-red-600">Long ctx surcharge above 272K</span></li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Terra ${tagH('green','Best value')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$12 · AA 55 · AA Coding 77.4 · 6 lvls</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>GPT-5.5-class at 40% of the price</li><li>DeepSWE 69.6% (v1.1, ties Fable 5 @ max)</li><li>Within 3 pts of Sol on DeepSWE at 40% cost</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Luna ${tagH('orange','Cost champ')}</div><div class="text-xs text-[#5a5f73] mt-1">$0.20/$1.20 · AA 51 · 92% of Sol's coding at 4% cost</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li><span class="text-red-600">⚠️ MRCR 41.3%</span> — bad at long ctx</li><li>Fine for ≤100K tasks</li></ul></div>
</div>
<div class="px-5 py-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 rounded-b-xl"><strong>⚠️ Trap:</strong> bare <code class="bg-amber-100 px-1 rounded">gpt-5.6</code> routes to Sol (${past('2026-11-22') ? '$5/$30' : '$4/$20 promo'}). Pin <code class="bg-amber-100 px-1 rounded">gpt-5.6-terra</code> or <code class="bg-amber-100 px-1 rounded">gpt-5.6-luna</code>.${past('2026-11-22') ? '' : ' Sol promo expires Nov 21 — re-check pricing then.'}</div></div>`;

  // Gemini
  document.getElementById('tab-gemini-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('gemini','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Gemini Lineup</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-50 text-green-800">4 Argon · 3.8 Flash</span></div><div class="px-5 text-[0.6875rem] text-[#6b7085]">Rates = <strong>$ per 1M tokens</strong> (input / output).</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">4 Argon ${tagH('blue','Flagship')} <span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span></div><div class="text-xs text-[#5a5f73] mt-1">${past('2026-12-01') ? '$4/$20' : '<strong class="text-green-700">$2/$10</strong> promo thru Nov 30 → $4/$20'} · 1M ctx · AA v4.3 53</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>Can write up to 1M-token completions; failed completions over 32K tokens are billed (from Nov 13)</li><li>Not ranked here: no score on this page's AA scale</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">3.8 Flash ${tagH('green','Best value')} <span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span></div><div class="text-xs text-[#5a5f73] mt-1">${past('2027-01-01') ? '$1.50/$7.50' : '<strong class="text-green-700">$0.75/$3.75</strong> intro thru Dec 31 → $1.50/$7.50'} · AA 59</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>Same price as 3.7 / 3.6 Flash, higher score</li><li>Built-in computer use</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">3.7 / 3.6 Flash ${tagH('gray','Superseded')}</div><div class="text-xs text-[#5a5f73] mt-1">Same price as 3.8 Flash (${past('2027-01-01') ? '$1.50/$7.50' : '$0.75/$3.75 intro thru Dec 31'}).</div><p class="text-xs text-[#5a5f73] mt-2">Use 3.8 Flash — same price, better.</p></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">3.1 Pro ${tagH('orange','Reasoning')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$12 ($4/$18 past 200K) · AA 46 · <span class="text-red-600">Jan 2025 cutoff</span></div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>GPQA 94.3% · HLE 44.4%</li><li>Only for PhD-level reasoning</li></ul></div>
</div></div>`;

  // Grok
  document.getElementById('tab-grok-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('grok','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Grok 4.5 / 4.6</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-50 text-green-800">4.6 Aug 12</span></div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
<div><p class="text-sm text-[#5a5f73]">xAI flagship. $2/$6 (≤200K) · $4/$12 (>200K) · 500K ctx · AA 54–55 · $/MTok</p><ul class="text-xs text-[#5a5f73] mt-2 ml-4 list-disc space-y-1"><li><strong>Grok 4.6:</strong> DeepSWE 65.9% (up from 4.5\'s 54%)</li><li><strong>CursorBench 3.2:</strong> 66.7% @ $1.51/task @ high (4.5)</li><li>SWE-Bench Pro: 64.7% · Terminal-Bench: 83.3%</li><li>4× cheaper output than Opus 4.8</li><li><span class="text-red-600">⚠️ Hallucination rate 25% → 54%</span></li></ul></div>
<div><div class="font-semibold text-xs text-[#5a5f73] uppercase tracking-wider mb-1">Effort vs CursorBench (4.5)</div><div class="space-y-1 text-xs"><div class="bg-[#f8f9fc] px-3 py-1.5 rounded flex justify-between"><span class="font-medium">Low</span><span>63.5% @ $1.22</span></div><div class="bg-[#f8f9fc] px-3 py-1.5 rounded flex justify-between"><span class="font-medium">Medium</span><span>65.4% @ $1.54</span></div><div class="bg-[#e8edff] px-3 py-1.5 rounded flex justify-between font-semibold text-[#2962ff]"><span>High ★</span><span>66.7% @ $1.51</span></div></div><p class="text-xs text-[#6b7085] mt-2">Grok matches Opus 5 score at 39% cost.</p></div>
</div></div>`;

  // Cursor
  document.getElementById('tab-cursor-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('cursor','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Cursor Models</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Cursor plan</span></div><div class="px-5 text-[0.6875rem] text-[#6b7085]">Rates = <strong>$ per 1M tokens</strong> (input / output) · task costs are per task.</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Composer 2.5 ${tagH('green','Best $/task')}</div><div class="text-xs text-[#5a5f73] mt-1">$0.50/$2.50 · 200K ctx · ~$0.44/task</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>SWE-Bench ML: 79.8% · CursorBench: 63.2%</li><li><strong>Unlimited on paid plans.</strong> Default for 80-90% of Cursor work.</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Grok 4.5 / 4.6 (Cursor) ${tagH('blue','Agentic')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$6 · Joint Cursor + xAI · First-party pool</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>CursorBench 66.7% vs Composer's 56.1%</li><li>Best for long agent sessions, data science</li></ul></div>
</div></div>`;

  // Free
  document.getElementById('tab-free-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('opensource','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Free &amp; Open-Source Models</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-green-50 text-green-800">Free tier info ↓</span></div><div class="px-5 pt-3 text-[0.6875rem] text-[#6b7085]">Prices = <strong>$ per 1M tokens</strong> (in / out); "~" = typical third-party rate.</div>

<!-- Free tier limits summary -->
<div class="mx-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
  <div class="bg-[#f0fdf4] border border-green-200 rounded-lg p-3">
    <div class="font-semibold text-green-800 text-[0.6875rem] uppercase tracking-wider">🧘 OpenCode Zen Free</div>
    <div class="text-green-700 mt-1">All Zen free models share a daily pool (~200 req / ~$0.30 equiv). Resets midnight local. Add $10+ balance to raise limit to ~1,000 req/day.</div>
  </div>
  <div class="bg-[#fffbeb] border border-amber-200 rounded-lg p-3">
    <div class="font-semibold text-amber-800 text-[0.6875rem] uppercase tracking-wider">🔌 OpenRouter :free</div>
    <div class="text-amber-700 mt-1">50 req/day default. Buy any $10 credit once → jumps to 1,000 req/day permanently on all :free models.</div>
  </div>
  <div class="bg-[#f8f9fc] border border-[#e2e5ec] rounded-lg p-3">
    <div class="font-semibold text-[#5a5f73] text-[0.6875rem] uppercase tracking-wider">💻 Self-Host (Ollama etc.)</div>
    <div class="text-[#5a5f73] mt-1">No limits, any hardware. Open-weight models (Apache 2.0, MIT). Smaller brains, needs your GPU/RAM.</div>
  </div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
<div class="relative bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-3.5"><div class="font-semibold text-sm">DeepSeek V4 Flash ${tagH('green','Best free')}</div><div class="text-xs text-[#5a5f73] mt-1">284B MoE (13B active) · 1M ctx · MIT · ${freeBadge(2)}</div><div class="text-xs text-[#5a5f73] mt-1"><strong>@ max:</strong> GPQA 88.1%, SWE-Ver 79%, LCB 91.6%</div><div class="text-xs text-green-700 mt-1"><strong>🔄 Daily:</strong> ~200 req on Zen · 5M free tokens on DeepSeek signup · Unlimited on chat.deepseek.com</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">GLM-5.2 ${tagH('indigo','Top OSS coder')}</div><div class="text-xs text-[#5a5f73] mt-1">744B MoE (40B active) · 1M ctx · MIT · $1.34/$4</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 91.2% · SWE-Pro 62.1% · TB 81%</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Kimi K3 ${tagH('purple','Best OSS')}</div><div class="text-xs text-[#5a5f73] mt-1">2.8T MoE · 1M ctx · AA 57 · Weights released Jul 27</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 93.5% · DeepSWE 69% (v1.1)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">DeepSeek V4 Pro ${tagH('indigo','MIT')}</div><div class="text-xs text-[#5a5f73] mt-1">1.6T MoE (49B active) · 1M ctx · $0.435/$0.87</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 90.1% · SWE-Ver 80.6%</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Gemma 4 31B ${tagH('cyan','Apache 2.0')}</div><div class="text-xs text-[#5a5f73] mt-1">31B dense · 256K ctx · ~$0.20/$0.80</div><div class="text-xs text-[#5a5f73] mt-1">LCB 80% · AIME 89.2% · GPQA 84.3%</div><div class="text-xs text-[#6b7085] mt-1">🏠 Self-host friendly (31B dense, Apache 2.0)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Qwen3.6-27B ${tagH('cyan','Apache 2.0')}</div><div class="text-xs text-[#5a5f73] mt-1">27B dense · 256K ctx · SWE-bench 77.2%</div><div class="text-xs text-[#5a5f73] mt-1">Best dense coding model for local</div><div class="text-xs text-[#6b7085] mt-1">🏠 Self-host friendly (27B dense, Apache 2.0)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">MiniMax M3 ${tagH('purple','Open')}</div><div class="text-xs text-[#5a5f73] mt-1">428B MoE (23B active) · 1M ctx · Native multimodal</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 92.9% · 12-hour autonomous sessions</div><div class="text-xs text-[#6b7085] mt-1">$0.30/$1.20 on Zen · Self-host option</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Mistral Small 4 ${tagH('cyan','Apache 2.0')}</div><div class="text-xs text-[#5a5f73] mt-1">119B MoE (6B active) · 256K · 128 experts</div><div class="text-xs text-[#5a5f73] mt-1">Unifies instruction, reasoning, multimodal</div><div class="text-xs text-[#6b7085] mt-1">🏠 Self-host friendly (6B active, Apache 2.0)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">MiMo v2.5 ${tagH('cyan','Multimodal')}${freeBadge(2)}</div><div class="text-xs text-[#5a5f73] mt-1">310B MoE (15B active) · 1M ctx · img+audio+video</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 84.9% · Best free multimodal</div><div class="text-xs text-green-700 mt-1"><strong>🔄 Daily:</strong> ~200 req on Zen</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">North Mini Code${freeBadge(2)}</div><div class="text-xs text-[#5a5f73] mt-1">Cohere 30B MoE (3B active) · 256K · Fits RTX 4090</div><div class="text-xs text-[#5a5f73] mt-1">SWE-Ver 67.6% · Best local agentic coder</div><div class="text-xs text-green-700 mt-1"><strong>🔄 Daily:</strong> ~200 req on Zen · 🏠 Self-host (3B active)</div></div>
</div></div>`;

  // Matrix — generated from TG so it never drifts from the By Task tab.
  // Budget = cheapest alternative (blended $/MTok); Upgrade = highest-AA alternative that beats the pick.
  const FREE_B='<span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>';
  const blendP=mk=>{const p=effPrice(mk);return p.i+p.o*3;};
  const altTxt=a=>{const m=M[a.m]; return m.fr ? `${m.n} ${FREE_B}` : `${m.n} ${a.c||''}`;};
  const mx=AFT.map(t=>{
    const pm=M[t.pr.m];
    const alts=t.alts.filter(a=>M[a.m]&&a.m!==t.pr.m);
    const cheaper=alts.filter(a=>blendP(a.m)<blendP(t.pr.m)).sort((x,y)=>blendP(x.m)-blendP(y.m))[0];
    const better=alts.filter(a=>M[a.m].aa>pm.aa).sort((x,y)=>M[y.m].aa-M[x.m].aa)[0];
    return [t.label, pm.n, t.pr.e||'—', pm.fr&&t.pr.c==='~$0'?FREE_B:t.pr.c, cheaper?altTxt(cheaper):'—', better?altTxt(better):'—'];
  });
  let mxHtml = `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">⚡ Quick Matrix</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[600px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Task</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Effort</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cheaper alt</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Better</th></tr></thead><tbody class="divide-y divide-[#eceef4]">`;
  mx.forEach(r=>{mxHtml+=`<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium">${r[0]}</td><td class="p-2.5 text-[#2962ff] font-medium">${r[1]}</td><td class="p-2.5 text-[#6b7085] font-mono">${r[2]}</td><td class="p-2.5">${r[3]}</td><td class="hidden md:table-cell p-2.5 text-[#5a5f73]">${r[4]}</td><td class="hidden md:table-cell p-2.5 text-[#5a5f73]">${r[5]}</td></tr>`;});
  mxHtml += `</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">Cost = estimated $/task at listed effort, current prices (Nov 5, 2026).</div></div>`;
  // Golden rules
  mxHtml += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">🥇 Golden Rules</h2></div><ol class="p-4 space-y-2 text-xs sm:text-sm"><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">1.</span><strong>Never let a thread validate its own work.</strong> Write with Sonnet/DeepSeek/Grok; validate with Opus 5.5.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">2.</span><strong>Escalate model, not effort.</strong> Sonnet 5.5 @ max costs more per task than Opus 5.5 ($7.60 vs $5.98 on AA) for worse results.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">3.</span><strong>Set effort explicitly on every call.</strong> Defaults lie. Route per-task.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">4.</span><strong>Move off Opus 5 / 4.8.</strong> Opus 5.5 is 20% cheaper ($4/$20) and better.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">5.</span><strong>Don't overpay for Luna at long context.</strong> MRCR 41.3% past 100K.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">6.</span>${past('2026-11-22') ? '<strong>Opus 5.5 is cheaper than Sol</strong> ($4/$20 vs $5/$30 since the Sol promo ended Nov 21).' : '<strong>Sol and Opus 5.5 now cost the same</strong> ($4/$20). Sol promo expires Nov 21 → $5/$30; after that Opus 5.5 is cheaper.'}</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">7.</span><strong>Free = good but not all the time.</strong> Don't rely on Big Pickle or Hy3 Free in production.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">8.</span><strong>Pin your model ID.</strong> <code class="bg-[#eceef4] px-1 rounded">gpt-5.6</code> → Sol. Use <code class="bg-[#eceef4] px-1 rounded">gpt-5.6-terra</code>.</li></ol></div>`;
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
      const quality = M[a.m] ? M[a.m].aa : 0;
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
      rh += `<div class="flex items-center gap-2"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full ${i===0?'bg-[#2962ff] text-white':'bg-[#e2e5ec] text-[#5a5f73]'} text-xs font-bold">${i+1}</span><span class="font-semibold text-sm ${pColor}">${m.n}</span>${freeBadge(m.fr)}<span class="ml-auto text-xs text-[#6b7085]">${m.aaT||'AA'} ${m.aa}</span></div>`;
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

// ─── DeepSWE v1.1 Value Chart (Datacurve leaderboard, updated Jul 25 2026) ───
// One bubble = one model at its best-scoring effort config ("Best" view, 113 tasks).
// Encodes 4 dimensions: X = avg cost/task (log) · Y = agent steps · size = output tokens · color = DeepSWE score.
const DSW = [
  {id:'claude-opus-5',     n:'Opus 5',           p:'Anthropic', e:'max',    s:73.6, ci:'±4%', c:11.84, t:118, st:99},
  {id:'gpt-5.6-sol',       n:'GPT-5.6 Sol',      p:'OpenAI',    e:'max',    s:72.7, ci:'±3%', c:6.72,  t:60,  st:61},
  {id:'claude-fable-5',    n:'Fable 5',          p:'Anthropic', e:'max',    s:69.7, ci:'±4%', c:21.63, t:119, st:88},
  {id:'gpt-5.6-terra',     n:'GPT-5.6 Terra',    p:'OpenAI',    e:'max',    s:69.6, ci:'±3%', c:3.96,  t:72,  st:76},
  {id:'kimi-k3',           n:'Kimi K3',          p:'Moonshot',  e:'max',    s:67.5, ci:'±5%', c:4.65,  t:81,  st:98},
  {id:'gpt-5.6-luna',      n:'GPT-5.6 Luna',     p:'OpenAI',    e:'max',    s:67.2, ci:'±4%', c:0.61,  t:73,  st:102},
  {id:'gpt-5.5',           n:'GPT-5.5',          p:'OpenAI',    e:'xhigh',  s:67.0, ci:'±6%', c:7.23,  t:46,  st:82},
  {id:'glm-5.3',           n:'GLM-5.3',          p:'Z.ai',      e:'max',    s:66.9, ci:'±3%', c:3.92,  t:78,  st:129},
  {id:'grok-4.6',          n:'Grok 4.6',         p:'xAI',       e:'xhigh',  s:65.9, ci:'±3%', c:2.42,  t:36,  st:61},
  {id:'gemini-3.7-flash',  n:'Gemini 3.7 Flash', p:'Google',    e:'high',   s:65.3, ci:'±4%', c:1.76,  t:80,  st:95},
  {id:'glm-5.3-flash',     n:'GLM-5.3-Flash',    p:'Z.ai',      e:'max',    s:63.4, ci:'±3%', c:0.82,  t:65,  st:110},
  {id:'muse-spark-1.2',    n:'Muse Spark 1.2',   p:'Meta',      e:'xhigh',  s:59.3, ci:'±3%', c:0.52,  t:70,  st:90},
  {id:'claude-opus-4.8',   n:'Opus 4.8',         p:'Anthropic', e:'max',    s:59.0, ci:'±2%', c:13.22, t:135, st:120},
  {id:'qwen38-flash-next', n:'Qwen3.8-Flash-Next',p:'Alibaba',  e:'xhigh',  s:58.7, ci:'±4%', c:0.65,  t:55,  st:85},
  {id:'qwen38-max',        n:'Qwen3.8-Max',      p:'Alibaba',   e:'xhigh',  s:56.6, ci:'±4%', c:4.95,  t:70,  st:100},
  {id:'deepseek-v4-flash', n:'DeepSeek V4 Flash',p:'DeepSeek',  e:'max',    s:54.4, ci:'±3%', c:0.56,  t:60,  st:80},
  {id:'claude-sonnet-5',   n:'Sonnet 5',         p:'Anthropic', e:'max',    s:54.0, ci:'±4%', c:10.40, t:214, st:268},
  {id:'muse-spark-1.1',    n:'Muse Spark 1.1',   p:'Meta',      e:'xhigh',  s:53.3, ci:'±3%', c:2.36,  t:74,  st:96},
  {id:'grok-4.5',          n:'Grok 4.5',         p:'xAI',       e:'high',   s:54.0, ci:'±2%', c:2.42,  t:36,  st:61},
  {id:'gpt-5.4',           n:'GPT-5.4',          p:'OpenAI',    e:'xhigh',  s:52.0, ci:'±2%', c:5.65,  t:71,  st:70},
  {id:'gemini-3.6-flash',  n:'Gemini 3.6 Flash', p:'Google',    e:'high',   s:49.0, ci:'±5%', c:3.53,  t:97,  st:108},
  {id:'glm-5.2',           n:'GLM-5.2',          p:'Z.ai',      e:'max',    s:44.0, ci:'±2%', c:2.80,  t:78,  st:129},
  {id:'qwen38-27b',        n:'Qwen3.8-27B',      p:'Alibaba',   e:'xhigh',  s:42.2, ci:'±3%', c:0.65,  t:50,  st:80},
  {id:'gemini-3.5-flash',  n:'Gemini 3.5 Flash', p:'Google',    e:'medium', s:37.0, ci:'±2%', c:7.34,  t:276, st:86},
  {id:'kimi-k2.7-code',    n:'Kimi K2.7 Code',   p:'Moonshot',  e:'—',      s:31.0, ci:'±1%', c:2.82,  t:59,  st:149},
  {id:'claude-sonnet-4.6', n:'Sonnet 4.6',       p:'Anthropic', e:'high',   s:30.0, ci:'±4%', c:5.52,  t:76,  st:134},
  {id:'gemini-3.1-pro',    n:'Gemini 3.1 Pro',   p:'Google',    e:'high',   s:12.0, ci:'±2%', c:9.48,  t:196, st:81},
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
  ['🏆','Top score','Opus 5 @ max','73.6% · $11.84/task · 118k out'],
  ['💎','Value frontier','Luna → Terra → Sol → Opus 5','Best score at every price point'],
  ['⚡','Cheapest ≥ 60%','GPT-5.6 Luna','67.2% for $0.61/task'],
  ['🆕','New entries','Grok 4.6 · Gemini 3.7 · GLM-5.3','5 new models since Jul 25'],
].map(s=>`<div class="bg-white border border-[#e2e5ec] rounded-xl p-4 shadow-sm"><div class="text-lg mb-1">${s[0]}</div><div class="text-[0.6875rem] uppercase tracking-wider font-semibold text-[#6b7085]">${s[1]}</div><div class="text-sm sm:text-base font-bold mt-0.5">${s[2]}</div><div class="text-xs text-[#5a5f73] mt-0.5">${s[3]}</div></div>`).join('')}
</div>`;

  h += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex flex-wrap items-center gap-2">
  <h2 class="text-lg sm:text-xl font-semibold tracking-tight">🎯 DeepSWE Value Chart</h2>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">v1.1 · Aug 26, 2026</span>
  <span class="text-xs text-[#6b7085]">113 tasks · 27 models · each at its best effort</span>
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
      <li>💎 <strong>Stay on the value frontier:</strong> Luna → Terra → Sol → Opus 5. Every off-frontier config has a cheaper pick that scores equal or higher — e.g. Sonnet 5 @ max costs $10.40 for 54% while Luna gets 67.2% for $0.61.</li>
      <li>⚡ <strong>Value ladder:</strong> Luna (67.2%, $0.61) → Terra (69.6%, $3.96) → Sol (72.7%, $6.72) → Opus 5 (73.6%, $11.84). Pick the leftmost rung that meets your quality bar.</li>
      <li>⚠️ <strong>Watch the trap configs:</strong> Sonnet 5 @ max (268 steps — most on the board) and Opus 4.8 @ max (dominated by Sol at a lower price).</li>
      <li>🔎 <strong>Cheap ≠ slow:</strong> Sol finishes in 61 steps (tied fewest) — top-tier quality without step bloat.</li>
      <li>📉 Confidence intervals (±) are tight at the top (67–74%); when scores tie, let cost decide.</li>
    </ul>
  </div>
</div>
<div class="px-5 py-3 bg-[#f8f9fc] border-t border-[#eceef4] text-xs text-[#6b7085]">Data: <a class="text-[#2962ff] hover:underline" href="https://deepswe.datacurve.ai" target="_blank" rel="noopener noreferrer">deepswe.datacurve.ai</a> v1.1 · 113 tasks · updated Aug 26, 2026. Each model shown at its best-scoring effort config (leaderboard "Best" view); all models ran on <a class="text-[#2962ff] hover:underline" href="https://github.com/SWE-agent/mini-swe-agent" target="_blank" rel="noopener noreferrer">mini-swe-agent</a>. Note: Sol costs reflect Aug 21 promo ($4/$20); Luna/Terra reflect Jul 30 cuts. <strong>Claude 5.5 / Fable 5.1 and Oct releases are not in this snapshot</strong> — third-party trackers disagree on the current board, so it is kept at the last verified version.</div>
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
    {d:'~Oct 13, 2026', p:'Google', c:'blue', t:'🔵 Gemini 4 Argon launch', b:'<strong>$2/$10</strong> promo (50% credit back) thru Nov 30, then <strong>$4/$20</strong>. 1M ctx. AA v4.3 = 53.', n:1},
    {d:'~Oct 7, 2026', p:'Anthropic', c:'violet', t:'🟣 Haiku 5.5 launch', b:'<strong>$0.10/$0.50</strong> for prompts up to 100K tokens, <strong>$0.50/$2.50</strong> above. 1M ctx. Replaces Haiku 4.5 ($1/$5) at 90% less.', n:1},
    {d:'~Sep 28, 2026', p:'Anthropic', c:'violet', t:'🟣 Sonnet 5.5 launch', b:'<strong>$2/$10</strong> — same as Sonnet 5. AA v4.3 #2 (56). Sonnet 5 becomes legacy.', n:1},
    {d:'Sep 22, 2026', p:'Anthropic', c:'violet', t:'🟣 Opus 5.5 launch', b:'<strong>$4/$20</strong> — 20% cheaper than Opus 5 ($5/$25). AA v4.3 #1 (58). Fast mode $8/$40. Opus 5 becomes legacy.', n:1},
    {d:'~Sep 2, 2026', p:'Google', c:'blue', t:'🔵 Gemini 3.8 Flash launch', b:'<strong>$0.75/$3.75</strong> intro thru Dec 31, then $1.50/$7.50. AA 59. Gemini 3.6 Flash also moved to the same intro price. 3.7 / 3.6 Flash superseded.', n:1},
    {d:'Sep 1, 2026', p:'Anthropic', c:'violet', t:'🟣 Fable 5.1', b:'<strong>$10/$50</strong> unchanged. Cache hit drops $1 → $0.25.', n:1},
    {d:'Aug 26, 2026', p:'Datacurve', c:'blue', t:'🔵 DeepSWE v1.1 leaderboard refresh', b:'Leaderboard updated to 27 models. New entries: Grok 4.6 (65.9%), Gemini 3.7 Flash (65.3%), GLM-5.3 (66.9%), GLM-5.3-Flash (63.4%), Muse Spark 1.2 (59.3%), Qwen3.8 family. Opus 5 holds #1 at 73.6%.'},
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
  const SNAP_EXTRA = [['GPT-5.5','$5','$30',''],['GPT-5.4','$2.50','$15',''],['Muse Spark 1.1 (Meta)','$1.25','$4.25','']];
  const money=v=>v?('$'+(v<1?String(+v.toFixed(3)):v)):'Free';
  const snap = MArr.filter(m=>m.sn!==undefined).map(m=>{const p=effPrice(m.k);return [m.n,money(p.i),money(p.o),m.sn+(m.v?` <span class="text-[#a0a5b5]">· checked ${fmtDate(m.v)}</span>`:'')];}).concat(SNAP_EXTRA);
  const dot = {emerald:'bg-emerald-500',blue:'bg-blue-500',violet:'bg-violet-500',gray:'bg-gray-400'};
  let h = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📜 Price Changes History</h2></div><div class="px-5 py-3.5 border-b border-[#eceef4] bg-[#f8f9fc]"><p class="text-xs text-[#5a5f73] leading-relaxed"><strong class="text-[#121420]">What this is:</strong> a change log of every price move that affects the models in this guide — launches, cuts, and supersessions, newest first — so you can see why recommendations shifted and what the current rates are.</p><ul class="text-xs text-[#5a5f73] mt-2 space-y-1"><li>🕐 <strong>Timeline</strong> — launches and price changes, newest first. Items marked <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.625rem] font-bold uppercase bg-pink-50 text-pink-800">New</span> landed since recent releases.</li><li>🧾 <strong>Snapshot</strong> — today\'s list prices ($/MTok) for every model, with a note on what changed and when.</li><li>⏰ <strong>Watchlist</strong> — upcoming changes that will re-shape the recommendation (promo and intro prices ending; DeepSeek peak-hour pricing). Past items drop off automatically.</li></ul><p class="text-xs text-[#6b7085] mt-2">Claude prices verified <strong>Nov 5, 2026</strong> (official docs). Google verified Nov 5, 2026 (cloud.google.com). OpenAI, xAI, DeepSeek and others last verified Aug 29, 2026.</p></div><div class="p-5">';
  tl.forEach(r=>{
    h += `<div class="relative pl-9 pb-5 last:pb-0"><span class="absolute left-0 top-1 h-2.5 w-2.5 rounded-full ${dot[r.c]} ring-4 ring-white"></span><span class="absolute left-[5px] top-5 bottom-0 w-px bg-[#eceef4] last:hidden"></span><div class="text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b7085]">${r.d} · ${r.p}${r.n?NEW:''}</div><div class="font-semibold text-sm mt-0.5">${r.t}</div><div class="text-xs text-[#5a5f73] mt-0.5 leading-relaxed">${r.b}</div></div>`;
  });
  h += '</div></div>';
  h += '<div class="space-y-4"><div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">🧾 Current Price Snapshot</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[480px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Input/MTok</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Output/MTok</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Note</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  snap.forEach(r=>{
    h += `<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium">${r[0]}</td><td class="p-2.5 font-mono">${r[1]}</td><td class="p-2.5 font-mono">${r[2]}</td><td class="p-2.5 text-[#6b7085]">${r[3]}</td></tr>`;
  });
  h += '</tbody></table></div></div>';
  h += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">⏰ Watchlist &amp; Gotchas</h2></div><ul class="p-4 space-y-2 text-xs sm:text-sm text-[#5a5f73]">'+(past('2026-11-22')?'':'<li>🔔 <strong>Nov 21:</strong> GPT-5.6 Sol promo pricing ($4/$20) expires → reverts to $5/$30. Re-check model selection then.</li>')+(past('2026-12-01')?'':'<li>🔔 <strong>Nov 30:</strong> Gemini 4 Argon promo ($2/$10) ends → $4/$20.</li>')+(past('2027-01-01')?'':'<li>🔔 <strong>Dec 31:</strong> Gemini 3.8 / 3.7 / 3.6 Flash intro pricing ($0.75/$3.75) ends → doubles to $1.50/$7.50.</li>')+'<li>🔔 <strong>TBA:</strong> DeepSeek 2× peak-hour pricing (Beijing 09:00–12:00 &amp; 14:00–18:00). Off-peak stays $0.14/$0.28.</li><li>⚡ <strong>Fast mode</strong> replaces Priority Processing on GPT-5.6 — 2× price for 2.5× speed. Same model ID, explicit flag.</li><li>📍 <strong>Pin your IDs:</strong> bare <code class="bg-[#eceef4] px-1 rounded">gpt-5.6</code> routes to Sol ($4/$20 promo). Use <code class="bg-[#eceef4] px-1 rounded">gpt-5.6-terra</code> / <code class="bg-[#eceef4] px-1 rounded">gpt-5.6-luna</code>.</li><li>🆕 <strong>Reported Oct releases — not yet verified, not in rankings:</strong> GPT-6 Astra, GPT-6.1 Terra ($1/$5, Oct 26), Kimi K3.1 Pro ($2/$10, Oct 23), DeepSeek V4.1 Flash ($0.30/$1.20, Oct 17). Source: third-party trackers only — check vendor pages before use.</li><li>📍 <strong>Claude IDs:</strong> <code class="bg-[#eceef4] px-1 rounded">claude-opus-5-5</code> · <code class="bg-[#eceef4] px-1 rounded">claude-sonnet-5-5</code> · <code class="bg-[#eceef4] px-1 rounded">claude-haiku-5-5</code> · <code class="bg-[#eceef4] px-1 rounded">claude-fable-5-1</code>.</li><li>🔧 <strong>Corrections applied Aug 1:</strong> DeepSeek V4 Pro <s>$0.50/$1.50</s> → $0.435/$0.87 · MiniMax M3 <s>$0.50/$2.00</s> → $0.30/$1.20 (matches vendor rate cards).</li></ul></div>';
  h += '</div></div>';
  document.getElementById('tab-price-inner').innerHTML = h;
}
renderPriceHistory();

// ─── References ───
function renderReferences(){
  const V = '2026-08-29';
  const off = [
    {u:'https://platform.claude.com/docs',n:'Anthropic / Claude Platform Docs',d:'Claude model IDs, pricing, effort levels, context sizes, launch announcements'},
    {u:'https://platform.openai.com',n:'OpenAI Platform Docs',d:'GPT-4.1 / GPT-5.6 family pricing, model IDs, Terminal-Bench scores, usage tiers'},
    {u:'https://ai.google.dev',n:'Google AI for Developers',d:'Gemini 2.5 Flash / Pro pricing, Gemini 3.6 Flash pricing, context windows, benchmark scores'},
    {u:'https://docs.x.ai',n:'xAI API Docs',d:'Grok 3 / Grok 4.5 pricing, model IDs, context limits, reasoning effort config'},
    {u:'https://api-docs.deepseek.com',n:'DeepSeek API Docs',d:'DeepSeek V4 Flash / V4 Pro pricing, model specs, context size, free tier details'},
    {u:'https://docs.cursor.com',n:'Cursor Docs',d:'Composer 2.5 / 3 pricing, model provider costs, usage-based billing, rate limits'},
    {u:'https://platform.moonshot.cn',n:'Moonshot AI (Kimi)',d:'Kimi K3 pricing, model specs, context window, benchmark publications'},
    {u:'https://z.ai',n:'Z.ai (GLM)',d:'GLM-5.2 pricing, model architecture (744B MoE), MIT license, context size'},
    {u:'https://platform.minimaxi.com',n:'MiniMax Platform',d:'MiniMax M3 pricing, multimodal capabilities, autonomous session specs'},
    {u:'https://docs.mistral.ai',n:'Mistral AI Docs',d:'Mistral Small 4 pricing, Apache 2.0 license, model architecture (119B MoE)'},
    {u:'https://docs.cohere.com',n:'Cohere Docs',d:'North Mini Code pricing, model specs, SWE-bench scores, local deployment'},
    {u:'https://qwenlm.github.io',n:'Qwen (Alibaba)',d:'Qwen3.6-27B model specs, Apache 2.0 license, SWE-bench scores, context size'},
    {u:'https://ai.google.dev/gemma',n:'Google Gemma',d:'Gemma 4 31B model specs, Apache 2.0 license, benchmark scores, local deployment'},
    {u:'https://openrouter.ai',n:'OpenRouter',d:'Free model pricing, rate limits, provider availability, model routing'},
    {u:'https://opencode.ai/docs/zen',n:'OpenCode Zen Docs',d:'Free model pricing, daily request limits (~200 req/day), self-host information'},
  ];
  const third = [
    {u:'https://artificialanalysis.ai',n:'Artificial Analysis (AA Index)',d:'Primary independent model quality ranking used throughout this guide. AA scores power the Dashboard stats and Finder quality scoring.'},
    {u:'https://deepswe.datacurve.ai',n:'DeepSWE v1.1 (Datacurve)',d:'Long-horizon agentic coding benchmark — 113 tasks, 18 models, updated Jul 25 2026. Source for the cost/task, output-token and agent-step data in the DeepSWE Value Chart tab.'},
    {u:'https://cursor.com/blog/cursorbench',n:'Cursor CursorBench 3.2 (BridgeMind)',d:'Agentic coding benchmark comparing models on task completion rate and cost per task. Source for cost/task estimates in Dashboard. Live leaderboard at cursor.com/cursorbench.'},
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
