# Architecture

## Overview

The application is a single-page app (SPA) built with React 18, React Router v6 (data router), Redux Toolkit, and MUI v5. There is no backend — all logic runs in the browser.

## Entry Point and Provider Composition

`src/index.tsx` bootstraps the app. The provider stack, from outermost to innermost:

```
<I18nextProvider>         ← i18next translations
  <ErrorBoundary>         ← top-level error boundary
    <Provider store>      ← Redux store
      <Suspense>          ← lazy-load boundary
        <RouterProvider>  ← React Router v6 data router
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

## HOC Slot Pattern (Complex Features)

When a feature has multiple **independent sections** that each require their own data/logic (Redux state, API calls, local state), use the **HOC slot pattern** to maintain clean separation of concerns. This pattern adds two more layers on top of the Page/Template pattern:

### Architecture

```
src/features/MyFeature/
├── components/          # Pure presentation components (no Redux, no services)
│   ├── SectionA/
│   │   ├── index.tsx
│   │   └── SectionA.stories.tsx
│   ├── SectionB/
│   │   ├── index.tsx
│   │   └── SectionB.stories.tsx
│   └── SectionC/
│       ├── index.tsx
│       └── SectionC.stories.tsx
├── hocs/                # Logic wrappers — connect Redux/services to components
│   ├── SectionAHoc.tsx
│   ├── SectionBHoc.tsx
│   └── SectionCHoc.tsx
├── pages/
│   └── MyFeaturePage.tsx    # Instantiates HOCs, passes them as slots to template
└── templates/
    └── MyFeatureTemplate/
        ├── index.tsx            # Layout shell — accepts HOCs as ReactNode slots
        └── MyFeatureTemplate.stories.tsx
```

### Layer Responsibilities

|Layer|Responsibility|Imports from|
|---|---|---|
|**Component**|Pure presentation — receives data/callbacks via props, no Redux/services|MUI, shared components|
|**HOC**|Logic — connects Redux, manages local state, calls services, passes props to component|Redux hooks, services, its component|
|**Template**|Layout shell — arranges ReactNode slots, handles conditional rendering (e.g., responsive breakpoints)|MUI layout primitives|
|**Page**|Orchestration — instantiates HOCs, passes them as slot props to template|HOCs, template|

### How It Works

1. **The template** defines `ReactNode` slot props for each section:

```tsx
export interface MyFeatureTemplateProps {
  SectionAHoc: ReactNode;
  SectionBHoc: ReactNode;
  SectionCHoc: ReactNode;
}

export default function MyFeatureTemplate({
  SectionAHoc,
  SectionBHoc,
  SectionCHoc,
}: MyFeatureTemplateProps) {
  return (
    <Stack>
      {SectionAHoc}
      {SectionBHoc}
      {SectionCHoc}
    </Stack>
  );
}
```

2. **Each HOC** connects logic to its presentation component:

```tsx
export default function SectionAHoc() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectSectionAData);

  const handleAction = useCallback(() => {
    dispatch(someAction());
  }, [dispatch]);

  return (
    <SectionA
      data={data}
      onAction={handleAction}
    />
  );
}
```

3. **The page** instantiates HOCs and passes them as slots:

```tsx
export default function MyFeaturePage() {
  const { t } = useTranslation('pageTitles');
  useDocumentTitle(t('myFeature'));

  return (
    <MyFeatureTemplate
      SectionAHoc={<SectionAHoc />}
      SectionBHoc={<SectionBHoc />}
      SectionCHoc={<SectionCHoc />}
    />
  );
}

  return (
    <MyFeatureTemplate
      SectionAHoc={<SectionAHoc />}
      SectionBHoc={<SectionBHoc />}
      SectionCHoc={<SectionCHoc />}
    />
  );
}
```

4. **Storybook stories** replace HOCs with the real presentation components fed mock data:

```tsx
export const Default: Story = {
  args: {
    SectionAHoc: (
      <SectionA
        data={mockData}
        onAction={action('onAction')}
      />
    ),
    SectionBHoc: (
      <SectionB ... />
    ),
  },
};
```

### Naming Conventions

- **Component folders** use the section name without the feature prefix (e.g., `Greeting/`, not `HomeGreeting/`).
- **HOC files** append `Hoc` to the component name (e.g., `GreetingHoc.tsx`).
- **Slot prop names** match the HOC name (e.g., `GreetingHoc: ReactNode`).
- **Each component** gets its own Storybook stories file in its folder.

### When to Use This Pattern

Use the HOC slot pattern when:

- A feature page has **3+ independent sections** that each need their own state/logic.
- Sections connect to **different Redux slices or API services**.
- You want each section to be **testable and renderable in Storybook independently**.
- The template layout varies by state (e.g., responsive breakpoints, conditional sections).

Do **not** use it for simple features where a page has one or two props to pass to a template — the basic Page/Template pattern is sufficient.


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
    │   │   ├── ModeToggle/
    │   │   ├── PlayClassifier/
    │   │   ├── PlayTypeSelector/
    │   │   ├── SegmentControls/
    │   │   ├── SegmentPanel/
    │   │   ├── SegmentTable/
    │   │   ├── SegmentTimeline/
    │   │   ├── TagSuggestions/
    │   │   ├── VideoPlayerSection/
    │   │   └── YouTubeUrlInput/
    │   ├── hocs/                  # Logic wrappers (Redux → components)
    │   │   ├── ModeToggleHoc.tsx
    │   │   ├── SegmentControlsHoc.tsx
    │   │   ├── SegmentPanelHoc.tsx
    │   │   └── VideoPlayerHoc.tsx
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

The store is configured in `src/redux/store.ts` with four slices:

| Reducer key | Slice file | Purpose |
|---|---|---|
| `analysis` | `AnalysisSlice/` | Active analysis mode (`'cut'` \| `'tag'`), controls Game Footage page behaviour |
| `breadcrumbs` | `BreadcrumbSlice/` | Page breadcrumb trail, managed by pages via `useEffect` |
| `video` | `VideoSlice/` | Current video (URL/YouTube ID/type), playback state (time, duration, isPlaying, seekTo) |
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
| `useActiveSegmentId` | Returns the ID of the segment that contains the current playhead time |
| `useDocumentTitle` | Sets the browser tab title using the `pageTitles` i18n namespace |
| `useSeek` | Watches `seekTo` from `VideoSlice` and calls the player's seek method imperatively |
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
