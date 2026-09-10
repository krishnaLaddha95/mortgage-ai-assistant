import Input from '@/components/ui/input/Input';
import { PropertyValues } from '@/lib/validations/propertySchema';
import { useFormContext } from 'react-hook-form';

export function calculateLTV(
  purchasePrice: number,
  downPayment: number
): number {
  if (purchasePrice <= 0) return 0;
  const loanAmount = purchasePrice - downPayment;
  return Math.round((loanAmount / purchasePrice) * 100);
}

function PropertyDetails() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<PropertyValues>();
  const purchasePrice = Number(watch('purchasePrice')) || 0;
  const downPayment = Number(watch('downPayment')) || 0;
  const ltv = calculateLTV(purchasePrice, downPayment);
  const hasValidInputs = purchasePrice > 0 && downPayment >= 0;

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Property Type"
        required
        error={errors.propertyType?.message}
        {...register('propertyType')}
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
        <div className="rounded-md bg-neutral-50 border border-neutral-300 px-4 py-3">
          <p className="text-sm font-medium text-neutral-700">
            Loan-to-Value ratio:{' '}
            <span className="text-ink font-semibold">{ltv}%</span>
          </p>
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

export default PropertyDetails;
