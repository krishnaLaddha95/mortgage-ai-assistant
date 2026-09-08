import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const nationalityOptions = [
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'in', label: 'India' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
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
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Nationality',
    options: nationalityOptions,
    placeholder: 'Select nationality',
  },
};

export const Large: Story = {
  args: {
    label: 'Nationality',
    options: nationalityOptions,
    placeholder: 'Select nationality',
    size: 'lg',
  },
};

export const Required: Story = {
  args: {
    label: 'Employment status',
    options: [
      { value: 'employed', label: 'Employed' },
      { value: 'self-employed', label: 'Self-employed' },
    ],
    placeholder: 'Select status',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Nationality',
    options: nationalityOptions,
    placeholder: 'Select nationality',
    error: 'Please select your nationality',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Property type',
    options: [
      { value: 'apartment', label: 'Apartment' },
      { value: 'villa', label: 'Villa' },
      { value: 'townhouse', label: 'Townhouse' },
    ],
    placeholder: 'Select property type',
    helperText: 'This affects which documents you will need to upload',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Nationality',
    options: nationalityOptions,
    defaultValue: 'in',
    disabled: true,
  },
};

export const Block: Story = {
  args: {
    label: 'Nationality',
    options: nationalityOptions,
    placeholder: 'Select nationality',
    block: true,
  },
  parameters: { layout: 'padded' },
};