import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import SegmentList from '.';

const meta: Meta<typeof SegmentList> = {
  title: 'Features / Game Footage / Components / Segment List',
  component: SegmentList,
  parameters: {
    layout: 'padded',
  },
  args: {
    onDelete: action('onDelete'),
    onSetPlayType: action('onSetPlayType'),
    onSetTags: action('onSetTags'),
  },
};

export default meta;

type Story = StoryObj<typeof SegmentList>;

export const Empty: Story = {
  args: {
    segments: [],
  },
};

export const WithSegments: Story = {
  args: {
    segments: [
      { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense', 'air'] },
      { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense', 'rush'] },
      { id: '3', start: 120, end: 122, duration: 2, playType: 'Defense', tags: ['defense', 'quick'] },
    ],
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
  args: {
    segments: [],
  },
};
