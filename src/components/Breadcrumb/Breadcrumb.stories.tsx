import StarIcon from '@mui/icons-material/StarSharp';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Breadcrumb from '.';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components /  Breadcrumb',
  component: Breadcrumb,
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    children: 'Breadcrumb',
  },
};

export const WithHref: Story = {
  args: {
    ...Default.args,
    LinkProps: {
      href: '#',
    },
  },
};

export const Active: Story = {
  args: {
    ...WithHref.args,
    active: true,
  },
};

export const WithRouterLink: Story = {
  args: {
    ...Default.args,
    to: '#',
  },
};

export const ActiveWithRouterLink: Story = {
  args: {
    ...WithRouterLink.args,
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    ...WithHref.args,
    icon: <StarIcon />,
  },
};

export const ActiveWithIcon: Story = {
  args: {
    ...WithIcon.args,
    active: true,
  },
};
