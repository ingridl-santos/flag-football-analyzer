import type { Meta, StoryObj } from '@storybook/react-vite';

import Footer from '.';

const meta: Meta<typeof Footer> = {
  title: 'Features / Layout / Components / Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    githubUrl: 'https://github.com/ingridl-santos/flag-football-analyzer',
  },
};

export const WithoutGitHub: Story = {
  args: {},
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
  args: {
    githubUrl: 'https://github.com/ingridl-santos/flag-football-analyzer',
  },
};
