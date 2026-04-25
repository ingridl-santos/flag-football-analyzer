import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import ErrorPanel from '.';

const meta: Meta<typeof ErrorPanel> = {
  title: 'Components / Error Panel',
  component: ErrorPanel,
};

export default meta;

type Story = StoryObj<typeof ErrorPanel>;

export const Default: Story = {
  args: {},
};

export const Custom: Story = {
  args: {
    image: 'https://placepengu.in/300x300',
    title: 'Penguin Error',
    description: 'Well, that went well...',
  },
};

export const WithAction: Story = {
  args: {
    onActionClick: action('onActionClick'),
    actionText: 'Try Again',
  },
};
