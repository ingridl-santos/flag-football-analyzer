import type { Meta, StoryObj } from '@storybook/react-vite';

import ErrorTemplate from '.';

const meta: Meta<typeof ErrorTemplate> = {
  title: 'Features / Errors / Error Template',
  component: ErrorTemplate,
};

export default meta;

type Story = StoryObj<typeof ErrorTemplate>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
