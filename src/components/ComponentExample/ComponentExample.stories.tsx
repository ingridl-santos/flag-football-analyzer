import { Meta, StoryFn } from '@storybook/react-vite';

import ComponentExample, { ComponentExampleProps } from '.';

const meta: Meta = {
  title: 'Components / Component Example',
  component: ComponentExample,
};

export default meta;

const Template: StoryFn<ComponentExampleProps> = (args: ComponentExampleProps) => (
  <ComponentExample {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithAltText = Template.bind({});
WithAltText.args = {
  alt: 'Sample Avatar',
};

export const WithCustomPicture = Template.bind({});
WithCustomPicture.args = {
  src: 'https://placepengu.in/250/250',
};

export const WithCustomSize = Template.bind({});
WithCustomSize.args = {
  size: '80px',
};

export const WithDefaultBorder = Template.bind({});
WithDefaultBorder.args = {
  src: 'https://placepengu.in/250/250',
  size: '80px',
  border: true,
};

export const WithCustomBorder = Template.bind({});
WithCustomBorder.args = {
  src: 'https://placepengu.in/250/250',
  size: '80px',
  border: true,
  borderWidth: '15px',
  borderColor: 'purple',
};
