import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import '@testing-library/jest-dom';

test('renders with label', () => {
  render(<Button>Continue</Button>);
  expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
});

test('calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Continue</Button>);
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('does not call onClick when disabled', async () => {
  const handleClick = jest.fn();
  render(
    <Button onClick={handleClick} disabled>
      Continue
    </Button>
  );
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).not.toHaveBeenCalled();
});

test('does not call onClick when loading', async () => {
  const handleClick = jest.fn();
  render(
    <Button onClick={handleClick} loading>
      Submitting...
    </Button>
  );
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).not.toHaveBeenCalled();
});

test('is disabled and marked aria-busy when loading', () => {
  render(<Button loading>Submitting...</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
});

test('renders full width when block is true', () => {
  render(<Button block>Continue</Button>);
  expect(screen.getByRole('button')).toHaveClass('w-full');
});

test.each(['md', 'lg'] as const)('renders %s size without crashing', (size) => {
  render(<Button size={size}>Continue</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test.each(['primary', 'secondary', 'ghost', 'negative'] as const)(
  'renders %s color without crashing',
  (color) => {
    render(<Button color={color}>Continue</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  }
);
