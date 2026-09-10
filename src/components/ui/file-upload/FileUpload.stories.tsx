import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FileUpload from './FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'UI/FileUpload',
  component: FileUpload,
  argTypes: {
    multiple: { control: { type: 'boolean' } },
    required: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

function Template(args: React.ComponentProps<typeof FileUpload>) {
  const [files, setFiles] = useState<File[]>(args.value ?? []);
  return <FileUpload {...args} value={files} onChange={setFiles} />;
}

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Upload ID proof' },
};

export const Required: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Upload ID proof', required: true },
};

export const WithHelperText: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Salary certificate',
    helperText: 'Must be dated within the last 3 months',
  },
};

export const MultipleFiles: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Bank statements',
    multiple: true,
    helperText: 'Last 6 months, one file per month',
  },
};

export const WithError: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Upload ID proof', error: 'This document is required' },
};

export const Disabled: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Upload ID proof', disabled: true },
};

export const SmallSizeLimit: Story = {
  render: (args) => <Template {...args} />,
  args: { label: 'Passport photo', accept: '.jpg,.png', maxSizeMB: 1 },
};
