import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['md', 'lg'],
    },
    disabled: { control: { type: 'boolean' } },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { label: 'I want to add a co-applicant' },
};

export const Large: Story = {
  args: { label: 'I want to add a co-applicant', size: 'lg' },
};

export const WithHelperText: Story = {
  args: {
    label: 'Send me updates about my application',
    helperText: 'You can unsubscribe at any time',
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    error: 'You must accept the terms to continue',
  },
};

export const Checked: Story = {
  args: { label: 'I want to add a co-applicant', defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: 'I want to add a co-applicant', disabled: true },
};

export const LongLabel: Story = {
  args: {
    label:
      'I confirm that all the information provided in this application is accurate and complete to the best of my knowledge, and I understand that providing false information may result in rejection of my application.',
  },
};
