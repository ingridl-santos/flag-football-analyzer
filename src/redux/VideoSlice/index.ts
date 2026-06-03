import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

interface VideoState {
  videoUrl: string | null;
  videoFileName: string | null;
  youtubeVideoId: string | null;
  videoType: 'file' | 'youtube' | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  seekTo: number | null;
}

const initialState: VideoState = {
  videoUrl: null,
  videoFileName: null,
  youtubeVideoId: null,
  videoType: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  seekTo: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideo(state, action: PayloadAction<{ url: string; fileName: string }>) {
      state.videoUrl = action.payload.url;
      state.videoFileName = action.payload.fileName;
      state.youtubeVideoId = null;
      state.videoType = 'file';
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = false;
      state.seekTo = null;
    },
    setYouTubeVideo(state, action: PayloadAction<{ videoId: string }>) {
      state.videoUrl = null;
      state.videoFileName = null;
      state.youtubeVideoId = action.payload.videoId;
      state.videoType = 'youtube';
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = false;
      state.seekTo = null;
    },
    clearVideo(state) {
      state.videoUrl = null;
      state.videoFileName = null;
      state.youtubeVideoId = null;
      state.videoType = null;
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = false;
      state.seekTo = null;
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
    requestSeek(state, action: PayloadAction<number>) {
      state.seekTo = action.payload;
    },
    consumeSeek(state) {
      state.seekTo = null;
    },
  },
});

export const {
  setVideo,
  setYouTubeVideo,
  clearVideo,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  requestSeek,
  consumeSeek,
} = videoSlice.actions;

export const selectVideoState = (state: RootState) => state.video;

export default videoSlice.reducer;
