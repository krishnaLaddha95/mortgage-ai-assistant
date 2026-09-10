import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Input } from './Input';

test('renders label linked to input', () => {
  render(<Input label="Full name" />);
  expect(screen.getByLabelText('Full name')).toBeInTheDocument();
});

test('accepts typed input', async () => {
  render(<Input label="Full name" />);
  const input = screen.getByLabelText('Full name');
  await userEvent.type(input, 'Krishna');
  expect(input).toHaveValue('Krishna');
});

test('shows required asterisk and sets aria-required', () => {
  render(<Input label="Email" required />);
  const input = screen.getByLabelText(/Email/);
  expect(screen.getByText('*')).toBeInTheDocument();
  expect(input).toHaveAttribute('aria-required', 'true');
});

test('shows error message and sets aria-invalid', () => {
  render(<Input label="Email" error="Please enter a valid email" />);
  const input = screen.getByLabelText('Email');
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Please enter a valid email'
  );
  expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('shows helper text when there is no error', () => {
  render(
    <Input
      label="Monthly income"
      helperText="Enter your gross monthly income"
    />
  );
  expect(
    screen.getByText('Enter your gross monthly income')
  ).toBeInTheDocument();
});

test('hides helper text when an error is present', () => {
  render(
    <Input
      label="Monthly income"
      helperText="Enter your gross monthly income"
      error="This field is required"
    />
  );
  expect(
    screen.queryByText('Enter your gross monthly income')
  ).not.toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
});

test('is disabled and does not accept input', async () => {
  render(<Input label="Employer name" disabled defaultValue="Locai.ai" />);
  const input = screen.getByLabelText('Employer name');
  expect(input).toBeDisabled();
  await userEvent.type(input, ' more text');
  expect(input).toHaveValue('Locai.ai');
});

test('renders leading icon', () => {
  render(<Input label="Purchase price" leadingIcon={<span>AED</span>} />);
  expect(screen.getByText('AED')).toBeInTheDocument();
});

test('renders full width when block is true', () => {
  const { container } = render(<Input label="Full name" block />);
  expect(container.firstChild).toHaveClass('w-full');
});

test.each(['md', 'lg'] as const)('renders %s size without crashing', (size) => {
  render(<Input label="Full name" size={size} />);
  expect(screen.getByLabelText('Full name')).toBeInTheDocument();
});
