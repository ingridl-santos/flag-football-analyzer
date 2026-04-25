import { Button } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import Dialog from '.';

const meta: Meta<typeof Dialog> = {
  title: 'Components / Dialog',
  component: Dialog,
  args: {
    open: true,
    disablePortal: true,
    closeButtonTextLabel: 'Close',
    onClose: action('onClose'),
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    title: 'Delete segment?',
    content: 'This action cannot be undone.',
    actions: (
      <>
        <Button variant="outlined">Cancel</Button>

        <Button variant="contained" color="error">Delete</Button>
      </>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    content: 'A dialog without a title — the close button still appears.',
  },
};

export const WithoutActions: Story = {
  args: {
    title: 'Export complete',
    content: 'Your ZIP file has been downloaded successfully.',
  },
};

export const Loading: Story = {
  args: {
    title: 'Delete segment?',
    content: 'This action cannot be undone.',
  },
  parameters: {
    noTranslations: true,
  },
};
