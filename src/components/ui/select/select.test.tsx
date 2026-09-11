import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import '@testing-library/jest-dom';
import Select from './select';

const options = [
  { value: 'in', label: 'India' },
  { value: 'ae', label: 'United Arab Emirates' },
];

// Controlled wrapper — Select takes value/onChange, not defaultValue,
// same pattern used for RadioGroup and RepeatableFieldList tests
function ControlledSelect(props: Partial<React.ComponentProps<typeof Select>>) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <Select
      label="Nationality"
      options={options}
      placeholder="Select nationality"
      {...props}
      value={value}
      onChange={setValue}
    />
  );
}

test('renders the label and placeholder when nothing is selected', () => {
  render(<ControlledSelect />);
  expect(screen.getByText('Nationality')).toBeInTheDocument();
  expect(screen.getByText('Select nationality')).toBeInTheDocument();
});

test('opens the dropdown when the trigger is clicked', async () => {
  render(<ControlledSelect />);
  const trigger = screen.getByRole('button');
  await userEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'India' })).toBeInTheDocument();
});

test('selects an option when clicked and closes the dropdown', async () => {
  render(<ControlledSelect />);
  await userEvent.click(screen.getByRole('button'));
  await userEvent.click(screen.getByRole('option', { name: 'India' }));

  expect(screen.getByRole('button')).toHaveTextContent('India');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('shows the selected option as checked via aria-selected', async () => {
  render(<ControlledSelect value="ae" />);
  await userEvent.click(screen.getByRole('button'));
  const selectedOption = screen.getByRole('option', {
    name: 'United Arab Emirates',
  });
  expect(selectedOption).toHaveAttribute('aria-selected', 'true');
});

test('closes the dropdown when clicking outside', async () => {
  render(
    <div>
      <ControlledSelect />
      <button>Outside button</button>
    </div>
  );
  const [selectTrigger] = screen.getAllByRole('button');
  await userEvent.click(selectTrigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Outside button' }));
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('does not open when disabled', async () => {
  render(<ControlledSelect disabled />);
  const trigger = screen.getByRole('button');
  expect(trigger).toBeDisabled();
  await userEvent.click(trigger);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('shows required asterisk', () => {
  render(<ControlledSelect required />);
  expect(screen.getByText('*')).toBeInTheDocument();
});

test('shows error message when provided', () => {
  render(<ControlledSelect error="Please select your nationality" />);
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Please select your nationality'
  );
});

test('shows helper text when there is no error', () => {
  render(<ControlledSelect helperText="This affects required documents" />);
  expect(
    screen.getByText('This affects required documents')
  ).toBeInTheDocument();
});
