import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

interface VideoState {
  videoUrl: string | null;
  videoFileName: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

const initialState: VideoState = {
  videoUrl: null,
  videoFileName: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideo(state, action: PayloadAction<{ url: string; fileName: string }>) {
      state.videoUrl = action.payload.url;
      state.videoFileName = action.payload.fileName;
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = false;
    },
    clearVideo(state) {
      state.videoUrl = null;
      state.videoFileName = null;
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = false;
    },
    setCurrentTime(state, action: PayloadAction<number>) {
      state.currentTime = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
  },
});

export const { setVideo, clearVideo, setCurrentTime, setDuration, setIsPlaying } = videoSlice.actions;

export const selectVideoState = (state: RootState) => state.video;

export default videoSlice.reducer;
