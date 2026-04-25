import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbState {
  breadcrumbs: BreadcrumbItem[];
}

const initialState: BreadcrumbState = {
  breadcrumbs: [],
};

const breadcrumbSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    setBreadcrumbs(state, action: PayloadAction<BreadcrumbItem[]>) {
      state.breadcrumbs = action.payload;
    },
    clearBreadcrumbs(state) {
      state.breadcrumbs = [];
    },
  },
});

export const { setBreadcrumbs, clearBreadcrumbs } = breadcrumbSlice.actions;

export const selectBreadcrumbs = (state: RootState) => state.breadcrumbs;

export default breadcrumbSlice.reducer;
