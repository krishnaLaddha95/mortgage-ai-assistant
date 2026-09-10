import Input from '@/components/ui/input/Input';
import Select from '@/components/ui/select/select';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';
import { Controller, useFormContext } from 'react-hook-form';

export function calculateLTV(
  purchasePrice: number,
  downPayment: number
): number {
  if (purchasePrice <= 0) return 0;
  const loanAmount = purchasePrice - downPayment;
  return Math.round((loanAmount / purchasePrice) * 100);
}

const propertyTypeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
];

function PropertyDetailsPage() {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<MortgageFormValues>();
  const purchasePrice = Number(watch('purchasePrice')) || 0;
  const downPayment = Number(watch('downPayment')) || 0;
  const ltv = calculateLTV(purchasePrice, downPayment);
  const hasValidInputs = purchasePrice > 0 && downPayment >= 0;

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="propertyType"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Property Type"
            options={propertyTypeOptions}
            placeholder="Select property type"
            required
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Input
        label="Location"
        required
        error={errors.location?.message}
        {...register('location')}
      />
      <Input
        label="Purchase Price (AED)"
        required
        type="number"
        error={errors.purchasePrice?.message}
        {...register('purchasePrice')}
      />
      <Input
        label="Down Payment (AED)"
        required
        type="number"
        error={errors.downPayment?.message}
        {...register('downPayment')}
      />
      {hasValidInputs && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-neutral-700">
            Loan-to-Value ratio (auto calculated) :{' '}
          </p>
          <div className="rounded-md bg-neutral-50 border border-neutral-300 px-4 py-2">
            <span className="text-ink font-semibold">{ltv}%</span>
          </div>
          {ltv > 80 && (
            <p className="text-sm text-error-600 mt-1">
              A high LTV usually means a higher interest rate on your loan.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyDetailsPage;
