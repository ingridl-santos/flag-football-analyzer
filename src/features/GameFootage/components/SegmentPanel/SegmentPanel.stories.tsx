import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import SegmentPanel from '.';

const classifiedSegments = [
  { id: '1', start: 10, end: 25, duration: 15, side: 'offense' as const, down: 2 as const, playType: 'Pass', result: 'Touchdown', tags: ['Red Zone'] },
  { id: '2', start: 42, end: 83, duration: 41, side: 'offense' as const, down: 1 as const, playType: 'Run', result: 'Big Gain' },
];

const meta: Meta<typeof SegmentPanel> = {
  title: 'Features / Game Footage / Components / Segment Panel',
  component: SegmentPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    onDelete: action('onDelete'),
    onNavigatePrev: action('onNavigatePrev'),
    onNavigateNext: action('onNavigateNext'),
    onSetSide: action('onSetSide'),
    onSetDown: action('onSetDown'),
    onSetPlayType: action('onSetPlayType'),
    onSetResult: action('onSetResult'),
    onSetPlayer: action('onSetPlayer'),
    onSetTags: action('onSetTags'),
    onSegmentClick: action('onSegmentClick'),
    onExportCsv: action('onExportCsv'),
    onExportJson: action('onExportJson'),
    onExportZip: action('onExportZip'),
    videoType: 'file',
    activeSegmentId: null,
    activeSegment: null,
    classifierMode: false,
    hasPrev: false,
    hasNext: false,
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
    segments: classifiedSegments,
  },
};

export const ClassifierModeNoSelection: Story = {
  args: {
    segments: classifiedSegments,
    classifierMode: true,
    activeSegment: null,
  },
};

export const ClassifierModeWithSelection: Story = {
  args: {
    segments: classifiedSegments,
    classifierMode: true,
    activeSegment: classifiedSegments[1],
    activeSegmentId: '2',
    hasPrev: true,
    hasNext: false,
  },
};

export const ClassifierModeNavigating: Story = {
  args: {
    segments: [
      ...classifiedSegments,
      { id: '3', start: 90, end: 110, duration: 20 },
    ],
    classifierMode: true,
    activeSegment: classifiedSegments[0],
    activeSegmentId: '1',
    hasPrev: false,
    hasNext: true,
  },
};

export const YouTube: Story = {
  args: {
    segments: classifiedSegments,
    videoType: 'youtube',
  },
};

export const ReadOnly: Story = {
  args: {
    segments: classifiedSegments,
    readOnly: true,
  },
};

export const ExportingZip: Story = {
  args: {
    segments: classifiedSegments,
    isExportingZip: true,
    exportZipProgress: 0.4,
  },
};

export const ExportError: Story = {
  args: {
    segments: classifiedSegments,
    exportError: 'Failed to load FFmpeg WASM: network error',
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
