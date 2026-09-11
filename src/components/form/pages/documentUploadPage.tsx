import { Controller, useFormContext } from 'react-hook-form';
import FileUpload from '@/components/ui/file-upload/FileUpload';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';

function DocumentsPage() {
  const { control, watch } = useFormContext<MortgageFormValues>();

  const employmentStatus = watch('employmentStatus');

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="idProof"
        control={control}
        render={({ field, fieldState }) => (
          <FileUpload
            label="ID proof"
            value={field.value ?? []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Controller
        name="salaryOrTradeLicence"
        control={control}
        render={({ field, fieldState }) => (
          <FileUpload
            label={
              employmentStatus === 'self-employed'
                ? 'Trade licence'
                : 'Salary certificate'
            }
            helperText={
              employmentStatus === 'self-employed'
                ? 'Upload your current business trade licence'
                : 'Must be dated within the last 3 months'
            }
            value={field.value ?? []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Controller
        name="bankStatements"
        control={control}
        render={({ field, fieldState }) => (
          <FileUpload
            label="Bank statements (6 months)"
            helperText="Upload one file per month, or a single combined statement"
            multiple
            value={field.value ?? []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Controller
        name="propertyDocuments"
        control={control}
        render={({ field, fieldState }) => (
          <FileUpload
            label="Property documents"
            value={field.value ?? []}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />
    </div>
  );
}

export default DocumentsPage;