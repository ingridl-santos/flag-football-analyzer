import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import SegmentPanel from '.';

const meta: Meta<typeof SegmentPanel> = {
  title: 'Features / Game Footage / Components / Segment Panel',
  component: SegmentPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    onDelete: action('onDelete'),
    onSetPlayType: action('onSetPlayType'),
    onSetTags: action('onSetTags'),
    onSegmentClick: action('onSegmentClick'),
    onExportCsv: action('onExportCsv'),
    onExportJson: action('onExportJson'),
    onExportZip: action('onExportZip'),
    videoType: 'file',
    activeSegmentId: null,
    isExportingZip: false,
    exportZipProgress: 0,
    segments: [],
  },
};

export default meta;

type Story = StoryObj<typeof SegmentPanel>;

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
    ],
  },
};

export const WithActiveSegment: Story = {
  args: {
    ...WithSegments.args,
    activeSegmentId: '2',
  },
};

export const YouTube: Story = {
  args: {
    ...WithSegments.args,
    videoType: 'youtube',
  },
};

export const ExportingZip: Story = {
  args: {
    ...WithSegments.args,
    isExportingZip: true,
    exportZipProgress: 0.4,
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
