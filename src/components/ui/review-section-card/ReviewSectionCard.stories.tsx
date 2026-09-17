import type { Meta, StoryObj } from '@storybook/react';
import ReviewSectionCard from './ReviewSectionCard';

const meta: Meta<typeof ReviewSectionCard> = {
  title: 'Form/ReviewSectionCard',
  component: ReviewSectionCard,
};
export default meta;
type Story = StoryObj<typeof ReviewSectionCard>;

export const WithFieldsGrid: Story = {
  args: {
    title: 'Personal information',
    onEdit: () => alert('Edit clicked'),
    fields: [
      { label: 'Full name', value: 'Krishna Laddha' },
      { label: 'Date of birth', value: '15/06/1995' },
      { label: 'Nationality', value: 'India' },
      { label: 'Passport / ID number', value: 'A1234567' },
      { label: 'Email', value: 'krishna@example.com' },
      { label: 'Phone number', value: '+971 54 219 3604' },
    ],
  },
};

export const WithMissingValue: Story = {
  args: {
    title: 'Employment & income',
    onEdit: () => alert('Edit clicked'),
    fields: [
      { label: 'Employment status', value: 'Employed' },
      { label: 'Employer', value: '' },
      { label: 'Job title', value: 'Frontend Engineer' },
    ],
  },
};

export const WithCustomChildren: Story = {
  args: {
    title: 'Documents',
    onEdit: () => alert('Edit clicked'),
    children: (
      <>
        <div className="flex justify-between text-sm text-ink">
          <span>ID proof</span>
          <span className="text-brand-600">Uploaded</span>
        </div>
        <div className="flex justify-between text-sm text-ink">
          <span>Bank statements</span>
          <span className="text-brand-600">2 files uploaded</span>
        </div>
      </>
    ),
  },
};
