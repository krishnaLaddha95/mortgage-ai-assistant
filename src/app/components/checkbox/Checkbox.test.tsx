import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Checkbox from './Checkbox';

test('renders label linked to checkbox', () => {
  render(<Checkbox label="Accept terms" />);
  expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
});

test('is unchecked by default', () => {
  render(<Checkbox label="Accept terms" />);
  expect(screen.getByLabelText('Accept terms')).not.toBeChecked();
});

test('toggles when clicked', async () => {
  render(<Checkbox label="Accept terms" />);
  const checkbox = screen.getByLabelText('Accept terms');
  await userEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  await userEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

test('toggles when label is clicked', async () => {
  render(<Checkbox label="Accept terms" />);
  await userEvent.click(screen.getByText('Accept terms'));
  expect(screen.getByLabelText('Accept terms')).toBeChecked();
});

test('renders checked when defaultChecked is true', () => {
  render(<Checkbox label="Accept terms" defaultChecked />);
  expect(screen.getByLabelText('Accept terms')).toBeChecked();
});

test('shows error message and sets aria-invalid', () => {
  render(<Checkbox label="Accept terms" error="You must accept the terms" />);
  const checkbox = screen.getByLabelText('Accept terms');
  expect(screen.getByRole('alert')).toHaveTextContent('You must accept the terms');
  expect(checkbox).toHaveAttribute('aria-invalid', 'true');
});

test('shows helper text when there is no error', () => {
  render(<Checkbox label="Send updates" helperText="Unsubscribe anytime" />);
  expect(screen.getByText('Unsubscribe anytime')).toBeInTheDocument();
});

test('is disabled and cannot be toggled', async () => {
  render(<Checkbox label="Accept terms" disabled />);
  const checkbox = screen.getByLabelText('Accept terms');
  expect(checkbox).toBeDisabled();
  await userEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
});

test.each(['md', 'lg'] as const)('renders %s size without crashing', (size) => {
  render(<Checkbox label="Accept terms" size={size} />);
  expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
});