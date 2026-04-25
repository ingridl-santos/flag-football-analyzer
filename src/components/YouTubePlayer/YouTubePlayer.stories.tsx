import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import YouTubePlayer from '.';

const meta: Meta<typeof YouTubePlayer> = {
  title: 'Components / You Tube Player',
  component: YouTubePlayer,
  parameters: {
    layout: 'padded',
  },
  args: {
    videoId: 'dQw4w9WgXcQ',
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    onTimeUpdate: action('onTimeUpdate'),
    onDurationChange: action('onDurationChange'),
    onPlayStateChange: action('onPlayStateChange'),
  },
};

export default meta;

type Story = StoryObj<typeof YouTubePlayer>;

export const Default: Story = {};

export const Playing: Story = {
  args: {
    isPlaying: true,
    currentTime: 30,
    duration: 212,
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
