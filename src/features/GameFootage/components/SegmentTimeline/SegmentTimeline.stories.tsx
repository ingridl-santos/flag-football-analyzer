import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import SegmentTimeline from '.';

const meta: Meta<typeof SegmentTimeline> = {
  title: 'Features / Game Footage / Components / Segment Timeline',
  component: SegmentTimeline,
  parameters: {
    layout: 'padded',
  },
  args: {
    onSegmentClick: action('onSegmentClick'),
    duration: 180,
    currentTime: 0,
    activeSegmentId: null,
    segments: [],
  },
};

export default meta;

type Story = StoryObj<typeof SegmentTimeline>;

export const Empty: Story = {
  args: {
    segments: [],
    currentTime: 0,
    activeSegmentId: null,
  },
};

export const WithSegments: Story = {
  args: {
    segments: [
      { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense'] },
      { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense'] },
      { id: '3', start: 120, end: 140, duration: 20, playType: 'Defense', tags: ['defense'] },
    ],
    currentTime: 55,
    activeSegmentId: null,
  },
};

export const WithActiveSegment: Story = {
  args: {
    ...WithSegments.args,
    currentTime: 55,
    activeSegmentId: '2',
  },
};

export const PlayheadAtStart: Story = {
  args: {
    ...WithSegments.args,
    currentTime: 0,
  },
};

export const PlayheadAtEnd: Story = {
  args: {
    ...WithSegments.args,
    currentTime: 180,
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
  args: {
    segments: [],
    currentTime: 0,
    activeSegmentId: null,
  },
};
