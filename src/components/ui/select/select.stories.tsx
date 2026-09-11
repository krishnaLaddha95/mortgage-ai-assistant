import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select from './select';

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

// Controlled wrapper — Select takes value/onChange, not defaultValue,
// so stories need local state to actually be interactive
function Template(args: Partial<React.ComponentProps<typeof Select>>) {
  const [value, setValue] = useState(args.value ?? '');
  return (
    <Select
      label="Nationality"
      options={nationalityOptions}
      placeholder="Select nationality"
      {...args}
      value={value}
      onChange={setValue}
    />
  );
}

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const Large: Story = {
  render: (args) => <Template {...args} />,
  args: { size: 'lg' },
};

export const Required: Story = {
  render: (args) => <Template {...args} />,
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
  render: (args) => <Template {...args} />,
  args: { error: 'Please select your nationality' },
};

export const WithHelperText: Story = {
  render: (args) => <Template {...args} />,
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
  render: (args) => <Template {...args} />,
  args: { value: 'in', disabled: true },
};

export const Block: Story = {
  render: (args) => <Template {...args} />,
  args: { block: true },
  parameters: { layout: 'padded' },
};
