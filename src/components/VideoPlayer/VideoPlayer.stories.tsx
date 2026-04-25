import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import VideoPlayer from '.';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components / Video Player',
  component: VideoPlayer,
  args: {
    onTimeUpdate: action('onTimeUpdate'),
    onDurationChange: action('onDurationChange'),
    onPlayStateChange: action('onPlayStateChange'),
    onSeek: action('onSeek'),
  },
};

export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {
  args: {
    src: 'mock://game-footage.mp4',
    currentTime: 0,
    duration: 180,
    isPlaying: false,
  },
};

export const MidPlayback: Story = {
  args: {
    src: 'mock://game-footage.mp4',
    currentTime: 42,
    duration: 180,
    isPlaying: false,
  },
};

export const Playing: Story = {
  args: {
    ...MidPlayback.args,
    isPlaying: true,
  },
};
