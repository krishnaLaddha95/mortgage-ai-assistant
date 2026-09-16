import { useFormContext, Controller } from 'react-hook-form';
import Input from '@/components/ui/input/Input';
import DatePicker from '@/components/ui/date-picker/DatePicker';
import RadioGroup from '@/components/ui/radio-group/RadioGroup';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';

const employmentStatusOptions = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
];

function EmploymentPage() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<MortgageFormValues>();

  const employmentStatus = watch('employment.employmentStatus');

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="employment.employmentStatus"
        control={control}
        render={({ field, fieldState }) => (
          <RadioGroup
            label="Employment status"
            name="employmentStatus"
            options={employmentStatusOptions}
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      {employmentStatus === 'employed' && (
        <>
          <Input
            label="Employer Name"
            required
            error={errors.employment?.employerName?.message}
            {...register('employment.employerName')}
          />
          <Input
            label="Job Title"
            required
            error={errors.employment?.jobTitle?.message}
            {...register('employment.jobTitle')}
          />
        </>
      )}

      {employmentStatus === 'self-employed' && (
        <>
          <Input
            label="Bussiness name"
            required
            error={errors.employment?.businessName?.message}
            {...register('employment.businessName')}
          />

          <Input
            label="Years in operation"
            type="number"
            required
            error={errors.employment?.yearsInOperation?.message}
            {...register('employment.yearsInOperation')}
          />
        </>
      )}

      <Input
        label="Monthly income (AED)"
        type="number"
        required
        error={errors.employment?.monthlyIncome?.message}
        {...register('employment.monthlyIncome')}
      />

      <DatePicker
        label="Employment start date"
        max={new Date().toISOString().split('T')[0]}
        required
        error={errors.employment?.employmentStartDate?.message}
        {...register('employment.employmentStartDate')}
      />
    </div>
  );
}

export default EmploymentPage;
