import type { Meta, StoryObj } from '@storybook/react-vite';

import ErrorTemplate from '.';

const meta: Meta<typeof ErrorTemplate> = {
  title: 'Features / Errors / Templates / Error',
  component: ErrorTemplate,
};

export default meta;

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
export const _Error: StoryObj<typeof ErrorTemplate> = {
  args: {},
};
