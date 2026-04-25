import type { Meta, StoryObj } from '@storybook/react-vite';

import HomeTemplate from '.';

const meta: Meta<typeof HomeTemplate> = {
  title: 'Features / Home / Templates / Home Template',
  component: HomeTemplate,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof HomeTemplate>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
