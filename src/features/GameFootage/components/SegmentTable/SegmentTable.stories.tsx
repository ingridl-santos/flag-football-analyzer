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
    onSetPlayType: action('onSetPlayType'),
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
      { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense', 'air'] },
      { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense', 'rush'] },
      { id: '3', start: 120, end: 122, duration: 2, playType: 'Defense', tags: ['defense', 'quick'] },
    ],
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
