import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Select } from './select';

const options = [
  { value: 'in', label: 'India' },
  { value: 'ae', label: 'United Arab Emirates' },
];

test('renders label linked to select', () => {
  render(<Select label="Nationality" options={options} />);
  expect(screen.getByLabelText('Nationality')).toBeInTheDocument();
});

test('renders all provided options', () => {
  render(<Select label="Nationality" options={options} />);
  expect(screen.getByRole('option', { name: 'India' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'United Arab Emirates' })).toBeInTheDocument();
});

test('renders placeholder as a disabled first option', () => {
  render(<Select label="Nationality" options={options} placeholder="Select nationality" />);
  const placeholderOption = screen.getByRole('option', { name: 'Select nationality' });
  expect(placeholderOption).toBeDisabled();
});

test('allows selecting an option', async () => {
  render(<Select label="Nationality" options={options} />);
  const select = screen.getByLabelText('Nationality');
  await userEvent.selectOptions(select, 'ae');
  expect(select).toHaveValue('ae');
});

test('shows required asterisk and sets aria-required', () => {
  render(<Select label="Employment status" options={options} required />);
  expect(screen.getByText('*')).toBeInTheDocument();
  expect(screen.getByLabelText(/Employment status/)).toHaveAttribute('aria-required', 'true');
});

test('shows error message and sets aria-invalid', () => {
  render(<Select label="Nationality" options={options} error="Please select a nationality" />);
  const select = screen.getByLabelText('Nationality');
  expect(screen.getByRole('alert')).toHaveTextContent('Please select a nationality');
  expect(select).toHaveAttribute('aria-invalid', 'true');
});

test('shows helper text when there is no error', () => {
  render(<Select label="Property type" options={options} helperText="Affects required documents" />);
  expect(screen.getByText('Affects required documents')).toBeInTheDocument();
});

test('is disabled and does not allow selection changes', () => {
  render(<Select label="Nationality" options={options} defaultValue="in" disabled />);
  expect(screen.getByLabelText('Nationality')).toBeDisabled();
});

test('renders full width when block is true', () => {
  const { container } = render(<Select label="Nationality" options={options} block />);
  expect(container.firstChild).toHaveClass('w-full');
});

test.each(['md', 'lg'] as const)('renders %s size without crashing', (size) => {
  render(<Select label="Nationality" options={options} size={size} />);
  expect(screen.getByLabelText('Nationality')).toBeInTheDocument();
});