// ═══════════════════════════════════════════════════════════════════
// MODEL GUIDE — APP (plain JS, no framework)
// Reads window.MG (data.js) and renders five pages by URL hash:
//   #recommend  #explore[/model]  #value[/model]  #insights  #changes
// ═══════════════════════════════════════════════════════════════════
(function () {
  'use strict';
  const D = window.MG;
  const M = D.models;
  const app = document.getElementById('app');

  // ── Helpers ──────────────────────────────────────────────────────
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const past = (d) => !!d && new Date() >= new Date(d + 'T00:00:00');
  const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const store = {
    get(k, def) { try { const v = localStorage.getItem('mg-' + k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem('mg-' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };
  // After a scheduled price change, the post-change description/note applies.
  Object.values(M).forEach((m) => { if (past(m.priceChangeDate)) { if (m.bAfter) m.b = m.bAfter; if (m.snAfter !== undefined) m.sn = m.snAfter; } });

  function effPrice(k) {
    const m = M[k]; if (!m) return { i: 0, o: 0 };
    return past(m.priceChangeDate) ? { i: m.iAfter ?? m.i, o: m.oAfter ?? m.o } : { i: m.i, o: m.o };
  }
  const usd = (v) => (v === 0 ? '$0' : '$' + (v < 1 ? v.toFixed(3).replace(/0$/, '') : (Number.isInteger(v) ? v : v.toFixed(2))));
  function priceTxt(k) {
    const m = M[k];
    if (m.i === 0 && m.o === 0) return 'Free';
    if (m.priceChangeDate && !past(m.priceChangeDate)) return `${usd(m.i)} / ${usd(m.o)} → ${usd(m.iAfter)} / ${usd(m.oAfter)}`;
    const p = effPrice(k); return `${usd(p.i)} / ${usd(p.o)}`;
  }
  const perTask = (v) => (v == null ? '—' : v === 0 ? 'Free' : '$' + v.toFixed(2));
  const big = (c) => (c === 0 ? 'Free' : c >= 1000 ? '$' + (c / 1000).toFixed(c >= 10000 ? 0 : 1) + 'k' : '$' + c.toFixed(c < 10 ? 2 : 0));
  const parseCost = (c) => { const m = /\$([0-9.]+)/.exec(c || ''); return m ? parseFloat(m[1]) : null; };
  const normE = (e) => ({ med: 'medium', 'non-think': 'non-think', 'low-med': 'low' }[e] || e || '');
  const PC = { OpenAI: 'openai', Anthropic: 'anthropic', Google: 'google', Moonshot: 'moonshot', DeepSeek: 'deepseek', 'Z.ai': 'zai', xAI: 'xai', Xiaomi: 'xiaomi', Meta: 'meta', Alibaba: 'alibaba' };
  const pcVar = (p) => `var(--c-${PC[p] || 'other'})`;
  const badge = (k, size) => `<span class="mono-badge ${size || ''}" style="--pc:${pcVar(M[k].p)};--bc:var(--b-${PC[M[k].p] || 'other'})" aria-hidden="true">${esc(M[k].mono)}</span>`;
  const stripEmoji = (s) => String(s).replace(/^[^\p{L}\p{N}$]+\s*/u, '');
  const I = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    warn: '<path d="M12 8v5M12 16.5v.5M10.3 3.9L2.6 17.5A2 2 0 004.3 20.5h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>',
    bulb: '<path d="M12 3a6 6 0 00-3.5 10.9V17h7v-3.1A6 6 0 0012 3zM9.5 20.5h5"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2.5h6"/>',
    trend: '<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    sigma: '<path d="M18 5H6l6 7-6 7h12"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    rss: '<path d="M5 19a1 1 0 100-2 1 1 0 000 2zM4 11a9 9 0 019 9M4 4a16 16 0 0116 16"/>',
    print: '<path d="M7 9V3h10v6M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 14h10v7H7z"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  };
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } ta.remove(); return ok;
    }
  }
  function downloadFile(name, text, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }
  const csvCell = (v) => { const t = String(v ?? ''); return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
  // Long-prompt tier: price per 1M once a prompt is over `over` tokens
  // ── Price history (step chart of $ per 1M; dashed = scheduled) ──
  const TODAY = new Date().toISOString().slice(0, 10);
  function histChart(k, w = 280, h = 140) {
    const H = (D.history || {})[k]; if (!H || !H.length) return '';
    const pts = H.map(([d, i, o, note]) => ({ d: d.replace('~', ''), approx: d.startsWith('~'), i, o, note }));
    const day = (d) => new Date(d + 'T00:00:00').getTime();
    const end = pts[pts.length - 1].d > TODAY ? pts[pts.length - 1].d : TODAY;
    const t0 = day(pts[0].d) - 20 * 864e5, t1 = day(end) + 25 * 864e5;
    const L = 38, R = 10, T = 16, B = 22, iw = w - L - R, ih = h - T - B;
    const x = (d) => L + (day(d) - t0) / (t1 - t0) * iw;
    const top = Math.max(...pts.map((q) => q.o)) * 1.22;
    const y = (v) => T + ih - (v / top) * ih;
    const xT = x(TODAY), xEnd = L + iw;
    const seg = (key, cls) => {
      let out = '';
      pts.forEach((q, n) => {
        const a = x(q.d), b = n + 1 < pts.length ? x(pts[n + 1].d) : xEnd, yy = y(q[key]);
        if (a < xT) out += `<line class="${cls}" x1="${a}" x2="${Math.min(b, xT)}" y1="${yy}" y2="${yy}"/>`;
        if (b > xT) out += `<line class="${cls} future" x1="${Math.max(a, xT)}" x2="${b}" y1="${yy}" y2="${yy}"/>`;
        if (n + 1 < pts.length) out += `<line class="${cls}${pts[n + 1].d > TODAY ? ' future' : ''}" x1="${b}" x2="${b}" y1="${yy}" y2="${y(pts[n + 1][key])}"/>`;
      });
      return out;
    };
    const fmtM = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const label = `Price history for ${M[k].n}: ` + pts.map((q) => `${q.approx ? 'about ' : ''}${fmtDate(q.d)} ${q.note}, ${usd(q.i)} in / ${usd(q.o)} out`).join('; ');
    return `<figure class="hist">
      <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
        <line class="hist-axis" x1="${L}" x2="${xEnd}" y1="${y(0)}" y2="${y(0)}"/>
        <text class="hist-tick" x="${L - 6}" y="${y(0) + 4}" text-anchor="end">$0</text>
        <text class="hist-tick" x="${L - 6}" y="${y(top / 1.22) + 4}" text-anchor="end">${usd(Math.round(top / 1.22 * 100) / 100)}</text>
        ${xT > L && xT < xEnd ? `<line class="hist-today" x1="${xT}" x2="${xT}" y1="${T - 6}" y2="${y(0)}"/><text class="hist-tick" x="${xT}" y="${T - 8}" text-anchor="middle">today</text>` : ''}
        ${seg('i', 'hist-in')}${seg('o', 'hist-out')}
        ${pts.map((q) => `<circle class="hist-dot${q.d > TODAY ? ' future' : ''}" cx="${x(q.d)}" cy="${y(q.o)}" r="3.5"><title>${esc((q.approx ? '~' : '') + fmtDate(q.d) + ' · ' + q.note + ' · ' + usd(q.i) + ' / ' + usd(q.o))}</title></circle>
          <text class="hist-val" x="${x(q.d)}" y="${y(q.o) - 8}" text-anchor="middle">${usd(q.o)}</text>`).join('')}
        <text class="hist-tick" x="${L}" y="${h - 6}">${fmtM(pts[0].d)}</text><text class="hist-tick" x="${xEnd}" y="${h - 6}" text-anchor="end">${fmtM(end)}</text>
      </svg>
      <figcaption class="hist-key"><span><i class="k-out"></i>Output</span><span><i class="k-in"></i>Input</span><span><i class="k-fut"></i>Scheduled</span></figcaption>
      <ol class="hist-list">${pts.map((q) => `<li class="${q.d > TODAY ? 'future' : ''}"><span class="mono">${q.approx ? '~' : ''}${esc(fmtM(q.d))}</span><span>${esc(q.note)}</span><span class="mono">${usd(q.i)} / ${usd(q.o)}</span></li>`).join('')}</ol>
    </figure>`;
  }

  // ── New since your last visit: compare each timeline item's `added` date with the data version last seen ──
  let prevSeen = null;
  try { prevSeen = sessionStorage.getItem('mg-prevSeen'); } catch (e) { /* ignore */ }
  if (prevSeen === null) { prevSeen = store.get('seen', '') || ''; try { sessionStorage.setItem('mg-prevSeen', prevSeen); } catch (e) { /* ignore */ } }
  // Mark as seen: the newest of the manual check date and any entry added later (e.g. by the weekly bot)
  store.set('seen', D.timeline.reduce((mx, t) => (t.added > mx ? t.added : mx), D.checked));
  const isFresh = (t) => !!prevSeen && t.added > prevSeen;
  const FRESH = D.timeline.filter(isFresh);

  function priceAt(k, inTok) { const m = M[k], p = effPrice(k); return m.long && inTok > m.long.over ? { i: m.long.i, o: m.long.o, long: true } : { ...p, long: false }; }
  const icon = (n, cls) => `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg>`;
  const segBtns = (items, cur, attr) => items.map(([v, label]) => `<button type="button" data-${attr}="${esc(v)}" aria-pressed="${String(v) === String(cur)}">${esc(label)}</button>`).join('');
  const ROLE = { pr: 'Recommended' };

  // All tasks flattened
  const TASKS = [];
  D.groups.forEach((g, gi) => g.tasks.forEach((t) => TASKS.push({ ...t, id: t.t.replace(/[^a-z0-9]+/gi, '-').toLowerCase(), group: gi })));
  const current = (k) => M[k] && !M[k].legacy;

  // ── Recommend ────────────────────────────────────────────────────
  const R = Object.assign({ task: TASKS[0].id, mode: 'balanced', vol: 100 }, store.get('rec', {}));
  if (!TASKS.find((t) => t.id === R.task)) R.task = TASKS[0].id;

  function taskOptions(task) {
    const list = [{ m: task.pr.m, e: task.pr.e, c: task.pr.c, role: 'Recommended', primary: true }].concat(task.alts.map((a) => ({ m: a.m, e: a.e, c: a.c, role: a.l })));
    return list.filter((o) => M[o.m]).map((o, i) => {
      let cost = parseCost(o.c); if (M[o.m].fr === 2 && !o.primary) cost = cost ?? 0;
      return { ...o, i, cost: cost ?? 0, aa: M[o.m].aa };
    });
  }
  function pickIndex(opts, mode) {
    if (mode === 'cheap') return opts.reduce((b, o, i) => (o.cost < opts[b].cost ? i : b), 0);
    if (mode === 'quality') return opts.reduce((b, o, i) => ((o.aa ?? -1) > (opts[b].aa ?? -1) ? i : b), 0);
    return 0;
  }
  function confidence(k) {
    const m = M[k];
    let s = 40 + (m.srcs || 1) * 12 + (m.official ? 12 : 0) + (m.dsw ? 12 : 0);
    if (m.legacy) s -= 15;
    return Math.max(20, Math.min(98, s));
  }
  function flagsFor(k, opt) {
    const m = M[k], out = [];
    out.push(m.official ? { ok: true, t: 'Price read from the vendor’s own page' } : { ok: false, t: `Price from ${m.srcs || 1} independent source${(m.srcs || 1) > 1 ? 's' : ''} (vendor page not read)` });
    if (m.priceChangeDate && !past(m.priceChangeDate)) out.push({ ok: false, t: `Price changes on ${fmtDate(m.priceChangeDate)}: ${usd(m.iAfter)} / ${usd(m.oAfter)}` });
    if (m.aa == null) out.push({ ok: false, t: 'Not on the current AA index — quality not ranked' });
    if (m.legacy) out.push({ ok: false, t: 'Legacy model — a newer one costs the same or less' });
    if (/DeepSWE/.test(opt.c || '')) out.push({ ok: true, t: 'Cost per task measured on DeepSWE (coding benchmark)' });
    (m.notes || []).forEach((n) => out.push({ ok: /DeepSWE #|zero data/.test(n), t: n }));
    return out.slice(0, 5);
  }

  function viewRecommend(taskArg, modeArg) {
    if (taskArg && TASKS.find((t) => t.id === taskArg)) R.task = taskArg;
    if (['balanced', 'cheap', 'quality'].includes(modeArg)) R.mode = modeArg;
    const want = '#recommend/' + R.task + '/' + R.mode;
    if (location.hash !== want) history.replaceState(null, '', want);
    const task = TASKS.find((t) => t.id === R.task);
    const g = D.groups[task.group];
    const opts = taskOptions(task);
    const pi = pickIndex(opts, R.mode);
    const p = opts[pi], m = M[p.m];
    const cheaper = opts.filter((o) => o.cost < p.cost).length;
    const why = [];
    if (R.mode === 'balanced') why.push(m.b);
    if (R.mode === 'cheap') why.push('Lowest cost per task among the options for this task');
    if (R.mode === 'quality') why.push('Highest AA score among the options for this task');
    why.push(m.aa == null ? `Not on the AA index · ${perTask(p.cost)} per task` : `AA ${m.aa} (best setting) · ${perTask(p.cost)} per task at ${normE(p.e) || 'its only setting'}`);
    why.push(cheaper === 0 ? 'Nothing cheaper is on the shortlist' : `${cheaper} cheaper option${cheaper > 1 ? 's' : ''} below if quality can drop`);

    // Effort ladder (3D bars)
    const lad = m.ladder || [];
    const pe = normE(p.e);
    let ladderHtml = '<p class="muted" style="margin-top:18px">This model has a single setting — no effort ladder to tune.</p>';
    if (lad.length > 1) {
      let best = null;
      for (let i = 1; i < lad.length; i++) {
        const dA = lad[i][1] - lad[i - 1][1], dC = lad[i][2] - lad[i - 1][2];
        if (dA > 0 && dC > 0 && (!best || dA / dC > best.r)) best = { r: dA / dC, a: lad[i - 1], b: lad[i] };
      }
      const chosen = lad.find((l) => l[0] === pe), top = lad[lad.length - 1];
      let tip = best ? `Best step: ${best.a[0]} → ${best.b[0]} adds +${best.b[1] - best.a[1]} AA for +$${(best.b[2] - best.a[2]).toFixed(2)}.` : '';
      if (chosen && top !== chosen) tip += ` Going from ${chosen[0]} to ${top[0]} costs ${(top[2] / chosen[2]).toFixed(1)}× for ${top[1] >= chosen[1] ? '+' : ''}${top[1] - chosen[1]} AA.`;
      ladderHtml = `<div class="ladder" role="img" aria-label="${esc(lad.map((l) => `${l[0]}: AA ${l[1]}, $${l[2].toFixed(2)}`).join('; '))}">${lad.map((l) => `
        <div class="lstep ${l[0] === pe ? 'on' : ''}"><span class="v">${l[1]}</span><div class="bar3d" style="height:${Math.round(l[1] * 2.6)}px"><i class="f"></i><i class="s"></i><i class="t"></i></div><span class="mono small">$${l[2].toFixed(2)}</span><span class="small muted">${esc(l[0])}</span></div>`).join('')}</div>
        <p class="insight">${icon('bulb')}${esc(tip)}</p>`;
    }

    // Monthly cost
    const rows = [p].concat(opts.filter((o, i) => i !== pi));
    const mmax = Math.max(...rows.map((r) => r.cost * R.vol * 30), 0.01);
    const cheapest = rows.reduce((b, r) => (r.cost < b.cost ? r : b), rows[0]);
    const saving = cheapest === p ? `${esc(m.n)} is already the cheapest option here.` : `Switching to ${esc(M[cheapest.m].n)} saves ${big((p.cost - cheapest.cost) * R.vol * 30)} a month — check its score first (AA ${M[cheapest.m].aa ?? '—'} vs ${m.aa ?? '—'}).`;

    const conf = confidence(p.m);
    const flags = flagsFor(p.m, p);
    const watch = D.watch.filter((w) => !past(w.until));
    const changed = (FRESH.length ? FRESH : D.timeline.filter((t) => t.n)).slice(0, 4);
    const board = Object.keys(M).filter((k) => current(k) && M[k].aa != null && M[k].aaCost).sort((a, b) => M[b].aa - M[a].aa).slice(0, 8);
    const valRank = [...board].sort((a, b) => M[b].aa / M[b].aaCost - M[a].aa / M[a].aaCost);

    app.innerHTML = `
    <div class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Recommend</p>
        <h1 class="h1">Which model should I use?</h1>
        <p class="lede">Pick a task and what matters most. The pick weighs score, cost per task, effort and upcoming price changes — from Artificial Analysis, DeepSWE and vendor price pages.</p>
        <div class="seg" role="group" aria-label="Optimize for" style="margin-top:22px">${segBtns([['balanced', 'Balanced'], ['cheap', 'Cheapest'], ['quality', 'Best quality']], R.mode, 'mode')}</div>
      </div>
      <div class="tiers" aria-hidden="true">
        <div class="tiers-plane">
          <div class="slab s1">Budget · Haiku 5.5 · GPT-6 Luna</div>
          <div class="slab s2">Value · GPT-6.1 Sol · Terra</div>
          <div class="slab s3"><span class="small">Frontier</span><b>Gemini 4 Carbon · Opus 5.5 · Astra</b></div>
          <div class="tick-cube">${icon('check')}</div>
        </div>
      </div>
    </div>

    <div class="chips group-tabs" role="group" aria-label="Task group">${D.groups.map((gr, i) => `<button type="button" class="chip ghost" data-group="${i}" aria-pressed="${i === task.group}">${icon(gr.icon)}${esc(gr.name)}</button>`).join('')}</div>
    <div class="chips task-chips" role="group" aria-label="Task">${g.tasks.map((t) => { const id = t.t.replace(/[^a-z0-9]+/gi, '-').toLowerCase(); return `<button type="button" class="chip" data-task="${id}" aria-pressed="${id === task.id}">${esc(t.t)}</button>`; }).join('')}</div>

    <div class="grid" style="margin-top:24px">
      <section class="card lift span-2" aria-label="Recommendation" aria-live="polite">
        <div class="pick-head">
          <div class="pick-id">${badge(p.m, 'lg')}
            <div><p class="small muted">${R.mode === 'balanced' ? 'Recommended' : R.mode === 'cheap' ? 'Cheapest' : 'Best quality'} for <strong style="color:var(--ink);font-weight:500">${esc(task.t)}</strong></p>
              <h2 class="pick-name">${esc(m.n)}</h2>
              <p class="muted">${esc(m.p)}${p.e ? ` · effort <span class="mono" style="color:var(--ink)">${esc(normE(p.e))}</span>` : ''}</p></div>
          </div>
          <div class="pick-cost"><button type="button" class="btn" id="share" style="height:34px;font-size:13px;margin-bottom:8px">${icon('link')}<span>Copy link</span></button><div class="big">${p.cost === 0 ? 'Free' : '~$' + p.cost.toFixed(2)}</div><div class="small muted">est. per task · ${esc(priceTxt(p.m))} per 1M tokens</div></div>
        </div>
        <div class="meter lg" style="margin-top:22px"><span class="small muted" style="width:92px">AA score</span><div class="track"><div class="fill on" style="width:${m.aa == null ? 0 : Math.round(m.aa / 60 * 100)}%"></div></div><span class="num">${m.aa ?? '—'}</span></div>
        <ul class="why">${why.map((w) => `<li>${icon('check')}${esc(w)}</li>`).join('')}</ul>
        <h3 class="label-caps" style="margin-top:28px">Alternatives</h3>
        <div class="alts">${opts.filter((o, i) => i !== pi).map((o) => `
          <button type="button" class="alt" data-explore="${o.m}">${badge(o.m, 'md')}<span class="role">${esc(o.primary ? 'Balanced pick' : o.role)}</span><span class="line"><b>${esc(M[o.m].n)}</b><span class="mono small">${o.cost === 0 ? 'Free' : '~$' + o.cost.toFixed(2)}</span></span></button>`).join('')}</div>
      </section>
      <aside class="stack" style="display:grid;gap:24px;min-width:0" aria-label="Price watch">
        <section class="card"><h3 class="h3" style="display:flex;gap:8px;align-items:center;color:var(--ink)"><span style="color:var(--warn);display:flex">${icon('clock')}</span>Price changes ahead</h3>
          ${watch.length ? `<ol class="watch" style="margin-top:14px">${watch.map((w) => `<li><span class="when">${esc(w.d)}</span><span>${esc(w.t)}<br><span class="small muted">${esc(w.b)}</span></span></li>`).join('')}</ol>` : '<p class="muted small" style="margin-top:10px">No scheduled price changes.</p>'}
        </section>
        <section class="card"><h3 class="h3" style="display:flex;gap:8px;align-items:center"><span style="color:var(--accent);display:flex">${icon('trend')}</span>${FRESH.length ? `New since your last visit <span class="tag solid">${FRESH.length}</span>` : 'What changed'}</h3>
          <ul style="list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px;font-size:14px">${changed.map((t) => `<li><strong style="font-weight:500">${stripEmoji(t.t)}</strong> <span class="muted small">· ${esc(t.d)}</span></li>`).join('')}</ul>
          <a href="#changes" style="display:inline-block;margin-top:14px;font-size:14px;font-weight:500">${FRESH.length > 4 ? `All ${FRESH.length} new changes →` : 'All changes →'}</a>
        </section>
      </aside>
    </div>

    <section class="section" aria-label="Deep analysis">
      <div class="section-head"><h2 class="h2">Deep analysis · ${esc(m.n)}</h2><span class="small muted">Updates with the task and mode above</span></div>
      <div class="grid">
        <article class="card"><h3 class="h3">Effort ladder</h3><p class="card-sub">Bar height = AA score · label = cost per task</p>${ladderHtml}</article>
        <article class="card">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center"><h3 class="h3">Monthly cost</h3>
            <div class="seg sm" role="group" aria-label="Tasks per day">${segBtns([[10, '10/day'], [100, '100/day'], [1000, '1000/day']], R.vol, 'vol')}</div></div>
          <p class="card-sub">${R.vol} tasks a day × 30 days, at each option’s effort setting</p>
          <div style="margin-top:18px">${rows.map((r, i) => `<div class="mrow ${i === 0 ? 'on' : ''}"><div class="top-line"><span>${esc(M[r.m].n)}</span><span class="mono">${big(r.cost * R.vol * 30)}</span></div><div class="track"><div class="fill" style="width:${Math.max(2, Math.round(r.cost * R.vol * 30 / mmax * 100))}%"></div></div></div>`).join('')}</div>
          <p style="margin-top:16px;font-size:14px">${saving}</p>
        </article>
        <article class="card"><h3 class="h3">Confidence &amp; risks</h3><p class="card-sub">What to check before you commit</p>
          <div style="margin-top:16px;display:flex;align-items:center;gap:14px">
            <div class="ring" style="background:conic-gradient(${conf >= 80 ? 'var(--good)' : 'var(--warn)'} ${conf}%, var(--chip) 0)"><div>${conf}</div></div>
            <div style="font-size:14px"><strong>${conf >= 80 ? 'High confidence' : conf >= 65 ? 'Medium confidence' : 'Check before use'}</strong><br><span class="small muted">Sources and benchmarks behind this pick</span></div>
          </div>
          <ul class="flags">${flags.map((f) => `<li><span class="${f.ok ? 'ok' : 'warn'}" style="display:flex">${icon(f.ok ? 'check' : 'warn')}</span>${esc(f.t)}</li>`).join('')}</ul>
        </article>
      </div>
    </section>

    <section class="section" aria-label="Top models">
      <div class="section-head"><h2 class="h2">Top models by score</h2><a href="#explore" style="font-size:14px;font-weight:500">Explore all ${Object.keys(M).length} models →</a></div>
      <div class="table-box"><table class="table" style="min-width:720px">
        <thead><tr><th scope="col">Model</th><th scope="col" style="width:34%">AA score</th><th scope="col" class="r">$ / task</th><th scope="col" class="r">In / Out per 1M</th><th scope="col" class="r">Value</th></tr></thead>
        <tbody>${board.map((k) => { const r = valRank.indexOf(k); return `<tr class="clickable" data-explore="${k}"><td><span class="model-cell">${badge(k)}<span><span class="name">${esc(M[k].n)}</span> <span class="small muted">${esc(M[k].p)}</span></span></span></td>
          <td><div class="meter"><div class="track"><div class="fill ${r === 0 ? 'on' : ''}" style="width:${Math.round(M[k].aa / 60 * 100)}%"></div></div><span class="num">${M[k].aa}</span></div></td>
          <td class="r mono">${perTask(M[k].aaCost)}</td><td class="r mono muted">${esc(priceTxt(k))}</td><td class="r">${r === 0 ? '<span class="tag solid">Best</span>' : `<span class="mono small muted">#${r + 1}</span>`}</td></tr>`; }).join('')}</tbody>
      </table></div>
      <p class="small muted" style="margin-top:10px">$ / task = Artificial Analysis cost to run its full index at the best effort setting. Value = score per dollar, ranked.</p>
    </section>`;

    app.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { R.mode = b.dataset.mode; saveRec(); goRec(); }));
    document.getElementById('share').addEventListener('click', async (e) => {
      const b = e.currentTarget, label = b.querySelector('span');
      const ok = await copyText(location.href.split('#')[0] + '#recommend/' + R.task + '/' + R.mode);
      label.textContent = ok ? 'Link copied' : 'Copy failed'; setTimeout(() => { label.textContent = 'Copy link'; }, 1800);
    });
    app.querySelectorAll('[data-vol]').forEach((b) => b.addEventListener('click', () => { R.vol = +b.dataset.vol; saveRec(); goRec(); }));
    app.querySelectorAll('[data-task]').forEach((b) => b.addEventListener('click', () => { R.task = b.dataset.task; saveRec(); goRec(); }));
    app.querySelectorAll('[data-group]').forEach((b) => b.addEventListener('click', () => { const t = TASKS.find((x) => x.group === +b.dataset.group); R.task = t.id; saveRec(); goRec(); }));
    app.querySelectorAll('[data-explore]').forEach((el) => el.addEventListener('click', () => { location.hash = 'explore/' + el.dataset.explore; }));
  }
  const saveRec = () => store.set('rec', R);
  // Keep the link in sync before redrawing, so the link (not stale args) drives the view
  const goRec = () => { history.replaceState(null, '', '#recommend/' + R.task + '/' + R.mode); render(); };

  // ── Explore ──────────────────────────────────────────────────────
  const E = { q: '', prov: '', open: false, free: false, legacy: true, sort: 'aa', sel: 'gpt61sol' };
  function exploreRows() {
    const q = E.q.trim().toLowerCase();
    let ks = Object.keys(M).filter((k) => {
      const m = M[k];
      if (E.legacy && m.legacy) return false;
      if (E.prov && m.p !== E.prov) return false;
      if (E.open && !m.open) return false;
      if (E.free && m.fr !== 2) return false;
      if (q && !(m.n + ' ' + m.p + ' ' + (m.t || '')).toLowerCase().includes(q)) return false;
      return true;
    });
    const by = {
      aa: (a, b) => (M[b].aa ?? -1) - (M[a].aa ?? -1),
      value: (a, b) => ((M[b].aa ?? 0) / (M[b].aaCost || 99)) - ((M[a].aa ?? 0) / (M[a].aaCost || 99)),
      cost: (a, b) => (M[a].aaCost ?? 99) - (M[b].aaCost ?? 99),
      price: (a, b) => (effPrice(a).i + effPrice(a).o * 3) - (effPrice(b).i + effPrice(b).o * 3),
    }[E.sort];
    return ks.sort(by);
  }
  function detailHtml(k) {
    const m = M[k]; if (!m) return '';
    const lad = m.ladder || [];
    const topAA = lad.length ? Math.max(...lad.map((l) => l[1])) : 0;
    return `<aside class="card detail side" aria-label="Model details">
      <div style="display:flex;gap:12px;align-items:center">${badge(k, 'md')}<p class="label-caps" style="font-size:12px">${esc(m.p)} · ${m.legacy ? 'Legacy' : esc(m.t || '')}</p></div>
      <h2 style="margin-top:8px;font-size:26px;letter-spacing:-.02em;font-weight:600">${esc(m.n)}</h2>
      <p class="muted" style="margin-top:6px;font-size:14px">${esc(m.b)}</p>
      <dl class="stats">
        <div><dt>Price / 1M (in / out)</dt><dd>${esc(priceTxt(k))}</dd></div>
        <div><dt>Context</dt><dd>${esc(m.ctx)}</dd></div>
        <div><dt>AA (best setting)</dt><dd>${m.aa ?? 'not ranked'}</dd></div>
        <div><dt>$ / task at best</dt><dd>${perTask(m.aaCost)}</dd></div>
        <div><dt>DeepSWE</dt><dd>${m.dsw ? m.dsw.toFixed(1) + '%' : 'not on board'}</dd></div>
        <div><dt>Weights · free</dt><dd>${m.open ? 'Open' : 'Closed'}${m.fr === 2 ? ' · Zen' : ''}</dd></div>
      </dl>
      ${lad.length ? `<h3 class="label-caps" style="margin:20px 0 8px">Effort ladder</h3><div class="eladder">${lad.map((l) => `<div class="er ${l[1] === topAA ? 'top' : ''}"><span class="mono muted">${esc(l[0])}</span><div class="track"><div class="fill" style="width:${Math.round(l[1] / 60 * 100)}%"></div></div><span class="mono" style="text-align:right">${l[1]}</span><span class="mono" style="text-align:right">$${l[2].toFixed(2)}</span></div>`).join('')}</div>` : ''}
      ${(m.notes || []).length ? `<h3 class="label-caps" style="margin:20px 0 8px">Notes</h3><ul class="flags" style="margin-top:0">${m.notes.map((n) => `<li><span class="${/DeepSWE #|zero data/.test(n) ? 'ok' : 'warn'}" style="display:flex">${icon(/DeepSWE #|zero data/.test(n) ? 'check' : 'warn')}</span>${esc(n)}</li>`).join('')}</ul>` : ''}
      ${(D.history || {})[k] ? `<h3 class="label-caps" style="margin:20px 0 8px">Price history</h3>${histChart(k)}` : ''}
      <p class="small muted" style="margin-top:18px">${m.official ? 'Price read on the vendor’s own page' : `Price from ${m.srcs || 1} independent source${(m.srcs || 1) > 1 ? 's' : ''}`} · checked ${fmtDate(m.v)}</p>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">${m.aa != null && m.aaCost ? `<a class="btn primary" href="#value/${k}">Show on value map</a>` : ''}
        <button type="button" class="btn" data-cmp="${k}" aria-pressed="${C.includes(k)}">${icon(C.includes(k) ? 'check' : 'plus')}${C.includes(k) ? 'In compare' : 'Add to compare'}</button>
        <button type="button" class="btn back-list" data-back="${k}">${icon('up')}Back to list</button></div>
    </aside>`;
  }
  function viewExplore(sel) {
    if (sel && M[sel]) { E.sel = sel; if (M[sel].legacy) E.legacy = false; }
    const provs = [...new Set(Object.values(M).map((m) => m.p))].sort();
    app.innerHTML = `
      <h1 class="h1" style="font-size:clamp(28px,3.4vw,36px)">Explore models</h1>
      <p class="muted" style="margin-top:6px">${Object.keys(M).length} models · scores and prices checked ${fmtDate(D.checked)} · select a row for details</p>
      <div class="filters">
        <label class="input">${icon('search')}<span class="sr-only">Search models</span><input id="q" type="search" placeholder="Search models or providers" value="${esc(E.q)}" autocomplete="off"></label>
        <label class="sr-only" for="prov">Provider</label>
        <select id="prov" class="select"><option value="">All providers</option>${provs.map((p) => `<option ${p === E.prov ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select>
        <button type="button" class="toggle" data-flag="open" aria-pressed="${E.open}"><span class="sw"></span>Open weights</button>
        <button type="button" class="toggle" data-flag="free" aria-pressed="${E.free}"><span class="sw"></span>Free on Zen</button>
        <button type="button" class="toggle" data-flag="legacy" aria-pressed="${E.legacy}"><span class="sw"></span>Hide legacy</button>
        <button type="button" class="btn" id="csv">${icon('download')}CSV</button>
        <label class="sort">Sort by <select id="sort" class="select">${[['aa', 'Score'], ['value', 'Value (score per $)'], ['cost', 'Cost per task'], ['price', 'Price']].map(([v, l]) => `<option value="${v}" ${v === E.sort ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      </div>
      <div class="row" style="margin-top:20px"><div class="grow" id="rows"></div><div id="detail" class="side" style="flex:1 1 320px"></div></div>`;
    const drawRows = () => {
      const ks = exploreRows();
      if (ks.length && !ks.includes(E.sel)) E.sel = ks[0];
      document.getElementById('rows').innerHTML = ks.length ? `<div class="table-box"><table class="table" style="min-width:700px">
        <thead><tr><th scope="col">Model</th><th scope="col" style="width:24%">AA</th><th scope="col" class="r">$ / task</th><th scope="col" class="r">In / Out</th><th scope="col" class="r">DeepSWE</th><th scope="col">Tag</th></tr></thead>
        <tbody>${ks.map((k) => { const m = M[k]; return `<tr class="clickable ${m.legacy ? 'legacy' : ''}" data-k="${k}" aria-selected="${k === E.sel}">
          <td><span class="model-cell">${badge(k)}<button type="button" data-pick="${k}" style="all:unset;cursor:pointer;display:block"><span class="name">${esc(m.n)}</span><br><span class="small muted">${esc(m.p)}</span></button></span></td>
          <td>${m.aa == null ? '<span class="muted">—</span>' : `<div class="meter"><div class="track"><div class="fill on" style="width:${Math.round(m.aa / 60 * 100)}%"></div></div><span class="num">${m.aa}</span></div>`}</td>
          <td class="r mono">${perTask(m.aaCost)}</td><td class="r mono muted" style="white-space:nowrap">${esc(priceTxt(k))}</td><td class="r mono">${m.dsw ? m.dsw.toFixed(1) + '%' : '—'}</td>
          <td>${m.legacy ? '<span class="tag">Legacy</span>' : m.fr === 2 ? '<span class="tag good">Free on Zen</span>' : `<span class="tag ${/value|Budget|Best/i.test(m.t) ? 'good' : /#1|DeepSWE/.test(m.t) ? 'accent' : ''}">${esc(m.t || '')}</span>`}</td></tr>`; }).join('')}</tbody></table></div>` : '<div class="card empty">No models match these filters.</div>';
      document.getElementById('detail').innerHTML = ks.length ? detailHtml(E.sel) : '';
      document.querySelectorAll('#rows tr[data-k]').forEach((tr) => tr.addEventListener('click', () => {
        E.sel = tr.dataset.k; drawRows();
        // On narrow screens the details sit below the table: bring them into view
        if (matchMedia('(max-width: 900px)').matches) document.getElementById('detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
      const cmpBtn = document.querySelector('#detail [data-cmp]');
      if (cmpBtn) cmpBtn.addEventListener('click', () => { toggleCompare(cmpBtn.dataset.cmp); drawRows(); });
      const back = document.querySelector('#detail [data-back]');
      if (back) back.addEventListener('click', () => { const row = document.querySelector(`#rows tr[data-k="${back.dataset.back}"]`); if (row) { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); row.querySelector('button')?.focus({ preventScroll: true }); } });
    };
    drawRows();
    const q = document.getElementById('q');
    q.addEventListener('input', () => { E.q = q.value; drawRows(); });
    document.getElementById('prov').addEventListener('change', (e) => { E.prov = e.target.value; drawRows(); });
    document.getElementById('sort').addEventListener('change', (e) => { E.sort = e.target.value; drawRows(); });
    document.getElementById('csv').addEventListener('click', () => {
      const head = ['Model', 'Provider', 'Input $/1M', 'Output $/1M', 'Scheduled change', 'AA', 'AA $/task', 'DeepSWE %', 'Context', 'Open weights', 'Free on Zen', 'Legacy', 'Checked'];
      const lines = [head].concat(exploreRows().map((k) => { const m = M[k], p = effPrice(k); return [m.n, m.p, p.i, p.o, m.priceChangeDate && !past(m.priceChangeDate) ? `${m.iAfter}/${m.oAfter} from ${m.priceChangeDate}` : '', m.aa ?? '', m.aaCost ?? '', m.dsw ?? '', m.ctx, m.open ? 'yes' : 'no', m.fr === 2 ? 'yes' : 'no', m.legacy ? 'yes' : 'no', m.v]; }));
      downloadFile(`model-guide-${D.checked}.csv`, lines.map((r) => r.map(csvCell).join(',')).join('\n') + '\n', 'text/csv');
    });
    app.querySelectorAll('[data-flag]').forEach((b) => b.addEventListener('click', () => { E[b.dataset.flag] = !E[b.dataset.flag]; b.setAttribute('aria-pressed', E[b.dataset.flag]); drawRows(); }));
  }

  // ── Value map ────────────────────────────────────────────────────
  const V = Object.assign({ src: 'aa', d3: true }, store.get('vm', {}));
  function viewValue(hl) {
    const W = 780, H = 500;
    let pts, lo, hi, yMin, yMax, yLab, src;
    if (V.src === 'aa') {
      pts = Object.keys(M).filter((k) => current(k) && M[k].aa != null && M[k].aa >= 15 && M[k].aaCost).map((k) => ({ k, n: M[k].n, p: M[k].p, y: M[k].aa, c: M[k].aaCost }));
      lo = 0.08; hi = 14; yMin = 15; yMax = 62; yLab = 'AA Intelligence Index (best setting)'; src = 'Artificial Analysis, ' + fmtDate(D.checked);
    } else {
      pts = D.dsw.map((d) => ({ k: d.id, n: d.n, p: d.p, y: d.s, c: d.c }));
      lo = 0.2; hi = 30; yMin = 10; yMax = 80; yLab = 'DeepSWE v1.1 pass rate %'; src = 'Datacurve DeepSWE v1.1, Sep 22, 2026';
    }
    const x = (c) => (Math.log(c) - Math.log(lo)) / (Math.log(hi) - Math.log(lo)) * W;
    const y = (v) => (yMax - v) / (yMax - yMin) * H;
    const byCost = [...pts].sort((a, b) => a.c - b.c);
    const front = new Set(); let best = -1;
    byCost.forEach((d) => { if (d.y > best) { front.add(d.k); best = d.y; } });
    const topN = new Set([...pts].sort((a, b) => b.y - a.y).slice(0, 4).map((d) => d.k));
    const xt = V.src === 'aa' ? [0.1, 0.3, 1, 3, 10] : [0.3, 1, 3, 10, 30];
    const yt = V.src === 'aa' ? [20, 30, 40, 50, 60] : [20, 40, 60, 80];
    const ladder = byCost.filter((d) => front.has(d.k));
    // Label placement: highlighted, frontier, then top scores; skip a label that would overlap one already placed.
    const placed = [], LAB = {};
    [...pts].sort((a, b) => (b.k === hl) - (a.k === hl) || front.has(b.k) - front.has(a.k) || b.y - a.y).forEach((d) => {
      if (!(front.has(d.k) || topN.has(d.k) || d.k === hl)) return;
      const px = x(d.c), py = y(d.y), w = d.n.length * 6.6 + 4, left = px > W - 170;
      const box = left ? { x1: px - 12 - w, x2: px - 8 } : { x1: px + 8, x2: px + 12 + w };
      box.y1 = py - 9; box.y2 = py + 9;
      if (placed.some((o) => box.x1 < o.x2 && box.x2 > o.x1 && box.y1 < o.y2 && box.y2 > o.y1)) return;
      placed.push(box); LAB[d.k] = true;
    });
    app.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px">
        <div><h1 class="h1" style="font-size:clamp(28px,3.4vw,36px)">Value map</h1><p class="muted" style="margin-top:6px">Score against cost per task. Models on the blue line give the best score for their price.</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <div class="seg" role="group" aria-label="Score source">${segBtns([['aa', 'AA index'], ['dsw', 'DeepSWE (coding)']], V.src, 'src')}</div>
          <button type="button" class="toggle" id="d3" aria-pressed="${V.d3}"><span class="sw"></span>3D view</button>
        </div>
      </div>
      <div class="row" style="margin-top:22px">
        <figure class="card grow" style="margin:0;padding:20px 24px 16px">
          <div class="vm-stage"><div class="vm-plane ${V.d3 ? 'd3' : ''}" id="plane">
            ${yt.map((v) => `<div class="vm-grid-h" style="top:${y(v)}px"></div><span class="vm-ylab" style="top:${y(v) - 8}px">${v}</span>`).join('')}
            ${xt.map((v) => `<div class="vm-grid-v" style="left:${x(v)}px"></div><span class="vm-xlab" style="left:${x(v) - 30}px">$${v}</span>`).join('')}
            <svg class="vm-line" width="${W}" height="${H}" aria-hidden="true"><polyline points="${ladder.map((d) => x(d.c).toFixed(1) + ',' + y(d.y).toFixed(1)).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" opacity=".55"/></svg>
            ${pts.map((d) => { const f = front.has(d.k), r = f ? 7 : 6, px = x(d.c), py = y(d.y), left = px > W - 170, lab = !!LAB[d.k];
              return `<button type="button" class="vm-dot ${f ? 'front' : ''}" style="--pc:${pcVar(d.p)};width:${r * 2}px;height:${r * 2}px;left:${px - r}px;top:${py - r}px${d.k === hl ? ';outline:3px solid var(--warn);outline-offset:2px' : ''}" aria-label="${esc(d.n)}: ${V.src === 'aa' ? 'AA ' + d.y : d.y.toFixed(1) + '%'}, $${d.c.toFixed(2)} per task" data-tip="${esc(d.n)} — ${V.src === 'aa' ? 'AA ' + d.y : d.y.toFixed(1) + '%'} · $${d.c.toFixed(2)}/task" data-x="${px}" data-y="${py}"></button>
              ${lab ? `<span class="vm-label ${f ? 'front' : ''}" style="top:${py - 9}px;${left ? 'right:' + (W - px + r + 6) : 'left:' + (px + r + 6)}px">${esc(d.n)}</span>` : ''}`; }).join('')}
            <div class="vm-tip" id="tip" hidden></div>
          </div></div>
          <figcaption class="small muted" style="margin-top:6px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px"><span>↑ ${esc(yLab)} · → cost per task, log scale</span><span>Source: ${esc(src)}</span></figcaption>
        </figure>
        <aside class="side" style="display:grid;gap:16px">
          <section class="card"><h2 class="h3" style="margin-bottom:12px">Best value ladder</h2>
            <ol class="ladder-list">${ladder.map((d) => `<li><span>${esc(d.n)}</span><span class="mono muted">${V.src === 'aa' ? 'AA ' + d.y : d.y.toFixed(1) + '%'}</span><span class="mono" style="width:54px;text-align:right">$${d.c.toFixed(2)}</span></li>`).join('')}</ol>
            <p class="small muted" style="margin-top:14px">Start at the top of the ladder; move down only when quality falls short.${V.src === 'aa' ? ' Models below AA 15 are left off the map.' : ''}</p></section>
          <section class="card"><h2 class="h3" style="margin-bottom:10px">Providers</h2>
            <ul class="legend">${[...new Set(pts.map((d) => d.p))].sort().map((p) => `<li><i style="--pc:${pcVar(p)}"></i>${esc(p)}</li>`).join('')}</ul></section>
        </aside>
      </div>`;
    app.querySelectorAll('[data-src]').forEach((b) => b.addEventListener('click', () => { V.src = b.dataset.src; store.set('vm', V); render(); }));
    document.getElementById('d3').addEventListener('click', (e) => { V.d3 = !V.d3; store.set('vm', V); e.currentTarget.setAttribute('aria-pressed', V.d3); document.getElementById('plane').classList.toggle('d3', V.d3); });
    const tip = document.getElementById('tip');
    app.querySelectorAll('.vm-dot').forEach((b) => {
      const show = () => { tip.textContent = b.dataset.tip; tip.style.left = b.dataset.x + 'px'; tip.style.top = b.dataset.y + 'px'; tip.hidden = false; };
      const hide = () => { tip.hidden = true; };
      b.addEventListener('mouseenter', show); b.addEventListener('focus', show); b.addEventListener('mouseleave', hide); b.addEventListener('blur', hide);
      b.addEventListener('click', () => { if (M[pts.find((d) => d.k === b.dataset.k)?.k]) location.hash = 'explore/' + b.dataset.k; });
    });
  }

  // ── Insights ─────────────────────────────────────────────────────
  function viewInsights() {
    // Cheapest setting that reaches AA 50, per current model
    const reach = [];
    Object.keys(M).filter(current).forEach((k) => {
      const m = M[k];
      if (m.ladder) { const s = m.ladder.filter((l) => l[1] >= 50).sort((a, b) => a[2] - b[2])[0]; if (s) reach.push({ k, e: s[0], aa: s[1], c: s[2] }); }
      else if (m.aa >= 50 && m.aaCost) reach.push({ k, e: 'best', aa: m.aa, c: m.aaCost });
    });
    reach.sort((a, b) => a.c - b.c);
    const top3 = reach.slice(0, 3);
    const order = [top3[1], top3[0], top3[2]].filter(Boolean);
    const H = { 0: 200, 1: 150, 2: 110 };
    const provBest = {}; reach.forEach((r) => { const p = M[r.k].p; if (!provBest[p]) provBest[p] = r; });
    const coding = [...D.dsw].sort((a, b) => b.s - a.s).slice(0, 3);
    const cmax = Math.max(...coding.map((c) => c.c));
    const tx = (i) => 48 + i * 123, ty = (v) => 200 - v * 6;
    app.innerHTML = `
      <p class="eyebrow">Insights · ${fmtDate(D.checked)}</p>
      <h1 class="h1" style="font-size:clamp(28px,3.6vw,38px)">What the numbers say this month</h1>
      <p class="lede">Findings from ${Object.keys(M).length} models, the current Artificial Analysis index, DeepSWE and vendor price pages.</p>
      <div class="row" style="margin-top:28px;align-items:stretch">
        <section class="card lift grow" style="flex-basis:520px" aria-label="Cheapest way to reach AA 50">
          <h2 class="h3" style="font-size:17px">Cheapest way to reach AA 50</h2>
          <p class="card-sub">Cost per task at the lowest effort that scores 50 or more</p>
          <div class="podium">${order.map((r) => { const rank = top3.indexOf(r); return `
            <div class="pod ${rank === 0 ? 'first' : ''}">${badge(r.k, 'md')}<div><div class="name">${esc(M[r.k].n)}</div><div class="small muted" style="text-align:center">AA ${r.aa} · ${esc(r.e)}</div></div>
              <div class="pod-block" style="height:${H[rank]}px"><div class="f"><span class="cost">$${r.c.toFixed(2)}</span></div><i class="s"></i><i class="t"></i><span class="rank">#${rank + 1}</span></div></div>`; }).join('')}</div>
          <p style="margin-top:18px;font-size:14px">Cheapest route per lab: ${Object.entries(provBest).map(([p, r]) => `<strong>${esc(p)}</strong> ${esc(M[r.k].n)} $${r.c.toFixed(2)}`).join(' · ')}. Every other lab — and every open-weight model — stays below AA 50.</p>
        </section>
        <section class="card inverse side" style="flex-basis:420px" aria-label="Key takeaways">
          <h2 class="h3" style="font-size:17px">Key takeaways</h2>
          <ol class="takeaways">${D.insights.map((k) => `<li><span class="stat">${esc(k.stat)}</span><span><b>${esc(k.title)}</b><span class="small muted">${esc(k.text)}</span></span></li>`).join('')}</ol>
        </section>
      </div>
      <div class="row" style="margin-top:24px;align-items:stretch">
        <section class="card grow" style="flex-basis:520px" aria-label="Output price trend">
          <h2 class="h3" style="font-size:17px">Output price is falling fast</h2>
          <p class="card-sub">Output $ per 1M tokens for each lab’s main value tier, by month</p>
          <svg viewBox="0 0 560 240" role="img" aria-label="${esc(D.trend.map((t) => t.lab + ': ' + t.label).join('. '))}" style="width:100%;height:auto;margin-top:16px;font-family:var(--mono)">
            ${[0, 10, 20, 30].map((v) => `<line x1="48" x2="548" y1="${ty(v)}" y2="${ty(v)}" stroke="var(--line)"/><text x="40" y="${ty(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">$${v}</text>`).join('')}
            ${['May', 'Jun', 'Jul', 'Aug', 'Sep'].map((mn, i) => `<text x="${tx(i)}" y="226" text-anchor="middle" font-size="11" fill="var(--muted)">${mn}</text>`).join('')}
            ${D.trend.map((t) => `<polyline points="${t.pts.map((p) => tx(p[0]) + ',' + ty(p[1])).join(' ')}" fill="none" stroke="${t.color}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${tx(t.pts[t.pts.length - 1][0])}" cy="${ty(t.pts[t.pts.length - 1][1])}" r="4.5" fill="${t.color}"/>`).join('')}
          </svg>
          <ul class="legend" style="grid-template-columns:1fr;margin-top:10px;font-size:13px">${D.trend.map((t) => `<li><i style="--pc:${t.color};border-radius:2px;height:3px;width:14px"></i>${esc(t.lab)}: ${esc(t.label)}</li>`).join('')}</ul>
        </section>
        <section class="card side" style="flex-basis:420px" aria-label="Coding three-way tie">
          <h2 class="h3" style="font-size:17px">Coding: a three-way tie, ${(cmax / Math.min(...coding.map((c) => c.c))).toFixed(0)}× apart in cost</h2>
          <p class="card-sub">DeepSWE v1.1 — the top three are within the error margin</p>
          <div style="margin-top:20px;display:grid;gap:16px">${coding.map((c) => `<div><div style="display:flex;justify-content:space-between;gap:10px"><span style="font-weight:500">${esc(c.n)}</span><span class="mono small muted">${c.s.toFixed(1)}% ${esc(c.ci)}</span></div>
            <div class="meter" style="margin-top:6px"><div class="track" style="height:12px"><div class="fill" style="background:${pcVar(c.p)};width:${Math.round(c.c / cmax * 100)}%"></div></div><span class="mono" style="width:60px;text-align:right">$${c.c.toFixed(2)}</span></div></div>`).join('')}</div>
          <p style="margin-top:18px;font-size:14px">Bars show cost per task. Same result, very different bill.</p>
        </section>
      </div>
      <section class="card section" aria-label="Provider strengths" style="margin-top:24px">
        <h2 class="h3" style="font-size:17px">Provider strengths</h2>
        <p class="card-sub" style="margin-bottom:12px">Darker = stronger. Each cell is the provider’s best model on that measure. *Gemini 4 Carbon price from one source.</p>
        <div style="overflow-x:auto"><table class="heat"><thead><tr><th scope="col">Provider</th>${D.strengths.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${D.strengths.rows.map(([n, cells]) => `<tr><th scope="row">${esc(n)}</th>${cells.map(([t, l]) => `<td class="hx${l}">${esc(t)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      </section>
      <section class="card section" aria-label="Golden rules" style="margin-top:24px">
        <h2 class="h3" style="font-size:17px;margin-bottom:16px">Golden rules</h2>
        <ol class="rules">${D.rules.map(([b, t]) => `<li><span><b>${esc(b)}</b><span class="muted">${esc(t)}</span></span></li>`).join('')}</ol>
      </section>`;
  }

  // ── Changes ──────────────────────────────────────────────────────
  function viewChanges() {
    const dotFor = { emerald: 'var(--c-openai)', blue: 'var(--c-google)', violet: 'var(--c-anthropic)', gray: 'var(--muted)' };
    const watch = D.watch.filter((w) => !past(w.until));
    const snap = Object.keys(M).filter((k) => M[k].sn !== undefined).sort((a, b) => M[a].p.localeCompare(M[b].p) || (M[b].aa ?? -1) - (M[a].aa ?? -1));
    app.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px">
        <div><h1 class="h1" style="font-size:clamp(28px,3.4vw,36px)">Changes &amp; sources</h1>
        <p class="muted" style="margin-top:6px">Launches and price moves, newest first, plus what is scheduled next.</p></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn" href="feed.xml" type="application/rss+xml">${icon('rss')}Subscribe (RSS)</a><a class="btn" href="#sheet">${icon('print')}Cheat sheet</a></div>
      </div>
      ${FRESH.length ? `<div class="fresh-note" role="status">${icon('spark')}<span><strong>${FRESH.length} change${FRESH.length > 1 ? 's' : ''} since your last visit</strong> — marked below. You last saw data from ${fmtDate(prevSeen)}.</span></div>` : ''}
      <div class="row" style="margin-top:24px">
        <section class="card grow" aria-label="Timeline"><h2 class="h3" style="margin-bottom:16px">Timeline</h2>
          <ol class="timeline">${D.timeline.map((t) => `<li class="${isFresh(t) ? 'fresh' : ''}" style="--pc:${dotFor[t.c] || 'var(--muted)'}"><div class="when">${esc(t.d)} · ${esc(t.p)}${isFresh(t) ? ' <span class="tag solid" style="margin-left:4px">New for you</span>' : t.n ? ' <span class="tag accent" style="margin-left:4px">New</span>' : ''}</div><div class="what">${stripEmoji(t.t)}</div><div class="body">${t.b}</div></li>`).join('')}</ol>
        </section>
        <div class="side" style="display:grid;gap:24px">
          <section class="card"><h2 class="h3" style="margin-bottom:14px">Coming up</h2>
            ${watch.length ? `<ol class="watch">${watch.map((w) => `<li><span class="when">${esc(w.d)}</span><span>${esc(w.t)}<br><span class="small muted">${esc(w.b)}</span></span></li>`).join('')}</ol>` : '<p class="small muted">Nothing scheduled.</p>'}
          </section>
          ${window.MG_CHECKS ? `<section class="card"><h2 class="h3" style="margin-bottom:10px;display:flex;gap:8px;align-items:center"><span style="color:var(--good);display:flex">${icon('check')}</span>Automatic checks</h2>
            <p class="small muted">Every Monday a bot compares prices, scores, the DeepSWE board and the free list with outside sources, and opens an issue or a PR when something changed.</p>
            <dl class="stats" style="margin-top:12px"><div><dt>Last run</dt><dd>${fmtDate(window.MG_CHECKS.date)}</dd></div><div><dt>Prices</dt><dd>${window.MG_CHECKS.prices.models} · ${window.MG_CHECKS.prices.diffs ? window.MG_CHECKS.prices.diffs + ' diff' : 'match'}</dd></div></dl>
            <ul class="flags" style="margin-top:10px">${Object.entries(window.MG_CHECKS.sources).map(([k, v]) => `<li><span class="${v === 'ok' ? 'ok' : 'warn'}" style="display:flex">${icon(v === 'ok' ? 'check' : 'warn')}</span>${esc(k)} <span class="muted small">· ${esc(v)}</span></li>`).join('')}</ul></section>` : ''}
          <section class="card"><h2 class="h3" style="margin-bottom:12px">Gotchas</h2>
            <ul class="flags" style="margin-top:0">${D.gotchas.map((g) => `<li><span class="warn" style="display:flex">${icon('warn')}</span>${esc(g)}</li>`).join('')}</ul></section>
          <section class="card"><h2 class="h3" style="margin-bottom:12px">Sources</h2>
            <ul class="sources">${D.sources.map((s) => `<li><a href="${esc(s.u)}" target="_blank" rel="noopener noreferrer">${esc(s.n)}</a><br><span class="small muted">${esc(s.d)}</span></li>`).join('')}</ul></section>
        </div>
      </div>
      <section class="section" aria-label="Price snapshot">
        <div class="section-head"><h2 class="h2">Price snapshot</h2><span class="small muted">$ per 1M tokens, in effect today</span></div>
        <div class="table-box"><table class="table" style="min-width:640px"><thead><tr><th scope="col">Model</th><th scope="col">Provider</th><th scope="col" class="r">Input</th><th scope="col" class="r">Output</th><th scope="col">Note</th><th scope="col">Checked</th></tr></thead>
          <tbody>${snap.map((k) => { const p = effPrice(k); return `<tr class="${M[k].legacy ? 'legacy' : ''}"><td><span class="model-cell">${badge(k)}<span class="name">${esc(M[k].n)}</span></span></td><td class="muted">${esc(M[k].p)}</td><td class="r mono">${usd(p.i)}</td><td class="r mono">${usd(p.o)}</td><td class="small muted">${M[k].sn || ''}</td><td class="small muted" style="white-space:nowrap">${fmtDate(M[k].v)}</td></tr>`; }).join('')}</tbody></table></div>
      </section>`;
  }

  // ── Compare ──────────────────────────────────────────────────────
  let C = (store.get('cmp', ['gpt61sol', 'opus55', 'gemini4carbon']) || []).filter((k) => M[k]).slice(0, 3);
  const Q = Object.assign({ inTok: 20000, outTok: 2000, perDay: 100 }, store.get('calc', {}));
  function toggleCompare(k) {
    C = C.includes(k) ? C.filter((x) => x !== k) : C.concat(k).slice(-3);
    store.set('cmp', C);
  }
  function viewCompare(arg) {
    if (arg) { const ks = arg.split(',').filter((k) => M[k]).slice(0, 3); if (ks.length) { C = ks; store.set('cmp', C); } }
    const want = '#compare/' + C.join(',');
    if (C.length && location.hash !== want) history.replaceState(null, '', want);
    const opts = Object.keys(M).sort((a, b) => M[a].p.localeCompare(M[b].p) || M[a].n.localeCompare(M[b].n));
    const sel = (i) => `<label class="sr-only" for="c${i}">Model ${i + 1}</label><select id="c${i}" class="select" data-slot="${i}" style="width:100%"><option value="">${i < C.length ? 'Remove' : 'Add a model…'}</option>${opts.map((k) => `<option value="${k}" ${C[i] === k ? 'selected' : ''}>${esc(M[k].n)} · ${esc(M[k].p)}</option>`).join('')}</select>`;
    const monthly = (k) => { const p = priceAt(k, Q.inTok); return { ...p, task: (Q.inTok * p.i + Q.outTok * p.o) / 1e6 }; };
    const costs = C.map(monthly);
    const cheapest = costs.length ? Math.min(...costs.map((c) => c.task)) : 0;
    const rows = [
      ['Provider', (k) => esc(M[k].p)],
      ['Price / 1M (in / out)', (k) => `<span class="mono">${esc(priceTxt(k))}</span>`],
      ['Long prompts', (k) => (M[k].long ? `<span class="mono">${usd(M[k].long.i)} / ${usd(M[k].long.o)}</span> <span class="small muted">over ${M[k].long.over / 1000}K</span>` : '<span class="muted">same price</span>')],
      ['AA score (best)', (k) => (M[k].aa == null ? '<span class="muted">not ranked</span>' : `<div class="meter"><div class="track"><div class="fill on" style="width:${Math.round(M[k].aa / 60 * 100)}%"></div></div><span class="num">${M[k].aa}</span></div>`)],
      ['AA $ / task', (k) => `<span class="mono">${perTask(M[k].aaCost)}</span>`],
      ['DeepSWE', (k) => `<span class="mono">${M[k].dsw ? M[k].dsw.toFixed(1) + '%' : '—'}</span>`],
      ['Context', (k) => `<span class="mono">${esc(M[k].ctx)}</span>`],
      ['Weights · free', (k) => `${M[k].open ? 'Open' : 'Closed'}${M[k].fr === 2 ? ' · free on Zen' : ''}`],
      ['Price source', (k) => (M[k].official ? 'Vendor page' : `${M[k].srcs || 1} independent source${(M[k].srcs || 1) > 1 ? 's' : ''}`)],
      ['Effort ladder', (k) => ((M[k].ladder || []).length ? `<div class="eladder">${M[k].ladder.map((l) => `<div class="er"><span class="mono muted">${esc(l[0])}</span><div class="track"><div class="fill" style="width:${Math.round(l[1] / 60 * 100)}%"></div></div><span class="mono" style="text-align:right">${l[1]}</span><span class="mono" style="text-align:right">$${l[2].toFixed(2)}</span></div>`).join('')}</div>` : '<span class="muted">single setting</span>')],
      ['Price history', (k) => histChart(k, 260, 120) || '<span class="muted">no recorded changes</span>'],
      ['Notes', (k) => ((M[k].notes || []).length ? `<ul class="flags" style="margin:0">${M[k].notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : '<span class="muted">—</span>')],
    ];
    app.innerHTML = `
      <h1 class="h1" style="font-size:clamp(28px,3.4vw,36px)">Compare models</h1>
      <p class="muted" style="margin-top:6px">Pick up to three models. The link updates so you can share this comparison.</p>
      <div class="cmp-pickers">${[0, 1, 2].map(sel).join('')}</div>
      ${C.length ? `
      <section class="card section" aria-label="Cost calculator">
        <div class="section-head" style="margin-bottom:6px"><h2 class="h3" style="font-size:17px">Your workload</h2><span class="small muted">Uses list prices, including long-prompt tiers</span></div>
        <div class="calc-inputs">
          <label>Input tokens per task<input type="number" min="0" step="1000" id="inTok" value="${Q.inTok}" class="num-in"></label>
          <label>Output tokens per task<input type="number" min="0" step="500" id="outTok" value="${Q.outTok}" class="num-in"></label>
          <label>Tasks per day<input type="number" min="0" step="10" id="perDay" value="${Q.perDay}" class="num-in"></label>
        </div>
        <div class="calc-out" id="calc-out"></div>
      </section>
      <div class="table-box section"><table class="table cmp-table" style="min-width:${220 + C.length * 240}px">
        <thead><tr><th scope="col" style="width:180px">&nbsp;</th>${C.map((k) => `<th scope="col"><span class="model-cell">${badge(k)}<span class="name" style="text-transform:none;letter-spacing:0;font-size:14px;color:var(--ink)">${esc(M[k].n)}</span></span></th>`).join('')}</tr></thead>
        <tbody>${rows.map(([label, f]) => `<tr><th scope="row" class="small muted" style="text-transform:none;letter-spacing:0;position:static">${label}</th>${C.map((k) => `<td>${f(k)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>` : '<div class="card empty section">Add a model above to start comparing.</div>'}`;
    const drawCalc = () => {
      const out = document.getElementById('calc-out'); if (!out) return;
      const cs = C.map((k) => ({ k, ...monthly(k) }));
      const minT = Math.min(...cs.map((c) => c.task)), maxM = Math.max(...cs.map((c) => c.task * Q.perDay * 30), 0.0001);
      out.innerHTML = cs.map((c) => `<div class="mrow ${c.task === minT ? 'on' : ''}"><div class="top-line"><span>${esc(M[c.k].n)}${c.long ? ' <span class="tag warn">long-prompt price</span>' : ''}</span><span class="mono">$${c.task.toFixed(4)} / task · ${big(c.task * Q.perDay * 30)} / month</span></div><div class="track"><div class="fill" style="width:${Math.max(2, Math.round(c.task * Q.perDay * 30 / maxM * 100))}%"></div></div></div>`).join('')
        + `<p class="small muted" style="margin-top:12px">Token-based estimate for one call per task. Reasoning tokens count as output; agent runs make many calls, so AA $ / task above is often closer for agents.</p>`;
    };
    drawCalc();
    ['inTok', 'outTok', 'perDay'].forEach((id) => { const el = document.getElementById(id); if (el) el.addEventListener('input', () => { Q[id] = Math.max(0, +el.value || 0); store.set('calc', Q); drawCalc(); }); });
    app.querySelectorAll('[data-slot]').forEach((s2) => s2.addEventListener('change', () => {
      const i = +s2.dataset.slot, v = s2.value, next = C.slice();
      if (!v) next.splice(i, 1); else if (i < next.length) next[i] = v; else next.push(v);
      C = [...new Set(next)].slice(0, 3); store.set('cmp', C);
      location.hash = C.length ? 'compare/' + C.join(',') : 'compare';
    }));
  }

  // ── Router simulator ─────────────────────────────────────────────
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const RT = Object.assign({ tiers: clone(D.routerPresets[0].tiers), perDay: 100, preset: D.routerPresets[0].id }, store.get('router', {}));
  const ROLE_NAME = ['Default', 'Escalate', 'Last resort'];
  const routable = () => Object.keys(M).filter((k) => current(k) && M[k].aa != null && (M[k].ladder || M[k].aaCost)).sort((a, b) => M[b].aa - M[a].aa);
  function costAt(k, e) { const l = (M[k].ladder || []).find((r) => r[0] === e); return l ? { aa: l[1], c: l[2] } : { aa: M[k].aa, c: M[k].aaCost }; }
  function effortsOf(k) { return (M[k].ladder || []).map((l) => l[0]); }
  function fixTiers() {
    RT.tiers = RT.tiers.filter((t) => M[t[0]]).slice(0, 3);
    RT.tiers.forEach((t) => { const ef = effortsOf(t[0]); if (ef.length && !ef.includes(t[1])) t[1] = ef[ef.length - 1]; if (!ef.length) t[1] = 'best'; });
    const rest = RT.tiers.slice(1).reduce((a, t) => a + t[2], 0);
    if (rest > 100) { let over = rest - 100; for (let i = RT.tiers.length - 1; i > 0 && over > 0; i--) { const cut = Math.min(over, RT.tiers[i][2]); RT.tiers[i][2] -= cut; over -= cut; } }
    RT.tiers[0][2] = 100 - RT.tiers.slice(1).reduce((a, t) => a + t[2], 0);
  }
  function routerCalc() {
    const tiers = RT.tiers.map(([k, e, share]) => ({ k, e, share, ...costAt(k, e) }));
    const task = tiers.reduce((a, t) => a + t.share / 100 * t.c, 0);
    const aa = tiers.reduce((a, t) => a + t.share / 100 * t.aa, 0);
    const month = (c) => c * RT.perDay * 30;
    const topT = tiers.reduce((b, t) => (t.aa > b.aa ? t : b), tiers[0]);
    const cheapT = tiers.reduce((b, t) => (t.c < b.c ? t : b), tiers[0]);
    return { tiers, task, aa, month: month(task), top: { ...topT, month: month(topT.c) }, cheap: { ...cheapT, month: month(cheapT.c) } };
  }
  function viewRouter() {
    fixTiers();
    const ks = routable();
    app.innerHTML = `
      <div class="hero" style="align-items:flex-end">
        <div class="hero-copy">
          <p class="eyebrow">Router</p>
          <h1 class="h1">Route tasks across models</h1>
          <p class="lede">Send most work to a cheap model and escalate only the hard tasks. See what the mix costs per month, how it scores, and what you save.</p>
        </div>
        <label class="perday">Tasks per day<input type="number" id="rt-day" class="num-in" min="1" step="10" value="${RT.perDay}"></label>
      </div>
      <div class="chips" role="group" aria-label="Presets" style="margin-top:22px">${D.routerPresets.map((pr) => `<button type="button" class="chip ghost" data-preset="${pr.id}" aria-pressed="${RT.preset === pr.id}">${esc(pr.name)}</button>`).join('')}</div>
      <div class="row" style="margin-top:22px">
        <section class="grow" aria-label="Tiers">
          <div class="tiers-list">${RT.tiers.map((t, i) => `
            ${i ? `<div class="tier-arrow" aria-hidden="true">${icon('down')}<span>escalate ${t[2]}% of tasks</span></div>` : ''}
            <div class="card tier" style="--bc:var(--b-${PC[M[t[0]].p] || 'other'})">
              <div class="tier-head"><span class="tier-num">${i + 1}</span><span class="label-caps">${ROLE_NAME[i]}</span>
                ${i ? `<button type="button" class="icon-btn" data-rm="${i}" aria-label="Remove tier ${i + 1}" style="margin-left:auto;width:32px;height:32px">${icon('x')}</button>` : ''}</div>
              <div class="tier-grid">
                <label>Model<select class="select" data-tm="${i}">${ks.map((k) => `<option value="${k}" ${k === t[0] ? 'selected' : ''}>${esc(M[k].n)} · AA ${M[k].aa}</option>`).join('')}</select></label>
                <label>Effort<select class="select" data-te="${i}" ${effortsOf(t[0]).length ? '' : 'disabled'}>${(effortsOf(t[0]).length ? effortsOf(t[0]) : ['best']).map((e) => `<option ${e === t[1] ? 'selected' : ''}>${esc(e)}</option>`).join('')}</select></label>
                ${i ? `<label class="share">Share of tasks <output id="rt-o${i}">${t[2]}%</output><input type="range" min="0" max="100" step="5" value="${t[2]}" data-ts="${i}"></label>`
                    : `<div class="share"><span>Share of tasks</span><output id="rt-o0" class="big-share">${t[2]}%</output><span class="small muted">gets everything not escalated</span></div>`}
              </div>
              <p class="tier-meta" id="rt-m${i}"></p>
            </div>`).join('')}
          </div>
          ${RT.tiers.length < 3 ? '<button type="button" class="btn" id="rt-add" style="margin-top:14px">' + icon('plus') + 'Add a tier</button>' : ''}
        </section>
        <aside class="side" aria-label="Results" aria-live="polite"><div id="rt-out"></div></aside>
      </div>`;
    const drawOut = () => {
      const r = routerCalc();
      r.tiers.forEach((t, i) => { const m = document.getElementById('rt-m' + i); if (m) m.innerHTML = `AA ${t.aa} · <span class="mono">$${t.c.toFixed(2)}</span> per task · ${t.share}% of tasks`; });
      const o0 = document.getElementById('rt-o0'); if (o0) o0.textContent = RT.tiers[0][2] + '%';
      const save = r.top.month > 0 ? (r.top.month - r.month) / r.top.month : 0;
      const bars = [['Your mix', r.month, r.aa, true], ['All to ' + M[r.top.k].n, r.top.month, r.top.aa], ['All to ' + M[r.cheap.k].n, r.cheap.month, r.cheap.aa]];
      const bmax = Math.max(...bars.map((b) => b[1]), 0.01);
      document.getElementById('rt-out').innerHTML = `
        <div class="card lift">
          <p class="label-caps">Traffic split</p>
          <div class="flow" role="img" aria-label="${esc(r.tiers.map((t) => `${M[t.k].n} ${t.share}%`).join(', '))}">${r.tiers.filter((t) => t.share > 0).map((t) => `<span style="--bc:var(--b-${PC[M[t.k].p] || 'other'});flex:${t.share}">${t.share >= 12 ? `${esc(M[t.k].mono)} ${t.share}%` : ''}</span>`).join('')}</div>
          <div class="kpis">
            <div><span class="small muted">Per month</span><b class="mono">${big(r.month)}</b><span class="small muted">${RT.perDay}/day</span></div>
            <div><span class="small muted">Avg score</span><b class="mono">${r.aa.toFixed(1)}</b><span class="small muted">weighted AA</span></div>
            <div class="${save > 0 ? 'good' : ''}"><span class="small muted">Saving</span><b class="mono">${save > 0 ? Math.round(save * 100) + '%' : '—'}</b><span class="small muted">vs ${esc(M[r.top.k].n)}</span></div>
          </div>
          <div style="margin-top:20px">${bars.map((b) => `<div class="mrow ${b[3] ? 'on' : ''}"><div class="top-line"><span>${esc(b[0])}</span><span class="mono">${big(b[1])} · AA ${b[2].toFixed(1)}</span></div><div class="track"><div class="fill" style="width:${Math.max(2, Math.round(b[1] / bmax * 100))}%"></div></div></div>`).join('')}</div>
          <p class="small muted" style="margin-top:14px">Cost per task and score come from Artificial Analysis at each effort. The weighted score is a rough guide: escalated tasks are usually the hardest ones.</p>
        </div>`;
    };
    drawOut();
    const save = () => store.set('router', RT);
    document.getElementById('rt-day').addEventListener('input', (e) => { RT.perDay = Math.max(1, +e.target.value || 1); save(); drawOut(); });
    app.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => { const pr = D.routerPresets.find((x) => x.id === b.dataset.preset); RT.tiers = clone(pr.tiers); RT.preset = pr.id; save(); viewRouter(); }));
    app.querySelectorAll('[data-tm]').forEach((sel) => sel.addEventListener('change', () => { RT.tiers[+sel.dataset.tm][0] = sel.value; RT.preset = ''; fixTiers(); save(); viewRouter(); }));
    app.querySelectorAll('[data-te]').forEach((sel) => sel.addEventListener('change', () => { RT.tiers[+sel.dataset.te][1] = sel.value; RT.preset = ''; save(); drawOut(); }));
    app.querySelectorAll('[data-ts]').forEach((rg) => rg.addEventListener('input', () => {
      const i = +rg.dataset.ts; RT.tiers[i][2] = +rg.value; RT.preset = ''; fixTiers(); rg.value = RT.tiers[i][2];
      document.getElementById('rt-o' + i).textContent = RT.tiers[i][2] + '%';
      const arrow = rg.closest('.tier').previousElementSibling; if (arrow && arrow.classList.contains('tier-arrow')) arrow.querySelector('span').textContent = `escalate ${RT.tiers[i][2]}% of tasks`;
      save(); drawOut();
    }));
    app.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { RT.tiers.splice(+b.dataset.rm, 1); RT.preset = ''; fixTiers(); save(); viewRouter(); }));
    const add = document.getElementById('rt-add');
    if (add) add.addEventListener('click', () => { const used = new Set(RT.tiers.map((t) => t[0])); const k = routable().find((x) => !used.has(x)); RT.tiers.push([k, effortsOf(k).slice(-1)[0] || 'best', 10]); RT.preset = ''; fixTiers(); save(); viewRouter(); });
  }

  // ── Printable cheat sheet ────────────────────────────────────────
  function viewSheet() {
    const vpts = Object.keys(M).filter((k) => current(k) && M[k].aa != null && M[k].aa >= 15 && M[k].aaCost).sort((a, b) => M[a].aaCost - M[b].aaCost);
    const front = []; let best = -1; vpts.forEach((k) => { if (M[k].aa > best) { front.push(k); best = M[k].aa; } });
    const watch = D.watch.filter((w) => !past(w.until));
    app.innerHTML = `
      <div class="sheet-bar">
        <div><h1 class="h1" style="font-size:clamp(26px,3vw,32px)">Cheat sheet</h1><p class="muted" style="margin-top:4px">One A4 page: the pick for every task, the value ladder and what changes next.</p></div>
        <button type="button" class="btn primary" id="print">${icon('print')}Print or save as PDF</button>
      </div>
      <article class="sheet" aria-label="Cheat sheet">
        <header class="sheet-head">
          <div><b>Model Guide</b> — which AI model to use</div>
          <div class="mono">Data ${fmtDate(D.checked)} · ${esc(D.siteUrl.replace(/^https?:\/\//, ''))}</div>
        </header>
        <div class="sheet-grid">
          ${D.groups.map((g) => `<section class="sheet-group"><h2>${icon(g.icon)}${esc(g.name)}</h2><ul>${g.tasks.map((t) => {
            const pc = parseCost(t.pr.c), alt = t.alts.filter((a) => M[a.m] && parseCost(a.c) != null && parseCost(a.c) < (pc ?? 0)).sort((a, b) => parseCost(a.c) - parseCost(b.c))[0];
            return `<li><span class="st">${esc(t.t)}</span><span class="sp"><b>${esc(M[t.pr.m].n)}</b>${t.pr.e ? ` <em>${esc(normE(t.pr.e))}</em>` : ''}</span><span class="sc mono">${esc((t.pr.c || '').replace(/ \(DeepSWE\)/, '*'))}</span><span class="sa">${alt ? `or ${esc(M[alt.m].n)} <span class="mono">${esc(alt.c.replace(/ \(DeepSWE\)/, '*'))}</span>` : ''}</span></li>`;
          }).join('')}</ul></section>`).join('')}
          <section class="sheet-group sheet-side">
            <h2>${icon('trend')}Best value ladder</h2>
            <ol class="sheet-ladder">${front.map((k) => `<li><span>${esc(M[k].n)}</span><span class="mono">AA ${M[k].aa}</span><span class="mono">$${M[k].aaCost.toFixed(2)}</span></li>`).join('')}</ol>
            ${watch.length ? `<h2 style="margin-top:10px">${icon('clock')}Coming up</h2><ul class="sheet-watch">${watch.map((w) => `<li><b class="mono">${esc(w.d)}</b> ${esc(w.t)} <span class="mono">${esc(w.b)}</span></li>`).join('')}</ul>` : ''}
            <h2 style="margin-top:10px">${icon('bulb')}Rules</h2>
            <ol class="sheet-rules">${D.rules.slice(0, 6).map(([b]) => `<li>${esc(b)}</li>`).join('')}</ol>
          </section>
        </div>
        <footer class="sheet-foot">$ = estimated cost per task (Artificial Analysis at that effort; * = DeepSWE coding benchmark). AA = Artificial Analysis Intelligence Index. Prices change often — check the vendor page before scale use.</footer>
      </article>`;
    document.getElementById('print').addEventListener('click', () => window.print());
  }

  // ── Router ───────────────────────────────────────────────────────
  const ROUTES = { recommend: viewRecommend, explore: viewExplore, compare: viewCompare, router: viewRouter, value: viewValue, insights: viewInsights, changes: viewChanges, sheet: viewSheet };
  const ORDER = ['recommend', 'explore', 'compare', 'router', 'value', 'insights', 'changes'];
  let lastRoute = '';
  function render() {
    const [route, arg, arg2] = (location.hash.replace(/^#\/?/, '') || 'recommend').split('/');
    const r = ROUTES[route] ? route : 'recommend';
    ROUTES[r](arg, arg2);
    staleBanner();
    document.querySelectorAll('.nav a').forEach((a) => (a.dataset.route === r ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    document.title = `Model Guide — ${{ recommend: 'Recommend', explore: 'Explore', compare: 'Compare', router: 'Router', value: 'Value map', insights: 'Insights', changes: 'Changes', sheet: 'Cheat sheet' }[r]}`;
    if (r !== lastRoute) { window.scrollTo(0, 0); if (lastRoute) app.focus({ preventScroll: true }); lastRoute = r; }
  }
  window.addEventListener('hashchange', render);

  // Warn when the data is older than MG.staleDays
  function staleBanner() {
    const days = Math.floor((Date.now() - new Date(D.checked + 'T00:00:00')) / 864e5);
    if (days <= (D.staleDays || 30)) return;
    app.insertAdjacentHTML('afterbegin', `<div class="stale" role="status">${icon('warn')}<span>These prices and scores were last checked <strong>${days} days ago</strong> (${fmtDate(D.checked)}). Models and prices change often — check the vendor page before you rely on a number.</span></div>`);
  }

  // Offline support (only over http/https — service workers don't run from file://)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ }); });
  }

  document.getElementById('checked').textContent = 'Data checked ' + fmtDate(D.checked);
  // Weekly automatic check (checks.js, written by the bot)
  const CK = window.MG_CHECKS;
  const autoLine = CK ? `Prices cross-checked automatically on ${fmtDate(CK.date)}: ${CK.prices.models} models, ${CK.prices.diffs ? CK.prices.diffs + ' difference' + (CK.prices.diffs > 1 ? 's' : '') + ' under review' : 'all match'} (${Object.entries(CK.sources).filter(([, v]) => v === 'ok').map(([k]) => k).join(', ')}).` : '';
  // Badge on the Changes link: how many items are new since the last visit
  if (FRESH.length) { const a = document.querySelector('.nav a[data-route="changes"]'); if (a) a.insertAdjacentHTML('beforeend', `<span class="nav-badge" aria-label="${FRESH.length} new since your last visit">${FRESH.length}</span>`); }
  document.getElementById('foot-line').textContent = `Prices and scores checked by hand ${fmtDate(D.checked)}${autoLine ? ' · ' + autoLine : ''} · prices and scores are directional — verify before scale deployment.`;
  document.getElementById('theme-btn').addEventListener('click', () => {
    const root = document.documentElement;
    const now = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = now === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('mg-theme', next); } catch (e) { /* ignore */ }
  });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || '');
    if (e.key === '/' && !typing) { e.preventDefault(); if (!location.hash.startsWith('#explore')) location.hash = 'explore'; setTimeout(() => document.getElementById('q')?.focus(), 0); return; }
    if (!typing && /^[1-7]$/.test(e.key)) location.hash = ORDER[+e.key - 1];
  });
  render();

  // Exposed for tests and the console
  window.MGApp = { effPrice, priceAt, past, TASKS, taskOptions, routerCalc, routes: ORDER, fresh: () => FRESH.length };
})();
