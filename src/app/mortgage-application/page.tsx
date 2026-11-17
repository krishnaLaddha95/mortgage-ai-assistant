'use client';
import { useState } from 'react';
import { useForm, FormProvider, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  mortgageFormSchema,
  MortgageFormValues,
} from '@/lib/validations/mortgageFormSchema';
import useFormWizard from '@/lib/form/useFormWizard';
import Stepper from '@/components/form/stepper/Stepper';
import Button from '@/components/ui/button/button';
import PersonalInfoPage from '@/components/form/pages/personalInfoPage';
import EmploymentPage from '@/components/form/pages/employmentPage';
import CoApplicantPage from '@/components/form/pages/coApplicantPage';
import PropertyDetailsPage from '@/components/form/pages/propertyDetailsPage';
import ExistingDebtPage from '@/components/form/pages/ExistingDebtPage';
import ReviewPage from '@/components/form/pages/reviewPage';
import SubmitSuccessPage from '@/components/form/pages/submitSuccessPage';
import DocumentsPage from '@/components/form/pages/documentUploadPage';
import ChatPanel from '@/components/chat/chat-panel/chatPanel';

const pageTitles = [
  'Personal Information',
  'Employment & Income',
  'Co-Applicant Information',
  'Property Details',
  'Existing Debts & Liabilities',
  'Document Upload',
  'Review & Consent',
];

const STEP_BY_SECTION: Record<string, number> = {
  personalInfo: 0,
  employment: 1,
  coApplicant: 2,
  property: 3,
  debts: 4,
  documents: 5,
  consent: 6,
};

export default function MortgageApplicationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const methods = useForm<MortgageFormValues>({
    resolver: zodResolver(mortgageFormSchema),
    mode: 'onBlur',
    defaultValues: {
      personalInfo: {
        applicationType: 'individual',
      },
      employment: {
        employmentStatus: 'employed',
      },
    },
  });

  const applicationType = methods.watch('personalInfo.applicationType');

  const { currentStep, next, back, isFirstStep, goToStep } =
    useFormWizard<MortgageFormValues>({
      totalSteps: 7,
      stepFields: [
        [
          'personalInfo.applicationType',
          'personalInfo.fullName',
          'personalInfo.dateOfBirth',
          'personalInfo.nationality',
          'personalInfo.passportNumber',
          'personalInfo.email',
          'personalInfo.phone',
        ],
        [
          'employment.employmentStatus',
          'employment.employerName',
          'employment.jobTitle',
          'employment.businessName',
          'employment.yearsInOperation',
          'employment.monthlyIncome',
          'employment.employmentStartDate',
        ],
        [
          'coApplicant.coApplicantName',
          'coApplicant.coApplicantEmail',
          'coApplicant.relationshipToPrimary',
        ],
        [
          'property.propertyType',
          'property.location',
          'property.purchasePrice',
          'property.downPayment',
        ],
        ['debts'],
        [
          'documents.idProof',
          'documents.salaryOrTradeLicence',
          'documents.bankStatements',
          'documents.propertyDocuments',
        ],
        [],
      ],
      trigger: methods.trigger,
      skipStep: (index) => index === 2 && applicationType !== 'joint',
    });

  const onSubmit = (data: MortgageFormValues) => {
    console.log('Submitted:', data);
    setIsSubmitted(true);
  };

  const onInvalid = (errors: FieldErrors<MortgageFormValues>) => {
    const stepsWithErrors = Object.keys(errors)
      .map((section) => STEP_BY_SECTION[section])
      .filter((step): step is number => step !== undefined);
    if (stepsWithErrors.length === 0) return;

    const firstStep = Math.min(...stepsWithErrors);
    
    if (firstStep < 6) {
      setSubmitMessage(
        'Some answers need fixing before you can submit. We have taken you to the first one.'
      );
      goToStep(firstStep);
    }
  };

  const handleNext = () => {
    setSubmitMessage(null);
    next();
  };

  const handleBack = () => {
    setSubmitMessage(null);
    back();
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-paper relative">
        <div className="max-w-[720px] mx-auto pt-8 pb-28 px-4 sm:pt-12 sm:px-8">
          {!isSubmitted && (
            <>
              <Stepper currentStep={currentStep} totalSteps={7} />
              <h2 className="font-display text-xl text-ink mt-6">
                {currentStep + 1 + '. ' + pageTitles[currentStep]}
              </h2>
              {submitMessage && (
                <p role="alert" className="mt-6 text-sm text-error-600">
                  {submitMessage}
                </p>
              )}
            </>
          )}

          <div className="mt-6">
            {isSubmitted ? (
              <SubmitSuccessPage />
            ) : (
              <>
                {currentStep === 0 && <PersonalInfoPage />}
                {currentStep === 1 && <EmploymentPage />}
                {currentStep === 2 && <CoApplicantPage />}
                {currentStep === 3 && <PropertyDetailsPage />}
                {currentStep === 4 && <ExistingDebtPage />}
                {currentStep === 5 && <DocumentsPage />}
                {currentStep === 6 && <ReviewPage goToStep={goToStep} />}
              </>
            )}
          </div>

          {!isSubmitted && (
            <div className="flex gap-3 mt-8">
              {!isFirstStep && (
                <Button type="button" color="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={
                  currentStep === 6
                    ? methods.handleSubmit(onSubmit, onInvalid)
                    : handleNext
                }
              >
                {currentStep === 6 ? 'Submit application' : 'Next'}
              </Button>
            </div>
          )}
        </div>

        {!isSubmitted && (
          <ChatPanel currentStep={currentStep} formData={methods.watch()} />
        )}
      </div>
    </FormProvider>
  );
}