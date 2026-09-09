import { useState } from 'react';
import { UseFormTrigger, FieldValues, Path } from 'react-hook-form';

interface UseFormWizardProps<T extends FieldValues> {
  totalSteps: number;
  stepFields: Path<T>[][];
  trigger: UseFormTrigger<T>;
}

function useFormWizard<T extends FieldValues>({
  totalSteps,
  stepFields,
  trigger,
}: UseFormWizardProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = async () => {
    const fieldsForCurrentStep = stepFields[currentStep];
    const isValid = await trigger(fieldsForCurrentStep);

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const back = () => {
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStep(index);
    }
  };

  return {
    currentStep,
    next,
    back,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };
}

export default useFormWizard;