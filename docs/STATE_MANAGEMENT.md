# State Management

## Overview

The application uses **Redux Toolkit v1** for client-side state management. The store is configured in `src/redux/store.ts` and uses typed hooks defined in `src/redux/hooks.ts`.

## Store Configuration

`src/redux/store.ts` configures four slices:

```typescript
export const store = configureStore({
  reducer: {
    analysis: analysisReducer,        // AnalysisSlice
    breadcrumbs: breadcrumbReducer,   // BreadcrumbSlice
    video: videoReducer,              // VideoSlice
    segments: segmentReducer,         // SegmentSlice
  },
});
```

## Typed Hooks

Always use the typed hooks from `src/redux/hooks.ts` instead of plain `useDispatch` and `useSelector`:

```typescript
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const dispatch = useAppDispatch();
const videoState = useAppSelector(selectVideoState);
```

These hooks are pre-typed with `RootState` and `AppDispatch`.

## Existing Slices

### AnalysisSlice (`src/redux/AnalysisSlice/`)

Manages the active analysis mode, which controls how the Game Footage page behaves.

**Types:**
```typescript
export const ANALYSIS_MODES = ['cut', 'tag'] as const;
export type AnalysisMode = typeof ANALYSIS_MODES[number]; // 'cut' | 'tag'
```

**State:**
```typescript
interface AnalysisState {
  mode: AnalysisMode;   // default: 'cut'
}
```

**Actions:**
- `setAnalysisMode(mode: AnalysisMode)` — Switch between `'cut'` (trimming) and `'tag'` (play classification) modes

**Selector:** `selectAnalysisState(state)` → `AnalysisState`

---

### BreadcrumbSlice (`src/redux/BreadcrumbSlice/`)

Manages the breadcrumb trail shown in the sticky header bar.

**State:**
```typescript
interface BreadcrumbState {
  breadcrumbs: BreadcrumbItem[];    // BreadcrumbItem = { label: string; to?: string }
}
```

**Actions:**
- `setBreadcrumbs(items: BreadcrumbItem[])` — Set the full breadcrumb trail
- `clearBreadcrumbs()` — Reset to empty array

**Selector:** `selectBreadcrumbs(state)` → `BreadcrumbState`

**Usage pattern** — Pages dispatch breadcrumbs in a `useEffect` with cleanup:
```typescript
useEffect(() => {
  dispatch(setBreadcrumbs([
    { label: t('home'), to: '/' },
    { label: t('gameFootage') },
  ]));
  return () => { dispatch(clearBreadcrumbs()); };
}, [dispatch, t]);
```

---

### VideoSlice (`src/redux/VideoSlice/`)

Manages the currently loaded video and its playback state.

**State:**
```typescript
interface VideoState {
  videoUrl: string | null;
  videoFileName: string | null;
  youtubeVideoId: string | null;
  videoType: 'file' | 'youtube' | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  seekTo: number | null;   // non-null while a seek is pending; cleared by consumeSeek()
}
```

**Actions:**
- `setVideo({ url, fileName })` — Load a local file (clears YouTube state)
- `setYouTubeVideo({ videoId })` — Load a YouTube video (clears file state)
- `clearVideo()` — Reset all video state
- `setCurrentTime(time)` — Update playhead position
- `setDuration(duration)` — Update total duration
- `setIsPlaying(isPlaying)` — Sync play/pause state
- `requestSeek(time)` — Request an imperative seek to `time` (sets `seekTo`); used by `useSeek`
- `consumeSeek()` — Clear `seekTo` after the player has performed the seek

**Selector:** `selectVideoState(state)` → `VideoState`

---

### SegmentSlice (`src/redux/SegmentSlice/`)

Manages the pending in-progress segment and the list of saved segments.

**Types:**
```typescript
export type PlaySide = 'offense' | 'defense';
export type PlayDown = 1 | 2 | 3 | 4;
```

**State:**
```typescript
interface SegmentState {
  pendingStart: number | null;
  pendingEnd: number | null;
  pendingPlayType: string | undefined;
  pendingTags: string[];
  segments: Segment[];
}

export interface Segment {
  id: string;              // nanoid-generated
  start: number;           // seconds
  end: number;             // seconds
  duration: number;        // end - start
  side?: PlaySide;         // 'offense' | 'defense'
  down?: PlayDown;         // 1 | 2 | 3 | 4
  playType?: string;       // offense-only; cleared when side changes to 'defense'
  result?: string;         // cleared when playType or side changes
  player?: string;
  tags?: string[];
}
```

**Actions:**
- `setPendingStart(time)`, `setPendingEnd(time)` — Set the pending segment timestamps
- `setPendingPlayType(playType)`, `setPendingTags(tags)` — Set pending metadata
- `createSegment()` — Commits the pending segment to `segments[]` (no-op if start ≥ end or either is null)
- `deleteSegment(id)` — Remove a segment by ID
- `setPlayType({ id, playType })` — Update play type; also clears `result` (result options differ per play type)
- `setTags({ id, tags })` — Update tags array
- `setSide({ id, side })` — Update side; also clears `playType` when side is `'defense'` and clears `result`
- `setDown({ id, down })` — Update down number
- `setResult({ id, result })` — Update result string
- `setPlayer({ id, player })` — Update player name/number
- `clearSegments()` — Reset all pending state and empty the segments list

**Selector:** `selectSegmentState(state)` → `SegmentState`

## Creating a New Slice

### Step 1: Create the slice folder

```
src/redux/MyNewSlice/
└── index.ts
```

```typescript
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface MyNewState {
  items: string[];
}

export const initialState: MyNewState = {
  items: [],
};

const myNewSlice = createSlice({
  name: 'myNew',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item !== action.payload);
    },
  },
});

export const { addItem, removeItem } = myNewSlice.actions;

export const selectMyNewState = (state: RootState) => state.myNew;

export default myNewSlice.reducer;
```

### Step 2: Register in the store

```typescript
import myNewReducer from './MyNewSlice';

export const store = configureStore({
  reducer: {
    breadcrumbs: breadcrumbReducer,
    video: videoReducer,
    segments: segmentReducer,
    myNew: myNewReducer,
  },
});
```

## Type Exports

| Type | Purpose |
|---|---|
| `RootState` | Return type of `store.getState()` — used in selectors |
| `AppDispatch` | Type of `store.dispatch` — used in `useAppDispatch` |
| `AppThunk<ReturnType>` | Type for thunk actions |

## Conventions

- Slice folders use PascalCase: `BreadcrumbSlice/`, `VideoSlice/`, `SegmentSlice/`
- Selectors use camelCase prefixed with `select`: `selectVideoState`, `selectSegmentState`, `selectBreadcrumbs`
- `export const initialState` — exported for use in tests
- The reducer is the default export; actions and selectors are named exports
- State mutations use Immer (built into Redux Toolkit) — write "mutative" code in reducers
