import type { Meta, StoryObj } from '@storybook/react-vite';

import Footer from '.';

const meta: Meta<typeof Footer> = {
  title: 'Layout / Components / Footer',
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    appTitle: 'Flag Football Analyzer',
  },
};

export const WithGitHub: Story = {
  args: {
    appTitle: 'Flag Football Analyzer',
    githubUrl: 'https://github.com/ingridl-santos/flag-football-analyzer',
  },
};
