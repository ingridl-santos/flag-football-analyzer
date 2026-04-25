import type { Meta, StoryObj } from '@storybook/react-vite';

import SkipLink from '.';

const meta: Meta<typeof SkipLink> = {
  title: 'Layout / Components / SkipLink',
  component: SkipLink,
};

export default meta;

type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {};

export const Focused: Story = {
  parameters: {
    pseudo: { focus: true },
  },
};
