import { Controller, useFormContext } from 'react-hook-form';
import Select from '@/components/ui/select/select';
import Input from '@/components/ui/input/Input';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';
import DatePicker from '@/components/ui/date-picker/DatePicker';
import RadioGroup from '@/components/ui/radio-group/RadioGroup';

const nationalityOptions = [
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'in', label: 'India' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

function PersonalInfoPage() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MortgageFormValues>();

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="applicationType"
        control={control}
        render={({ field, fieldState }) => (
          <RadioGroup
            label="Application type"
            name="applicationType"
            options={[
              {
                value: 'individual',
                label: 'Individual application',
                description: 'Just you as the sole applicant',
              },
              {
                value: 'joint',
                label: 'Joint application',
                description: 'You and a co-applicant, such as a spouse',
              },
            ]}
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Input
        label="Full name"
        required
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <DatePicker
        label="Date of birth"
        required
        error={errors.dateOfBirth?.message}
        {...register('dateOfBirth')}
      />

      <Controller
        name="nationality"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Nationality"
            options={nationalityOptions}
            placeholder="Select nationality"
            required
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Input
        label="Passport or ID number"
        required
        error={errors.passportNumber?.message}
        {...register('passportNumber')}
      />

      <Input
        label="Email"
        type="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone number"
        type="tel"
        required
        error={errors.phone?.message}
        {...register('phone')}
      />
    </div>
  );
}

export default PersonalInfoPage;
