import React from 'react';
import Title from './Title';

export default {
  title: 'Title',
  component: Title,
  argTypes: {
    reverse: false,
  },
};

const Template = args => <Title {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  reverse: false,
};

export const Reverse = Template.bind({});
Reverse.args = {
  label: 'Reverse',
  reverse: true,
};
