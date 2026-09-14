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

function makeMockFile(name: string, sizeInBytes = 500000) {
  return new File(['x'.repeat(sizeInBytes)], name, { type: 'application/pdf' });
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

// Single-file field WITH a file already attached — dropzone should be hidden,
// only the file row with Replace/Remove shows
export const SingleFileAttached: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'ID proof',
    value: [makeMockFile('passport.pdf')],
  },
};

// Multi-file field — dropzone stays visible even with files already attached
export const MultipleFilesWithDropzoneVisible: Story = {
  render: (args) => <Template {...args} />,
  args: {
    label: 'Bank statements',
    multiple: true,
    helperText: 'Last 6 months, one file per month',
    value: [makeMockFile('january.pdf'), makeMockFile('february.pdf')],
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