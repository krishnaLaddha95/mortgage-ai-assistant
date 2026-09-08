import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'UI/DatePicker',
  component: DatePicker,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['md', 'lg'],
    },
    required: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    block: { control: { type: 'boolean' } },
  },
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: { label: 'Date of birth' },
};

export const Large: Story = {
  args: { label: 'Date of birth', size: 'lg' },
};

export const Required: Story = {
  args: { label: 'Date of birth', required: true },
};

export const WithMinMax: Story = {
  args: {
    label: 'Employment start date',
    helperText: 'Cannot be a future date',
    max: new Date().toISOString().split('T')[0],
  },
};

export const WithError: Story = {
  args: {
    label: 'Date of birth',
    error: 'You must be at least 18 years old',
  },
};

export const Disabled: Story = {
  args: { label: 'Date of birth', defaultValue: '1995-06-15', disabled: true },
};

export const Block: Story = {
  args: { label: 'Date of birth', block: true },
  parameters: { layout: 'padded' },
};