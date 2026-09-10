import { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

type InputSize = 'md' | 'lg';

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  label: string;
  size?: InputSize;
  error?: string;
  helperText?: string;
  required?: boolean;
  block?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      size = 'md',
      error,
      helperText,
      required = false,
      block = false,
      leadingIcon,
      trailingIcon,
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

        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="absolute left-3 flex items-center text-neutral-500 pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={`
              w-full rounded-md border bg-white
              ${sizeStyles[size]}
              ${leadingIcon ? 'pl-9' : ''}
              ${trailingIcon ? 'pr-9' : ''}
              ${
                error
                  ? 'border-error-500 focus:ring-error-500'
                  : 'border-neutral-300 focus:ring-brand-500'
              }
              focus:outline-none focus:ring-2
              disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
              ${className}
            `}
            aria-invalid={!!error}
            aria-required={required}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />

          {trailingIcon && (
            <span className="absolute right-3 flex items-center text-neutral-500 pointer-events-none">
              {trailingIcon}
            </span>
          )}
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
      </div>
    );
  }
);

export default Input;
