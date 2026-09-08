import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import RepeatableFieldList from './RepeatableFieldList';
import Input from '../input/Input';
import Select from '../select/select';

interface Debt {
  type: string;
  monthlyPayment: string;
}

const debtTypeOptions = [
  { value: 'car-loan', label: 'Car loan' },
  { value: 'credit-card', label: 'Credit card' },
  { value: 'personal-loan', label: 'Personal loan' },
  { value: 'other', label: 'Other' },
];

function DebtsTemplate(args: Partial<React.ComponentProps<typeof RepeatableFieldList<Debt>>>) {
  const [debts, setDebts] = useState<Debt[]>(
    (args.items as Debt[]) ?? [{ type: '', monthlyPayment: '' }]
  );

  return (
    <RepeatableFieldList<Debt>
      label="Existing debts"
      items={debts}
      onChange={setDebts}
      createItem={() => ({ type: '', monthlyPayment: '' })}
      addButtonLabel="Add another debt"
      renderRow={(item, index, updateItem) => (
        <>
          <Select
            label="Debt type"
            options={debtTypeOptions}
            placeholder="Select type"
            value={item.type}
            onChange={(e) => updateItem({ ...item, type: e.target.value })}
          />
          <Input
            label="Monthly payment (AED)"
            type="number"
            value={item.monthlyPayment}
            onChange={(e) => updateItem({ ...item, monthlyPayment: e.target.value })}
          />
        </>
      )}
      {...args}
    />
  );
}

const meta: Meta<typeof DebtsTemplate> = {
  title: 'UI/RepeatableFieldList',
  component: DebtsTemplate,
};
export default meta;
type Story = StoryObj<typeof DebtsTemplate>;

export const Default: Story = {};

export const StartingEmpty: Story = {
  args: { items: [] },
};

export const WithMinimumOne: Story = {
  args: { minItems: 1 },
};

export const WithMaximumFour: Story = {
  args: {
    items: [
      { type: 'car-loan', monthlyPayment: '1500' },
      { type: 'credit-card', monthlyPayment: '800' },
    ],
    maxItems: 4,
    helperText: 'You can list up to 4 debts',
  },
};

export const WithError: Story = {
  args: { items: [], error: 'Please add at least one debt, or select "No" above if you have none' },
};

export const Disabled: Story = {
  args: {
    items: [{ type: 'car-loan', monthlyPayment: '1500' }],
    disabled: true,
  },
};