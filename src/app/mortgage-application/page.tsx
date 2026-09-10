'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  personalInfoSchema,
  PersonalInfoValues,
} from '@/lib/validations/personalInfoSchema';
import useFormWizard from '@/lib/form/useFormWizard';
import Stepper from '@/components/form/stepper/Stepper';
import Button from '@/components/ui/button/button';
import PersonalInfoPage from '@/components/form/pages/personalInfoPage';
import EmploymentPage from '@/components/form/pages/employmentPage';
import CoApplicantPage from '@/components/form/pages/coApplicantPage';
import {
  mortgageFormSchema,
  MortgageFormValues,
} from '@/lib/validations/mortgageFormSchema';
import PropertyDetails from '@/components/form/pages/propertyDetails';

export default function MortgageApplicationPage() {
  const methods = useForm<MortgageFormValues>({
    resolver: zodResolver(mortgageFormSchema),
    mode: 'onBlur',
  });
  const pageTitles = [
    'Personal Information',
    'Employment & Income',
    'Co-Applicant Information',
    'Property Details',
    'Loan Details',
    'Review & Submit',
    'Confirmation',
  ];

  const applicationType = methods.watch('applicationType');

  const { currentStep, next, back, isFirstStep } =
    useFormWizard<MortgageFormValues>({
      totalSteps: 7,
      stepFields: [
        [
          'applicationType',
          'fullName',
          'dateOfBirth',
          'nationality',
          'passportNumber',
          'email',
          'phone',
        ],
        [
          'employmentStatus',
          'employerName',
          'jobTitle',
          'businessName',
          'yearsInOperation',
          'monthlyIncome',
          'employmentStartDate',
        ],
        ['coApplicantName', 'coApplicantEmail', 'relationshipToPrimary'],
        [],
        [],
        [],
        [],
      ],
      trigger: methods.trigger,
      skipStep: (index) => index === 2 && applicationType !== 'joint',
    });

  const onSubmit = (data: PersonalInfoValues) => {
    console.log('Submitted:', data);
  };

  return (
    <FormProvider {...methods}>
      {/* one flat background for the whole page — no separate card color */}
      <div className="min-h-screen bg-paper relative">
        <div className="max-w-[720px] mx-auto py-12 px-8">
          <Stepper currentStep={currentStep} totalSteps={7} />

          <h2 className="font-display text-xl text-ink mt-6">
            {currentStep + 1 + '. ' + pageTitles[currentStep]}
          </h2>

          <div className="mt-6">
            {currentStep === 0 && <PersonalInfoPage />}
            {currentStep === 1 && <EmploymentPage />}
            {currentStep === 2 && <CoApplicantPage />}
            {currentStep === 3 && <PropertyDetails />}
          </div>

          <div className="flex gap-3 mt-8">
            {!isFirstStep && (
              <Button type="button" color="secondary" onClick={back}>
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={
                currentStep === 6 ? methods.handleSubmit(onSubmit) : next
              }
            >
              {currentStep === 6 ? 'Submit application' : 'Next'}
            </Button>
          </div>
        </div>

        <button
          type="button"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-600 text-white font-bold shadow-lg"
          aria-label="Open AI assistant"
        >
          AI
        </button>
      </div>
    </FormProvider>
  );
}
