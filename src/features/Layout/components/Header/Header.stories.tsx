import type { Meta, StoryObj } from '@storybook/react-vite';

import Header from '.';

const meta: Meta<typeof Header> = {
  title: 'Layout / Components / Header',
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: 'Flag Football Analyzer',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Flag Football Analyzer — 2026 Season Game Analysis',
  },
};
