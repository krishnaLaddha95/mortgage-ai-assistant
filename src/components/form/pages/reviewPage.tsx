import { useFormContext } from 'react-hook-form';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';
import ReviewSectionCard from '@/components/ui/review-section-card/ReviewSectionCard';
import Checkbox from '@/components/ui/checkbox/Checkbox';

const nationalityLabels: Record<string, string> = {
  ae: 'United Arab Emirates',
  in: 'India',
  uk: 'United Kingdom',
  us: 'United States',
};

interface ReviewPageProps {
  goToStep: (index: number) => void;
}

const propertyTypeLabels: Record<string, string> = {
  apartment: 'Apartment',
  villa: 'Villa',
  townhouse: 'Townhouse',
};

const debtTypeLabels: Record<string, string> = {
  'car-loan': 'Car loan',
  'credit-card': 'Credit card',
  'personal-loan': 'Personal loan',
  other: 'Other',
};

const documentLabels: {
  key: keyof MortgageFormValues['documents'];
  label: string;
}[] = [
  { key: 'idProof', label: 'ID proof' },
  { key: 'salaryOrTradeLicence', label: 'Salary certificate / Trade licence' },
  { key: 'bankStatements', label: 'Bank statements' },
  { key: 'propertyDocuments', label: 'Property documents' },
];

function formatDate(isoDate: string | undefined): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function formatCurrency(amount: string | undefined): string {
  if (!amount) return '';
  return `AED ${Number(amount).toLocaleString('en-US')}`;
}

function ReviewPage({ goToStep }: ReviewPageProps) {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<MortgageFormValues>();
  const formData = watch();
  const isJoint = formData.personalInfo?.applicationType === 'joint';

  console.log('Form Data:', formData);

  return (
    <div className="flex flex-col gap-8">
      <ReviewSectionCard
        title="Personal information"
        onEdit={() => goToStep(0)}
        fields={[
          { label: 'Full name', value: formData.personalInfo?.fullName },
          { label: 'Date of birth', value: formData.personalInfo?.dateOfBirth },
          {
            label: 'Nationality',
            value:
              nationalityLabels[formData.personalInfo?.nationality] ??
              formData.personalInfo?.nationality,
          },
          {
            label: 'Passport / ID number',
            value: formData.personalInfo?.passportNumber,
          },
          { label: 'Email', value: formData.personalInfo?.email },
          { label: 'Phone number', value: formData.personalInfo?.phone },
        ]}
      />
      <ReviewSectionCard
        title="Employment & income"
        onEdit={() => goToStep(1)}
        fields={
          formData.employment.employmentStatus === 'self-employed'
            ? [
                { label: 'Employment status', value: 'Self-employed' },
                {
                  label: 'Business name',
                  value: formData.employment?.businessName ?? '',
                },
                {
                  label: 'Years in operation',
                  value: formData.employment?.yearsInOperation ?? '',
                },
                {
                  label: 'Monthly income',
                  value: formData.employment?.monthlyIncome,
                },
              ]
            : [
                { label: 'Employment status', value: 'Employed' },
                {
                  label: 'Employer',
                  value: formData.employment?.employerName ?? '',
                },
                {
                  label: 'Job title',
                  value: formData.employment?.jobTitle ?? '',
                },
                {
                  label: 'Monthly income',
                  value: formData.employment?.monthlyIncome,
                },
              ]
        }
      />

      {isJoint && (
        <ReviewSectionCard
          title="Co-applicant details"
          onEdit={() => goToStep(2)}
          fields={[
            {
              label: 'Co-applicant name',
              value: formData.coApplicant?.coApplicantName ?? '',
            },
            {
              label: 'Co-applicant email',
              value: formData.coApplicant?.coApplicantEmail ?? '',
            },
            {
              label: 'Relationship',
              value: formData.coApplicant?.relationshipToPrimary ?? '',
            },
          ]}
        />
      )}

      <ReviewSectionCard
        title="Property details"
        onEdit={() => goToStep(3)}
        fields={[
          {
            label: 'Property type',
            value:
              propertyTypeLabels[formData.property?.propertyType ?? ''] ??
              formData.property?.propertyType ??
              '',
          },
          { label: 'Location', value: formData.property?.location ?? '' },
          {
            label: 'Purchase price',
            value: formatCurrency(formData.property?.purchasePrice),
          },
          {
            label: 'Down payment',
            value: formatCurrency(formData.property?.downPayment),
          },
        ]}
      />

      <ReviewSectionCard title="Existing debts" onEdit={() => goToStep(4)}>
        {formData.debts && formData.debts.length > 0 ? (
          formData.debts.map((debt, index) => (
            <div key={index} className="flex justify-between text-sm text-ink">
              <span>{debtTypeLabels[debt.type] ?? debt.type}</span>
              <span>{formatCurrency(debt.monthlyPayment)}/month</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">No debts listed</p>
        )}
      </ReviewSectionCard>

      <ReviewSectionCard title="Documents" onEdit={() => goToStep(5)}>
        {documentLabels.map(({ key, label }) => {
          const files = formData.documents?.[key];
          const count = Array.isArray(files) ? files.length : 0;
          return (
            <div key={key} className="flex justify-between text-sm text-ink">
              <span>{label}</span>
              <span className={count > 0 ? 'text-brand-600' : 'text-error-600'}>
                {count === 0
                  ? 'Not uploaded'
                  : count === 1
                    ? 'Uploaded'
                    : `${count} files uploaded`}
              </span>
            </div>
          );
        })}
      </ReviewSectionCard>
    </div>
  );
}

export default ReviewPage;
