import { InputHTMLAttributes, useId } from 'react';

type RadioGroupSize = 'md' | 'lg';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  label: string;
  options: RadioOption[];
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  size?: RadioGroupSize;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
}

const sizeStyles: Record<RadioGroupSize, { dot: string; text: string }> = {
  md: { dot: 'h-4 w-4', text: 'text-sm' },
  lg: { dot: 'h-5 w-5', text: 'text-base' },
};

function RadioGroup({
  label,
  options,
  name,
  value,
  onChange,
  size = 'md',
  error,
  helperText,
  required = false,
  disabled = false,
  direction = 'vertical',
}: RadioGroupProps) {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const helperId = `${groupId}-helper`;

  return (
    <fieldset
      className="flex flex-col gap-2"
      aria-invalid={!!error}
      aria-describedby={error ? errorId : helperText ? helperId : undefined}
    >
      <legend className="text-sm font-medium text-neutral-700">
        {label}
        {required && (
          <span className="text-error-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </legend>

      <div className={`flex gap-3 ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}`}>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <div key={option.value} className="flex items-start gap-2">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                disabled={disabled}
                className={`
                  ${sizeStyles[size].dot} mt-0.5 shrink-0
                  text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500
                  ${error ? 'border-error-500' : 'border-neutral-300'}
                  disabled:cursor-not-allowed
                `}
              />
              <label
                htmlFor={optionId}
                className={`${sizeStyles[size].text} ${
                  disabled ? 'text-neutral-400 cursor-not-allowed' : 'text-neutral-700 cursor-pointer'
                }`}
              >
                {option.label}
                {option.description && (
                  <span className="block text-neutral-500 text-xs mt-0.5">{option.description}</span>
                )}
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <span id={errorId} role="alert" className="text-sm text-error-600">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={helperId} className="text-sm text-neutral-500">
          {helperText}
        </span>
      )}
    </fieldset>
  );
}

export default RadioGroup;