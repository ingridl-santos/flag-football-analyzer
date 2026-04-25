import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import TagSuggestions from '.';

const meta: Meta<typeof TagSuggestions> = {
  title: 'Features / Game Footage / Components / Tag Suggestions',
  component: TagSuggestions,
  parameters: {
    layout: 'padded',
  },
  args: {
    onAddTag: action('onAddTag'),
    existingTags: [],
  },
};

export default meta;

type Story = StoryObj<typeof TagSuggestions>;

export const PassDeepPlay: Story = {
  args: {
    playType: 'Pass',
    duration: 9,
    existingTags: [],
  },
};

export const PassQuickPlay: Story = {
  args: {
    playType: 'Pass',
    duration: 2,
    existingTags: [],
  },
};

export const PassMidRange: Story = {
  args: {
    playType: 'Pass',
    duration: 5,
    existingTags: [],
  },
};

export const RunExplosive: Story = {
  args: {
    playType: 'Run',
    duration: 8,
    existingTags: [],
  },
};

export const RunQuick: Story = {
  args: {
    playType: 'Run',
    duration: 2,
    existingTags: [],
  },
};

export const DefensePlay: Story = {
  args: {
    playType: 'Defense',
    duration: 5,
    existingTags: [],
  },
};

export const DefenseQuickStop: Story = {
  args: {
    playType: 'Defense',
    duration: 1,
    existingTags: [],
  },
};

export const WithExistingTags: Story = {
  args: {
    playType: 'Pass',
    duration: 9,
    existingTags: ['Deep Pass', 'Touchdown', 'Screen Pass', 'Slant'],
  },
};

export const AllTagged: Story = {
  name: 'All Suggested (renders nothing)',
  args: {
    playType: 'Pass',
    duration: 5,
    existingTags: [
      'Touchdown', 'Completion', 'Incompletion', 'Interception', 'Sack', 'Flag Pull',
      'Screen Pass', 'Slant', 'Out Route', 'Post Route', 'Go Route', 'Crossing Route', 'Rollout Pass', 'QB Scramble',
      'Shotgun', 'Spread', 'Trips Formation', 'Empty Backfield', 'I-Formation',
      'Red Zone', 'Two-Minute Drill', 'Two-Point Attempt', 'Opening Drive',
    ],
  },
};

export const NoPlayType: Story = {
  name: 'No Play Type (renders nothing)',
  args: {
    playType: '',
    duration: 5,
    existingTags: [],
  },
};

export const Loading: Story = {
  args: {
    playType: 'Pass',
    duration: 9,
    existingTags: [],
  },
  parameters: {
    noTranslations: true,
  },
};
