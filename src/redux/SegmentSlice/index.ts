import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export interface Segment {
  id: string;
  start: number;
  end: number;
  duration: number;
  playType?: string;
  tags?: string[];
}

interface SegmentState {
  pendingStart: number | null;
  pendingEnd: number | null;
  pendingPlayType: string;
  pendingTags: string[];
  segments: Segment[];
}

const initialState: SegmentState = {
  pendingStart: null,
  pendingEnd: null,
  pendingPlayType: '',
  pendingTags: [],
  segments: [],
};

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
        playType: state.pendingPlayType || undefined,
        tags: state.pendingTags.length ? [...state.pendingTags] : undefined,
      });
      state.pendingStart = null;
      state.pendingEnd = null;
      state.pendingPlayType = '';
      state.pendingTags = [];
    },
    deleteSegment(state, action: PayloadAction<string>) {
      state.segments = state.segments.filter((s) => s.id !== action.payload);
    },
    setPlayType(state, action: PayloadAction<{ id: string; playType: string }>) {
      const segment = state.segments.find((s) => s.id === action.payload.id);

      if (!segment) return;

      segment.playType = action.payload.playType;
    },
    setTags(state, action: PayloadAction<{ id: string; tags: string[] }>) {
      const segment = state.segments.find((s) => s.id === action.payload.id);

      if (!segment) return;

      segment.tags = action.payload.tags;
    },
    clearSegments(state) {
      state.pendingStart = null;
      state.pendingEnd = null;
      state.pendingPlayType = '';
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
  clearSegments,
} = segmentSlice.actions;

export const selectSegmentState = (state: RootState) => state.segments;

export default segmentSlice.reducer;
