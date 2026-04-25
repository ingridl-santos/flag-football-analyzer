import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import breadcrumbReducer from './BreadcrumbSlice';
import segmentReducer from './SegmentSlice';
import videoReducer from './VideoSlice';

export const store = configureStore({
  reducer: {
    breadcrumbs: breadcrumbReducer,
    video: videoReducer,
    segments: segmentReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
