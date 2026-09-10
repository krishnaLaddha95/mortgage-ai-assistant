interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

function Stepper({ currentStep, totalSteps, stepLabels }: StepperProps) {
  return (
    <nav aria-label="Form progress">
      <ol className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={index} className="flex items-center gap-2 flex-1">
              <div
                className={`
                  h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0
                  ${isCurrent ? 'bg-brand-600 text-white' : ''}
                  ${isComplete ? 'bg-brand-100 text-brand-700' : ''}
                  ${!isCurrent && !isComplete ? 'bg-neutral-100 text-neutral-500' : ''}
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {index + 1}
              </div>

              {stepLabels?.[index] && (
                <span className="text-xs text-neutral-500 hidden sm:inline">
                  {stepLabels[index]}
                </span>
              )}

              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-6 rounded-full ${isComplete || isCurrent ? 'bg-brand-600' : 'bg-neutral-300'}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Stepper;
