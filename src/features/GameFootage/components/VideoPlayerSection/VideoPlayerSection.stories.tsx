import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import VideoPlayerSection from '.';

const meta: Meta<typeof VideoPlayerSection> = {
  title: 'Features / Game Footage / Components / Video Player Section',
  component: VideoPlayerSection,
  parameters: {
    layout: 'padded',
  },
  args: {
    onFileSelect: action('onFileSelect'),
    onYouTubeUrl: action('onYouTubeUrl'),
    onTimeUpdate: action('onTimeUpdate'),
    onDurationChange: action('onDurationChange'),
    onPlayStateChange: action('onPlayStateChange'),
    onSeek: action('onSeek'),
    onSegmentClick: action('onSegmentClick'),
    segments: [],
    activeSegmentId: null,
  },
};

export default meta;

type Story = StoryObj<typeof VideoPlayerSection>;

export const Upload: Story = {
  args: {
    videoType: null,
    videoUrl: null,
    videoFileName: null,
    youtubeVideoId: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  },
};

export const WithVideo: Story = {
  args: {
    videoType: 'file',
    videoUrl: 'mock://game-footage.mp4',
    videoFileName: 'game-footage.mp4',
    youtubeVideoId: null,
    currentTime: 42,
    duration: 180,
    isPlaying: false,
  },
};

export const WithSegments: Story = {
  args: {
    ...WithVideo.args,
    currentTime: 55,
    segments: [
      { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense'] },
      { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense'] },
    ],
    activeSegmentId: '2',
  },
};

export const WithYouTube: Story = {
  args: {
    videoType: 'youtube',
    videoUrl: null,
    videoFileName: null,
    youtubeVideoId: 'dQw4w9WgXcQ',
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
  args: {
    videoType: null,
    videoUrl: null,
    videoFileName: null,
    youtubeVideoId: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  },
};
