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
    formState: { errors },
  } = useFormContext<MortgageFormValues>();

  return (
    <Controller
      name="debts"
      control={control}
      render={({ field }) => (
        <RepeatableFieldList<Debt>
          label="Existing debts"
          items={field.value ?? []}
          onChange={field.onChange}
          createItem={() => ({ type: '', monthlyPayment: '' })}
          addButtonLabel="Add another debt"
          renderRow={(item, index, updateItem) => {
            // errors.debts is an ARRAY, one slot per row — not a single message
            const rowError = errors.debts?.[index];

            return (
              <>
                <Select
                  label="Debt type"
                  options={debtTypeOptions}
                  placeholder="Select type"
                  value={item.type}
                  onChange={(value) => updateItem({ ...item, type: value })}
                  error={rowError?.type?.message}
                />

                <Input
                  label="Monthly payment (AED)"
                  type="number"
                  value={item.monthlyPayment}
                  onChange={(e) => updateItem({ ...item, monthlyPayment: e.target.value })}
                  error={rowError?.monthlyPayment?.message}
                />
              </>
            );
          }}
        />
      )}
    />
  );
}

export default ExistingDebtPage;