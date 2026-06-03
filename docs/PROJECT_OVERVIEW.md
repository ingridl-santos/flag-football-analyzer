# Project Overview

## Summary

**Flag Football Analyzer** is a free, browser-based video analysis tool for flag football coaches and teams. All processing — including video clipping via FFmpeg.wasm — happens entirely in the browser. No account, cloud storage, or subscription is required.

Users can:
- Load a local MP4 file or paste a YouTube URL
- Watch the video and mark timestamps to create segments
- Assign a play type (Pass, Run, Defense) and tags to each segment
- Export their analysis as CSV, JSON, or a ZIP archive containing clipped video clips plus metadata

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server at `http://localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run all checks: TypeScript + ESLint + Stylelint |
| `npm run lint:js` | ESLint only on `src/**/*.{ts,tsx}` |
| `npm run lint:js:fix` | ESLint with auto-fix |
| `npm run lint:css` | Stylelint on `src/**/*.{css,scss}` |
| `npm run lint:css:fix` | Stylelint with auto-fix |
| `npm run test` | Single test run (Vitest) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Coverage with V8 |
| `npm run test:update-snapshots` | Delete and regenerate all Storybook snapshots |
| `npm run storybook` | Start Storybook dev server at port 6006 |
| `npm run storybook:build` | Build Storybook to `dist/storybook/` |

## Directory Layout

```
flag-football-analyzer/
├── public/
│   ├── environment.js            # Runtime env var injection (window.env)
│   ├── locales/
│   │   ├── en-US/                # English translations (primary)
│   │   └── pt-BR/                # Portuguese translations
│   └── vendor/ffmpeg/            # FFmpeg.wasm WASM/worker files
├── src/
│   ├── App.tsx                   # Root component (ThemeProvider, CssBaseline, Suspense)
│   ├── index.tsx                 # Entry point — ReactDOM.createRoot, Redux Provider, Router
│   ├── i18n.ts                   # i18next initialization
│   ├── i18nOptions.ts            # Shared i18next config (used by app and Storybook)
│   ├── runtime-env.ts            # window.env type declaration + wait loop
│   ├── __mocks__/i18n.ts         # i18n mock for tests
│   ├── __tests__/                # Automated snapshot tests
│   ├── components/               # Shared, feature-agnostic components
│   ├── config/                   # Test setup files
│   ├── features/                 # Feature modules (Errors, GameFootage, Home, Layout)
│   ├── hooks/                    # Custom React hooks (co-located unit tests required)
│   ├── redux/                    # Redux store, slices, typed hooks
│   ├── router/                   # Route definitions and router instance
│   ├── theme/                    # MUI theme (palette, typography, component overrides)
│   ├── types/                    # Shared TypeScript types
│   └── utils/                    # Pure utility functions (co-located unit tests required)
├── .storybook/                   # Storybook config (main.ts, preview.tsx, i18n setup)
├── docs/                         # Project documentation (this folder)
├── eslint.config.js              # ESLint v9 flat config
├── vite.config.ts                # Vite configuration
├── vitest.config.ts              # Vitest configuration
└── tsconfig.json                 # TypeScript configuration
```

## Features

### Home (`src/features/Home/`)

Landing page that describes the tool and links to the Game Footage analyzer. No Redux state. No API calls.

### Game Footage (`src/features/GameFootage/`)

The core feature. Handles:
- File upload (local MP4) or YouTube URL input
- Video playback via `VideoPlayer` (HTML5) or `YouTubePlayer` (iframe API)
- Segment creation: set start/end timestamps at the current playhead position
- Segment metadata: play type selector, tag autocomplete with AI-suggested tags
- Segment table view
- Export: CSV, JSON, and ZIP (FFmpeg.wasm clips each segment from the local file)

### Layout (`src/features/Layout/`)

Persistent shell: `Header`, `Footer`, `SkipLink`, breadcrumb bar, and the `LayoutTemplate` that wraps all pages. Reads breadcrumbs from Redux.

### Errors (`src/features/Errors/`)

Error boundary pages used by all route `errorElement` definitions.

## Key Architectural Decisions

- **No backend / no auth** — Everything runs in the browser. There are no API calls to any backend service.
- **Redux for cross-page state** — Video state, segment state, and breadcrumbs are stored in Redux (not local component state) so they persist during navigation.
- **FFmpeg.wasm for video export** — `@ffmpeg/ffmpeg` (single-threaded, `core-st`) runs in-browser to cut video clips without a server. The WASM binary is served from `public/vendor/ffmpeg/`.
- **Page → Template separation** — Pages wire up data; templates render UI. Templates must be Storybook-renderable without Redux or Router context beyond what global decorators provide.
