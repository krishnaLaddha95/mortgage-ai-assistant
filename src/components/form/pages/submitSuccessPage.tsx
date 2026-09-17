import { useFormContext } from 'react-hook-form';
import { MortgageFormValues } from '@/lib/validations/mortgageFormSchema';

function SubmitSuccessPage() {
  const { watch } = useFormContext<MortgageFormValues>();
  const fullName = watch('personalInfo.fullName');
  const email = watch('personalInfo.email');

  return (
    <div className="flex flex-col items-start py-8">
      <div className="h-14 w-14 rounded-full bg-brand-600 flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12l5 5L19 7"
            stroke="#F3F4F1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="font-display text-2xl text-ink mb-3">
        Application submitted
      </h2>
      <p className="text-sm text-neutral-700 max-w-md">
        Thank you, {fullName}. We&apos;ve received your mortgage pre-approval
        application and a summary has been sent to {email}.
      </p>
    </div>
  );
}

export default SubmitSuccessPage;
