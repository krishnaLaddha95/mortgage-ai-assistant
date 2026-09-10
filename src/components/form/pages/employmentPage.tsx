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

  const employmentStatus = watch('employmentStatus');

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="employmentStatus"
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
            error={errors.employerName?.message}
            {...register('employerName')}
          />
          <Input
            label="Job Title"
            required
            error={errors.jobTitle?.message}
            {...register('jobTitle')}
          />
        </>
      )}

      {employmentStatus === 'self-employed' && (
        <>
          <Input
            label="Bussiness name"
            required
            error={errors.businessName?.message}
            {...register('businessName')}
          />

          <Input
            label="Years in operation"
            type="number"
            required
            error={errors.yearsInOperation?.message}
            {...register('yearsInOperation')}
          />
        </>
      )}

      <Input
        label="Monthly income (AED)"
        type="number"
        required
        error={errors.monthlyIncome?.message}
        {...register('monthlyIncome')}
      />

      <DatePicker
        label="Employment start date"
        max={new Date().toISOString().split('T')[0]}
        required
        error={errors.employmentStartDate?.message}
        {...register('employmentStartDate')}
      />
    </div>
  );
}

export default EmploymentPage;
