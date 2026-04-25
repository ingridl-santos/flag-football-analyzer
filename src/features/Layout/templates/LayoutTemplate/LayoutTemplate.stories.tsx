import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';

import LayoutTemplate from '.';

const meta: Meta<typeof LayoutTemplate> = {
  title: 'Layout / Templates / Layout Template',
  component: LayoutTemplate,
};

export default meta;

type Story = StoryObj<typeof LayoutTemplate>;

export const Default: Story = {
  render: (args) => (
    <LayoutTemplate {...args}>
      <Typography>Page content goes here.</Typography>
    </LayoutTemplate>
  ),
  args: {
    title: 'Flag Football Analyzer',
  },
};

export const WithRichContent: Story = {
  render: (args) => (
    <LayoutTemplate {...args}>
      <Typography variant="h2" gutterBottom>Game Analysis</Typography>

      <Typography>Sample page content rendered inside the layout shell.</Typography>
    </LayoutTemplate>
  ),
  args: {
    title: 'Flag Football Analyzer',
  },
};
