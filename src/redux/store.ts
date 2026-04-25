import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import videoReducer from './VideoSlice';

export const store = configureStore({
  reducer: {
    video: videoReducer,
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
