import { Stack } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AppLogo from '.';

const meta: Meta<typeof AppLogo> = {
  title: 'Components / Logos / App Logo',
  component: AppLogo,
  args: {
    role: 'img',
    'aria-label': 'Flag Football Analyzer Logo',
  },
};

export default meta;

type Story = StoryObj<typeof AppLogo>;

export const Default: Story = {
  args: {
    width: '2.5rem',
    height: '2.5rem',
  },
};

export const Small: Story = {
  args: {
    width: '1.5rem',
    height: '1.5rem',
  },
};

export const Large: Story = {
  args: {
    width: '4rem',
    height: '4rem',
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: '1.5rem' }}>
      <AppLogo width="1.5rem" height="1.5rem" aria-label="Small" />

      <AppLogo width="2.5rem" height="2.5rem" aria-label="Medium" />

      <AppLogo width="4rem" height="4rem" aria-label="Large" />
    </Stack>
  ),
};
