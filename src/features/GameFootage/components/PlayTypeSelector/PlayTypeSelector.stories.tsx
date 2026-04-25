import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import PlayTypeSelector from '.';

const meta: Meta<typeof PlayTypeSelector> = {
  title: 'Features / Game Footage / Components / Play Type Selector',
  component: PlayTypeSelector,
  parameters: {
    layout: 'padded',
  },
  args: {
    segmentId: 'seg-1',
    onChange: action('onChange'),
  },
};

export default meta;

type Story = StoryObj<typeof PlayTypeSelector>;

export const Default: Story = {
  args: {
    value: '',
  },
};

export const WithPass: Story = {
  args: {
    value: 'Pass',
  },
};

export const WithRun: Story = {
  args: {
    value: 'Run',
  },
};

export const Loading: Story = {
  args: {
    value: '',
  },
  parameters: {
    noTranslations: true,
  },
};
