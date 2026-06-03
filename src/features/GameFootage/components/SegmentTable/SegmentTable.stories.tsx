import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import SegmentTable from '.';

const meta: Meta<typeof SegmentTable> = {
  title: 'Features / Game Footage / Components / Segment Table',
  component: SegmentTable,
  parameters: {
    layout: 'padded',
  },
  args: {
    onDelete: action('onDelete'),
    onSegmentClick: action('onSegmentClick'),
    activeSegmentId: null,
  },
};

export default meta;

type Story = StoryObj<typeof SegmentTable>;

export const Empty: Story = {
  args: {
    segments: [],
  },
};

export const WithSegments: Story = {
  args: {
    segments: [
      { id: '1', start: 10, end: 25, duration: 15, side: 'offense', down: 2, playType: 'Pass', result: 'Touchdown', tags: ['Quick Pass', 'Red Zone'] },
      { id: '2', start: 42, end: 83, duration: 41, side: 'offense', down: 1, playType: 'Run', result: 'Big Gain' },
      { id: '3', start: 120, end: 122, duration: 2, side: 'defense', result: 'Flag Pull', tags: ['Man Coverage'] },
    ],
  },
};

export const WithActiveSegment: Story = {
  args: {
    ...WithSegments.args,
    activeSegmentId: '2',
  },
};

export const Unclassified: Story = {
  args: {
    segments: [
      { id: '1', start: 10, end: 25, duration: 15 },
      { id: '2', start: 42, end: 83, duration: 41 },
    ],
  },
};

export const ReadOnly: Story = {
  args: {
    ...WithSegments.args,
    readOnly: true,
  },
};

export const Loading: Story = {
  args: {
    segments: [],
  },
  parameters: {
    noTranslations: true,
  },
};
