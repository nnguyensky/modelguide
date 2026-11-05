// ═══════════════════════════════════════════════════════════════════
// MODEL GUIDE — DATA (all numbers live here; app.js only renders)
// Checked Nov 5, 2026. Sources: vendor price pages (Claude, Google Cloud, xAI,
// DeepSeek, Z.ai, Cursor, OpenCode), Artificial Analysis (AA index, cost per task),
// LiteLLM + models.dev open price databases (cross-check), Datacurve DeepSWE v1.1 (Sep 22).
//
// Model fields: n name · p provider · i/o $ per 1M in/out · iAfter/oAfter/priceChangeDate
// scheduled change · aa AA index (null = not ranked) · aaCost $/task at best setting ·
// ladder [[effort, AA, $/task]] · dsw DeepSWE % · ctx · open (weights) · fr 2 = free on Zen ·
// legacy · official (price read on the vendor page) · srcs (sources agreeing) · v date checked ·
// long {over, i, o} long-prompt price tier · ref {lit, md} keys in LiteLLM / models.dev (used by tools/check-prices.mjs).
// ═══════════════════════════════════════════════════════════════════
var MG = window.MG = {};
MG.checked = '2026-11-05';
// Show a warning on the page when the data is older than this many days
MG.staleDays = 30;
MG.models = {
 "opus55": {
  "n": "Opus 5.5",
  "p": "Anthropic",
  "i": 4,
  "o": 20,
  "aa": 59,
  "b": "Best Claude. AA #2 (max). Fast mode $8/$40",
  "t": "AA #2",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Sep 22",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    35,
    0.98
   ],
   [
    "medium",
    48,
    2.45
   ],
   [
    "high",
    52,
    3.46
   ],
   [
    "xhigh",
    57,
    6.05
   ],
   [
    "max",
    59,
    10.04
   ]
  ],
  "aaCost": 10.04,
  "official": true,
  "srcs": 3,
  "notes": [
   "Not on DeepSWE yet (Opus 5 scored 73.6%)",
   "Fast mode $8 / $40"
  ],
  "mono": "O5",
  "ref": {
   "lit": "claude-opus-5-5",
   "md": "anthropic/models/claude-opus-5-5"
  }
 },
 "sonnet55": {
  "n": "Sonnet 5.5",
  "p": "Anthropic",
  "i": 2,
  "o": 10,
  "aa": 55,
  "b": "Best daily Claude. Writing, analysis",
  "t": "Best daily",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "~Sep 28",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    26,
    0.51
   ],
   [
    "medium",
    31,
    0.78
   ],
   [
    "high",
    42,
    1.64
   ],
   [
    "xhigh",
    50,
    4.09
   ],
   [
    "max",
    55,
    10.02
   ]
  ],
  "aaCost": 10.02,
  "official": true,
  "srcs": 3,
  "notes": [
   "At max effort it costs as much as Opus 5.5 at max"
  ],
  "mono": "S5",
  "ref": {
   "lit": "claude-sonnet-5-5",
   "md": "anthropic/models/claude-sonnet-5-5"
  }
 },
 "fable51": {
  "n": "Fable 5.1",
  "p": "Anthropic",
  "i": 10,
  "o": 50,
  "aa": 50,
  "b": "Costliest Claude. Scores below Opus 5.5 on AA",
  "t": "Premium",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Sep 1",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    39,
    4.47
   ],
   [
    "medium",
    43,
    5.56
   ],
   [
    "high",
    47,
    7.54
   ],
   [
    "xhigh",
    50,
    10.85
   ],
   [
    "max",
    49,
    12.99
   ]
  ],
  "aaCost": 10.85,
  "official": true,
  "srcs": 3,
  "notes": [
   "Scores below Opus 5.5 on AA at 2–5× the price"
  ],
  "mono": "F5",
  "ref": {
   "lit": "claude-fable-5-1",
   "md": "anthropic/models/claude-fable-5-1"
  }
 },
 "haiku55": {
  "n": "Haiku 5.5",
  "p": "Anthropic",
  "i": 0.1,
  "o": 0.5,
  "aa": 36,
  "b": "Cheapest Claude. $0.50/$2.50 past 100K prompt",
  "t": "Budget",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "≤100K prompt; $0.50/$2.50 above",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    19,
    0.04
   ],
   [
    "medium",
    25,
    0.09
   ],
   [
    "high",
    30,
    0.16
   ],
   [
    "xhigh",
    35,
    0.25
   ],
   [
    "max",
    36,
    0.41
   ]
  ],
  "aaCost": 0.41,
  "official": true,
  "srcs": 3,
  "notes": [
   "Prompts over 100K tokens cost 5× ($0.50 / $2.50)"
  ],
  "mono": "H5",
  "ref": {
   "lit": "claude-haiku-5-5",
   "md": "anthropic/models/claude-haiku-5-5"
  },
  "long": {
   "over": 100000,
   "i": 0.5,
   "o": 2.5
  }
 },
 "opus5": {
  "n": "Opus 5",
  "p": "Anthropic",
  "i": 5,
  "o": 25,
  "aa": null,
  "b": "Legacy. Opus 5.5 is cheaper and better",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 73.6,
  "official": true,
  "srcs": 3,
  "mono": "O5",
  "ref": {
   "lit": "claude-opus-5",
   "md": "anthropic/models/claude-opus-5"
  }
 },
 "fable5": {
  "n": "Fable 5",
  "p": "Anthropic",
  "i": 10,
  "o": 50,
  "aa": null,
  "b": "Legacy. Use Fable 5.1 (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 69.9,
  "official": true,
  "srcs": 3,
  "mono": "F5",
  "ref": {
   "lit": "claude-fable-5",
   "md": "anthropic/models/claude-fable-5"
  }
 },
 "sonnet5": {
  "n": "Sonnet 5",
  "p": "Anthropic",
  "i": 2,
  "o": 10,
  "aa": null,
  "b": "Legacy. Use Sonnet 5.5 (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 53.8,
  "official": true,
  "srcs": 3,
  "mono": "S5",
  "ref": {
   "lit": "claude-sonnet-5",
   "md": "anthropic/models/claude-sonnet-5"
  }
 },
 "opus48": {
  "n": "Opus 4.8",
  "p": "Anthropic",
  "i": 5,
  "o": 25,
  "aa": null,
  "b": "Legacy. Migrate to Opus 5.5",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 59,
  "official": true,
  "srcs": 3,
  "mono": "O4"
 },
 "gpt6astra": {
  "n": "GPT-6 Astra",
  "p": "OpenAI",
  "i": 10,
  "o": 50,
  "aa": 57,
  "b": "Top OpenAI. DeepSWE #1 (74.1%). $20/$75 past 272K",
  "t": "DeepSWE #1",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Sep · $20/$75 &gt;272K",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    43,
    1.42
   ],
   [
    "medium",
    52,
    2.73
   ],
   [
    "high",
    55,
    3.24
   ],
   [
    "xhigh",
    55,
    3.66
   ],
   [
    "max",
    57,
    6.24
   ]
  ],
  "aaCost": 6.24,
  "dsw": 74.1,
  "official": false,
  "srcs": 4,
  "notes": [
   "DeepSWE #1 (74.1%, ~29 agent steps)",
   "Above 272K tokens: $20 / $75"
  ],
  "mono": "A6",
  "ref": {
   "lit": "gpt-6-astra",
   "md": "openai/models/gpt-6-astra"
  },
  "long": {
   "over": 272000,
   "i": 20,
   "o": 75
  }
 },
 "gpt61sol": {
  "n": "GPT-6.1 Sol",
  "p": "OpenAI",
  "i": 2,
  "o": 10,
  "aa": 55,
  "b": "Best value at the top: AA 55 for ~$1.27/task. $4/$15 past 272K",
  "t": "Best value",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Sep · $4/$15 &gt;272K",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    35,
    0.16
   ],
   [
    "medium",
    46,
    0.36
   ],
   [
    "high",
    50,
    0.59
   ],
   [
    "xhigh",
    52,
    0.76
   ],
   [
    "max",
    55,
    1.27
   ]
  ],
  "aaCost": 1.27,
  "official": false,
  "srcs": 4,
  "notes": [
   "Not on DeepSWE yet — coding score is AA only",
   "Above 272K tokens: $4 / $15"
  ],
  "mono": "S6",
  "ref": {
   "lit": "gpt-6.1-sol",
   "md": "openai/models/gpt-6.1-sol"
  },
  "long": {
   "over": 272000,
   "i": 4,
   "o": 15
  }
 },
 "gpt61terra": {
  "n": "GPT-6.1 Terra",
  "p": "OpenAI",
  "i": 1,
  "o": 5,
  "aa": 51,
  "b": "Budget OpenAI. AA 51 for ~$0.96/task. $2/$7.50 past 272K",
  "t": "Budget",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Oct · $2/$7.50 &gt;272K",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    29,
    0.07
   ],
   [
    "medium",
    38,
    0.17
   ],
   [
    "high",
    42,
    0.26
   ],
   [
    "xhigh",
    45,
    0.4
   ],
   [
    "max",
    51,
    0.96
   ]
  ],
  "aaCost": 0.96,
  "official": false,
  "srcs": 3,
  "notes": [
   "Not on DeepSWE yet",
   "Above 272K tokens: $2 / $7.50"
  ],
  "mono": "T6",
  "ref": {
   "lit": "gpt-6.1-terra",
   "md": "openai/models/gpt-6.1-terra"
  },
  "long": {
   "over": 272000,
   "i": 2,
   "o": 7.5
  }
 },
 "gpt6luna": {
  "n": "GPT-6 Luna",
  "p": "OpenAI",
  "i": 0.1,
  "o": 0.5,
  "aa": 28,
  "b": "Cheapest OpenAI. Bulk, classify",
  "t": "Cheapest",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Sep · $0.20/$0.75 &gt;272K",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    10,
    0.01
   ],
   [
    "medium",
    18,
    0.04
   ],
   [
    "high",
    21,
    0.07
   ],
   [
    "xhigh",
    23,
    0.1
   ],
   [
    "max",
    28,
    0.15
   ]
  ],
  "aaCost": 0.15,
  "official": false,
  "srcs": 4,
  "notes": [
   "Low score — simple, high-volume work only",
   "Above 272K tokens: $0.20 / $0.75"
  ],
  "mono": "L6",
  "ref": {
   "lit": "gpt-6-luna",
   "md": "openai/models/gpt-6-luna"
  },
  "long": {
   "over": 272000,
   "i": 0.2,
   "o": 0.75
  }
 },
 "gptSol": {
  "n": "GPT-5.6 Sol",
  "p": "OpenAI",
  "i": 4,
  "o": 20,
  "aa": null,
  "b": "Legacy. Promo $4/$20 thru Nov 21. Use GPT-6.1 Sol",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "iAfter": 5,
  "oAfter": 30,
  "priceChangeDate": "2026-11-22",
  "bAfter": "Legacy. $5/$30 (promo ended Nov 21). Use GPT-6.1 Sol",
  "sn": "legacy · promo thru Nov 21 → $5/$30",
  "snAfter": "legacy · promo ended Nov 21",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 72.7,
  "official": false,
  "srcs": 4,
  "notes": [
   "Promo $4 / $20 ends Nov 21 → $5 / $30"
  ],
  "mono": "S5",
  "ref": {
   "lit": "gpt-5.6-sol",
   "md": "openai/models/gpt-5.6-sol"
  },
  "long": {
   "over": 272000,
   "i": 8,
   "o": 30
  }
 },
 "gptTerra": {
  "n": "GPT-5.6 Terra",
  "p": "OpenAI",
  "i": 2,
  "o": 12,
  "aa": null,
  "b": "Legacy. GPT-6.1 Terra is cheaper",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 69.6,
  "official": false,
  "srcs": 3,
  "mono": "T5",
  "ref": {
   "lit": "gpt-5.6-terra",
   "md": "openai/models/gpt-5.6-terra"
  },
  "long": {
   "over": 272000,
   "i": 4,
   "o": 18
  }
 },
 "gptLuna": {
  "n": "GPT-5.6 Luna",
  "p": "OpenAI",
  "i": 0.2,
  "o": 1.2,
  "aa": null,
  "b": "Legacy. GPT-6 Luna is cheaper",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 67.2,
  "official": false,
  "srcs": 3,
  "mono": "L5",
  "ref": {
   "lit": "gpt-5.6-luna",
   "md": "openai/models/gpt-5.6-luna"
  },
  "long": {
   "over": 272000,
   "i": 0.4,
   "o": 1.8
  }
 },
 "gemini4carbon": {
  "n": "Gemini 4 Carbon",
  "p": "Google",
  "i": 4,
  "o": 20,
  "aa": 60,
  "b": "AA #1 overall",
  "t": "AA #1",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Oct",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "low",
    54,
    7.19
   ],
   [
    "medium",
    58,
    6.59
   ],
   [
    "high",
    60,
    7.76
   ]
  ],
  "aaCost": 7.76,
  "official": false,
  "srcs": 1,
  "notes": [
   "Price from one source (not on the Google Cloud page)",
   "Completions over 32K tokens are billed even if they fail"
  ],
  "mono": "C4"
 },
 "gemini4argon": {
  "n": "Gemini 4 Argon",
  "p": "Google",
  "i": 2,
  "o": 10,
  "aa": 50,
  "b": "Promo $2/$10 thru Nov 30, then $4/$20",
  "t": "Flagship",
  "fr": 0,
  "v": "2026-11-05",
  "iAfter": 4,
  "oAfter": 20,
  "priceChangeDate": "2026-12-01",
  "bAfter": "Google flagship tier below Carbon",
  "sn": "promo thru Nov 30 → $4/$20",
  "snAfter": "standard since Dec 1",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "aaCost": 9.95,
  "official": true,
  "srcs": 3,
  "notes": [
   "Promo price ends Nov 30",
   "Completions over 32K tokens are billed even if they fail"
  ],
  "mono": "A4",
  "ref": {
   "lit": "gemini/gemini-4-argon",
   "md": "google/models/gemini-4-argon"
  }
 },
 "gemini38f": {
  "n": "Gemini 3.8 Flash",
  "p": "Google",
  "i": 0.75,
  "o": 3.75,
  "aa": 31,
  "b": "Coding value: DeepSWE 73.8% (#2) at $2.36/task. Computer use, audio/video in",
  "t": "Coding value",
  "fr": 0,
  "v": "2026-11-05",
  "iAfter": 1.5,
  "oAfter": 7.5,
  "priceChangeDate": "2027-01-01",
  "sn": "intro thru Dec 31 → $1.50/$7.50",
  "snAfter": "standard since Jan 1",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "ladder": [
   [
    "medium",
    30,
    6.26
   ],
   [
    "high",
    31,
    7.77
   ]
  ],
  "aaCost": 7.77,
  "dsw": 73.8,
  "official": true,
  "srcs": 3,
  "notes": [
   "Intro price ends Dec 31 — doubles to $1.50 / $7.50",
   "DeepSWE #2 (73.8%) despite a low AA score",
   "Text, image, video and audio input; built-in computer use"
  ],
  "mono": "F3",
  "ref": {
   "lit": "gemini-3.8-flash",
   "md": "google/models/gemini-3.8-flash"
  }
 },
 "gemini37f": {
  "n": "Gemini 3.7 Flash",
  "p": "Google",
  "i": 0.75,
  "o": 3.75,
  "aa": null,
  "b": "Legacy. Use 3.8 Flash (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "iAfter": 1.5,
  "oAfter": 7.5,
  "priceChangeDate": "2027-01-01",
  "sn": "legacy · intro thru Dec 31",
  "snAfter": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 65.5,
  "official": true,
  "srcs": 3,
  "mono": "F3"
 },
 "gemini36f": {
  "n": "Gemini 3.6 Flash",
  "p": "Google",
  "i": 0.75,
  "o": 3.75,
  "aa": null,
  "b": "Legacy. Use 3.8 Flash (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "iAfter": 1.5,
  "oAfter": 7.5,
  "priceChangeDate": "2027-01-01",
  "sn": "legacy · intro thru Dec 31",
  "snAfter": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 46.7,
  "official": true,
  "srcs": 3,
  "mono": "F3"
 },
 "gemini35f": {
  "n": "Gemini 3.5 Flash",
  "p": "Google",
  "i": 1.5,
  "o": 9,
  "aa": null,
  "b": "Legacy. Use 3.8 Flash",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 36.1,
  "official": true,
  "srcs": 3,
  "mono": "F3"
 },
 "gemini31p": {
  "n": "Gemini 3.1 Pro",
  "p": "Google",
  "i": 2,
  "o": 12,
  "aa": null,
  "b": "Preview. Not on the current AA index",
  "t": "Preview",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "preview · $4/$18 &gt;200K",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "dsw": 11.7,
  "official": true,
  "srcs": 3,
  "mono": "P3",
  "long": {
   "over": 200000,
   "i": 4,
   "o": 18
  }
 },
 "grok47": {
  "n": "Grok 4.7",
  "p": "xAI",
  "i": 2,
  "o": 6,
  "aa": 35,
  "b": "xAI flagship. 500K ctx. In Cursor plan pool",
  "t": "xAI flagship",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Sep · $4/$12 &gt;200K",
  "legacy": false,
  "ctx": "500K",
  "open": false,
  "ladder": [
   [
    "low",
    31,
    2.92
   ],
   [
    "high",
    35,
    6.18
   ],
   [
    "xhigh",
    35,
    7.77
   ]
  ],
  "aaCost": 6.18,
  "official": true,
  "srcs": 3,
  "notes": [
   "Above 200K tokens: $4 / $12",
   "Weak value on AA: GPT-6.1 Sol scores higher for less"
  ],
  "mono": "G4",
  "ref": {
   "lit": "xai/grok-4.7",
   "md": "xai/models/grok-4.7"
  },
  "long": {
   "over": 200000,
   "i": 4,
   "o": 12
  }
 },
 "grok46": {
  "n": "Grok 4.6",
  "p": "xAI",
  "i": 2,
  "o": 6,
  "aa": null,
  "b": "Legacy. Use Grok 4.7 (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 67.5,
  "official": true,
  "srcs": 3,
  "mono": "G4",
  "long": {
   "over": 200000,
   "i": 4,
   "o": 12
  }
 },
 "grok45": {
  "n": "Grok 4.5",
  "p": "xAI",
  "i": 2,
  "o": 6,
  "aa": null,
  "b": "Legacy. Use Grok 4.7 (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": false,
  "dsw": 53.8,
  "official": true,
  "srcs": 3,
  "mono": "G4",
  "long": {
   "over": 200000,
   "i": 4,
   "o": 12
  }
 },
 "composer25": {
  "n": "Composer 2.5",
  "p": "Cursor",
  "i": 0.5,
  "o": 2.5,
  "aa": null,
  "b": "Cheapest Cursor coding model. Cursor only (not on AA)",
  "t": "Cursor $/task",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Cursor only",
  "cu": 1,
  "legacy": false,
  "ctx": "200K",
  "open": false,
  "official": true,
  "srcs": 3,
  "notes": [
   "Cursor only; not on AA or DeepSWE",
   "~$0.44 per task on CursorBench (Aug)"
  ],
  "mono": "C2"
 },
 "kimiK31pro": {
  "n": "Kimi K3.1 Pro",
  "p": "Moonshot",
  "i": 2,
  "o": 10,
  "aa": 46,
  "b": "Strong non-US alternative. Proprietary",
  "t": "Alt family",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "Oct 23",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "aaCost": 3.68,
  "official": false,
  "srcs": 3,
  "notes": [
   "Vendor page not reachable — price from 3 independent sources"
  ],
  "mono": "K3",
  "ref": {
   "lit": "moonshot/kimi-k3.1-pro",
   "md": "moonshotai/models/kimi-k3.1-pro"
  }
 },
 "museWonder": {
  "n": "Muse Wonder",
  "p": "Meta",
  "i": 4,
  "o": 20,
  "aa": 44,
  "b": "Meta flagship (API). Full version AA 50, no public price",
  "t": "Meta",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "aaCost": 6.95,
  "official": false,
  "srcs": 4,
  "mono": "MW",
  "ref": {
   "lit": "meta/muse-wonder-1.0",
   "md": "meta/models/muse-wonder-1.0"
  }
 },
 "qwen38max": {
  "n": "Qwen3.8 Max",
  "p": "Alibaba",
  "i": 2,
  "o": 6,
  "aa": 34,
  "b": "Alibaba flagship. Pricey per task",
  "t": "Alibaba",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "aaCost": 10.02,
  "dsw": 57.5,
  "official": false,
  "srcs": 3,
  "mono": "QM",
  "ref": {
   "md": "alibaba/models/qwen3.8-max"
  }
 },
 "dsV41Flash": {
  "n": "DeepSeek V4.1 Flash",
  "p": "DeepSeek",
  "i": 0.3,
  "o": 1.2,
  "aa": 33,
  "b": "Open weights. Off-peak half price ($0.15/$0.60). Free on Zen (limited time)",
  "t": "Open value",
  "fr": 2,
  "v": "2026-11-05",
  "sn": "peak price · off-peak $0.15/$0.60",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "ladder": [
   [
    "non-think",
    19,
    0.43
   ],
   [
    "high",
    29,
    0.46
   ],
   [
    "max",
    33,
    0.6
   ]
  ],
  "aaCost": 0.6,
  "official": true,
  "srcs": 3,
  "notes": [
   "2× price at peak hours (01–04, 06–10 UTC, Mon–Fri)",
   "Free on Zen for now — zero data retention"
  ],
  "mono": "DF",
  "ref": {
   "lit": "deepseek/deepseek-flash"
  }
 },
 "dsV4Pro": {
  "n": "DeepSeek V4 Pro",
  "p": "DeepSeek",
  "i": 1.32,
  "o": 3.96,
  "aa": 23,
  "b": "Open weights, MIT. Off-peak $0.66/$1.98. Flash scores higher",
  "t": "MIT",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "peak price · off-peak $0.66/$1.98",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "ladder": [
   [
    "non-think",
    13,
    0.98
   ],
   [
    "max",
    23,
    1.77
   ]
  ],
  "aaCost": 1.77,
  "dsw": 62.8,
  "official": true,
  "srcs": 3,
  "notes": [
   "2× price at peak hours",
   "Price went up since Aug ($0.435 / $0.87)"
  ],
  "mono": "DP",
  "ref": {
   "lit": "deepseek/deepseek-v4-pro"
  }
 },
 "glm53": {
  "n": "GLM-5.3",
  "p": "Z.ai",
  "i": 1.4,
  "o": 4.4,
  "aa": 32,
  "b": "Top open-weight coder on DeepSWE (69%)",
  "t": "Open coder",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "ladder": [
   [
    "low",
    23,
    1.57
   ],
   [
    "max",
    32,
    5.01
   ]
  ],
  "aaCost": 5.01,
  "dsw": 69,
  "official": true,
  "srcs": 3,
  "mono": "G5",
  "ref": {
   "lit": "zai/glm-5.3",
   "md": "zai/models/glm-5.3"
  }
 },
 "glm53f": {
  "n": "GLM-5.3-Flash",
  "p": "Z.ai",
  "i": 0.15,
  "o": 0.5,
  "aa": 28,
  "b": "DeepSWE 63.4% at $0.24/task. MIT. Free on Zen (limited time)",
  "t": "Budget open",
  "fr": 2,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "aaCost": 0.58,
  "dsw": 63.4,
  "official": true,
  "srcs": 3,
  "mono": "GF",
  "ref": {
   "lit": "zai/glm-5.3-flash",
   "md": "zai/models/glm-5.3-flash"
  }
 },
 "glm52": {
  "n": "GLM-5.2",
  "p": "Z.ai",
  "i": 1.4,
  "o": 4.4,
  "aa": null,
  "b": "Legacy. Use GLM-5.3 (same price)",
  "t": "Legacy",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "legacy",
  "legacy": true,
  "ctx": "1M",
  "open": true,
  "dsw": 43.8,
  "official": true,
  "srcs": 3,
  "mono": "G5",
  "ref": {
   "lit": "zai/glm-5.2",
   "md": "zai/models/glm-5.2"
  }
 },
 "mimoV26pro": {
  "n": "MiMo V2.6 Pro",
  "p": "Xiaomi",
  "i": 0.435,
  "o": 0.87,
  "aa": 30,
  "b": "Open weights. AA 30 for $0.26/task",
  "t": "Open value",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "aaCost": 0.26,
  "official": false,
  "srcs": 3,
  "mono": "MP",
  "ref": {
   "lit": "xiaomi_mimo/mimo-v2.6-pro",
   "md": "xiaomi/models/mimo-v2.6-pro"
  }
 },
 "mimoV26f": {
  "n": "MiMo V2.6 Flash",
  "p": "Xiaomi",
  "i": 0.14,
  "o": 0.28,
  "aa": 27,
  "b": "Open weights. Free on Zen (limited time; data may be used for training)",
  "t": "Open budget",
  "fr": 2,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "aaCost": 0.13,
  "official": false,
  "srcs": 3,
  "notes": [
   "Free on Zen may use your data for training"
  ],
  "mono": "MF",
  "ref": {
   "lit": "xiaomi_mimo/mimo-v2.6-flash",
   "md": "xiaomi/models/mimo-v2.6-flash"
  }
 },
 "minimaxM31f": {
  "n": "MiniMax M3.1 Flash",
  "p": "MiniMax",
  "i": 0.15,
  "o": 0.6,
  "aa": 29,
  "b": "Open weights, 1M ctx",
  "t": "Open",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "aaCost": 0.49,
  "official": false,
  "srcs": 2,
  "mono": "MM",
  "ref": {
   "md": "minimax/models/MiniMax-M3.1-Flash"
  }
 },
 "mistralL4": {
  "n": "Mistral Large 4",
  "p": "Mistral",
  "i": 0.7,
  "o": 2.1,
  "aa": 26,
  "b": "Open weights (EU lab)",
  "t": "EU open",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "ladder": [
   [
    "medium",
    23,
    1.41
   ],
   [
    "high",
    26,
    2.06
   ]
  ],
  "aaCost": 2.06,
  "official": false,
  "srcs": 3,
  "mono": "ML",
  "ref": {
   "lit": "mistral/mistral-large-4",
   "md": "mistral/models/mistral-large-4"
  }
 },
 "mistralS4": {
  "n": "Mistral Small 4",
  "p": "Mistral",
  "i": 0.15,
  "o": 0.6,
  "aa": 4,
  "b": "Small, Apache 2.0. Edge / simple tasks only",
  "t": "Edge",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "256K",
  "open": true,
  "aaCost": 0.04,
  "official": false,
  "srcs": 1,
  "mono": "MS"
 },
 "qwen3827b": {
  "n": "Qwen3.8 27B",
  "p": "Alibaba",
  "i": 0.5,
  "o": 3,
  "aa": 20,
  "b": "Open weights, 256K ctx. Best local-size model on AA",
  "t": "Local",
  "fr": 0,
  "v": "2026-11-05",
  "sn": "",
  "legacy": false,
  "ctx": "256K",
  "open": true,
  "ladder": [
   [
    "low",
    16,
    1.91
   ],
   [
    "medium",
    17,
    2.16
   ],
   [
    "xhigh",
    20,
    3.53
   ]
  ],
  "aaCost": 3.53,
  "official": false,
  "srcs": 2,
  "mono": "Q2",
  "ref": {
   "md": "alibaba/models/qwen3.8-27b"
  }
 },
 "nemotron35svl": {
  "n": "Nemotron 3.5 Super VL",
  "p": "NVIDIA",
  "i": 0.2,
  "o": 0.5,
  "aa": 14,
  "b": "Vision-language. Free on Zen (trial — no personal data)",
  "t": "Free vision",
  "fr": 2,
  "v": "2026-11-05",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "aaCost": 0.54,
  "official": true,
  "srcs": 3,
  "notes": [
   "NVIDIA trial endpoint — no personal data"
  ],
  "mono": "NV"
 },
 "beam": {
  "n": "Beam 1.0",
  "p": "Reflection",
  "i": 0.4,
  "o": 1.2,
  "aa": 18,
  "b": "Free on Zen. Not used for training; kept 30 days",
  "t": "Free",
  "fr": 2,
  "v": "2026-11-05",
  "legacy": false,
  "ctx": "1M",
  "open": true,
  "aaCost": 0.28,
  "official": true,
  "srcs": 3,
  "mono": "B1"
 },
 "bigPickle": {
  "n": "Big Pickle",
  "p": "OpenCode Zen",
  "i": 0,
  "o": 0,
  "aa": null,
  "b": "Stealth model. Free on Zen; data may be used for training",
  "t": "Smoke tests",
  "fr": 2,
  "v": "2026-11-05",
  "legacy": false,
  "ctx": "1M",
  "open": false,
  "official": true,
  "srcs": 3,
  "notes": [
   "Free on Zen may use your data for training"
  ],
  "mono": "BP"
 },
 "northMini": {
  "n": "North Mini Code",
  "p": "Cohere",
  "i": 0.2,
  "o": 0.8,
  "aa": null,
  "b": "Local coder. Fits RTX 4090. No longer on Zen",
  "t": "Local",
  "fr": 0,
  "v": "2026-08-29",
  "legacy": false,
  "ctx": "256K",
  "open": true,
  "official": false,
  "srcs": 1,
  "mono": "NM"
 },
 "gemma431": {
  "n": "Gemma 4 31B",
  "p": "Google",
  "i": 0.2,
  "o": 0.8,
  "aa": null,
  "b": "Apache 2.0, self-host friendly",
  "t": "Apache 2.0",
  "fr": 0,
  "v": "2026-08-29",
  "legacy": false,
  "ctx": "256K",
  "open": true,
  "official": false,
  "srcs": 1,
  "mono": "G3"
 }
};

// Task picks: pr = primary, alts = 3 alternatives. c = cost per task (AA unless marked DeepSWE).
MG.groups = [
 {
  "name": "Software Engineering",
  "icon": "code",
  "tasks": [
   {
    "t": "Write routine code",
    "pr": {
     "m": "gpt61sol",
     "e": "high",
     "c": "~$0.59"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "high",
      "r": 1,
      "l": "Open weights",
      "c": "~$0.46"
     },
     {
      "m": "sonnet55",
      "e": "medium",
      "r": 2,
      "l": "Claude alt",
      "c": "~$0.78"
     },
     {
      "m": "gemini38f",
      "e": "high",
      "r": 3,
      "l": "Strong coder",
      "c": "~$2.36 (DeepSWE)"
     }
    ]
   },
   {
    "t": "Write critical code",
    "pr": {
     "m": "opus55",
     "e": "xhigh",
     "c": "~$6.05"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Near tier, 5× cheaper",
      "c": "~$1.27"
     },
     {
      "m": "gpt6astra",
      "e": "xhigh",
      "r": 2,
      "l": "DeepSWE #1",
      "c": "~$3.66"
     },
     {
      "m": "gemini4carbon",
      "e": "high",
      "r": 3,
      "l": "AA #1",
      "c": "~$7.76"
     }
    ]
   },
   {
    "t": "Pipeline-critical multi-file",
    "pr": {
     "m": "gpt6astra",
     "e": "xhigh",
     "c": "~$4.43 (DeepSWE)"
    },
    "alts": [
     {
      "m": "gemini38f",
      "e": "high",
      "r": 1,
      "l": "DeepSWE #2, cheaper",
      "c": "~$2.36 (DeepSWE)"
     },
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 2,
      "l": "Budget",
      "c": "~$1.27"
     },
     {
      "m": "opus55",
      "e": "xhigh",
      "r": 3,
      "l": "Claude alt",
      "c": "~$6.05"
     }
    ]
   },
   {
    "t": "Debug a hard bug",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "max",
      "r": 1,
      "l": "Open budget",
      "c": "~$0.60"
     },
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 2,
      "l": "Value",
      "c": "~$1.27"
     },
     {
      "m": "gpt6astra",
      "e": "high",
      "r": 3,
      "l": "Strong alt",
      "c": "~$3.24"
     }
    ]
   },
   {
    "t": "Review / validate code",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "max",
      "r": 1,
      "l": "Open budget",
      "c": "~$0.60"
     },
     {
      "m": "gpt61sol",
      "e": "xhigh",
      "r": 2,
      "l": "Second opinion",
      "c": "~$0.76"
     },
     {
      "m": "kimiK31pro",
      "e": "",
      "r": 3,
      "l": "Different family",
      "c": "~$3.68"
     }
    ]
   },
   {
    "t": "Multi-step agent workflow",
    "pr": {
     "m": "gpt61sol",
     "e": "max",
     "c": "~$1.27"
    },
    "alts": [
     {
      "m": "gpt61terra",
      "e": "max",
      "r": 1,
      "l": "Budget",
      "c": "~$0.96"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 2,
      "l": "Claude alt",
      "c": "~$3.46"
     },
     {
      "m": "gpt6astra",
      "e": "xhigh",
      "r": 3,
      "l": "Stronger",
      "c": "~$3.66"
     }
    ]
   },
   {
    "t": "Coding in Cursor (daily)",
    "pr": {
     "m": "composer25",
     "e": "",
     "c": "~$0.44"
    },
    "alts": [
     {
      "m": "sonnet55",
      "e": "medium",
      "r": 1,
      "l": "Third-party (Premium+)",
      "c": "~$0.78"
     },
     {
      "m": "grok47",
      "e": "low",
      "r": 2,
      "l": "In plan pool",
      "c": "~$2.92"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 3,
      "l": "Best via Cursor",
      "c": "~$3.46"
     }
    ]
   }
  ]
 },
 {
  "name": "Content & Writing",
  "icon": "pen",
  "tasks": [
   {
    "t": "Write analysis / memo",
    "pr": {
     "m": "sonnet55",
     "e": "high",
     "c": "~$1.64"
    },
    "alts": [
     {
      "m": "haiku55",
      "e": "high",
      "r": 1,
      "l": "Budget",
      "c": "~$0.16"
     },
     {
      "m": "gpt61sol",
      "e": "high",
      "r": 2,
      "l": "Cheaper",
      "c": "~$0.59"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 3,
      "l": "Premium",
      "c": "~$3.46"
     }
    ]
   },
   {
    "t": "Translation (bulk)",
    "pr": {
     "m": "haiku55",
     "e": "medium",
     "c": "~$0.09"
    },
    "alts": [
     {
      "m": "gpt6luna",
      "e": "medium",
      "r": 1,
      "l": "Cheapest",
      "c": "~$0.04"
     },
     {
      "m": "mimoV26f",
      "e": "",
      "r": 2,
      "l": "Open weights",
      "c": "~$0.13"
     },
     {
      "m": "sonnet55",
      "e": "low",
      "r": 3,
      "l": "Higher quality",
      "c": "~$0.51"
     }
    ]
   },
   {
    "t": "Classify / extract / format",
    "pr": {
     "m": "haiku55",
     "e": "low",
     "c": "~$0.04"
    },
    "alts": [
     {
      "m": "gpt6luna",
      "e": "low",
      "r": 1,
      "l": "Cheapest",
      "c": "~$0.01"
     },
     {
      "m": "gpt61terra",
      "e": "low",
      "r": 2,
      "l": "Smarter",
      "c": "~$0.07"
     },
     {
      "m": "mimoV26f",
      "e": "",
      "r": 3,
      "l": "Open weights",
      "c": "~$0.13"
     }
    ]
   },
   {
    "t": "Marketing / creative copy",
    "pr": {
     "m": "sonnet55",
     "e": "high",
     "c": "~$1.64"
    },
    "alts": [
     {
      "m": "haiku55",
      "e": "high",
      "r": 1,
      "l": "Budget",
      "c": "~$0.16"
     },
     {
      "m": "gpt61sol",
      "e": "high",
      "r": 2,
      "l": "Alt voice",
      "c": "~$0.59"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 3,
      "l": "Premium",
      "c": "~$3.46"
     }
    ]
   }
  ]
 },
 {
  "name": "Data & Research",
  "icon": "chart",
  "tasks": [
   {
    "t": "Analyze data / statistics",
    "pr": {
     "m": "gpt61sol",
     "e": "max",
     "c": "~$1.27"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "max",
      "r": 1,
      "l": "Open budget",
      "c": "~$0.60"
     },
     {
      "m": "sonnet55",
      "e": "high",
      "r": 2,
      "l": "Claude alt",
      "c": "~$1.64"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 3,
      "l": "Premium",
      "c": "~$3.46"
     }
    ]
   },
   {
    "t": "Research / lit review",
    "pr": {
     "m": "opus55",
     "e": "xhigh",
     "c": "~$6.05"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Budget",
      "c": "~$1.27"
     },
     {
      "m": "kimiK31pro",
      "e": "",
      "r": 2,
      "l": "Alt family",
      "c": "~$3.68"
     },
     {
      "m": "gemini4carbon",
      "e": "high",
      "r": 3,
      "l": "AA #1",
      "c": "~$7.76"
     }
    ]
   },
   {
    "t": "Low-cost bulk processing",
    "pr": {
     "m": "gpt6luna",
     "e": "medium",
     "c": "~$0.04"
    },
    "alts": [
     {
      "m": "haiku55",
      "e": "low",
      "r": 1,
      "l": "Claude budget",
      "c": "~$0.04"
     },
     {
      "m": "mimoV26f",
      "e": "",
      "r": 2,
      "l": "Open weights",
      "c": "~$0.13"
     },
     {
      "m": "glm53f",
      "e": "",
      "r": 3,
      "l": "Free on Zen",
      "c": "~$0"
     }
    ]
   },
   {
    "t": "Database query generation",
    "pr": {
     "m": "gpt61terra",
     "e": "high",
     "c": "~$0.26"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "high",
      "r": 1,
      "l": "Open weights",
      "c": "~$0.46"
     },
     {
      "m": "glm53f",
      "e": "",
      "r": 2,
      "l": "Open budget",
      "c": "~$0.58"
     },
     {
      "m": "sonnet55",
      "e": "medium",
      "r": 3,
      "l": "Claude alt",
      "c": "~$0.78"
     }
    ]
   }
  ]
 },
 {
  "name": "Reasoning & Analysis",
  "icon": "sigma",
  "tasks": [
   {
    "t": "Math proof / hard reasoning",
    "pr": {
     "m": "gemini4carbon",
     "e": "high",
     "c": "~$7.76"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Budget",
      "c": "~$1.27"
     },
     {
      "m": "gpt6astra",
      "e": "max",
      "r": 2,
      "l": "Strong alt",
      "c": "~$6.24"
     },
     {
      "m": "opus55",
      "e": "max",
      "r": 3,
      "l": "Claude alt",
      "c": "~$10.04"
     }
    ]
   },
   {
    "t": "Agent orchestration prompts",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Value",
      "c": "~$1.27"
     },
     {
      "m": "sonnet55",
      "e": "high",
      "r": 2,
      "l": "Budget Claude",
      "c": "~$1.64"
     },
     {
      "m": "kimiK31pro",
      "e": "",
      "r": 3,
      "l": "Alt family",
      "c": "~$3.68"
     }
    ]
   },
   {
    "t": "Logic / puzzle solving",
    "pr": {
     "m": "gpt61sol",
     "e": "max",
     "c": "~$1.27"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "max",
      "r": 1,
      "l": "Open budget",
      "c": "~$0.60"
     },
     {
      "m": "gpt6astra",
      "e": "high",
      "r": 2,
      "l": "Stronger",
      "c": "~$3.24"
     },
     {
      "m": "opus55",
      "e": "xhigh",
      "r": 3,
      "l": "Claude alt",
      "c": "~$6.05"
     }
    ]
   }
  ]
 },
 {
  "name": "Security",
  "icon": "shield",
  "tasks": [
   {
    "t": "Security code audit",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Value",
      "c": "~$1.27"
     },
     {
      "m": "gpt6astra",
      "e": "xhigh",
      "r": 2,
      "l": "DeepSWE #1",
      "c": "~$3.66"
     },
     {
      "m": "fable51",
      "e": "xhigh",
      "r": 3,
      "l": "Long runs",
      "c": "~$10.85"
     }
    ]
   },
   {
    "t": "Vulnerability research / CVE",
    "pr": {
     "m": "gpt6astra",
     "e": "max",
     "c": "~$6.24"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Budget",
      "c": "~$1.27"
     },
     {
      "m": "kimiK31pro",
      "e": "",
      "r": 2,
      "l": "Alt family",
      "c": "~$3.68"
     },
     {
      "m": "opus55",
      "e": "xhigh",
      "r": 3,
      "l": "Claude alt",
      "c": "~$6.05"
     }
    ]
   },
   {
    "t": "Secure code generation",
    "pr": {
     "m": "sonnet55",
     "e": "high",
     "c": "~$1.64"
    },
    "alts": [
     {
      "m": "dsV41Flash",
      "e": "high",
      "r": 1,
      "l": "Open weights",
      "c": "~$0.46"
     },
     {
      "m": "gpt61sol",
      "e": "high",
      "r": 2,
      "l": "Cheaper",
      "c": "~$0.59"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 3,
      "l": "Premium",
      "c": "~$3.46"
     }
    ]
   },
   {
    "t": "Incident response / forensics",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Value",
      "c": "~$1.27"
     },
     {
      "m": "gpt6astra",
      "e": "high",
      "r": 2,
      "l": "Strong alt",
      "c": "~$3.24"
     },
     {
      "m": "gemini4carbon",
      "e": "medium",
      "r": 3,
      "l": "AA #1",
      "c": "~$6.59"
     }
    ]
   }
  ]
 },
 {
  "name": "Multimodal & Vision",
  "icon": "eye",
  "tasks": [
   {
    "t": "Vision / chart reading",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "mimoV26pro",
      "e": "",
      "r": 1,
      "l": "Open budget",
      "c": "~$0.26"
     },
     {
      "m": "gpt61sol",
      "e": "high",
      "r": 2,
      "l": "Cheaper",
      "c": "~$0.59"
     },
     {
      "m": "gemini4carbon",
      "e": "medium",
      "r": 3,
      "l": "Top Google",
      "c": "~$6.59"
     }
    ]
   },
   {
    "t": "Document OCR + analysis",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "haiku55",
      "e": "high",
      "r": 1,
      "l": "Budget",
      "c": "~$0.16"
     },
     {
      "m": "mimoV26pro",
      "e": "",
      "r": 2,
      "l": "Open budget",
      "c": "~$0.26"
     },
     {
      "m": "gpt61sol",
      "e": "high",
      "r": 3,
      "l": "Cheaper",
      "c": "~$0.59"
     }
    ]
   },
   {
    "t": "Screenshot → code",
    "pr": {
     "m": "opus55",
     "e": "high",
     "c": "~$3.46"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "max",
      "r": 1,
      "l": "Value",
      "c": "~$1.27"
     },
     {
      "m": "gemini38f",
      "e": "high",
      "r": 2,
      "l": "Strong coder",
      "c": "~$2.36 (DeepSWE)"
     },
     {
      "m": "gpt6astra",
      "e": "high",
      "r": 3,
      "l": "Strong alt",
      "c": "~$3.24"
     }
    ]
   },
   {
    "t": "Computer use / GUI",
    "pr": {
     "m": "gemini38f",
     "e": "medium",
     "c": "~$6.26"
    },
    "alts": [
     {
      "m": "gpt61sol",
      "e": "high",
      "r": 1,
      "l": "Cheaper",
      "c": "~$0.59"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 2,
      "l": "Better",
      "c": "~$3.46"
     }
    ]
   },
   {
    "t": "Multimodal (img+audio+video)",
    "pr": {
     "m": "gemini38f",
     "e": "medium",
     "c": "~$6.26"
    },
    "alts": [
     {
      "m": "nemotron35svl",
      "e": "",
      "r": 1,
      "l": "Free vision (Zen)",
      "c": "~$0"
     },
     {
      "m": "gemini4carbon",
      "e": "medium",
      "r": 2,
      "l": "Top Google",
      "c": "~$6.59"
     },
     {
      "m": "opus55",
      "e": "high",
      "r": 3,
      "l": "Best img+txt",
      "c": "~$3.46"
     }
    ]
   }
  ]
 },
 {
  "name": "Local / Private",
  "icon": "chip",
  "tasks": [
   {
    "t": "Local code agent (no cloud)",
    "pr": {
     "m": "qwen3827b",
     "e": "xhigh",
     "c": "~$0 (self-host)"
    },
    "alts": [
     {
      "m": "northMini",
      "e": "",
      "r": 1,
      "l": "Smaller GPU",
      "c": "~$0 (self-host)"
     },
     {
      "m": "gemma431",
      "e": "",
      "r": 2,
      "l": "Open alt",
      "c": "~$0 (self-host)"
     },
     {
      "m": "glm53f",
      "e": "",
      "r": 3,
      "l": "Bigger open model",
      "c": "~$0 (self-host)"
     }
    ]
   },
   {
    "t": "On-device / edge inference",
    "pr": {
     "m": "gemma431",
     "e": "",
     "c": "~$0 (self-host)"
    },
    "alts": [
     {
      "m": "mistralS4",
      "e": "",
      "r": 1,
      "l": "Efficient",
      "c": "~$0 (self-host)"
     },
     {
      "m": "northMini",
      "e": "",
      "r": 2,
      "l": "Small GPU",
      "c": "~$0 (self-host)"
     },
     {
      "m": "qwen3827b",
      "e": "medium",
      "r": 3,
      "l": "Stronger",
      "c": "~$0 (self-host)"
     }
    ]
   }
  ]
 }
];

// DeepSWE v1.1 (deepswe.datacurve.ai, updated Sep 22 2026): best config per model.
// s score % · c $/task · t output tokens (k) · st agent steps.
MG.dsw = [{"id": "gpt-6-astra", "n": "GPT-6 Astra", "p": "OpenAI", "e": "xhigh", "s": 74.1, "ci": "±3%", "c": 4.43, "t": 30, "st": 29}, {"id": "gemini-3-8-flash", "n": "Gemini 3.8 Flash", "p": "Google", "e": "high", "s": 73.8, "ci": "±1%", "c": 2.36, "t": 143, "st": 166}, {"id": "claude-opus-5", "n": "Opus 5", "p": "Anthropic", "e": "max", "s": 73.6, "ci": "±4%", "c": 11.84, "t": 118, "st": 99}, {"id": "gpt-5-6-sol", "n": "GPT-5.6 Sol", "p": "OpenAI", "e": "max", "s": 72.7, "ci": "±3%", "c": 6.46, "t": 60, "st": 61}, {"id": "claude-fable-5", "n": "Fable 5", "p": "Anthropic", "e": "xhigh", "s": 69.9, "ci": "±3%", "c": 13.41, "t": 80, "st": 68}, {"id": "gpt-5-6-terra", "n": "GPT-5.6 Terra", "p": "OpenAI", "e": "max", "s": 69.6, "ci": "±3%", "c": 3.96, "t": 72, "st": 76}, {"id": "glm-5-3", "n": "GLM-5.3", "p": "Z.ai", "e": "max", "s": 69, "ci": "±3%", "c": 3.99, "t": 80, "st": 124}, {"id": "kimi-k3", "n": "Kimi K3", "p": "Moonshot", "e": "max", "s": 68.5, "ci": "±5%", "c": 4.65, "t": 81, "st": 98}, {"id": "grok-4-6", "n": "Grok 4.6", "p": "xAI", "e": "medium", "s": 67.5, "ci": "±2%", "c": 3.45, "t": 50, "st": 70}, {"id": "gpt-5-6-luna", "n": "GPT-5.6 Luna", "p": "OpenAI", "e": "max", "s": 67.2, "ci": "±4%", "c": 0.61, "t": 73, "st": 102}, {"id": "gpt-5-5", "n": "GPT-5.5", "p": "OpenAI", "e": "xhigh", "s": 67, "ci": "±6%", "c": 7.23, "t": 46, "st": 82}, {"id": "gemini-3-7-flash", "n": "Gemini 3.7 Flash", "p": "Google", "e": "medium", "s": 65.5, "ci": "±3%", "c": 2.03, "t": 94, "st": 117}, {"id": "glm-5-3-flash", "n": "GLM-5.3-Flash", "p": "Z.ai", "e": "max", "s": 63.4, "ci": "±4%", "c": 0.24, "t": 73, "st": 123}, {"id": "deepseek-v4-pro", "n": "DeepSeek V4 Pro", "p": "DeepSeek", "e": "max", "s": 62.8, "ci": "±6%", "c": 1.67, "t": 106, "st": 155}, {"id": "claude-opus-4-8", "n": "Opus 4.8", "p": "Anthropic", "e": "max", "s": 59, "ci": "±2%", "c": 13.22, "t": 135, "st": 120}, {"id": "qwen3-8-max", "n": "Qwen3.8-Max", "p": "Alibaba", "e": "xhigh", "s": 57.5, "ci": "±3%", "c": 3.73, "t": 95, "st": 111}, {"id": "muse-spark-1-2", "n": "Muse Spark 1.2", "p": "Meta", "e": "xhigh", "s": 54.9, "ci": "±2%", "c": 3.7, "t": 99, "st": 101}, {"id": "claude-sonnet-5", "n": "Sonnet 5", "p": "Anthropic", "e": "max", "s": 53.8, "ci": "±4%", "c": 26.4, "t": 214, "st": 268}, {"id": "grok-4-5", "n": "Grok 4.5", "p": "xAI", "e": "high", "s": 53.8, "ci": "±2%", "c": 2.42, "t": 36, "st": 61}, {"id": "deepseek-v4-flash", "n": "DeepSeek V4 Flash", "p": "DeepSeek", "e": "max", "s": 53.3, "ci": "±4%", "c": 0.46, "t": 108, "st": 153}, {"id": "muse-spark-1-1", "n": "Muse Spark 1.1", "p": "Meta", "e": "xhigh", "s": 53.3, "ci": "±3%", "c": 2.36, "t": 74, "st": 96}, {"id": "gpt-5-4", "n": "GPT-5.4", "p": "OpenAI", "e": "xhigh", "s": 51.8, "ci": "±2%", "c": 5.65, "t": 71, "st": 70}, {"id": "gemini-3-6-flash", "n": "Gemini 3.6 Flash", "p": "Google", "e": "high", "s": 46.7, "ci": "±4%", "c": 2.21, "t": 96, "st": 117}, {"id": "glm-5-2", "n": "GLM-5.2", "p": "Z.ai", "e": "max", "s": 43.8, "ci": "±2%", "c": 3.92, "t": 78, "st": 129}, {"id": "gemini-3-5-flash", "n": "Gemini 3.5 Flash", "p": "Google", "e": "high", "s": 36.1, "ci": "±4%", "c": 3.45, "t": 76, "st": 105}, {"id": "kimi-k2-7-code", "n": "Kimi K2.7 Code", "p": "Moonshot", "e": "—", "s": 30.5, "ci": "±1%", "c": 2.82, "t": 59, "st": 149}, {"id": "claude-sonnet-4-6", "n": "Sonnet 4.6", "p": "Anthropic", "e": "high", "s": 29.9, "ci": "±4%", "c": 5.52, "t": 76, "st": 134}, {"id": "gemini-3-1-pro-preview", "n": "Gemini 3.1 Pro", "p": "Google", "e": "high", "s": 11.7, "ci": "±1%", "c": 2.14, "t": 28, "st": 76}];

// Price & launch timeline, newest first. n:1 = new since the last refresh.
MG.timeline = [
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

// Upcoming changes: shown until their date passes.
MG.watch = [
 {until:'2026-11-22', d:'Nov 21', t:'GPT-5.6 Sol promo ends', b:'$4/$20 → $5/$30'},
 {until:'2026-12-01', d:'Nov 30', t:'Gemini 4 Argon promo ends', b:'$2/$10 → $4/$20'},
 {until:'2027-01-01', d:'Dec 31', t:'Gemini Flash intro price ends', b:'$0.75/$3.75 → $1.50/$7.50 (3.8 / 3.7 / 3.6)'},
];
MG.gotchas = [
 'DeepSeek peak pricing is live: 2× price 01:00–04:00 and 06:00–10:00 UTC, Mon–Fri. Run batch jobs off-peak.',
 'Long-context surcharge: GPT-6 above 272K tokens ($4/$15 for 6.1 Sol, $20/$75 for Astra); Grok 4.7 above 200K ($4/$12).',
 'Gemini 4: completions over 32K tokens are billed even if the request fails (from Nov 13).',
 'Zen free models are limited-time and some use your data for training (MiMo, Big Pickle, Flint, Pulse).',
 'Not on DeepSWE yet: Claude 5.5, GPT-6.1, Gemini 4, Grok 4.7 — coding picks for them use AA only.',
];

MG.rules = [
 ['Never let a thread validate its own work.', 'Write with one family (e.g. GPT-6.1 Sol), review with another (Opus 5.5).'],
 ['Escalate model, not effort.', 'Sonnet 5.5 at max costs $10.02 a task — the same as Opus 5.5 at max, for a lower score.'],
 ['Start with GPT-6.1 Sol at max.', 'AA 55 for about $1.27 a task beats almost everything per dollar; move up only when it fails.'],
 ['Set effort on every call.', 'Cost per task can change 10× between effort levels.'],
 ['Move off legacy IDs.', 'Opus 5 / 4.8, GPT-5.6, Gemini 3.7 / 3.6, Grok 4.6 all have a newer model at the same or lower price.'],
 ['Coding is not the AA score.', 'Gemini 3.8 Flash has AA 31 but is #2 on DeepSWE (73.8%).'],
 ['Run DeepSeek off-peak.', 'Prices halve outside the peak hours.'],
 ['Free is good, not dependable.', 'Free tiers change without notice; don\u2019t rely on them in production.'],
];

MG.insights = [
 {stat:'6×', title:'One model owns the value spot', text:'GPT-6.1 Sol reaches AA 50 for $0.59 a task — about 6× cheaper than the next lab (Opus 5.5 at high, $3.46).'},
 {stat:'57–60', title:'The top is crowded', text:'Gemini 4 Carbon, Opus 5.5 and GPT-6 Astra sit within 3 points; the last few points cost $6–10 a task.'},
 {stat:'5×', title:'Coding ties, bills don\u2019t', text:'Three models tie on DeepSWE (~74%) but cost $2.36 to $11.84 a task.'},
 {stat:'−67%', title:'Prices drop every quarter', text:'OpenAI\u2019s value-tier output price went from $30 to $10 per 1M tokens in three months.'},
 {stat:'~25', title:'Open weights trail', text:'The best open-weight model (DeepSeek V4.1 Flash, AA 33) is about 25 points behind the top — but free on Zen right now.'},
];

// Output $ per 1M for each lab's value tier, by month (May..Sep 2026)
MG.trend = [
 {lab:'OpenAI', label:'5.6 Sol $30 → 6.1 Sol $10', color:'var(--c-openai)', pts:[[2,30],[3,20],[4,10]]},
 {lab:'Anthropic', label:'Opus $25 → $20', color:'var(--c-anthropic)', pts:[[0,25],[2,25],[4,20]]},
 {lab:'Google', label:'Flash $7.50 → $3.75', color:'var(--c-google)', pts:[[2,7.5],[3,3.75],[4,3.75]]},
];

// Provider strengths: [text, level 0–3]
MG.strengths = {
 cols:['Top AA','$ to reach AA 50','DeepSWE best','Open weights','Free option','Price verified'],
 rows:[
  ['OpenAI',[['57',3],['$0.59',3],['74.1%',3],['No',0],['No',0],['3 sources',1]]],
  ['Anthropic',[['59',3],['$3.46',2],['73.6%',3],['No',0],['No',0],['Official',3]]],
  ['Google',[['60',3],['$6.59',1],['73.8%',3],['Gemma',1],['No',0],['Official*',2]]],
  ['Moonshot',[['46',2],['—',0],['68.5%',2],['K3 only',1],['No',0],['2 sources',1]]],
  ['DeepSeek',[['33',1],['—',0],['62.8%',1],['MIT',3],['Zen',3],['Official',3]]],
  ['Z.ai',[['32',1],['—',0],['69.0%',2],['MIT',3],['Zen',3],['Official',3]]],
 ]};

MG.sources = [
 {u:'https://platform.claude.com/docs/en/about-claude/pricing', n:'Claude Platform Docs', d:'Claude prices, model IDs, legacy list'},
 {u:'https://cloud.google.com/vertex-ai/generative-ai/pricing', n:'Google Cloud pricing', d:'Gemini 4 Argon promo, Gemini Flash intro prices'},
 {u:'https://docs.x.ai/docs/models', n:'xAI API Docs', d:'Grok 4.7 price and context'},
 {u:'https://api-docs.deepseek.com/quick_start/pricing', n:'DeepSeek API Docs', d:'V4.1 Flash / V4 Pro peak and off-peak prices'},
 {u:'https://docs.z.ai/guides/overview/pricing', n:'Z.ai Docs', d:'GLM-5.3 / 5.3-Flash / 5.2 prices'},
 {u:'https://cursor.com/docs/models', n:'Cursor Docs', d:'Plan pool models and third-party list prices'},
 {u:'https://opencode.ai/docs/zen', n:'OpenCode Console / Zen', d:'Free model list, data policies, list prices'},
 {u:'https://artificialanalysis.ai/leaderboards/models', n:'Artificial Analysis', d:'AA Intelligence Index, cost per task by effort, prices for GPT-6, Gemini 4 Carbon, Kimi, Meta, Xiaomi, MiniMax, Mistral, Qwen'},
 {u:'https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json', n:'LiteLLM price database', d:'Open price list used to cross-check prices and long-context tiers'},
 {u:'https://deepswe.datacurve.ai', n:'DeepSWE v1.1 (Datacurve)', d:'Coding benchmark: score, cost per task, tokens, agent steps'},
 {u:'https://github.com/sst/models.dev', n:'models.dev', d:'Open model database (sst / OpenCode team), updated daily. Second cross-check for prices and long-context tiers'},
 {u:'https://openai.com/api/pricing/', n:'OpenAI Pricing', d:'Not read (bot check) — GPT-6 prices from AA, matched by LiteLLM, models.dev and OpenCode'},
];
