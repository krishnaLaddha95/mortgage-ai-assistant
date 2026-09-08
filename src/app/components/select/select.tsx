import { SelectHTMLAttributes, forwardRef, useId } from 'react';

type SelectSize = 'md' | 'lg';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string;
  options: SelectOption[];
  size?: SelectSize;
  error?: string;
  helperText?: string;
  required?: boolean;
  block?: boolean;
  placeholder?: string;
}

const sizeStyles: Record<SelectSize, string> = {
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      size = 'md',
      error,
      helperText,
      required = false,
      block = false,
      placeholder,
      id,
      disabled,
      className = '',
      defaultValue,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className={`flex flex-col gap-1 ${block ? 'w-full' : ''}`}>
        <label htmlFor={selectId} className="text-sm font-medium text-neutral-700">
          {label}
          {required && (
            <span className="text-error-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          defaultValue={defaultValue ?? ''}
          className={`
            w-full rounded-md border bg-white appearance-none
            bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="%236b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')]
            bg-no-repeat bg-[right_0.75rem_center]
            pr-9
            ${sizeStyles[size]}
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
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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


export default Select;
