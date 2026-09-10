import Input from '@/components/ui/input/Input';
import Select from '@/components/ui/select/select';
import { CoApplicantValues } from '@/lib/validations/coApplicantSchema';
import { Controller, useFormContext } from 'react-hook-form';

function CoApplicantPage() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CoApplicantValues>();

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'business-partner', label: 'Business partner' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Co-Applicant Name"
        required
        error={errors.coApplicantName?.message}
        {...register('coApplicantName')}
      />
      <Input
        label="Co-Applicant Email"
        required
        error={errors.coApplicantEmail?.message}
        {...register('coApplicantEmail')}
      />

      <Controller
        name="relationshipToPrimary"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Relationship to Primary Applicant"
            options={relationshipOptions}
            placeholder="Select nationality"
            required
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </div>
  );
}
export default CoApplicantPage;
