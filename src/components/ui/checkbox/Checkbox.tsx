import { InputHTMLAttributes, forwardRef, useId } from 'react';

type CheckboxSize = 'md' | 'lg';

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  label: string;
  size?: CheckboxSize;
  error?: string;
  helperText?: string;
}

const sizeStyles: Record<CheckboxSize, { box: string; text: string }> = {
  md: { box: 'h-4 w-4', text: 'text-sm' },
  lg: { box: 'h-5 w-5', text: 'text-base' },
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      size = 'md',
      error,
      helperText,
      id,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;
    const helperId = `${checkboxId}-helper`;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className={`
              ${sizeStyles[size].box} mt-0.5 rounded border shrink-0
              text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500
              ${error ? 'border-error-500' : 'border-neutral-300'}
              disabled:bg-neutral-50 disabled:cursor-not-allowed
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={`${sizeStyles[size].text} text-neutral-700 ${
              disabled
                ? 'text-neutral-400 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
          >
            {label}
          </label>
        </div>

        {error && (
          <span
            id={errorId}
            role="alert"
            className="text-sm text-error-600 pl-6"
          >
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-sm text-neutral-500 pl-6">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
