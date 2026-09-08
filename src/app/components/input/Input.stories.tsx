import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['md', 'lg'],
    },
    required: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    block: {
      control: { type: 'boolean' },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Full name', placeholder: 'John Doe', size: 'md' },
};

export const Large: Story = {
  args: { label: 'Full name', placeholder: 'John Doe', size: 'lg' },
};

export const Required: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', required: true },
};

export const WithHelperText: Story = {
  args: {
    label: 'Monthly income',
    placeholder: '15000',
    helperText: 'Enter your gross monthly income in AED',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    error: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: { label: 'Employer name', defaultValue: 'Locai.ai', disabled: true },
};

export const WithLeadingIcon: Story = {
  args: {
    label: 'Purchase price',
    placeholder: '2,000,000',
    leadingIcon: <span>AED</span>,
  },
};

export const Block: Story = {
  args: { label: 'Full name', placeholder: 'John Doe', block: true },
  parameters: { layout: 'padded' },
};