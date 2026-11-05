# Model Selection Guide

A single-page, dependency-free cheat-sheet for picking the right AI model per task. Covers Claude, OpenAI, Gemini, Grok, Cursor, and free/OSS models — with current prices, effort ladders, per-task routing, an interactive benchmark chart, and a price-change log.

**Files**
- `index.html` — the page (layout, tabs, styles). Loads `modelguide.js`.
- `modelguide.js` — ALL data and logic: model catalog (`M[]`), per-task recommendations (`TG`), DeepSWE leaderboard (`DSW`), price history, finder scoring, tab rendering.
- `tests/smoke.mjs` — headless check: page loads with no JS errors, every tab renders, finder works, every task/dashboard entry points to a real model.
- `.github/workflows/check.yml` — runs `node --check` and the smoke test on every push and pull request.

**Run**
Open `index.html` in any browser. No build step. Optionally serve: `python3 -m http.server` in this folder.
Light/dark theme follows the OS setting; the sun/moon button switches it and remembers the choice.

**Test**
```bash
npm install --no-save playwright@1.63.0 && npx playwright install chromium
node tests/smoke.mjs
```

**Tabs**
| Tab | What it shows |
|---|---|
| 📊 Dashboard | All-models table (free highlighted, date each model was last checked), pricing tiers, best cost/task (CursorBench) |
| 🎯 By Task | 29 tasks × primary pick + 3 alternatives with estimated $/task |
| 🔍 Finder | Select tasks + priority → top-5 ranked models |
| Claude / OpenAI / Gemini / Grok / Cursor / Free | Per-provider lineups with rates and gotchas |
| ⚡ Matrix | Task × model quick table (built from the By Task data) + golden rules + effort-level reference |
| 🎯 DeepSWE Chart | Interactive bubble chart: score × cost/task × output tokens × agent steps (27 models) |
| 📜 Price History | Timeline of price changes, current-rate snapshot, watchlist |
| 📚 References | Sources |

**Conventions**
- List prices: **$/MTok** (input / output), e.g. `$2/$12`.
- Workload costs: **estimated $ per task** at the listed effort, marked `~`.
- Keyboard: `Ctrl/Cmd + 1..9` jump to tabs, `Ctrl/Cmd + 0` = Matrix.

**How to update**
1. Prices/specs: edit the model entry in `M[]` (`modelguide.js`, top of file). Set `v:'YYYY-MM-DD'` to the day you checked it, and `sn:'…'` for the note in the price snapshot (models without `sn` are left out of the snapshot).
2. Scheduled price changes (promo or intro price ending): add `iAfter`/`oAfter`/`priceChangeDate`. The page shows `old→new` before the date and switches to the new price on that date — finder scores, the matrix and the snapshot all use the price in effect today. Add `bAfter` / `snAfter` for the description and snapshot note to use after that date.
   - Other date-bound text: in JS templates use `past('YYYY-MM-DD') ? after : before`; in `index.html` add `data-after="YYYY-MM-DD" data-after-html="…"` to the element (the swapped-in HTML may carry its own later `data-after`).
   - A model with no score on this page's AA scale can use `aa:null`: it is listed with "—" but not ranked.
3. Per-task picks and cost estimates: edit `TG`. The Matrix tab is generated from `TG`, so don't edit it separately.
4. Benchmarks: DeepSWE data lives in `DSW[]`; re-fetch from the live leaderboard and update the `updated` note.
5. Price history timeline and watchlist: `renderPriceHistory()`.
6. Bump the dates in `index.html` (header, sidebar, footer).
7. Run `node tests/smoke.mjs` before pushing (CI runs it too).

**Data sources**
- Scores: Artificial Analysis Intelligence Index (current version, best effort setting) and its cost per task by effort; DeepSWE v1.1 (deepswe.datacurve.ai, read from the page data).
- Prices from vendor pages: Claude, Google Cloud, xAI, DeepSeek, Z.ai, Cursor.
- Prices via Artificial Analysis where the vendor page could not be read (OpenAI GPT-6 family, Gemini 4 Carbon, Kimi, Meta, Xiaomi, MiniMax, Mistral, Qwen), cross-checked against [LiteLLM's open price database](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json).
- OpenCode Zen free list and list prices checked Nov 5 (also used to cross-check GPT-6 prices). OpenRouter free limits as of Aug 29.
- Models with `aa:null` are legacy or not on the current AA index and are not ranked.

Prices and benchmarks are directional — verify before scale deployment. Full disclaimer at the bottom of the page.
