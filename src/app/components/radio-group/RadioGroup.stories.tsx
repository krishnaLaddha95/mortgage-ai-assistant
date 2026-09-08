import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RadioGroup from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['md', 'lg'],
    },
    direction: {
      control: { type: 'radio' },
      options: ['vertical', 'horizontal'],
    },
    required: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

const employmentOptions = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Not currently employed' },
];

// Wrapper needed since this is a controlled component
function Template(args: React.ComponentProps<typeof RadioGroup>) {
  const [value, setValue] = useState(args.value ?? '');
  return <RadioGroup {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Employment status', name: 'employment', options: employmentOptions },
};

export const WithDescriptions: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Application type',
    name: 'appType',
    options: [
      {
        value: 'individual',
        label: 'Individual application',
        description: 'Just you as the sole applicant',
      },
      {
        value: 'joint',
        label: 'Joint application',
        description: 'You and a co-applicant, such as a spouse',
      },
    ],
  },
};

export const Horizontal: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Do you have any existing debts?',
    name: 'hasDebts',
    direction: 'horizontal',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
};

export const Required: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Employment status', name: 'employment', options: employmentOptions, required: true },
};

export const WithError: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Employment status',
    name: 'employment',
    options: employmentOptions,
    error: 'Please select your employment status',
  },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Employment status', name: 'employment', options: employmentOptions, disabled: true, value: 'employed' },
};

export const Large: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Employment status', name: 'employment', options: employmentOptions, size: 'lg' },
};