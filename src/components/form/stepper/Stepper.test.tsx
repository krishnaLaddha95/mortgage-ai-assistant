import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stepper from './Stepper';

test('renders the correct number of steps', () => {
  render(<Stepper currentStep={0} totalSteps={7} />);
  // 7 numbered circles, 1 through 7
  for (let i = 1; i <= 7; i++) {
    expect(screen.getByText(String(i))).toBeInTheDocument();
  }
});

test('marks the current step with aria-current', () => {
  render(<Stepper currentStep={2} totalSteps={7} />);
  const currentStepEl = screen.getByText('3'); // index 2 = step "3"
  expect(currentStepEl).toHaveAttribute('aria-current', 'step');
});

test('does not mark other steps as current', () => {
  render(<Stepper currentStep={2} totalSteps={7} />);
  const otherStep = screen.getByText('1');
  expect(otherStep).not.toHaveAttribute('aria-current');
});

test('renders step labels when provided', () => {
  render(
    <Stepper
      currentStep={0}
      totalSteps={3}
      stepLabels={['Personal', 'Employment', 'Review']}
    />
  );
  expect(screen.getByText('Personal')).toBeInTheDocument();
  expect(screen.getByText('Employment')).toBeInTheDocument();
  expect(screen.getByText('Review')).toBeInTheDocument();
});

test('renders without labels when none are provided', () => {
  render(<Stepper currentStep={0} totalSteps={3} />);
  expect(screen.queryByText('Personal')).not.toBeInTheDocument();
});

test('renders as a navigation landmark with an accessible name', () => {
  render(<Stepper currentStep={0} totalSteps={3} />);
  expect(
    screen.getByRole('navigation', { name: 'Form progress' })
  ).toBeInTheDocument();
});
