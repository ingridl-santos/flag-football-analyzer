import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import PlayClassifier from '.';

const baseSegment = {
  id: '1',
  start: 42,
  end: 83,
  duration: 41,
};

const meta: Meta<typeof PlayClassifier> = {
  title: 'Features / Game Footage / Components / Play Classifier',
  component: PlayClassifier,
  parameters: {
    layout: 'padded',
  },
  args: {
    segmentNumber: 3,
    segment: baseSegment,
    onSetSide: action('onSetSide'),
    onSetDown: action('onSetDown'),
    onSetPlayType: action('onSetPlayType'),
    onSetResult: action('onSetResult'),
    onSetPlayer: action('onSetPlayer'),
    onSetTags: action('onSetTags'),
  },
};

export default meta;

type Story = StoryObj<typeof PlayClassifier>;

export const Unclassified: Story = {};

export const OffenseSelected: Story = {
  args: {
    segment: { ...baseSegment, side: 'offense' },
  },
};

export const OffenseWithDown: Story = {
  args: {
    segment: { ...baseSegment, side: 'offense', down: 2 },
  },
};

export const OffensePass: Story = {
  args: {
    segment: { ...baseSegment, side: 'offense', down: 3, playType: 'Pass' },
  },
};

export const OffenseRun: Story = {
  args: {
    segment: { ...baseSegment, side: 'offense', down: 1, playType: 'Run' },
  },
};

export const FullyClassifiedOffense: Story = {
  args: {
    segment: {
      ...baseSegment,
      side: 'offense',
      down: 2,
      playType: 'Pass',
      result: 'Touchdown',
      player: '#7, QB',
      tags: ['Quick Pass', 'Red Zone'],
    },
  },
};

export const DefenseSelected: Story = {
  args: {
    segment: { ...baseSegment, side: 'defense' },
  },
};

export const FullyClassifiedDefense: Story = {
  args: {
    segment: {
      ...baseSegment,
      side: 'defense',
      down: 3,
      result: 'Interception',
      player: '#34, CB',
      tags: ['Man Coverage', 'Press Coverage'],
    },
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
