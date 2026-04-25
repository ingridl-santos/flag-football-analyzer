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
    title: 'Dialog title',
    content: 'This is the dialog content. It can be any ReactNode.',
    actions: (
      <>
        <Button variant="outlined">Cancel</Button>

        <Button variant="contained">Confirm</Button>
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
    title: 'No actions',
    content: 'This dialog has no action buttons.',
  },
};

export const Loading: Story = {
  args: {
    title: 'Dialog title',
    content: 'Dialog content.',
  },
  parameters: {
    noTranslations: true,
  },
};
