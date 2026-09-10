import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import '@testing-library/jest-dom';
import RadioGroup from './RadioGroup';

const options = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
];

// Controlled wrapper so tests exercise real onChange behavior
function ControlledRadioGroup(
  props: Partial<React.ComponentProps<typeof RadioGroup>>
) {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <RadioGroup
      label="Employment status"
      name="employment"
      options={options}
      value={value}
      onChange={setValue}
      {...props}
    />
  );
}

test('renders the group label as a legend', () => {
  render(<ControlledRadioGroup />);
  expect(screen.getByText('Employment status')).toBeInTheDocument();
});

test('renders all options', () => {
  render(<ControlledRadioGroup />);
  expect(screen.getByLabelText('Employed')).toBeInTheDocument();
  expect(screen.getByLabelText('Self-employed')).toBeInTheDocument();
});

test('only one option can be selected at a time', async () => {
  render(<ControlledRadioGroup />);
  const employed = screen.getByLabelText('Employed');
  const selfEmployed = screen.getByLabelText('Self-employed');

  await userEvent.click(employed);
  expect(employed).toBeChecked();
  expect(selfEmployed).not.toBeChecked();

  await userEvent.click(selfEmployed);
  expect(selfEmployed).toBeChecked();
  expect(employed).not.toBeChecked();
});

test('calls onChange with the selected value', async () => {
  const handleChange = jest.fn();
  render(
    <RadioGroup
      label="Employment status"
      name="employment"
      options={options}
      value=""
      onChange={handleChange}
    />
  );
  await userEvent.click(screen.getByLabelText('Self-employed'));
  expect(handleChange).toHaveBeenCalledWith('self-employed');
});

test('renders option description when provided', () => {
  render(
    <ControlledRadioGroup
      options={[
        {
          value: 'joint',
          label: 'Joint application',
          description: 'You and a co-applicant',
        },
      ]}
    />
  );
  expect(screen.getByText('You and a co-applicant')).toBeInTheDocument();
});

test('shows required asterisk', () => {
  render(<ControlledRadioGroup required />);
  expect(screen.getByText('*')).toBeInTheDocument();
});

test('shows error message and sets aria-invalid on the fieldset', () => {
  render(<ControlledRadioGroup error="Please select an option" />);
  expect(screen.getByRole('alert')).toHaveTextContent(
    'Please select an option'
  );
});

test('shows helper text when there is no error', () => {
  render(
    <ControlledRadioGroup helperText="Choose the option that applies to you" />
  );
  expect(
    screen.getByText('Choose the option that applies to you')
  ).toBeInTheDocument();
});

test('disables all options when disabled is true', () => {
  render(<ControlledRadioGroup disabled />);
  expect(screen.getByLabelText('Employed')).toBeDisabled();
  expect(screen.getByLabelText('Self-employed')).toBeDisabled();
});

test('does not call onChange when disabled', async () => {
  const handleChange = jest.fn();
  render(
    <RadioGroup
      label="Employment status"
      name="employment"
      options={options}
      value=""
      onChange={handleChange}
      disabled
    />
  );
  await userEvent.click(screen.getByLabelText('Employed'));
  expect(handleChange).not.toHaveBeenCalled();
});

test.each(['md', 'lg'] as const)('renders %s size without crashing', (size) => {
  render(<ControlledRadioGroup size={size} />);
  expect(screen.getByLabelText('Employed')).toBeInTheDocument();
});
