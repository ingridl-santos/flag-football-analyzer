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

export const Pass: Story = {
  args: {
    playType: 'Pass',
    duration: 9,
    existingTags: [],
  },
};

export const Run: Story = {
  args: {
    playType: 'Run',
    duration: 8,
    existingTags: [],
  },
};

export const Defense: Story = {
  args: {
    playType: 'Defense',
    duration: 5,
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

export const Loading: Story = {
  args: {
    playType: 'Pass',
    duration: 9,
    existingTags: [],
    loading: true,
  },
  parameters: {
    noTranslations: true,
  },
};
