import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { Task } from './types';
import { RootState } from '../store';

export interface ToDoState {
  todoList: Array<Task>;
}

export const initialState: ToDoState = {
  todoList: [
    { title: 'Start a new React Project', done: true, id: 'asjidha' },
    { title: 'Finish MVP', done: false, id: 'jasdiasd' },
  ],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state, { payload }: PayloadAction<string>) => {
      // just example, usually the backend should create the ID
      const randomString = `${Math.random() * 999}`;

      state.todoList = [
        { done: false, id: randomString, title: payload },
        ...state.todoList,
      ];
    },
    removeTask: (state, { payload }: PayloadAction<string>) => {
      state.todoList = state.todoList.filter((task) => task.id !== payload);
    },
    updateTask: (state, { payload }: PayloadAction<string>) => {
      state.todoList = state.todoList.map((task) => {
        if (task.id === payload) {
          return { ...task, done: !task.done };
        }
        return task;
      });
    },
  },
});

// action
export const { addTask, removeTask, updateTask } = todoSlice.actions;

// state
export const todoSelect = (state: RootState) => state.todo;

// reducer
export default todoSlice.reducer;
