import Input from '@/components/ui/input/Input';
import Select from '@/components/ui/select/select';
import { CoApplicantValues } from '@/lib/validations/coApplicantSchema';
import { useFormContext } from 'react-hook-form';

function CoApplicantPage() {
  const {
    register,
    control,
    watch,
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
      <Select
        label="Relationship to Primary Applicant"
        options={relationshipOptions}
        required
        error={errors.relationshipToPrimary?.message}
        {...register('relationshipToPrimary')}
      />
    </div>
  );
}
export default CoApplicantPage;
