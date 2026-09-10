import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DatePicker from './DatePicker';

test('renders label linked to input', () => {
  render(<DatePicker label="Date of birth" />);
  expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
});

test('renders as a date input', () => {
  render(<DatePicker label="Date of birth" />);
  expect(screen.getByLabelText('Date of birth')).toHaveAttribute(
    'type',
    'date'
  );
});

test('accepts a typed date value', async () => {
  render(<DatePicker label="Date of birth" />);
  const input = screen.getByLabelText('Date of birth');
  await userEvent.type(input, '1995-06-15');
  expect(input).toHaveValue('1995-06-15');
});

test('shows required asterisk and sets aria-required', () => {
  render(<DatePicker label="Date of birth" required />);
  expect(screen.getByText('*')).toBeInTheDocument();
  expect(screen.getByLabelText(/Date of birth/)).toHaveAttribute(
    'aria-required',
    'true'
  );
});

test('applies min and max attributes', () => {
  render(
    <DatePicker
      label="Employment start date"
      min="2000-01-01"
      max="2026-09-08"
    />
  );
  const input = screen.getByLabelText('Employment start date');
  expect(input).toHaveAttribute('min', '2000-01-01');
  expect(input).toHaveAttribute('max', '2026-09-08');
});

test('shows error message and sets aria-invalid', () => {
  render(
    <DatePicker
      label="Date of birth"
      error="You must be at least 18 years old"
    />
  );
  const input = screen.getByLabelText('Date of birth');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'You must be at least 18 years old'
  );
  expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('shows helper text when there is no error', () => {
  render(
    <DatePicker
      label="Employment start date"
      helperText="Cannot be a future date"
    />
  );
  expect(screen.getByText('Cannot be a future date')).toBeInTheDocument();
});

test('is disabled and does not accept input', () => {
  render(
    <DatePicker label="Date of birth" disabled defaultValue="1995-06-15" />
  );
  expect(screen.getByLabelText('Date of birth')).toBeDisabled();
});

test('renders full width when block is true', () => {
  const { container } = render(<DatePicker label="Date of birth" block />);
  expect(container.firstChild).toHaveClass('w-full');
});

test.each(['md', 'lg'] as const)('renders %s size without crashing', (size) => {
  render(<DatePicker label="Date of birth" size={size} />);
  expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
});
