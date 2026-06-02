import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type AnalysisMode = 'cut' | 'tag';

interface AnalysisState {
  mode: AnalysisMode;
}

const initialState: AnalysisState = {
  mode: 'cut',
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setAnalysisMode(state, action: PayloadAction<AnalysisMode>) {
      state.mode = action.payload;
    },
  },
});

export const { setAnalysisMode } = analysisSlice.actions;
export const selectAnalysisState = (state: RootState) => state.analysis;
export default analysisSlice.reducer;
