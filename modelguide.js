// ═══════════════════════════════════════════════════════════════════
// MODEL SELECTION GUIDE v1.1 — DATA MODEL + RENDERERS
// ═══════════════════════════════════════════════════════════════════

// ─── Models ───
const M = {
  opus5:     { n:'Opus 5',        p:'Anthropic',  i:5,   o:25,  aa:61, e:['low','med','high','xhigh','max'],     b:'Critical code, validation, reasoning', t:'#1 overall', c:'purple', fr:0 },
  fable5:    { n:'Fable 5',       p:'Anthropic',  i:10,  o:50,  aa:60, e:['low','med','high','xhigh','max'],     b:'Ceiling model. Multi-day autonomy', t:'Ceiling', c:'purple', fr:0 },
  sonnet5:   { n:'Sonnet 5',      p:'Anthropic',  i:2,   o:10,  iAfter:3, oAfter:15, priceChangeDate:'2026-08-31', aa:53, e:['low','med','high','xhigh','max'],     b:'Best daily driver. Analysis, writing', t:'Best daily', c:'green', fr:0 },
  opus48:    { n:'Opus 4.8',      p:'Anthropic',  i:5,   o:25,  aa:56, e:['low','med','high','xhigh','max'],     b:'Superseded. Safety fallback only', t:'Superseded', c:'gray', fr:0 },
  gptSol:    { n:'GPT-5.6 Sol',   p:'OpenAI',     i:5,   o:30,  aa:59, e:['none','low','med','high','xhigh','max','ultra'], b:'Best agentic coding. TB leader', t:'AA Coding #1', c:'blue', fr:0 },
  gptTerra:  { n:'GPT-5.6 Terra', p:'OpenAI',     i:2, o:12,  aa:55, e:['none','low','med','high','xhigh','max'], b:'Best value GPT-5.6 family', t:'Best value', c:'green', fr:0 },
  gptLuna:   { n:'GPT-5.6 Luna',  p:'OpenAI',     i:0.2, o:1.2, aa:51, e:['none','low','med','high','xhigh','max'], b:'Cost champ. ⚠️ Bad at long ctx', t:'Cost champ', c:'orange', fr:0 },
  grok45:    { n:'Grok 4.5',      p:'xAI',        i:2,   o:6,   aa:54, e:['low','med','high'],                    b:'Best agentic $/task', t:'Agentic value', c:'orange', fr:0 },
  gemini36f: { n:'Gemini 3.6 Flash',p:'Google',   i:1.5, o:7.5, aa:50, e:[], b:'Best Gemini default. Computer use', t:'Best Gemini', c:'cyan', fr:0 },
  gemini35f: { n:'Gemini 3.5 Flash',p:'Google',   i:1.5, o:9,   aa:50, e:[], b:'Superseded. Use 3.6 Flash', t:'Superseded', c:'gray', fr:0 },
  gemini31p: { n:'Gemini 3.1 Pro',  p:'Google',   i:2,   o:12,  aa:46, e:[], b:'Reasoning specialist. GPQA 94.3%', t:'Reasoning', c:'orange', fr:0 },
  composer25:{ n:'Composer 2.5',    p:'Cursor',    i:0.5, o:2.5, aa:62, e:[], b:'Best coding $/task. Cursor-only', t:'Best $/task', c:'green', fr:0, cu:1 },
  dsV4Flash: { n:'DeepSeek V4 Flash',p:'DeepSeek',i:0.14,o:0.28,aa:47, e:['non-think','high','max'], b:'Best free. Near Opus 4.8 quality', t:'Best free', c:'green', fr:2 },
  dsV4Pro:   { n:'DeepSeek V4 Pro',p:'DeepSeek',  i:0.435, o:0.87, aa:44, e:['non-think','high','max'], b:'1.6T MoE, 1M ctx, MIT', t:'MIT', c:'indigo', fr:0 },
  hy3Free:   { n:'Hy3 Free',       p:'Tencent',   i:0,   o:0,   aa:41, e:['no_think','low','high'], b:'295B MoE. Free tier may have expired', t:'Was free', c:'orange', fr:1 },
  mimoV25:   { n:'MiMo v2.5',      p:'Xiaomi',    i:0.14,o:0.28,aa:37, e:[], b:'Native multimodal. Free on Zen', t:'Multimodal', c:'cyan', fr:2 },
  northMini: { n:'North Mini Code',p:'Cohere',    i:0.2, o:0.8, aa:27.6,e:[], b:'Local coder. Fits RTX 4090', t:'Local', c:'purple', fr:2 },
  bigPickle: { n:'Big Pickle',     p:'OpenCode Zen',i:0, o:0,  aa:47, e:[], b:'Smoke tests. Routes DWV4', t:'Smoke tests', c:'gray', fr:1 },
  kimiK3:    { n:'Kimi K3',        p:'Moonshot',  i:3,   o:15,  aa:57, e:['low','med','high','max'], b:'Best OSS overall. 2.8T params', t:'Best OSS', c:'purple', fr:0 },
  glm52:     { n:'GLM-5.2',        p:'Z.ai',      i:1.34,o:4,   aa:51, e:['low','med','high','max'], b:'Strongest OSS coder. 1M ctx MIT', t:'Top OSS coder', c:'indigo', fr:0 },
  gemma431:  { n:'Gemma 4 31B',    p:'Google',    i:0.2, o:0.8, aa:43, e:[], b:'LCB 80%, AIME 89.2%, Apache 2.0', t:'Apache 2.0', c:'cyan', fr:0 },
  qwen3627:  { n:'Qwen3.6-27B',    p:'Alibaba',   i:0.25,o:1,   aa:42, e:[], b:'SWE-bench 77.2%, Apache 2.0', t:'Apache 2.0', c:'cyan', fr:0 },
  mistralS4: { n:'Mistral Small 4',p:'Mistral',   i:0.2, o:0.6, aa:36, e:[], b:'6B active, 256K ctx, Apache 2.0', t:'Apache 2.0', c:'cyan', fr:0 },
  minimaxM3: { n:'MiniMax M3',     p:'MiniMax',   i:0.3, o:1.2, aa:44, e:[], b:'GPQA 92.9%, multimodal, open', t:'Open', c:'purple', fr:0 },
};
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

function cost(mk,inT,outT){ const x=M[mk]; return x?((inT/1e6)*x.i+(outT/1e6)*x.o):0; }
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
  {t:'Write routine code',pr:{m:'sonnet5',e:'medium',c:'~$0.80'},alts:[{m:'dsV4Flash',e:'high',r:1,l:'Cheaper free',c:'~$0'},{m:'gptTerra',e:'high',r:2,l:'Balanced',c:'~$0.71'},{m:'opus5',e:'high',r:3,l:'Best quality',c:'~$3.90'}]},
  {t:'Write critical code',pr:{m:'opus5',e:'xhigh',c:'~$7.40'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free alt',c:'~$0'},{m:'gptSol',e:'high',r:2,l:'Strong alt',c:'~$3.90'},{m:'fable5',e:'xhigh',r:3,l:'Ceiling',c:'~$14'}]},
  {t:'Pipeline-critical multi-file',pr:{m:'opus5',e:'xhigh',c:'~$7.40'},alts:[{m:'gptTerra',e:'high',r:1,l:'Budget',c:'~$0.71'},{m:'gptSol',e:'max',r:2,l:'Stronger',c:'~$5.69'},{m:'fable5',e:'max',r:3,l:'Best',c:'~$14'}]},
  {t:'Debug a hard bug',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free alt',c:'~$0'},{m:'sonnet5',e:'xhigh',r:2,l:'Budget',c:'~$1.50'},{m:'gptSol',e:'high',r:3,l:'Strong',c:'~$3.90'}]},
  {t:'Review / validate code',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free',c:'~$0'},{m:'glm52',e:'high',r:2,l:'Open alt',c:'~$0.80'},{m:'gptSol',e:'high',r:3,l:'Strong',c:'~$3.90'}]},
  {t:'Multi-step agent workflow',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'grok45',e:'high',r:1,l:'Best $/task',c:'~$1.51'},{m:'gptTerra',e:'xhigh',r:2,l:'Budget',c:'~$0.71-1.20'},{m:'gptSol',e:'high',r:3,l:'Stronger',c:'~$3.90'}]},
  {t:'Coding in Cursor (daily)',pr:{m:'composer25',e:'',c:'~$0.44'},alts:[{m:'grok45',e:'high',r:1,l:'Better score',c:'~$1.51'},{m:'sonnet5',e:'med',r:2,l:'Via API',c:'~$0.60'},{m:'opus5',e:'high',r:3,l:'Best via API',c:'~$3.90'}]},
]},
{name:'✍️ Content & Writing',co:'border-l-[#6366f1]',hc:'text-[#4338ca]',hb:'bg-[#e0e7ff]',tasks:[
  {t:'Write analysis / memo',pr:{m:'sonnet5',e:'high',c:'~$1.50'},alts:[{m:'gemini36f',e:'',r:1,l:'Cheaper',c:'~$0.80'},{m:'gptTerra',e:'high',r:2,l:'Alt',c:'~$0.71'},{m:'opus5',e:'high',r:3,l:'Premium',c:'~$3.90'}]},
  {t:'Translation (bulk)',pr:{m:'sonnet5',e:'low-med',c:'~$0.40-0.80'},alts:[{m:'dsV4Flash',e:'non-think',r:1,l:'Free',c:'~$0'},{m:'qwen3627',e:'',r:2,l:'Open multi-lang',c:'~$0.15'},{m:'gptLuna',e:'low',r:3,l:'Budget API',c:'~$0.03'}]},
  {t:'Classify / extract / format',pr:{m:'sonnet5',e:'low',c:'~$0.40'},alts:[{m:'dsV4Flash',e:'non-think',r:1,l:'Free',c:'~$0'},{m:'gptLuna',e:'low',r:2,l:'Budget',c:'~$0.03'},{m:'gemini36f',e:'',r:3,l:'Fast',c:'~$0.30'}]},
  {t:'Marketing / creative copy',pr:{m:'sonnet5',e:'high',c:'~$1.50'},alts:[{m:'gptTerra',e:'high',r:1,l:'Creative alt',c:'~$0.71'},{m:'opus5',e:'high',r:2,l:'Premium',c:'~$3.90'},{m:'gemini36f',e:'',r:3,l:'Budget',c:'~$0.80'}]},
]},
{name:'📊 Data & Research',co:'border-l-[#0d9488]',hc:'text-[#0a6e65]',hb:'bg-[#d5f5f0]',tasks:[
  {t:'Analyze data / statistics',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'sonnet5',e:'high',r:1,l:'Budget',c:'~$1.50'},{m:'gptTerra',e:'high',r:2,l:'Alt',c:'~$0.71'},{m:'dsV4Flash',e:'max',r:3,l:'Free',c:'~$0'}]},
  {t:'Research / lit review',pr:{m:'opus5',e:'xhigh',c:'~$7.40'},alts:[{m:'gemini31p',e:'',r:1,l:'Budget',c:'~$2-4'},{m:'kimiK3',e:'max',r:2,l:'Open alt',c:'~$6'},{m:'fable5',e:'xhigh',r:3,l:'Best',c:'~$14'}]},
  {t:'Low-cost bulk processing',pr:{m:'dsV4Flash',e:'high',c:'~$0'},alts:[{m:'northMini',e:'',r:1,l:'Free local',c:'~$0'},{m:'gptLuna',e:'low',r:2,l:'API',c:'~$0.03'},{m:'mimoV25',e:'',r:3,l:'Free multi',c:'~$0'}]},
  {t:'Database query generation',pr:{m:'sonnet5',e:'med',c:'~$0.60'},alts:[{m:'dsV4Flash',e:'high',r:1,l:'Free',c:'~$0'},{m:'gptTerra',e:'med',r:2,l:'Alt',c:'~$0.56'},{m:'glm52',e:'med',r:3,l:'Open',c:'~$0.50'}]},
]},
{name:'🧠 Reasoning & Analysis',co:'border-l-[#d97706]',hc:'text-[#7a4a02]',hb:'bg-[#fef3cd]',tasks:[
  {t:'Math proof / hard reasoning',pr:{m:'opus5',e:'max',c:'~$8.20'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free',c:'~$0'},{m:'gptSol',e:'max',r:2,l:'Strong',c:'~$5.69'},{m:'fable5',e:'max',r:3,l:'Ceiling',c:'~$14'}]},
  {t:'Agent orchestration prompts',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'sonnet5',e:'high',r:1,l:'Budget',c:'~$1.50'},{m:'gptSol',e:'high',r:2,l:'Strong',c:'~$3.90'},{m:'glm52',e:'high',r:3,l:'Open',c:'~$0.80'}]},
  {t:'Logic / puzzle solving',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'dsV4Flash',e:'max',r:1,l:'Free',c:'~$0'},{m:'grok45',e:'high',r:2,l:'Value',c:'~$1.51'},{m:'kimiK3',e:'high',r:3,l:'Open',c:'~$6'}]},
]},
{name:'🛡️ Security',co:'border-l-[#dc2626]',hc:'text-[#991b1b]',hb:'bg-[#fee2e2]',tasks:[
  {t:'Security code audit',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'gptSol',e:'high',r:1,l:'TB leader',c:'~$3.90'},{m:'dsV4Flash',e:'max',r:2,l:'Free alt',c:'~$0'},{m:'fable5',e:'xhigh',r:3,l:'Ceiling',c:'~$14'}]},
  {t:'Vulnerability research / CVE',pr:{m:'gptSol',e:'max',c:'~$5.69'},alts:[{m:'opus5',e:'xhigh',r:1,l:'Strong reasoning',c:'~$7.40'},{m:'dsV4Flash',e:'max',r:2,l:'Free alt',c:'~$0'},{m:'kimiK3',e:'max',r:3,l:'Open alt',c:'~$6'}]},
  {t:'Secure code generation',pr:{m:'sonnet5',e:'high',c:'~$1.50'},alts:[{m:'dsV4Flash',e:'high',r:1,l:'Free',c:'~$0'},{m:'gptTerra',e:'high',r:2,l:'Budget',c:'~$0.71'},{m:'opus5',e:'high',r:3,l:'Premium',c:'~$3.90'}]},
  {t:'Incident response / forensics',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'gptSol',e:'high',r:1,l:'Strong alt',c:'~$3.90'},{m:'grok45',e:'high',r:2,l:'Best $/task',c:'~$1.51'},{m:'fable5',e:'xhigh',r:3,l:'Ceiling',c:'~$14'}]},
]},
{name:'👁️ Multimodal & Vision',co:'border-l-[#0891b2]',hc:'text-[#155e75]',hb:'bg-[#d5f6fc]',tasks:[
  {t:'Vision / chart reading',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'gemini36f',e:'',r:1,l:'Budget',c:'~$0.80'},{m:'mimoV25',e:'',r:2,l:'Free',c:'~$0'},{m:'kimiK3',e:'high',r:3,l:'Open',c:'~$6'}]},
  {t:'Document OCR + analysis',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'mimoV25',e:'',r:1,l:'Free',c:'~$0'},{m:'gemini36f',e:'',r:2,l:'Budget',c:'~$0.80'},{m:'minimaxM3',e:'',r:3,l:'Open',c:'~$0.30'}]},
  {t:'Screenshot → code',pr:{m:'opus5',e:'high',c:'~$3.90'},alts:[{m:'mimoV25',e:'',r:1,l:'Free',c:'~$0'},{m:'gemini36f',e:'',r:2,l:'Budget',c:'~$0.80'},{m:'gptSol',e:'high',r:3,l:'Strong',c:'~$3.90'}]},
  {t:'Computer use / GUI',pr:{m:'gemini36f',e:'',c:'~$0.80'},alts:[{m:'opus5',e:'high',r:1,l:'Better',c:'~$3.90'},{m:'gptSol',e:'high',r:2,l:'Alt',c:'~$3.90'}]},
  {t:'Multimodal (img+audio+video)',pr:{m:'mimoV25',e:'',c:'~$0'},alts:[{m:'gemini36f',e:'',r:1,l:'Budget',c:'~$0.80'},{m:'minimaxM3',e:'',r:2,l:'Open',c:'~$0.30'},{m:'opus5',e:'high',r:3,l:'Best img+txt',c:'~$3.90'}]},
]},
{name:'🔒 Local / Private',co:'border-l-[#7c3aed]',hc:'text-[#5b21b6]',hb:'bg-[#ede9fe]',tasks:[
  {t:'Local code agent (no cloud)',pr:{m:'northMini',e:'',c:'~$0'},alts:[{m:'qwen3627',e:'',r:1,l:'Stronger local',c:'~$0.15'},{m:'gemma431',e:'',r:2,l:'Open alt',c:'~$0.10'},{m:'opus5',e:'high',r:3,l:'Cloud (if ok)',c:'~$3.90'}]},
  {t:'On-device / edge inference',pr:{m:'gemma431',e:'',c:'~$0.10'},alts:[{m:'mistralS4',e:'',r:1,l:'Efficient',c:'~$0.08'},{m:'northMini',e:'',r:2,l:'Free',c:'~$0'},{m:'qwen3627',e:'',r:3,l:'Stronger',c:'~$0.15'}]},
]},
];

// Flatten for finder
const AFT = [];
TG.forEach(g=>{g.tasks.forEach(t=>{AFT.push({id:t.t.replace(/[^a-z0-9]/gi,'_'),label:t.t,group:g.name,pr:t.pr,alts:t.alts});});});

// ─── Tab switching ───
const tabBtns = document.querySelectorAll('.tab-btn');
function switchTab(el){
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  document.getElementById(el.dataset.tab).classList.add('active');
  try{ localStorage.setItem('mg-active-tab', el.dataset.tab); }catch(e){}
}
tabBtns.forEach(b=>{ b.addEventListener('click', ()=>switchTab(b)); });

// Restore last active tab
try{
  const saved = localStorage.getItem('mg-active-tab');
  if(saved){
    const el = document.querySelector(`.tab-btn[data-tab="${saved}"]`);
    if(el) switchTab(el);
  }
}catch(e){}

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
const DASH_ORDER = ['opus5','fable5','gptSol','opus48','gptTerra','grok45','sonnet5','gptLuna','gemini36f','kimiK3','glm52'];
const DASH_FREE_ORDER = ['dsV4Flash','hy3Free','mimoV25','northMini'];
function renderDash(){
  const maxAa = Math.max(...MArr.map(m=>m.aa));
  function dashRow(mk,free){
    const m = M[mk]; if(!m) return '';
    const pr = priceHtml(mk);
    const scorePct = Math.round(m.aa/maxAa*100);
    const grad = free ? '#6ee7b7' : (barGrad[m.c]||'#a5b4fc');
    const bestFor = (m.t?tagH(m.c,m.t)+' ':'')+m.b;
    const rowCls = free ? 'bg-[#f0fdf4] hover:bg-[#e8f8f2] transition-colors' : 'hover:bg-[#f8f9fc] transition-colors';
    const nameCls = free ? 'p-2.5 sm:p-3 font-semibold border-l-3 border-[#0d9488] pl-3' : 'p-2.5 sm:p-3 font-semibold';
    return `<tr class="${rowCls}"><td class="${nameCls}">${m.n}</td><td class="p-2.5 sm:p-3 text-[#5a5f73]">${m.p}</td><td class="p-2.5 sm:p-3 font-mono">${pr.i}</td><td class="p-2.5 sm:p-3 font-mono">${pr.o}</td><td class="p-2.5 sm:p-3 font-semibold">${m.aa}</td><td class="hidden md:table-cell p-2.5 sm:p-3"><div class="flex items-center gap-1.5"><div class="flex-1 h-1.5 bg-[#eceef4] rounded-full overflow-hidden"><div class="score-bar h-full rounded-full" style="width:${scorePct}%;background:${grad}"></div></div></div></td><td class="p-2.5 sm:p-3 text-[#5a5f73] text-xs">${bestFor}</td></tr>`;
  }

  let html = '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="flex items-center gap-2 px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📊 All Models</h2><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">Sorted by AA Index</span><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">Free highlighted</span></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[620px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Provider</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">In $/MTok</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Out $/MTok</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">AA</th><th class="hidden md:table-cell p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Score</th><th class="p-2.5 sm:p-3 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Best For</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  DASH_ORDER.forEach(mk=>{html+=dashRow(mk,false);});
  DASH_FREE_ORDER.forEach(mk=>{html+=dashRow(mk,true);});
  html += '</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">* Green rows = free on OpenCode Zen. Prices in $/MTok.</div></div>';

  // Pricing & CursorBench side-by-side
  html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">';
  html += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">💰 Pricing Tiers <span class="text-xs font-normal text-[#6b7085]">($/MTok in / out)</span></h2></div><div class="p-4 space-y-2">';
  const tiers=[['Free','$0 / $0','5%','bg-[#6ee7b7]','DeepSeek V4 Flash'],['Budget','$0.20–1.50 / $1.20–7.50','15%','bg-[#6366f1]','Luna · Composer · Grok'],['Mid','$2–3 / $10–15','35%','bg-[#d97706]','Sonnet 5 · Terra'],['Premium','$5 / $25–30','65%','bg-[#dc2626]','Opus 5 · Sol'],['Ceiling','$10 / $50','100%','bg-gradient-to-r from-red-500 to-purple-600','Fable 5']];
  tiers.forEach(t=>{html+=`<div class="flex items-center gap-3 text-sm"><span class="w-16 font-semibold text-[0.6875rem] uppercase tracking-wider text-[#5a5f73]">${t[0]}</span><div class="flex-1 h-2 bg-[#eceef4] rounded-full overflow-hidden"><div class="h-full rounded-full ${t[3]}" style="width:${t[2]}"></div></div><span class="text-xs text-[#6b7085] font-mono w-28">${t[1]}</span><span class="text-xs text-[#2962ff] font-medium w-36 text-right">${t[4]}</span></div>`;});
  html += '</div></div>';

  // CursorBench table
  const cb=[['Composer 2.5','56.1%','<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">$0.44</span>','$0.008'],['GPT-5.6 Luna Medium †','47.7%','$0.08','$0.002'],['Grok 4.5 Low','63.5%','<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-green-50 text-green-800">$1.22</span>','$0.019'],['Grok 4.5 High ★','66.7%','<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-blue-50 text-blue-800">$1.51</span>','$0.023'],['GPT-5.6 Terra High †','54.2%','$0.71','$0.013'],['Opus 5 High','66.7%','$3.91','$0.059'],['Opus 5 Max','70.0%','$8.23','$0.118']];
  html += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">⚡ Best Cost/Task</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[400px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Score</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost/task</th><th class="hidden sm:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">$/pt</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  cb.forEach((r,i)=>{const hl=i===3?' bg-[#e8edff]':'';html+=`<tr class="hover:bg-[#f8f9fc]${hl}"><td class="p-2.5 font-medium${hl?' text-[#2962ff]':''}">${r[0]}</td><td class="p-2.5${hl?' text-[#2962ff] font-semibold':''}">${r[1]}</td><td class="p-2.5">${r[2]}</td><td class="hidden sm:table-cell p-2.5 text-[#6b7085]">${r[3]}</td></tr>`;});
  html += '</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">† GPT-5.6 costs scaled to post-Jul 30 prices (measured at pre-cut rates).</div></div></div>';

  document.getElementById('dashboard-table').innerHTML = html;
}
renderDash();

// ─── Render By Task ───
function renderByTask(){
  let h = '<div class="px-4 sm:px-5 py-2.5 text-xs text-[#6b7085] bg-[#f8f9fc] border border-[#e2e5ec] rounded-t-xl -mb-1">Costs = <strong>estimated $ per task</strong> at the listed effort, using current prices (Aug 1, 2026). "~" = rough estimate.</div>';
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
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Sonnet 5 ${tagH('green','Best daily')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$10 intro → $3/$15 · AA 53 · 1M ctx</div><div class="text-xs text-[#5a5f73] mt-2"><strong>Effort:</strong> low → medium → <strong class="text-[#2962ff]">high</strong> → <span class="text-red-600">avoid xhigh/max</span></div><div class="mt-2 text-xs bg-white border-l-3 border-[#2962ff] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">API docs, marketing copy, CRUD — Sonnet 5 @ medium–high</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Opus 5 ${tagH('blue','#1 overall')} <span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">New</span></div><div class="text-xs text-[#5a5f73] mt-1">$5/$25 · AA 61 · 1M ctx · DeepSWE 74% (#1)</div><div class="text-xs text-[#5a5f73] mt-2"><strong>Effort:</strong> high ($3.91/task) → xhigh ($7.35) → max (rare)</div><div class="mt-2 text-xs bg-white border-l-3 border-[#2962ff] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Debug race condition, validate PR — Opus 5 @ high–xhigh</code></div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5 hover:border-[#2962ff] transition-colors"><div class="font-semibold text-sm">Opus 4.8 ${tagH('gray','Superseded')}</div><div class="text-xs text-[#5a5f73] mt-1">$5/$25 · Same price as Opus 5, worse everywhere (DeepSWE 59% vs 74%).</div><div class="text-xs text-[#5a5f73] mt-2">Only use if Opus 5 safety classifier blocks you.</div><div class="mt-2 text-xs bg-white border-l-3 border-[#dc2626] px-3 py-2 rounded-r"><code class="text-[#5a5f73]">Fallback only — migrate now</code></div></div>
</div></div>`;

  // OpenAI
  document.getElementById('tab-openai-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('openai','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">GPT-5.6 Family</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">GA Jul 9</span></div>
<div class="p-4 text-xs sm:text-sm text-[#5a5f73] px-5">Three tiers: Sol (flagship), Terra (balanced), Luna (fast/cheap). Shared 1.05M context, 128K max output, Feb 16, 2026 cutoff. Prices = <strong>$ per 1M tokens</strong> (in / out). <strong class="text-[#121420]">Price cut Jul 30:</strong> Luna −80%, Terra −20%.</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 pt-0">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Sol ${tagH('blue','Flagship')}</div><div class="text-xs text-[#5a5f73] mt-1">$5/$30 · AA 59 · AA Coding 80 (#1) · 6 levels + Ultra</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>Terminal-Bench 88.8% (91.9% Ultra)</li><li>DeepSWE 73% (v1.1)</li><li><span class="text-red-600">Long ctx surcharge above 272K</span></li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Terra ${tagH('green','Best value')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$12 · AA 55 · AA Coding 77.4 · 6 lvls</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>GPT-5.5-class at half price</li><li>DeepSWE 70% (v1.1, ties Fable 5 @ max)</li><li>Within 1-3 pts of Sol at 40% cost</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Luna ${tagH('orange','Cost champ')}</div><div class="text-xs text-[#5a5f73] mt-1">$0.20/$1.20 · AA 51 · 93% of Sol's coding at 4% cost</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li><span class="text-red-600">⚠️ MRCR 41.3%</span> — bad at long ctx</li><li>Fine for ≤100K tasks</li></ul></div>
</div>
<div class="px-5 py-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 rounded-b-xl"><strong>⚠️ Trap:</strong> bare <code class="bg-amber-100 px-1 rounded">gpt-5.6</code> routes to Sol ($5/$30). Pin <code class="bg-amber-100 px-1 rounded">gpt-5.6-terra</code> or <code class="bg-amber-100 px-1 rounded">gpt-5.6-luna</code>.</div></div>`;

  // Gemini
  document.getElementById('tab-gemini-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('gemini','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Gemini Lineup</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span></div><div class="px-5 text-[0.6875rem] text-[#6b7085]">Rates = <strong>$ per 1M tokens</strong> (input / output).</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">3.6 Flash ${tagH('green','Best default')}</div><div class="text-xs text-[#5a5f73] mt-1">$1.50/$7.50 · AA 50 · 1M ctx · Mar 2026 cutoff</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>Beats 3.1 Pro on every coding benchmark</li><li>2.3× faster, built-in computer use</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">3.5 Flash ${tagH('gray','Superseded')}</div><div class="text-xs text-[#5a5f73] mt-1">$1.50/$9 · Same quality as 3.6 but pricier.</div><p class="text-xs text-[#5a5f73] mt-2">Use 3.6 Flash — cheaper output.</p></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">3.1 Pro ${tagH('orange','Reasoning')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$12 ($4/$18 past 200K) · AA 46 · <span class="text-red-600">Jan 2025 cutoff</span></div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>GPQA 94.3% · HLE 44.4%</li><li>Only for PhD-level reasoning</li></ul></div>
</div></div>`;

  // Grok
  document.getElementById('tab-grok-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('grok','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Grok 4.5</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Paid</span><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-pink-50 text-pink-800">Jul 8</span></div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
<div><p class="text-sm text-[#5a5f73]">xAI flagship. $2/$6 (≤200K) · $4/$12 (>200K) · 500K ctx · AA 54 · $/MTok</p><ul class="text-xs text-[#5a5f73] mt-2 ml-4 list-disc space-y-1"><li><strong>CursorBench 3.2:</strong> 66.7% @ $1.51/task @ high</li><li>SWE-Bench Pro: 64.7% · Terminal-Bench: 83.3%</li><li>DeepSWE 54% @ $2.42/task — best score under $3</li><li>3× cheaper output than Opus 4.8</li><li><span class="text-red-600">⚠️ Hallucination rate 25% → 54%</span></li></ul></div>
<div><div class="font-semibold text-xs text-[#5a5f73] uppercase tracking-wider mb-1">Effort vs CursorBench</div><div class="space-y-1 text-xs"><div class="bg-[#f8f9fc] px-3 py-1.5 rounded flex justify-between"><span class="font-medium">Low</span><span>63.5% @ $1.22</span></div><div class="bg-[#f8f9fc] px-3 py-1.5 rounded flex justify-between"><span class="font-medium">Medium</span><span>65.4% @ $1.54</span></div><div class="bg-[#e8edff] px-3 py-1.5 rounded flex justify-between font-semibold text-[#2962ff]"><span>High ★</span><span>66.7% @ $1.51</span></div></div><p class="text-xs text-[#6b7085] mt-2">Grok matches Opus 5 score at 39% cost.</p></div>
</div></div>`;

  // Cursor
  document.getElementById('tab-cursor-inner').innerHTML = `
<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex items-center gap-2">${iconSvg('cursor','w-5 h-5')}<h2 class="text-lg sm:text-xl font-semibold">Cursor Models</h2><span class="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-bold uppercase bg-indigo-50 text-indigo-800">Cursor plan</span></div><div class="px-5 text-[0.6875rem] text-[#6b7085]">Rates = <strong>$ per 1M tokens</strong> (input / output) · task costs are per task.</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Composer 2.5 ${tagH('green','Best $/task')}</div><div class="text-xs text-[#5a5f73] mt-1">$0.50/$2.50 · 200K ctx · ~$0.44/task</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>SWE-Bench ML: 79.8% · CursorBench: 63.2%</li><li><strong>Unlimited on paid plans.</strong> Default for 80-90% of Cursor work.</li></ul></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Grok 4.5 (Cursor) ${tagH('blue','Agentic')}</div><div class="text-xs text-[#5a5f73] mt-1">$2/$6 · Joint Cursor + xAI · First-party pool</div><ul class="text-xs text-[#5a5f73] mt-1.5 ml-4 list-disc"><li>CursorBench 66.7% vs Composer's 56.1%</li><li>Best for long agent sessions, data science</li></ul></div>
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
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Kimi K3 ${tagH('purple','Best OSS')}</div><div class="text-xs text-[#5a5f73] mt-1">2.8T MoE · 1M ctx · AA 57.1 · Weights released Jul 27</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 93.5% · DeepSWE 69% (v1.1)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">DeepSeek V4 Pro ${tagH('indigo','MIT')}</div><div class="text-xs text-[#5a5f73] mt-1">1.6T MoE (49B active) · 1M ctx · $0.435/$0.87</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 90.1% · SWE-Ver 80.6%</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Gemma 4 31B ${tagH('cyan','Apache 2.0')}</div><div class="text-xs text-[#5a5f73] mt-1">31B dense · 256K ctx · ~$0.20/$0.80</div><div class="text-xs text-[#5a5f73] mt-1">LCB 80% · AIME 89.2% · GPQA 84.3%</div><div class="text-xs text-[#6b7085] mt-1">🏠 Self-host friendly (31B dense, Apache 2.0)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Qwen3.6-27B ${tagH('cyan','Apache 2.0')}</div><div class="text-xs text-[#5a5f73] mt-1">27B dense · 256K ctx · SWE-bench 77.2%</div><div class="text-xs text-[#5a5f73] mt-1">Best dense coding model for local</div><div class="text-xs text-[#6b7085] mt-1">🏠 Self-host friendly (27B dense, Apache 2.0)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">MiniMax M3 ${tagH('purple','Open')}</div><div class="text-xs text-[#5a5f73] mt-1">428B MoE (23B active) · 1M ctx · Native multimodal</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 92.9% · 12-hour autonomous sessions</div><div class="text-xs text-[#6b7085] mt-1">$0.30/$1.20 on Zen · Self-host option</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">Mistral Small 4 ${tagH('cyan','Apache 2.0')}</div><div class="text-xs text-[#5a5f73] mt-1">119B MoE (6B active) · 256K · 128 experts</div><div class="text-xs text-[#5a5f73] mt-1">Unifies instruction, reasoning, multimodal</div><div class="text-xs text-[#6b7085] mt-1">🏠 Self-host friendly (6B active, Apache 2.0)</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">MiMo v2.5 ${tagH('cyan','Multimodal')}${freeBadge(2)}</div><div class="text-xs text-[#5a5f73] mt-1">310B MoE (15B active) · 1M ctx · img+audio+video</div><div class="text-xs text-[#5a5f73] mt-1">GPQA 84.9% · Best free multimodal</div><div class="text-xs text-green-700 mt-1"><strong>🔄 Daily:</strong> ~200 req on Zen</div></div>
<div class="bg-[#f8f9fc] border border-[#eceef4] rounded-lg p-3.5"><div class="font-semibold text-sm">North Mini Code${freeBadge(2)}</div><div class="text-xs text-[#5a5f73] mt-1">Cohere 30B MoE (3B active) · 256K · Fits RTX 4090</div><div class="text-xs text-[#5a5f73] mt-1">SWE-Ver 67.6% · Best local agentic coder</div><div class="text-xs text-green-700 mt-1"><strong>🔄 Daily:</strong> ~200 req on Zen · 🏠 Self-host (3B active)</div></div>
</div></div>`;

  // Matrix
  const mx=[
    ['Classify / extract / format','Sonnet 5','low','~$0.40','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','—'],
    ['Write routine code','Sonnet 5','med','~$0.80','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Opus 5 ~$3.90'],
    ['Write critical code','Opus 5','xhigh','~$7.40','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','—'],
    ['Debug a hard bug','Opus 5','high','~$3.90','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','—'],
    ['Review / validate','Opus 5','high','~$3.90','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','—'],
    ['Multi-step agent','Opus 5','high','~$3.90','Grok 4.5 ~$1.51','GPT-5.6 Sol'],
    ['Cursor daily coding','Composer 2.5','—','~$0.44','—','Grok 4.5 (Cursor)'],
    ['Write analysis / memo','Sonnet 5','high','~$1.50','Gemini 3.6 Flash ~$0.80','Opus 5 ~$3.90'],
    ['Research / lit review','Opus 5','xhigh','~$7.40','Gemini 3.1 Pro ~$2-4','Fable 5'],
    ['Math proof / hard reasoning','Opus 5','max','~$8.20','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Fable 5'],
    ['Vision / chart reading','Opus 5','high','~$3.90','Gemini 3.6 Flash ~$0.80','—'],
    ['Computer use / GUI','Gemini 3.6 Flash','—','~$0.80','—','Opus 5'],
    ['Document OCR + analysis','Opus 5','high','~$3.90','MiMo v2.5 <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','—'],
    ['Screenshot → code','Opus 5','high','~$3.90','MiMo v2.5 <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','—'],
    ['Bulk processing','DS V4 Flash','high','<span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','North Mini <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','GPT-5.6 Luna'],
    ['Security code audit','Opus 5','high','~$3.90','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Fable 5 ~$14'],
    ['Vulnerability research / CVE','GPT-5.6 Sol','max','~$5.69','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Fable 5 ~$14'],
    ['Secure code generation','Sonnet 5','high','~$1.50','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Opus 5 ~$3.90'],
    ['Incident response / forensics','Opus 5','high','~$3.90','Grok 4.5 ~$1.51','Fable 5 ~$14'],
    ['Translation (bulk)','Sonnet 5','low-med','~$0.40-0.80','DS V4 Flash <span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Opus 5'],
    ['Local code agent','North Mini Code','—','<span class="badge-free px-1.5 py-0.5 rounded text-[0.6875rem] font-bold">Free</span>','Qwen3.6-27B (local)','Opus 5 (cloud)'],
  ];
  let mxHtml = `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">⚡ Quick Matrix</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[600px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Task</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Effort</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cost</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Cheaper alt</th><th class="hidden md:table-cell p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Better</th></tr></thead><tbody class="divide-y divide-[#eceef4]">`;
  mx.forEach(r=>{mxHtml+=`<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium">${r[0]}</td><td class="p-2.5 text-[#2962ff] font-medium">${r[1]}</td><td class="p-2.5 text-[#6b7085] font-mono">${r[2]}</td><td class="p-2.5">${r[3]}</td><td class="hidden md:table-cell p-2.5 text-[#5a5f73]">${r[4]}</td><td class="hidden md:table-cell p-2.5 text-[#5a5f73]">${r[5]}</td></tr>`;});
  mxHtml += `</tbody></table></div><div class="px-5 py-2 text-xs text-[#6b7085] border-t border-[#eceef4]">Cost = estimated $/task at listed effort, current prices (Aug 1, 2026).</div></div>`;
  // Golden rules
  mxHtml += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold">🥇 Golden Rules</h2></div><ol class="p-4 space-y-2 text-xs sm:text-sm"><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">1.</span><strong>Never let a thread validate its own work.</strong> Write with Sonnet/DeepSeek/Grok; validate with Opus 5.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">2.</span><strong>Escalate model, not effort.</strong> Sonnet @ xhigh costs more than Opus 5 @ high for worse results.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">3.</span><strong>Set effort explicitly on every call.</strong> Defaults lie. Route per-task.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">4.</span><strong>Opus 4.8 is dead.</strong> Opus 5 costs the same and is better everywhere.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">5.</span><strong>Don't overpay for Luna at long context.</strong> MRCR 41.3% past 100K.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">6.</span><strong>Free = good but not all the time.</strong> Don't rely on Big Pickle or Hy3 Free in production.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">7.</span><strong>Test on your data.</strong> Benchmarks are directional.</li><li class="flex gap-2"><span class="text-[#2962ff] font-bold shrink-0">8.</span><strong>Pin your model ID.</strong> <code class="bg-[#eceef4] px-1 rounded">gpt-5.6</code> → Sol. Use <code class="bg-[#eceef4] px-1 rounded">gpt-5.6-terra</code>.</li></ol></div>`;
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
  function blend(mk){ const x=M[mk]; return x ? x.i + x.o*3 : 999; }

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
      rh += `<div class="flex items-center gap-2"><span class="inline-flex items-center justify-center w-6 h-6 rounded-full ${i===0?'bg-[#2962ff] text-white':'bg-[#e2e5ec] text-[#5a5f73]'} text-xs font-bold">${i+1}</span><span class="font-semibold text-sm ${pColor}">${m.n}</span>${freeBadge(m.fr)}<span class="ml-auto text-xs text-[#6b7085]">AA ${m.aa}</span></div>`;
      rh += `<div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#5a5f73]"><span>💰 <strong>$${m.i}</strong> / MTok in</span><span>💰 <strong>$${m.o}</strong> / MTok out</span><span>📊 <strong>$${blend(r.mk).toFixed(1)}</strong> blended $/MTok (in + 3× out)</span><span>🎯 ${m.b}</span></div>`;
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
  {id:'claude-opus-5',     n:'Opus 5',           p:'Anthropic', e:'max',    s:74, ci:'±4%', c:11.84, t:118, st:99},
  {id:'gpt-5.6-sol',       n:'GPT-5.6 Sol',      p:'OpenAI',    e:'max',    s:73, ci:'±3%', c:8.39,  t:60,  st:61},
  {id:'claude-fable-5',    n:'Fable 5',          p:'Anthropic', e:'max',    s:70, ci:'±4%', c:21.63, t:119, st:88},
  {id:'gpt-5.6-terra',     n:'GPT-5.6 Terra',    p:'OpenAI',    e:'max',    s:70, ci:'±3%', c:3.96,  t:72,  st:76},
  {id:'kimi-k3',           n:'Kimi K3',          p:'Moonshot',  e:'max',    s:69, ci:'±5%', c:4.65,  t:81,  st:98},
  {id:'gpt-5.6-luna',      n:'GPT-5.6 Luna',     p:'OpenAI',    e:'max',    s:67, ci:'±4%', c:0.61,  t:73,  st:102},
  {id:'gpt-5.5',           n:'GPT-5.5',          p:'OpenAI',    e:'xhigh',  s:67, ci:'±6%', c:7.23,  t:46,  st:82},
  {id:'claude-opus-4.8',   n:'Opus 4.8',         p:'Anthropic', e:'max',    s:59, ci:'±2%', c:13.22, t:135, st:120},
  {id:'claude-sonnet-5',   n:'Sonnet 5',         p:'Anthropic', e:'max',    s:54, ci:'±4%', c:26.40, t:214, st:268},
  {id:'grok-4.5',          n:'Grok 4.5',         p:'xAI',       e:'high',   s:54, ci:'±2%', c:2.42,  t:36,  st:61},
  {id:'muse-spark-1.1',    n:'Muse Spark 1.1',   p:'Meta',      e:'xhigh',  s:53, ci:'±3%', c:2.36,  t:74,  st:96},
  {id:'gpt-5.4',           n:'GPT-5.4',          p:'OpenAI',    e:'xhigh',  s:52, ci:'±2%', c:5.65,  t:71,  st:70},
  {id:'gemini-3.6-flash',  n:'Gemini 3.6 Flash', p:'Google',    e:'high',   s:49, ci:'±5%', c:3.53,  t:97,  st:108},
  {id:'glm-5.2',           n:'GLM-5.2',          p:'ZAI',       e:'max',    s:44, ci:'±2%', c:3.92,  t:78,  st:129},
  {id:'gemini-3.5-flash',  n:'Gemini 3.5 Flash', p:'Google',    e:'medium', s:37, ci:'±2%', c:7.34,  t:276, st:86},
  {id:'kimi-k2.7-code',    n:'Kimi K2.7 Code',   p:'Moonshot',  e:'—',      s:31, ci:'±1%', c:2.82,  t:59,  st:149},
  {id:'claude-sonnet-4.6', n:'Sonnet 4.6',       p:'Anthropic', e:'high',   s:30, ci:'±4%', c:5.52,  t:76,  st:134},
  {id:'gemini-3.1-pro',    n:'Gemini 3.1 Pro',   p:'Google',    e:'high',   s:12, ci:'±2%', c:9.48,  t:196, st:81},
];
const DSW_PC = {Anthropic:'#c2410c', OpenAI:'#0d9488', xAI:'#18181b', Google:'#2563eb', Moonshot:'#7c3aed', ZAI:'#6366f1', Meta:'#0891b2'};
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
  ['🏆','Top score','Opus 5 @ max','74% · $11.84/task · 118k out'],
  ['💎','Value frontier','Luna → Terra → Sol → Opus 5','Best score at every price point'],
  ['⚡','Cheapest ≥ 60%','GPT-5.6 Luna','67% for $0.61/task'],
  ['⚠️','Worst deal','Sonnet 5 @ max','54% for $26.40 · 268 steps'],
].map(s=>`<div class="bg-white border border-[#e2e5ec] rounded-xl p-4 shadow-sm"><div class="text-lg mb-1">${s[0]}</div><div class="text-[0.6875rem] uppercase tracking-wider font-semibold text-[#6b7085]">${s[1]}</div><div class="text-sm sm:text-base font-bold mt-0.5">${s[2]}</div><div class="text-xs text-[#5a5f73] mt-0.5">${s[3]}</div></div>`).join('')}
</div>`;

  h += `<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm mt-4">
<div class="px-5 py-3.5 border-b border-[#eceef4] flex flex-wrap items-center gap-2">
  <h2 class="text-lg sm:text-xl font-semibold tracking-tight">🎯 DeepSWE Value Chart</h2>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6875rem] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">v1.1 · Jul 25, 2026</span>
  <span class="text-xs text-[#6b7085]">113 tasks · 18 models · each at its best effort</span>
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
  DSW.forEach(m=>{
    const x=px(m.c), y=py(m.st), r=rad(m), o=dim(m.p)?0.12:1;
    svg += `<g class="dsw-bub" data-id="${m.id}" opacity="${o}">`;
    svg += `<circle class="dsw-fill" cx="${x}" cy="${y}" r="${r}" fill="${dswColor(m.s)}" fill-opacity=".85" stroke="${DSW_PC[m.p]}" stroke-width="2"/>`;
    if(DSW_FRONTIER.has(m.id)) svg += `<circle cx="${x}" cy="${y}" r="${r+3}" fill="none" stroke="#2962ff" stroke-width="1.2" stroke-dasharray="3 3"/>`;
    if(r>13) svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="9.5" font-weight="700" fill="#fff" pointer-events="none">${m.s}</text>`;
    const left = x > DL+iw*0.62, above = y > DT+ih*0.52 && x < DL+iw*0.55;
    const lx = above ? x : left ? x-r-6 : x+r+6;
    const anchor = above ? 'middle' : left ? 'end' : 'start';
    const ly = above ? y-r-5 : y+2;
    svg += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="11.5" font-weight="600" fill="#3c4152" stroke="#fff" stroke-width="3" paint-order="stroke" pointer-events="none">${DSW_FRONTIER.has(m.id)?'⭐ ':''}${m.n}</text>`;
    svg += `<text x="${lx}" y="${ly+12}" text-anchor="${anchor}" font-size="9" fill="#9aa0b0" stroke="#fff" stroke-width="2.5" paint-order="stroke" pointer-events="none">${m.e} · $${m.c.toFixed(2)} · ${m.t}k tok · ${m.st} steps</text>`;
    svg += `</g>`;
  });
  svg += '</svg>';
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
      <li>💎 <strong>Stay on the value frontier:</strong> Luna → Terra → Sol → Opus 5. Every off-frontier config has a cheaper pick that scores equal or higher — e.g. Sonnet 5 @ max costs $26.40 for 54% while Luna gets 67% for $0.61.</li>
      <li>⚡ <strong>Value ladder:</strong> Luna (67%, $0.61) → Terra (70%, $3.96) → Sol (73%, $8.39) → Opus 5 (74%, $11.84). Pick the leftmost rung that meets your quality bar.</li>
      <li>⚠️ <strong>Watch the trap configs:</strong> Sonnet 5 @ max (268 steps — most on the board) and Opus 4.8 @ max (dominated by Sol at a lower price).</li>
      <li>🔎 <strong>Cheap ≠ slow:</strong> Sol finishes in 61 steps (tied fewest) — top-tier quality without step bloat.</li>
      <li>📉 Confidence intervals (±) are tight at the top (67–74%); when scores tie, let cost decide.</li>
    </ul>
  </div>
</div>
<div class="px-5 py-3 bg-[#f8f9fc] border-t border-[#eceef4] text-xs text-[#6b7085]">Data: <a class="text-[#2962ff] hover:underline" href="https://deepswe.datacurve.ai" target="_blank" rel="noopener noreferrer">deepswe.datacurve.ai</a> v1.1 · 113 tasks · updated Jul 25, 2026. Each model shown at its best-scoring effort config (leaderboard "Best" view); all models ran on <a class="text-[#2962ff] hover:underline" href="https://github.com/SWE-agent/mini-swe-agent" target="_blank" rel="noopener noreferrer">mini-swe-agent</a>. Note: costs were measured Jul 25 at then-current prices — OpenAI cut Luna −80% / Terra −20% on Jul 30, so both are cheaper in real-world use today.</div>
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
    document.querySelectorAll('.dsw-bub').forEach(g=> g.classList.toggle('dsw-hov', hit && g.dataset.id===best.id));
    if(hit){ if(hoverId!==best.id){ hoverId=best.id; showTip(best, ev.clientX, ev.clientY); } else { const r2 = wrap.getBoundingClientRect(); tip.style.left=(ev.clientX-r2.left+14)+'px'; tip.style.top=(ev.clientY-r2.top-10)+'px'; } }
    else { hoverId=null; tip.classList.add('hidden'); }
  });
  svgEl.addEventListener('mouseleave', ()=>{ hoverId=null; tip.classList.add('hidden'); document.querySelectorAll('.dsw-bub').forEach(g=>g.classList.remove('dsw-hov')); });
  document.querySelectorAll('.dsw-chip').forEach(b=> b.addEventListener('click', ()=>{ dswProv = b.dataset.prov || null; renderDeepSWE(); }));
}
renderDeepSWE();

// ─── Price Changes History (verified Aug 1, 2026) ───
function renderPriceHistory(){
  const NEW = '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.625rem] font-bold uppercase bg-pink-50 text-pink-800 ml-1.5">New</span>';
  const tl = [
    {d:'Jul 31, 2026', p:'DeepSeek', c:'blue', t:'🔵 V4 Flash 0731 public beta', b:'Price unchanged <strong>$0.14/$0.28</strong> — but DeepSWE jumped <strong>7.3% → 54.4%</strong> (7×). V4 Pro confirmed at <strong>$0.435/$0.87</strong>. Legacy <code class="bg-[#eceef4] px-1 rounded">deepseek-chat</code> / <code class="bg-[#eceef4] px-1 rounded">deepseek-reasoner</code> aliases retired. Future <strong>2× peak-hour pricing</strong> announced (Beijing 09:00–12:00 &amp; 14:00–18:00), effective date TBA.', n:1},
    {d:'Jul 30, 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-5.6 price cuts', b:'<strong>Luna −80%:</strong> $1/$6 → <strong>$0.20/$1.20</strong> · <strong>Terra −20%:</strong> $2.50/$15 → <strong>$2/$12</strong> · Sol unchanged at $5/$30. Priority Processing renamed <strong>Fast mode</strong> (2× price, 2.5× speed). Both cuts apply retroactively to usage from Jul 30.', n:1},
    {d:'Jul 24, 2026', p:'Anthropic', c:'violet', t:'🟣 Opus 5 launch', b:'<strong>$5/$25</strong> — same price as Opus 4.8, massively better. <strong>Opus 4.8 is now superseded</strong> (keep only if Opus 5\'s safety classifier blocks a request).'},
    {d:'Jul 21, 2026', p:'Google', c:'blue', t:'🔵 Gemini 3.6 Flash launch', b:'<strong>$1.50/$7.50</strong>. Output −17% vs 3.5 Flash ($9.00) plus ~17% fewer output tokens → <strong>~31% lower real-world bill</strong>. 3.5 Flash superseded.'},
    {d:'Jul 9, 2026', p:'OpenAI', c:'emerald', t:'🟢 GPT-5.6 GA', b:'Sol <strong>$5/$30</strong> · Terra <strong>$2.50/$15</strong> · Luna <strong>$1/$6</strong> (pre-cut rates).'},
    {d:'Jul 8, 2026', p:'xAI', c:'gray', t:'⚫ Grok 4.5 launch', b:'<strong>$2/$6</strong>, 500K ctx, cached input $0.50/M. Best agentic $/task at launch ($1.51/task @ high).'},
    {d:'Jun 30, 2026', p:'Anthropic', c:'violet', t:'🟣 Sonnet 5 launch', b:'<strong>$2/$10 intro</strong> (thru Aug 31) → <strong>$3/$15</strong>. New tokenizer adds ~30% tokens (code/JSON heaviest) — up to ~95% more per equivalent text at standard pricing.'},
    {d:'May 28, 2026', p:'Anthropic', c:'violet', t:'🟣 Opus 4.8 launch', b:'<strong>$5/$25</strong>. Superseded by Opus 5 at the same price.'},
    {d:'Apr 24, 2026', p:'DeepSeek', c:'blue', t:'🔵 V4 Flash &amp; V4 Pro launch', b:'<strong>$0.14/$0.28</strong> and <strong>$0.435/$0.87</strong>, 1M ctx, MIT.'},
  ];
  const snap = [
    ['Opus 5','$5','$25','Jul 24 · #1 overall'],
    ['Fable 5','$10','$50',''],
    ['Sonnet 5','$2','$10','intro → $3/$15 Sep 1'],
    ['Opus 4.8','$5','$25','superseded'],
    ['GPT-5.6 Sol','$5','$30','Fast mode 2×'],
    ['GPT-5.6 Terra','$2','$12','cut Jul 30'],
    ['GPT-5.6 Luna','$0.20','$1.20','cut Jul 30'],
    ['GPT-5.5','$5','$30',''],
    ['GPT-5.4','$2.50','$15',''],
    ['Grok 4.5','$2','$6','cached in $0.50'],
    ['Gemini 3.6 Flash','$1.50','$7.50','Jul 21'],
    ['Gemini 3.5 Flash','$1.50','$9','superseded'],
    ['Gemini 3.1 Pro','$2','$12','$4/$18 &gt;200K'],
    ['DeepSeek V4 Flash','$0.14','$0.28',''],
    ['DeepSeek V4 Pro','$0.435','$0.87','corrected Aug 1'],
    ['Kimi K3','$3','$15',''],
    ['GLM-5.2','$1.34','$4',''],
    ['MiniMax M3','$0.30','$1.20','corrected Aug 1'],
    ['Muse Spark 1.1 (Meta)','$1.25','$4.25',''],
  ];
  const dot = {emerald:'bg-emerald-500',blue:'bg-blue-500',violet:'bg-violet-500',gray:'bg-gray-400'};
  let h = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4"><div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">📜 Price Changes History</h2></div><div class="px-5 py-3.5 border-b border-[#eceef4] bg-[#f8f9fc]"><p class="text-xs text-[#5a5f73] leading-relaxed"><strong class="text-[#121420]">What this is:</strong> a change log of every price move that affects the models in this guide — launches, cuts, and supersessions, newest first — so you can see why recommendations shifted and what the current rates are.</p><ul class="text-xs text-[#5a5f73] mt-2 space-y-1"><li>🕐 <strong>Timeline</strong> — launches and price changes, newest first. Items marked <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[0.625rem] font-bold uppercase bg-pink-50 text-pink-800">New</span> landed since the guide\'s Jul 28 verification.</li><li>🧾 <strong>Snapshot</strong> — today\'s list prices ($/MTok) for every model, with a note on what changed and when.</li><li>⏰ <strong>Watchlist</strong> — upcoming changes that will re-shape the recommendation (Sonnet 5 intro pricing ends Aug 31; DeepSeek peak-hour pricing).</li></ul><p class="text-xs text-[#6b7085] mt-2">All prices verified <strong>Aug 1, 2026</strong>. DeepSWE chart costs were measured Jul 25 at pre-cut prices — Luna/Terra are cheaper in real use today.</p></div><div class="p-5">';
  tl.forEach(r=>{
    h += `<div class="relative pl-9 pb-5 last:pb-0"><span class="absolute left-0 top-1 h-2.5 w-2.5 rounded-full ${dot[r.c]} ring-4 ring-white"></span><span class="absolute left-[5px] top-5 bottom-0 w-px bg-[#eceef4] last:hidden"></span><div class="text-[0.6875rem] font-bold uppercase tracking-wider text-[#6b7085]">${r.d} · ${r.p}${r.n?NEW:''}</div><div class="font-semibold text-sm mt-0.5">${r.t}</div><div class="text-xs text-[#5a5f73] mt-0.5 leading-relaxed">${r.b}</div></div>`;
  });
  h += '</div></div>';
  h += '<div class="space-y-4"><div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">🧾 Current Price Snapshot</h2></div><div class="table-scroll p-1"><table class="w-full text-xs sm:text-sm min-w-[480px]"><thead><tr class="bg-[#f8f9fc]"><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Model</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Input/MTok</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Output/MTok</th><th class="p-2.5 text-left font-semibold text-xs uppercase tracking-wider text-[#6b7085] border-b-2 border-[#e2e5ec]">Note</th></tr></thead><tbody class="divide-y divide-[#eceef4]">';
  snap.forEach(r=>{
    h += `<tr class="hover:bg-[#f8f9fc]"><td class="p-2.5 font-medium">${r[0]}</td><td class="p-2.5 font-mono">${r[1]}</td><td class="p-2.5 font-mono">${r[2]}</td><td class="p-2.5 text-[#6b7085]">${r[3]}</td></tr>`;
  });
  h += '</tbody></table></div></div>';
  h += '<div class="bg-white border border-[#e2e5ec] rounded-xl shadow-sm"><div class="px-5 py-3.5 border-b border-[#eceef4]"><h2 class="text-lg sm:text-xl font-semibold tracking-tight">⏰ Watchlist &amp; Gotchas</h2></div><ul class="p-4 space-y-2 text-xs sm:text-sm text-[#5a5f73]"><li>🔔 <strong>Aug 31:</strong> Sonnet 5 intro pricing ends → <strong>$3/$15</strong> (+50%). With the new tokenizer (~+30% tokens), a fixed task costs up to ~95% more in standard pricing. Set a reminder to re-route.</li><li>🔔 <strong>TBA:</strong> DeepSeek 2× peak-hour pricing (Beijing 09:00–12:00 &amp; 14:00–18:00). Off-peak stays $0.14/$0.28.</li><li>⚡ <strong>Fast mode</strong> replaces Priority Processing on GPT-5.6 — 2× price for 2.5× speed. Same model ID, explicit flag.</li><li>📍 <strong>Pin your IDs:</strong> bare <code class="bg-[#eceef4] px-1 rounded">gpt-5.6</code> routes to Sol ($5/$30). Use <code class="bg-[#eceef4] px-1 rounded">gpt-5.6-terra</code> / <code class="bg-[#eceef4] px-1 rounded">gpt-5.6-luna</code>.</li><li>🔧 <strong>Corrections applied Aug 1:</strong> DeepSeek V4 Pro <s>$0.50/$1.50</s> → $0.435/$0.87 · MiniMax M3 <s>$0.50/$2.00</s> → $0.30/$1.20 (matches vendor rate cards). DeepSWE chart costs were measured Jul 25 at pre-cut prices — Luna/Terra are cheaper in real use today.</li></ul></div>';
  h += '</div></div>';
  document.getElementById('tab-price-inner').innerHTML = h;
}
renderPriceHistory();

// ─── References ───
function renderReferences(){
  const V = '2026-08-01';
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
