# Model Guide

A single-page guide for picking the right AI model per task. Covers Claude, GPT-6, Gemini, Grok, Cursor and open-weight models — with scores, cost per task, prices, upcoming price changes and the sources behind every number.

Plain **HTML, CSS and JavaScript**. No framework, no build step, no runtime dependencies (Google Fonts is optional; system fonts are used if it fails to load).

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell: header, navigation, footer. Loads `styles.css`, `data.js`, `app.js`. |
| `styles.css` | All styles. Color tokens at the top (light + dark), then components. |
| `data.js` | **All data**: models, task picks, DeepSWE results, timeline, price watch, insights, sources. |
| `app.js` | Rendering and interaction for all pages. Reads `window.MG` from `data.js`. |
| `sw.js`, `manifest.webmanifest`, `icon*.svg/png` | Offline support and install-as-app (service worker caches the site; works over http/https, not from `file://`). |
| `tools/check-prices.mjs` | Compares `data.js` prices with the LiteLLM and models.dev open price databases. |
| `tools/build-feed.mjs`, `feed.xml` | Builds the RSS feed of changes from the timeline. CI fails if `feed.xml` is out of date. |
| `tests/smoke.mjs` | Headless test: every page renders, every task/mode works, share links, CSV export, Compare + calculator, phone layout, stale-data banner, accessibility (axe-core, light and dark), data references, and each scheduled price-change date. |
| `.github/workflows/check.yml` | Runs syntax checks and the smoke + accessibility test on every push and pull request. |
| `.github/workflows/price-check.yml` | Every Monday: runs the price check and opens (or comments on) a `price-check` issue when prices differ. Can also be run by hand from the Actions tab. |

## Run

Open `index.html` in a browser. Or serve the folder: `python3 -m http.server`.

## Pages

| Page | URL | What it does |
|---|---|---|
| Recommend | `#recommend[/<task>/<mode>]` | Pick a task group and task, then Balanced / Cheapest / Best quality. Shows the pick, why, alternatives, upcoming price changes, and a deep analysis: 3D effort ladder, monthly cost at 10/100/1000 tasks a day, confidence and risks. The link always holds the task and mode; "Copy link" shares it. |
| Explore | `#explore` or `#explore/<model>` | All models: search, provider filter, open weights, free on Zen, hide legacy, sort, CSV download. Selecting a row opens the detail panel with the model's price history chart (on a phone it scrolls to it). |
| Router | `#router` | Route tasks across up to three models (default → escalate → last resort): share of tasks, effort, tasks per day. Shows monthly cost, weighted score and the saving vs sending everything to the strongest model. Presets included. |
| Cheat sheet | `#sheet` | One printable A4 page: the pick for every task, the best-value ladder, upcoming price changes and the rules. "Print or save as PDF". Also from the printer button in the header. |
| Compare | `#compare/<a>,<b>,<c>` | Up to three models side by side, plus a workload calculator (input / output tokens per task, tasks per day) that uses list prices and long-prompt tiers. |
| Value map | `#value` or `#value/<model>` | Score against cost per task (AA index or DeepSWE), with the best-value line. 3D view on/off. |
| Insights | `#insights` | Cheapest way to reach AA 50 (3D podium), key takeaways, price trend, coding tie, provider strengths, golden rules. |
| Changes | `#changes` | Timeline, upcoming changes, gotchas, sources, full price snapshot, RSS link. Items added since your last visit are marked, and the menu shows how many. |

Keyboard: `1`–`7` switch pages, `/` searches models. Theme follows the OS; the moon/sun button switches it and remembers the choice.

## How to update

All edits are in `data.js`. Then run the test.

1. **Prices / specs:** edit the model in `MG.models`. Set `v` to the date you checked it and `sn` for the note in the price snapshot (models without `sn` are left out of the snapshot).
2. **Scheduled price change** (promo or intro price ending): add `iAfter`, `oAfter`, `priceChangeDate`. Before the date the page shows `old → new`; from that date it uses the new price everywhere. `bAfter` / `snAfter` replace the description and note after that date. Add a matching item to `MG.watch` with `until` = the same date — it disappears once the date passes.
3. **Scores:** `aa` = Artificial Analysis Intelligence Index at the best setting (`null` = legacy or not on the current index; listed but not ranked). `ladder` = `[effort, AA, $ per task]` rows from AA. `aaCost` = $ per task at the best setting. `dsw` = DeepSWE %.
4. **Source confidence:** `official: true` when the price was read on the vendor's own page; `srcs` = how many independent sources agree.
5. **Task picks:** edit `MG.groups` (`pr` = primary pick, `alts` = 3 alternatives; `c` = cost per task, from AA unless marked `(DeepSWE)`).
6. **Benchmarks:** `MG.dsw` holds the DeepSWE board (best config per model).
7. **Timeline / insights / rules / sources:** `MG.timeline`, `MG.insights`, `MG.trend`, `MG.strengths`, `MG.rules`, `MG.sources`.
8. Long-prompt price tiers: `long: {over, i, o}`. Price-database keys for the weekly check: `ref: {lit, md}` (LiteLLM key, models.dev path under `providers/`).
9. **Timeline entries** need `iso` (event date) and `added` (the `MG.checked` date when the entry was added — this drives "new since your last visit" and the RSS dates).
10. **Price history:** `MG.history[model]` = `[date, in, out, note]` rows; prefix the date with `~` when only the month is known; future dates are scheduled changes. The test checks that the latest past row matches the current price.
11. **Router presets:** `MG.routerPresets`.
12. Rebuild the RSS feed: `node tools/build-feed.mjs` (set `MG.siteUrl` to your site address).
13. Update `MG.checked` (the page warns readers once the data is older than `MG.staleDays`, default 30). Then run the checks:

```bash
npm install --no-save playwright@1.63.0 axe-core@4.14.0 && npx playwright install chromium
```

```bash
node tests/smoke.mjs
```

```bash
node tools/check-prices.mjs
```

## Data sources

- **Scores:** Artificial Analysis Intelligence Index (current version) and its cost per task by effort; DeepSWE v1.1 (deepswe.datacurve.ai).
- **Prices from vendor pages:** Claude, Google Cloud, xAI, DeepSeek, Z.ai, Cursor, OpenCode.
- **Prices via Artificial Analysis** where the vendor page could not be read (OpenAI GPT-6 family, Gemini 4 Carbon, Kimi, Meta, Xiaomi, MiniMax, Mistral, Qwen), cross-checked against two open price databases: [LiteLLM](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) and [models.dev](https://github.com/sst/models.dev). Gemini 4 Carbon is in neither, so its price has one source.
- Coloured initials are placeholders, not vendor logos.

Prices and benchmarks are directional — verify before scale deployment.
