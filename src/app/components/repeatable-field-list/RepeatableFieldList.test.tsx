import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import '@testing-library/jest-dom';
import RepeatableFieldList from './RepeatableFieldList';

interface Row {
  name: string;
}

function TestList({ items: initialItems, ...rest }: Partial<React.ComponentProps<typeof RepeatableFieldList<Row>>>) {
  const [items, setItems] = useState<Row[]>((initialItems as Row[]) ?? [{ name: '' }]);
  return (
    <RepeatableFieldList<Row>
      label="Test rows"
      createItem={() => ({ name: '' })}
      renderRow={(item, index, updateItem) => (
        <input
          aria-label={`Row ${index + 1} name`}
          value={item.name}
          onChange={(e) => updateItem({ name: e.target.value })}
        />
      )}
      {...rest}
      items={items}
      onChange={setItems}
    />
  );
}

test('renders one row by default', () => {
  render(<TestList />);
  expect(screen.getByLabelText('Row 1 name')).toBeInTheDocument();
});

test('adds a new row when Add is clicked', async () => {
  render(<TestList />);
  await userEvent.click(screen.getByRole('button', { name: /Add another/i }));
  expect(screen.getByLabelText('Row 1 name')).toBeInTheDocument();
  expect(screen.getByLabelText('Row 2 name')).toBeInTheDocument();
});

test('removes a row when Remove is clicked', async () => {
  render(<TestList items={[{ name: 'a' }, { name: 'b' }]} />);
  expect(screen.getByLabelText('Row 2 name')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Remove row 2' }));
  expect(screen.queryByLabelText('Row 2 name')).not.toBeInTheDocument();
});

test('updates the correct row independently', async () => {
  render(<TestList items={[{ name: '' }, { name: '' }]} />);
  const row1 = screen.getByLabelText('Row 1 name');
  const row2 = screen.getByLabelText('Row 2 name');

  await userEvent.type(row1, 'first');
  await userEvent.type(row2, 'second');

  expect(row1).toHaveValue('first');
  expect(row2).toHaveValue('second');
});

test('shows empty state message when there are no items', () => {
  render(<TestList items={[]} />);
  expect(screen.getByText('Nothing added yet.')).toBeInTheDocument();
});

test('does not allow removing below minItems', () => {
  render(<TestList items={[{ name: 'a' }]} minItems={1} />);
  expect(screen.queryByRole('button', { name: /Remove/i })).not.toBeInTheDocument();
});

test('hides Add button once maxItems is reached', () => {
  render(<TestList items={[{ name: 'a' }, { name: 'b' }]} maxItems={2} />);
  expect(screen.queryByRole('button', { name: /Add another/i })).not.toBeInTheDocument();
});

test('shows error message when provided', () => {
  render(<TestList items={[]} error="Please add at least one item" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Please add at least one item');
});

test('shows helper text when there is no error', () => {
  render(<TestList helperText="Add as many as needed" />);
  expect(screen.getByText('Add as many as needed')).toBeInTheDocument();
});

test('disables Add button when disabled is true', () => {
  render(<TestList disabled />);
  expect(screen.getByRole('button', { name: /Add another/i })).toBeDisabled();
});