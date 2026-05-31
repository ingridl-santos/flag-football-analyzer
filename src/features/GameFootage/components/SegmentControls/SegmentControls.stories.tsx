import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import SegmentControls from '.';

const meta: Meta<typeof SegmentControls> = {
  title: 'Features / Game Footage / Components / Segment Controls',
  component: SegmentControls,
  parameters: {
    layout: 'padded',
  },
  args: {
    onSetStart: action('onSetStart'),
    onSetEnd: action('onSetEnd'),
    onSetPendingPlayType: action('onSetPendingPlayType'),
    onSetPendingTags: action('onSetPendingTags'),
    onCreateSegment: action('onCreateSegment'),
    videoLoaded: true,
    pendingStart: null,
    pendingEnd: null,
    pendingPlayType: '',
    pendingTags: [],
  },
};

export default meta;

type Story = StoryObj<typeof SegmentControls>;

export const NoVideo: Story = {
  args: {
    videoLoaded: false,
  },
};

export const VideoLoaded: Story = {
  args: {
    videoLoaded: true,
  },
};

export const WithStart: Story = {
  args: {
    pendingStart: 10,
    pendingEnd: null,
  },
};

export const WithPendingSegment: Story = {
  args: {
    pendingStart: 10,
    pendingEnd: 42,
  },
};

export const WithPendingSegmentConfigured: Story = {
  args: {
    pendingStart: 10,
    pendingEnd: 42,
    pendingPlayType: 'Pass',
    pendingTags: ['Deep Pass'],
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
