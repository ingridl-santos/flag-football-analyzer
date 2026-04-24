# 🏈 Flag Football Analyzer

A free, static, coach-focused video analysis tool for flag football teams.

This application allows coaches to:
- Upload and analyze game/practice footage
- Manually segment plays using timestamps
- Classify plays (assisted + automated in future versions)
- Export structured data for Excel, Hudl, and further analysis

---

## 🎯 Project Goals

- Build a zero-cost, browser-based tool
- Keep all processing client-side
- Ensure data portability (download-first)
- Support real coach workflows
- Be deployable on Vercel / GitHub Pages

---

## 🧱 Tech Stack

| Category | Libraries |
|---|---|
| Core | React, TypeScript, Vite |
| UI | Material UI (MUI) |
| State | Redux Toolkit |
| Routing | React Router DOM |
| i18n | i18next |
| Tooling | ESLint, Stylelint, Vitest, Storybook |
| Future (V2+) | ffmpeg.wasm, onnxruntime-web |

---

## 🗂️ Project Structure

```
├── public/
│   ├── environment.jsre
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   └── home.json
│       └── pt/
│           └── common.json
└── src/
    ├── App.tsx
    ├── i18n.ts
    ├── i18nOptions.ts
    ├── index.tsx
    ├── runtime-env.ts
    ├── __mocks__/
    │   └── i18n.ts
    ├── __tests__/
    │   └── snapshots.test.ts
    ├── components/       # Shared UI components
    │   ├── ComponentExample/
    │   ├── InputForm/
    │   └── TodoItem/
    ├── config/           # Test and story setup
    │   ├── setupPortableStories.ts
    │   └── setupTests.ts
    ├── features/         # Domain features
    │   ├── Home/
    │   └── TodoListPage/
    ├── redux/            # Redux store and slices
    │   ├── hooks.ts
    │   ├── store.ts
    │   └── TodoSlice/
    ├── router/           # Route definitions
    │   ├── routeDefinitions.tsx
    │   └── router.tsx
    ├── theme/            # MUI theme
    │   └── base.ts
    └── types/            # Shared TypeScript types
        └── router/
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Run ESLint + Stylelint |
| `npm run storybook` | Launch Storybook |

---

## 🧩 Core Features

### 1. Video Analysis
- Upload local MP4 video
- Play / pause / seek
- Display current timestamp

### 2. Segmentation
- Set start / end timestamps
- Create and manage segments
- Stored in Redux

```ts
type Segment = {
  id: string
  start: number
  end: number
  duration: number
  playType?: string
  tags?: string[]
}
```

### 3. Classification (V1 — Rule-Based)

| Play Type | Tags |
|---|---|
| Pass | `["offense", "air"]` |
| Run | `["offense", "ground"]` |
| Duration < 3s | adds `"quick"` |

### 4. Export

**CSV**
```
id,start,end,duration,playType,tags
```

**JSON**
```json
{
  "segments": []
}
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Mode | Dark (default) |
| Primary | Gold `#C9A227` |
| Secondary | Silver `#C0C0C0` |
| Background | Black `#121212` |

**UX Principles:** desktop-first, minimal clicks, clear data visibility, built for film sessions.

---

## 🧠 Architecture Principles

1. **Fully Client-Side** — no backend, no database, no cloud processing
2. **Export-First** — all data is downloadable (CSV, JSON, ZIP in future)
3. **Coach-Controlled** — no automatic segmentation; AI assists, never replaces
4. **Progressive Enhancement** — V1 manual → V2 clips + embeddings → V3 analytics

---

## 🗺️ Roadmap

| Version | Focus |
|---|---|
| **V1** (current) | Segmentation, manual classification, CSV/JSON export |
| **V2** | Clip generation (ffmpeg.wasm), embedding-based classification (CLIP) |
| **V3** | Analytics dashboard, player tagging, multi-game insights |

### Current Scope (V1)

**Included:**
- Local video upload (MP4), playback, timestamp-based segmentation
- Manual play type selection, rule-based tag generation
- CSV and JSON export

**Not included yet:**
- Clip generation, AI classification, YouTube support, cloud sync

---

## ⚠️ Constraints & Decisions

- **Static hosting only** — must work on GitHub Pages / Vercel; no server dependencies
- **Local video only** — only local files supported in V1; files >2GB may cause issues
- **No YouTube** — not supported in V1 (metadata-only planned for V2)

---

## 🧠 Engineering Guidelines

- Prefer simple solutions first; avoid premature optimization
- Keep components small and reusable
- Separate UI from logic
- Use Redux for all shared state
- Add tests for logic; use Storybook for UI components

---

## 🤝 Contributing

- Keep PRs small and focused
- Follow linting rules
- Add tests for logic when possible
- Use Storybook for UI components

---

## 💡 Vision

This is not just a tool — it's a foundation for a lightweight, private, coach-controlled analytics platform.

No subscriptions. No lock-in. Just usable football intelligence.
