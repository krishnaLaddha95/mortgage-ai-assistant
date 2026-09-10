import { useState } from 'react';
import { UseFormTrigger, FieldValues, Path } from 'react-hook-form';

interface UseFormWizardProps<T extends FieldValues> {
  totalSteps: number;
  stepFields: Path<T>[][];
  trigger: UseFormTrigger<T>;
  skipStep?: (stepIndex: number) => boolean; // NEW: return true to skip a given step
}

function useFormWizard<T extends FieldValues>({
  totalSteps,
  stepFields,
  trigger,
  skipStep,
}: UseFormWizardProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = async () => {
    const isValid = await trigger(stepFields[currentStep]);
    if (!isValid) return;

    let nextIndex = currentStep + 1;
    while (nextIndex < totalSteps && skipStep?.(nextIndex)) {
      nextIndex++;
    }
    if (nextIndex < totalSteps) setCurrentStep(nextIndex);
  };

  const back = () => {
    let prevIndex = currentStep - 1;
    while (prevIndex >= 0 && skipStep?.(prevIndex)) {
      prevIndex--;
    }
    setCurrentStep(Math.max(0, prevIndex));
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) setCurrentStep(index);
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
