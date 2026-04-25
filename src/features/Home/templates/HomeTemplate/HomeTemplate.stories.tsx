import VideoFileIcon from '@mui/icons-material/VideoFile';
import type { Meta, StoryObj } from '@storybook/react-vite';

import HomeTemplate from '.';

const meta: Meta<typeof HomeTemplate> = {
  title: 'Features / Home / Templates / Home Template',
  component: HomeTemplate,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof HomeTemplate>;

const FEATURES = [
  {
    key: 'gameFootage',
    href: '/game-footage',
    icon: <VideoFileIcon fontSize="inherit" />,
  },
];

export const Default: Story = {
  args: {
    features: FEATURES,
  },
};

export const Loading: Story = {
  args: {
    features: FEATURES,
  },
  parameters: {
    noTranslations: true,
  },
};
