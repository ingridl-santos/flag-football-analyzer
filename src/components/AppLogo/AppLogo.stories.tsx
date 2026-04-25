import type { Meta, StoryObj } from '@storybook/react-vite';
import AppLogo from '.';

const meta: Meta<typeof AppLogo> = {
  title: 'Components / Logos / App Logo',
  component: AppLogo,
};

export default meta;

export const Default: StoryObj<typeof AppLogo> = {
  args: {},
};
