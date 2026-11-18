import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import ChatPanel from './chatPanel';

test('has no accessibility violations when collapsed', async () => {
  const { container } = render(<ChatPanel currentStep={0} formData={{}} />);
  expect(await axe(container)).toHaveNoViolations();
});

test('has no accessibility violations when open', async () => {
  const { container } = render(<ChatPanel currentStep={0} formData={{}} />);
  await userEvent.click(screen.getByRole('button', { name: 'Open AI assistant' }));
  expect(await axe(container)).toHaveNoViolations();
});