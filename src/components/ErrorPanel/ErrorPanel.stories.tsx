import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import ErrorPanel from '.';

const meta: Meta<typeof ErrorPanel> = {
  title: 'Components / Error Panel',
  component: ErrorPanel,
  args: {
    onActionClick: action('onActionClick'),
  },
};

export default meta;

type Story = StoryObj<typeof ErrorPanel>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};

export const Custom: Story = {
  args: {
    image: 'https://placepengu.in/300x300',
  },
};

export const WithAction: Story = {
  args: {
    actionText: 'Try Again',
  },
};
