import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { computeTags } from '../../utils/computeTags';
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
  segments: Segment[];
}

const initialState: SegmentState = {
  pendingStart: null,
  pendingEnd: null,
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
    createSegment(state) {
      const { pendingStart, pendingEnd } = state;

      if (pendingStart === null || pendingEnd === null) return;
      if (pendingStart >= pendingEnd) return;

      state.segments.push({
        id: nanoid(),
        start: pendingStart,
        end: pendingEnd,
        duration: pendingEnd - pendingStart,
      });
      state.pendingStart = null;
      state.pendingEnd = null;
    },
    deleteSegment(state, action: PayloadAction<string>) {
      state.segments = state.segments.filter((s) => s.id !== action.payload);
    },
    setPlayType(state, action: PayloadAction<{ id: string; playType: string }>) {
      const segment = state.segments.find((s) => s.id === action.payload.id);

      if (!segment) return;

      segment.playType = action.payload.playType;
      segment.tags = computeTags(action.payload.playType, segment.duration);
    },
    clearSegments(state) {
      state.pendingStart = null;
      state.pendingEnd = null;
      state.segments = [];
    },
  },
});

export const { setPendingStart, setPendingEnd, createSegment, deleteSegment, setPlayType, clearSegments }
  = segmentSlice.actions;

export const selectSegmentState = (state: RootState) => state.segments;

export default segmentSlice.reducer;
