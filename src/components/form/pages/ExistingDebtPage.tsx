import Input from '@/components/ui/input/Input';
import RepeatableFieldList from '@/components/ui/repeatable-field-list/RepeatableFieldList';
import Select from '@/components/ui/select/select';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';
import { Controller, useFormContext } from 'react-hook-form';

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

function ExistingDebtPage() {
  const {
    control,
  } = useFormContext<MortgageFormValues>();
  return (
    <Controller
      name="debts"
      control={control}
      render={({ field, fieldState }) => (
        <RepeatableFieldList<Debt>
          label="Existing debts"
          items={field.value ?? []}
          onChange={field.onChange}
          createItem={() => ({ type: '', monthlyPayment: '' })}
          error={fieldState.error?.message}
          addButtonLabel="Add another debt"
          renderRow={(item, index, updateItem) => (
            <>
              <Select
                label="Debt type"
                options={debtTypeOptions}
                placeholder="Select type"
                value={item.type}
                onChange={(value) => updateItem({ ...item, type: value })}
              />

              <Input
                label="Monthly payment (AED)"
                type="number"
                value={item.monthlyPayment}
                onChange={(e) =>
                  updateItem({ ...item, monthlyPayment: e.target.value })
                }
              />
            </>
          )}
        />
      )}
    />
  );
}

export default ExistingDebtPage;
