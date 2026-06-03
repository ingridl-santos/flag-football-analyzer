import type { Meta, StoryObj } from '@storybook/react-vite';

import SkipLink from '.';

const meta: Meta<typeof SkipLink> = {
  title: 'Features / Layout / Components / Skip Link',
  component: SkipLink,
  args: {
    href: '#main',
    children: 'Skip to main content',
  },
};

export default meta;

type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {};

export const Focused: Story = {
  parameters: {
    pseudo: { focus: true },
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
    pseudo: { focus: true },
  },
  args: {
    children: undefined,
  },
};
