import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type PlaySide = 'offense' | 'defense';
export type PlayDown = 1 | 2 | 3 | 4;

/** Intersect with this to add a required `id` to any action payload. */
type WithId<T> = { id: string } & T;

export interface Segment {
  id: string;
  start: number;
  end: number;
  duration: number;
  side?: PlaySide;
  down?: PlayDown;
  playType?: string;
  result?: string;
  player?: string;
  tags?: string[];
}

interface SegmentState {
  pendingStart: number | null;
  pendingEnd: number | null;
  pendingPlayType: string | undefined;
  pendingTags: string[];
  segments: Segment[];
}

const initialState: SegmentState = {
  pendingStart: null,
  pendingEnd: null,
  pendingPlayType: undefined,
  pendingTags: [],
  segments: [],
};

function findSegment(state: SegmentState, id: string): Segment | undefined {
  return state.segments.find((s) => s.id === id);
}

const segmentSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    setPendingStart(state, action: PayloadAction<number>) {
      state.pendingStart = action.payload;
    },
    setPendingEnd(state, action: PayloadAction<number>) {
      state.pendingEnd = action.payload;
    },
    setPendingPlayType(state, action: PayloadAction<string>) {
      state.pendingPlayType = action.payload;
    },
    setPendingTags(state, action: PayloadAction<string[]>) {
      state.pendingTags = action.payload;
    },
    createSegment(state) {
      const { pendingStart, pendingEnd } = state;

      if (pendingStart === null || pendingEnd === null) return;
      if (pendingStart >= pendingEnd) return;

      state.segments.push({
        id: nanoid(),
        start: pendingStart,
        end: pendingEnd,
        duration: pendingEnd - pendingStart,
        playType: state.pendingPlayType,
        tags: state.pendingTags.length ? [...state.pendingTags] : undefined,
      });
      state.pendingStart = null;
      state.pendingEnd = null;
      state.pendingPlayType = undefined;
      state.pendingTags = [];
    },
    deleteSegment(state, action: PayloadAction<string>) {
      state.segments = state.segments.filter((s) => s.id !== action.payload);
    },
    setPlayType(state, action: PayloadAction<WithId<{ playType: string | undefined }>>) {
      const segment = findSegment(state, action.payload.id);

      if (!segment) return;

      segment.playType = action.payload.playType || undefined;
      // result options differ per play type — clear to avoid stale classification data.
      segment.result = undefined;
    },
    setTags(state, action: PayloadAction<WithId<{ tags: string[] }>>) {
      const segment = findSegment(state, action.payload.id);

      if (!segment) return;

      segment.tags = action.payload.tags;
    },
    setSide(state, action: PayloadAction<WithId<{ side: PlaySide | undefined }>>) {
      const segment = findSegment(state, action.payload.id);

      if (!segment) return;

      segment.side = action.payload.side;

      // playType (Run/Pass) is offense-only; result options differ per side —
      // clear both whenever side changes to avoid stale classification data.
      if (action.payload.side !== 'offense') {
        segment.playType = undefined;
      }
      segment.result = undefined;
    },
    setDown(state, action: PayloadAction<WithId<{ down: PlayDown | undefined }>>) {
      const segment = findSegment(state, action.payload.id);

      if (!segment) return;

      segment.down = action.payload.down;
    },
    setResult(state, action: PayloadAction<WithId<{ result: string | undefined }>>) {
      const segment = findSegment(state, action.payload.id);

      if (!segment) return;

      segment.result = action.payload.result;
    },
    setPlayer(state, action: PayloadAction<WithId<{ player: string | undefined }>>) {
      const segment = findSegment(state, action.payload.id);

      if (!segment) return;

      segment.player = action.payload.player;
    },
    clearSegments(state) {
      state.pendingStart = null;
      state.pendingEnd = null;
      state.pendingPlayType = undefined;
      state.pendingTags = [];
      state.segments = [];
    },
  },
});

export const {
  setPendingStart,
  setPendingEnd,
  setPendingPlayType,
  setPendingTags,
  createSegment,
  deleteSegment,
  setPlayType,
  setTags,
  setSide,
  setDown,
  setResult,
  setPlayer,
  clearSegments,
} = segmentSlice.actions;

export const selectSegmentState = (state: RootState) => state.segments;

export default segmentSlice.reducer;
