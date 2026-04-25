# Architecture

## Overview

The application is a single-page app (SPA) built with React 18, React Router v6 (data router), Redux Toolkit, and MUI v5. There is no backend — all logic runs in the browser.

## Entry Point and Provider Composition

`src/index.tsx` bootstraps the app. The provider stack, from outermost to innermost:

```
<React.StrictMode>
  <I18nextProvider>       ← i18next translations
    <Provider store>      ← Redux store
      <RouterProvider>    ← React Router v6 data router
```

Inside the router, `App.tsx` adds:

```
<ThemeProvider>           ← MUI theme
  <CssBaseline />         ← Global CSS reset
    <Suspense>            ← Lazy-loaded route boundary
      <Outlet />          ← Router outlet
```

## Routing

Routes are defined in `src/router/routeDefinitions.tsx`. All routes are **nested under the Layout route**, which renders the persistent `Header`, `Footer`, and breadcrumb bar around each page:

```
<App />                                     (ThemeProvider, CssBaseline)
└── <Layout />   (LayoutPage → LayoutTemplate + Header + Footer + breadcrumbs)
    ├── /                  → HomePage
    └── /game-footage      → GameFootagePage
```

All route-level components are **lazy-loaded** using `React.lazy(() => import(...))`. Every route has an `errorElement: <Errors.ErrorPage />`.

### Route Definitions

The `ROUTES` constant maps logical names to page names:

```typescript
export const ROUTES = {
  home: 'HomePage',
  gameFootage: 'GameFootagePage',
} as const;
```

New routes must be added to `ROUTES_DEFINITIONS` as children of the Layout route.

## Page / Template Pattern

This separation is non-negotiable:

| Layer | File | Responsibility |
|---|---|---|
| **Page** | `src/features/X/pages/XPage.tsx` | Wire up data: Redux selectors, dispatches, hooks. As thin as possible. |
| **Template** | `src/features/X/templates/XTemplate/index.tsx` | All UI layout and presentation. Receives all data as props. No Redux or API access. |

Templates must be **independently renderable in Storybook** using only the global decorators (ThemeProvider, I18nextProvider, MemoryRouter).

Pages are never given Storybook stories — only templates are.

**Every page must:**
1. Call `useDocumentTitle` from `src/hooks/useDocumentTitle.ts` to set the browser tab title
2. Dispatch `setBreadcrumbs` in a `useEffect` (with cleanup `clearBreadcrumbs`) when the page has a navigation hierarchy deeper than the root

## Component Structure

```
src/
├── components/                    # Shared, feature-agnostic components
│   ├── AppLogo/
│   ├── Breadcrumb/
│   ├── Dialog/                    # Project Dialog wrapper (always use instead of MUI Dialog directly)
│   ├── ErrorPanel/
│   ├── MultilineSkelly/           # Multi-line skeleton text utility
│   ├── VideoPlayer/               # HTML5 video player
│   └── YouTubePlayer/             # YouTube iframe API player
└── features/
    ├── Errors/                    # Error boundary pages
    ├── GameFootage/
    │   ├── components/            # Feature-scoped components
    │   │   ├── PlayTypeSelector/
    │   │   ├── SegmentList/
    │   │   ├── SegmentTable/
    │   │   ├── TagSuggestions/
    │   │   └── YouTubeUrlInput/
    │   ├── pages/
    │   │   └── GameFootagePage.tsx
    │   └── templates/
    │       └── GameFootageTemplate/
    ├── Home/
    │   ├── pages/HomePage.tsx
    │   └── templates/HomeTemplate/
    └── Layout/
        ├── components/            # Header, Footer, SkipLink
        ├── pages/LayoutPage/      # Reads breadcrumbs from Redux, renders LayoutTemplate
        └── templates/LayoutTemplate/
```

## Redux Store

The store is configured in `src/redux/store.ts` with three slices:

| Reducer key | Slice file | Purpose |
|---|---|---|
| `breadcrumbs` | `BreadcrumbSlice/` | Page breadcrumb trail, managed by pages via `useEffect` |
| `video` | `VideoSlice/` | Current video (URL/YouTube ID/type), playback state (time, duration, isPlaying) |
| `segments` | `SegmentSlice/` | Pending segment (start/end/playType/tags) and the saved segments list |

Always use the typed hooks from `src/redux/hooks.ts`:
```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks';
```

See [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) for full slice API details.

## Custom Hooks

All custom hooks live in `src/hooks/`. Each hook **must** have a co-located unit test:

| Hook | Purpose |
|---|---|
| `useDocumentTitle` | Sets the browser tab title using the `pageTitles` i18n namespace |
| `useVideoExport` | Manages FFmpeg.wasm loading and ZIP export of video segments |
| `useVideoPlayer` | Controls HTML5 video playback (play/pause/seek/time tracking) |
| `useYouTubePlayer` | Controls YouTube iframe API playback |
| `useWidth` | Returns the current MUI breakpoint name (`xs`, `sm`, `md`, `lg`, `xl`) |

## Utility Functions

All utility functions live in `src/utils/`. Each file **must** have a co-located unit test:

| Utility | Purpose |
|---|---|
| `formatTime` | Formats seconds to `MM:SS` or `H:MM:SS` strings |
| `parseYoutubeUrl` | Extracts a YouTube video ID from various URL formats |
| `exportSegments` | Converts segments to CSV/JSON; triggers file download |
| `suggestTags` | Returns auto-detected and manual tag suggestions based on play type and duration |
| `responsive` | Helper for MUI responsive `sx` breakpoint values |

## Layout Template Behavior

`LayoutTemplate` (`src/features/Layout/templates/LayoutTemplate/index.tsx`):

- Uses `overflowY: 'auto'` on the scrollable content area (not `scroll`) to prevent the phantom scrollbar gap.
- Uses `useRef` + `useEffect` to scroll back to the top of the content area on `pathname` change (not `window.scrollTo`).
- Renders a sticky breadcrumb bar above the main content when `breadcrumbsItems` is non-empty.

## Runtime Environment Variables

Environment variables are **injected at runtime** via `window.env` (not baked into the build). The `public/environment.js` file sets these values and is served as a static asset. The app waits in `src/runtime-env.ts` until `window.env` is available before rendering.

See [ENVIRONMENT_AND_DEPLOYMENT.md](ENVIRONMENT_AND_DEPLOYMENT.md) for adding new env vars.
