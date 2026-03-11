import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import TodoSlice from './TodoSlice';

export const store = configureStore({
  reducer: { todo: TodoSlice },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
