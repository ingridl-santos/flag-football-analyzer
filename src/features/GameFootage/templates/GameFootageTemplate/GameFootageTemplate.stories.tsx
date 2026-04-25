import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import GameFootageTemplate from '.';

const meta: Meta<typeof GameFootageTemplate> = {
  title: 'Features / Game Footage / Templates / Game Footage Template',
  component: GameFootageTemplate,
  parameters: {
    layout: 'padded',
  },
  args: {
    onFileSelect: action('onFileSelect'),
    onTimeUpdate: action('onTimeUpdate'),
    onDurationChange: action('onDurationChange'),
    onPlayStateChange: action('onPlayStateChange'),
    onSeek: action('onSeek'),
    onSetStart: action('onSetStart'),
    onSetEnd: action('onSetEnd'),
    onCreateSegment: action('onCreateSegment'),
    onDeleteSegment: action('onDeleteSegment'),
    onSetPlayType: action('onSetPlayType'),
    onExportCsv: action('onExportCsv'),
    onExportJson: action('onExportJson'),
    segments: [],
  },
};

export default meta;

type Story = StoryObj<typeof GameFootageTemplate>;

export const Default: Story = {
  args: {
    videoUrl: null,
    videoFileName: null,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    pendingStart: null,
    pendingEnd: null,
    segments: [],
  },
};

export const WithVideo: Story = {
  args: {
    videoUrl: 'mock://game-footage.mp4',
    videoFileName: 'game-footage.mp4',
    currentTime: 42,
    duration: 180,
    isPlaying: false,
    pendingStart: null,
    pendingEnd: null,
    segments: [],
  },
};

export const WithPendingSegment: Story = {
  args: {
    ...WithVideo.args,
    pendingStart: 10,
    pendingEnd: 42,
  },
};

export const WithSegments: Story = {
  args: {
    ...WithVideo.args,
    segments: [
      { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense', 'air'] },
      { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense', 'rush'] },
    ],
  },
};

export const Playing: Story = {
  args: {
    ...WithVideo.args,
    isPlaying: true,
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
