# Model Guide

A single-page guide for picking the right AI model per task. Covers Claude, GPT-6, Gemini, Grok, Cursor and open-weight models — with scores, cost per task, prices, upcoming price changes and the sources behind every number.

Plain **HTML, CSS and JavaScript**. No framework, no build step, no runtime dependencies (Google Fonts is optional; system fonts are used if it fails to load).

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell: header, navigation, footer. Loads `styles.css`, `data.js`, `app.js`. |
| `styles.css` | All styles. Color tokens at the top (light + dark), then components. |
| `data.js` | **All data**: models, task picks, DeepSWE results, timeline, price watch, insights, sources. |
| `app.js` | Rendering and interaction for the five pages. Reads `window.MG` from `data.js`. |
| `tests/smoke.mjs` | Headless test: every page renders, every task/mode works, controls work, data references are valid, and the page still works on each scheduled price-change date. |
| `.github/workflows/check.yml` | Runs a syntax check and the smoke test on every push and pull request. |

## Run

Open `index.html` in a browser. Or serve the folder: `python3 -m http.server`.

## Pages

| Page | URL | What it does |
|---|---|---|
| Recommend | `#recommend` | Pick a task group and task, then Balanced / Cheapest / Best quality. Shows the pick, why, alternatives, upcoming price changes, and a deep analysis: 3D effort ladder, monthly cost at 10/100/1000 tasks a day, confidence and risks. |
| Explore | `#explore` or `#explore/<model>` | All models: search, provider filter, open weights, free on Zen, hide legacy, sort. Selecting a row opens the detail panel. |
| Value map | `#value` or `#value/<model>` | Score against cost per task (AA index or DeepSWE), with the best-value line. 3D view on/off. |
| Insights | `#insights` | Cheapest way to reach AA 50 (3D podium), key takeaways, price trend, coding tie, provider strengths, golden rules. |
| Changes | `#changes` | Timeline, upcoming changes, gotchas, sources, full price snapshot. |

Keyboard: `1`–`5` switch pages, `/` searches models. Theme follows the OS; the moon/sun button switches it and remembers the choice.

## How to update

All edits are in `data.js`. Then run the test.

1. **Prices / specs:** edit the model in `MG.models`. Set `v` to the date you checked it and `sn` for the note in the price snapshot (models without `sn` are left out of the snapshot).
2. **Scheduled price change** (promo or intro price ending): add `iAfter`, `oAfter`, `priceChangeDate`. Before the date the page shows `old → new`; from that date it uses the new price everywhere. `bAfter` / `snAfter` replace the description and note after that date. Add a matching item to `MG.watch` with `until` = the same date — it disappears once the date passes.
3. **Scores:** `aa` = Artificial Analysis Intelligence Index at the best setting (`null` = legacy or not on the current index; listed but not ranked). `ladder` = `[effort, AA, $ per task]` rows from AA. `aaCost` = $ per task at the best setting. `dsw` = DeepSWE %.
4. **Source confidence:** `official: true` when the price was read on the vendor's own page; `srcs` = how many independent sources agree.
5. **Task picks:** edit `MG.groups` (`pr` = primary pick, `alts` = 3 alternatives; `c` = cost per task, from AA unless marked `(DeepSWE)`).
6. **Benchmarks:** `MG.dsw` holds the DeepSWE board (best config per model).
7. **Timeline / insights / rules / sources:** `MG.timeline`, `MG.insights`, `MG.trend`, `MG.strengths`, `MG.rules`, `MG.sources`.
8. Update `MG.checked`, then run the test:

```bash
npm install --no-save playwright@1.63.0 && npx playwright install chromium
```

```bash
node tests/smoke.mjs
```

## Data sources

- **Scores:** Artificial Analysis Intelligence Index (current version) and its cost per task by effort; DeepSWE v1.1 (deepswe.datacurve.ai).
- **Prices from vendor pages:** Claude, Google Cloud, xAI, DeepSeek, Z.ai, Cursor, OpenCode.
- **Prices via Artificial Analysis** where the vendor page could not be read (OpenAI GPT-6 family, Gemini 4 Carbon, Kimi, Meta, Xiaomi, MiniMax, Mistral, Qwen), cross-checked against [LiteLLM's open price database](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json).
- Coloured initials are placeholders, not vendor logos.

Prices and benchmarks are directional — verify before scale deployment.
