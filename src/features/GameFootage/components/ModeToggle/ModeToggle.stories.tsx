import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import ModeToggle from '.';

const meta: Meta<typeof ModeToggle> = {
  title: 'Features / Game Footage / Components / Mode Toggle',
  component: ModeToggle,
  parameters: {
    layout: 'padded',
  },
  args: {
    videoLoaded: true,
    mode: 'cut',
    onModeChange: action('onModeChange'),
  },
};

export default meta;

type Story = StoryObj<typeof ModeToggle>;

export const CutMode: Story = {
  args: {
    mode: 'cut',
  },
};

export const TagMode: Story = {
  args: {
    mode: 'tag',
  },
};

export const NoVideo: Story = {
  args: {
    videoLoaded: false,
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
