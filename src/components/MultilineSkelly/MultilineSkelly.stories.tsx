import type { Meta, StoryObj } from '@storybook/react-vite';

import MultilineSkelly from '.';

const meta: Meta<typeof MultilineSkelly> = {
  title: 'Components / Multiline Skelly',
  component: MultilineSkelly,
};

export default meta;

type Story = StoryObj<typeof MultilineSkelly>;

export const Default: Story = {};

export const MultipleLines: Story = {
  args: {
    lines: 4,
  },
};

export const WithLastLineWidth: Story = {
  args: {
    lines: 4,
    lastLineWidth: '20rem',
  },
};

export const WithResponsiveLineCount: Story = {
  args: {
    lines: { xs: 4, md: 2, lg: 1 },
  },
};

export const WithResponsiveLastLineWidth: Story = {
  args: {
    lines: 4,
    lastLineWidth: { xs: '10rem', md: '20rem', lg: '40rem' },
  },
};

export const Centered: Story = {
  args: {
    centered: true,
    lines: 4,
    lastLineWidth: '20rem',
  },
};

export const ResponsiveCentered: Story = {
  args: {
    centered: { xs: false, md: true },
    lines: 4,
    lastLineWidth: '20rem',
  },
};
