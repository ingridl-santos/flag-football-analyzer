import Typography from '@mui/material/Typography';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import LayoutTemplate from '.';

const HEADER_PROPS = {
  title: 'Flag Football Analyzer',
  menuEntries: [],
  onMenuButtonClick: action('onMenuButtonClick'),
};

const FOOTER_PROPS = {
  githubUrl: 'https://github.com/ingridl-santos/flag-football-analyzer',
};

const meta: Meta<typeof LayoutTemplate> = {
  title: 'Layout / Templates / Layout Template',
  component: LayoutTemplate,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    slotProps: {
      header: HEADER_PROPS,
      footer: FOOTER_PROPS,
    },
  },
};

export default meta;

type Story = StoryObj<typeof LayoutTemplate>;

export const Default: Story = {
  render: (args) => (
    <LayoutTemplate {...args}>
      <Typography>Page content goes here.</Typography>
    </LayoutTemplate>
  ),
};

export const WithNavEntries: Story = {
  render: (args) => (
    <LayoutTemplate {...args}>
      <Typography>Page content goes here.</Typography>
    </LayoutTemplate>
  ),
  args: {
    slotProps: {
      header: {
        ...HEADER_PROPS,
        menuEntries: [
          { id: 'game-footage', label: 'Game Footage', to: '/', active: true },
        ],
      },
      footer: FOOTER_PROPS,
    },
  },
};

export const Loading: Story = {
  render: (args) => (
    <LayoutTemplate {...args}>
      <Typography>Page content goes here.</Typography>
    </LayoutTemplate>
  ),
  parameters: {
    noTranslations: true,
  },
};
