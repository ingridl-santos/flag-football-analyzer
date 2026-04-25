import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

import AppLogo from '.';

const meta: Meta<typeof AppLogo> = {
  title: 'Components / App Logo',
  component: AppLogo,
  args: {
    width: '4rem',
    height: '4rem',
  },
  decorators: [
    (Story) => (
      <Box sx={{ padding: '2rem' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AppLogo>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    width: '1.5rem',
    height: '1.5rem',
  },
};

export const Large: Story = {
  args: {
    width: '8rem',
    height: '8rem',
  },
};
