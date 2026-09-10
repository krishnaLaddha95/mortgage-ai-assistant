import { InputHTMLAttributes, forwardRef, useId } from 'react';

type DatePickerSize = 'md' | 'lg';

interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> {
  label: string;
  size?: DatePickerSize;
  error?: string;
  helperText?: string;
  required?: boolean;
  block?: boolean;
}

const sizeStyles: Record<DatePickerSize, string> = {
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      size = 'md',
      error,
      helperText,
      required = false,
      block = false,
      id,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`flex flex-col gap-1 ${block ? 'w-full' : ''}`}>
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-700"
        >
          {label}
          {required && (
            <span className="text-error-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          type="date"
          id={inputId}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-md border bg-white
            ${sizeStyles[size]}
            ${
              error
                ? 'border-error-500 focus:ring-error-500'
                : 'border-neutral-300 focus:ring-brand-500'
            }
            focus:outline-none focus:ring-2
            disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
            [color-scheme:light]
            ${className}
          `}
          aria-invalid={!!error}
          aria-required={required}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />

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
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

export default DatePicker;
