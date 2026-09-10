import type { Meta, StoryObj } from '@storybook/react';
import Stepper from './Stepper';

const labels = [
  'Personal',
  'Employment',
  'Co-applicant',
  'Property',
  'Debts',
  'Documents',
  'Review',
];

const meta: Meta<typeof Stepper> = {
  title: 'Form/Stepper',
  component: Stepper,
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const FirstStep: Story = {
  args: { currentStep: 0, totalSteps: 7, stepLabels: labels },
};

export const MiddleStep: Story = {
  args: { currentStep: 3, totalSteps: 7, stepLabels: labels },
};

export const LastStep: Story = {
  args: { currentStep: 6, totalSteps: 7, stepLabels: labels },
};

export const NoLabels: Story = {
  args: { currentStep: 2, totalSteps: 5 },
};
