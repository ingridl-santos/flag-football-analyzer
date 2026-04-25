import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import Header from '.';

const meta: Meta<typeof Header> = {
  title: 'Layout / Components / Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onMenuButtonClick: action('onMenuButtonClick'),
    menuEntries: [],
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    title: 'Flag Football Analyzer',
    menuEntries: [],
  },
};

export const WithNavEntries: Story = {
  args: {
    title: 'Flag Football Analyzer',
    menuEntries: [
      { id: 'game-footage', label: 'Game Footage', to: '/', active: true },
    ],
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
  args: {
    title: '',
    menuEntries: [
      { id: 'game-footage', to: '/' },
    ],
  },
};
