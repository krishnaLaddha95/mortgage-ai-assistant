import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonSize = 'md' | 'lg';
type ButtonColor = 'primary' | 'secondary' | 'ghost' | 'negative';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  color?: ButtonColor;
  loading?: boolean;
  block?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const colorStyles: Record<ButtonColor, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500 disabled:bg-neutral-300',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-400',
  ghost: 'bg-transparent text-brand-600 hover:bg-brand-50 focus:ring-brand-500 disabled:text-neutral-300',
  negative: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 disabled:bg-neutral-300',
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'md',
      color = 'primary',
      loading = false,
      block = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`
          rounded-md font-medium transition-colors inline-flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${sizeStyles[size]}
          ${colorStyles[color]}
          ${block ? 'w-full' : ''}
          ${isDisabled ? 'cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);

export default Button;