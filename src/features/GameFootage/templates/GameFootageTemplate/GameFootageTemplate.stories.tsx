import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import GameFootageTemplate from '.';

const meta: Meta<typeof GameFootageTemplate> = {
  title: 'Features / Game Footage / Game Footage Template',
  component: GameFootageTemplate,
  args: {
    onFileSelect: action('onFileSelect'),
    onTimeUpdate: action('onTimeUpdate'),
    onDurationChange: action('onDurationChange'),
    onPlayStateChange: action('onPlayStateChange'),
    onSeek: action('onSeek'),
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
  },
};

export const WithVideo: Story = {
  args: {
    videoUrl: 'mock://game-footage.mp4',
    videoFileName: 'game-footage.mp4',
    currentTime: 42,
    duration: 180,
    isPlaying: false,
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
