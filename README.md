# Model Selection Guide

A single-page, dependency-free cheat-sheet for picking the right AI model per task. Covers Claude, OpenAI, Gemini, Grok, Cursor, and free/OSS models — with current prices, effort ladders, per-task routing, an interactive benchmark chart, and a price-change log.

**Files**
- `index.html` — the page (layout, tabs, styles). Loads `modelguide.js`.
- `modelguide.js` — ALL data and logic: model catalog (`M[]`), per-task recommendations (`TG`), DeepSWE leaderboard (`DSW`), price history, finder scoring, tab rendering.
- `modelreview.md` — companion markdown doc (Claude-focused review, DeepSWE table). Not used by the page; standalone.

**Run**
Open `index.html` in any browser. No build step, no dependencies. Optionally serve: `python3 -m http.server` in this folder.

**Tabs**
| Tab | What it shows |
|---|---|
| 📊 Dashboard | All-models table (sorted, free highlighted), pricing tiers, best cost/task (CursorBench) |
| 🎯 By Task | 22 tasks × primary pick + 3 alternatives with estimated $/task |
| 🔍 Finder | Select tasks + priority → top-5 ranked models |
| Claude / OpenAI / Gemini / Grok / Cursor / Free | Per-provider lineups with rates and gotchas |
| ⚡ Matrix | Task × model quick table + golden rules + effort-level reference |
| 🎯 DeepSWE Chart | Interactive bubble chart: score × cost/task × output tokens × agent steps (18 models) |
| 📜 Price History | Timeline of price changes, current-rate snapshot, watchlist |
| 📚 References | Sources |

**Conventions**
- List prices: **$/MTok** (input / output), e.g. `$2/$12`.
- Workload costs: **estimated $ per task** at the listed effort, marked `~`.
- Keyboard: `Ctrl/Cmd + 1..9` jump to tabs, `Ctrl/Cmd + 0` = Matrix.

**How to update**
1. Prices/specs: edit the model entries in `M[]` (`modelguide.js`, top of file). For scheduled changes (e.g. Sonnet 5 intro → standard), use `iAfter`/`oAfter`/`priceChangeDate`.
2. Benchmarks: DeepSWE data lives in `DSW[]`; re-fetch from the live leaderboard and update the `updated` note.
3. Cost estimates per task: adjust the `~$` strings in `TG`.
4. Bump the verification date in the header/footer and `Price History` tab.

**Data sources**
Artificial Analysis (AA Index), DeepSWE v1.1 (deepswe.datacurve.ai), CursorBench 3.2 (BridgeMind), vendor docs (Claude, OpenAI, Gemini, xAI, DeepSeek, etc.). Prices and benchmarks are directional — verify before scale deployment. Full disclaimer at the bottom of the page.
