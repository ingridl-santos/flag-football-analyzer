import StarIcon from '@mui/icons-material/StarSharp';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumb from '.';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components / Breadcrumb',
  component: Breadcrumb,
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    children: 'Home',
  },
};

export const WithHref: Story = {
  args: {
    children: 'Home',
    LinkProps: {
      href: '#',
    },
  },
};

export const Active: Story = {
  args: {
    children: 'Game Footage',
    active: true,
  },
};

export const WithRouterLink: Story = {
  args: {
    children: 'Home',
    to: '#',
  },
};

export const ActiveWithRouterLink: Story = {
  args: {
    children: 'Game Footage',
    to: '#',
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Home',
    to: '#',
    icon: <StarIcon />,
  },
};

export const ActiveWithIcon: Story = {
  args: {
    children: 'Game Footage',
    active: true,
    icon: <StarIcon />,
  },
};
