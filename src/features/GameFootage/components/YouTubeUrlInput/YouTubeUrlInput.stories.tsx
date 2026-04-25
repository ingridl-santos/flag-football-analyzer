import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import YouTubeUrlInput from '.';

const meta: Meta<typeof YouTubeUrlInput> = {
  title: 'Features / Game Footage / Components / You Tube Url Input',
  component: YouTubeUrlInput,
  parameters: {
    layout: 'padded',
  },
  args: {
    onSubmit: action('onSubmit'),
  },
};

export default meta;

type Story = StoryObj<typeof YouTubeUrlInput>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
