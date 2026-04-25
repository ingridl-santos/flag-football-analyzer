# 🏈 Flag Football Analyzer

A free, static, coach-focused video analysis tool for flag football teams.

Upload a game video, mark segments, classify plays, and export your analysis — all in the browser, with no backend required.

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
| Core | React 18, TypeScript 5, Vite 7 |
| UI | Material UI v5 (MUI) |
| State | Redux Toolkit |
| Routing | React Router v6 |
| i18n | i18next (en-US, pt-BR) |
| Video | FFmpeg.wasm (in-browser clip export) |
| Tooling | ESLint v9, Stylelint, Vitest, Storybook 10 |

---

## 🗂️ Project Structure

```
├── public/
│   ├── environment.js          # Runtime env vars (injected at deploy)
│   └── locales/
│       ├── en-US/              # English translations
│       └── pt-BR/              # Brazilian Portuguese translations
└── src/
    ├── App.tsx
    ├── i18n.ts
    ├── i18nOptions.ts
    ├── index.tsx
    ├── runtime-env.ts
    ├── components/             # Shared UI components (Breadcrumb, Dialog, …)
    ├── config/                 # Test and Storybook setup
    ├── features/
    │   ├── Errors/             # Error pages
    │   ├── GameFootage/        # Game footage analysis feature
    │   ├── Home/               # Landing / home page
    │   └── Layout/             # App shell (header, footer, nav)
    ├── hooks/                  # Custom React hooks
    ├── redux/                  # Store, slices, typed hooks
    ├── router/                 # Route definitions
    ├── theme/                  # MUI theme customisation
    └── types/                  # Shared TypeScript types
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
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit and snapshot tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:update-snapshots` | Regenerate Storybook snapshots |
| `npm run lint` | Run TypeScript + ESLint + Stylelint |
| `npm run lint:js:fix` | Auto-fix ESLint issues |
| `npm run lint:css:fix` | Auto-fix Stylelint issues |
| `npm run storybook` | Launch Storybook on port 6006 |
| `npm run storybook:build` | Build Storybook to `dist/storybook` |

---

## 🧩 Features

### Home Page
The landing page describes the application and lists available features with a **Get Started** button that navigates directly to the Game Footage tool.

### Game Footage Analysis
- Upload a local **MP4** video or load a **YouTube** video by URL
- Play / pause / seek with a visual timeline
- Set start and end timestamps to define a **segment**
- Optionally assign a **play type** and **tags** before saving
- Rule-based tag suggestions based on play type and segment duration
- Manage and review all segments in a sortable table
- **Export** your analysis:
  - **CSV** — flat table compatible with Excel / Sheets
  - **JSON** — structured data for programmatic use
  - **ZIP** — segments bundled with clipped video (local files only)

### Navigation
- Persistent header with app logo (links home) and a **Game Footage** nav entry
- Breadcrumb trail on inner pages (Home → current page)

---

## 🎨 Design System

| Token | Value |
|---|---|
| Mode | Light |
| Primary | Blue `#2563EB` |
| Secondary | Mid-grey `#6B7280` |
| Background | Off-white `#F9FAFB` |
| Paper | White `#FFFFFF` |
| Divider | `#E5E7EB` |
| Font | Inter + Roboto fallback |

---

## 🧠 Architecture Principles

1. **Fully Client-Side** — no backend, no database, no cloud processing
2. **Pages delegate to templates** — pages wire data; templates own all UI and are independently renderable in Storybook
3. **Export-First** — all data is downloadable (CSV, JSON, ZIP)
4. **Coach-Controlled** — no automatic segmentation; classification assists, never replaces

---

## 🗺️ Roadmap

| Version | Focus |
|---|---|
| **V1** (current) | Segmentation, manual classification, CSV / JSON export, YouTube support, clip generation (ffmpeg.wasm) |
| **V2** | Embedding-based classification, analytics dashboard |
| **V3** | Player tagging, multi-game insights |

---

## 🤝 Contributing

- Keep PRs small and focused
- Follow the conventions in `docs/` before writing any code
- Run `npm run lint` and `npm run test` before opening a PR
- Add Storybook stories for all new templates and components

---

## 💡 Vision

No subscriptions. No lock-in. Just usable football intelligence.
