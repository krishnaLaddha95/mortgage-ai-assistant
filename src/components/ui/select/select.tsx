import { useEffect, useId, useRef, useState } from 'react';

type SelectSize = 'md' | 'lg';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  size?: SelectSize;
  error?: string;
  helperText?: string;
  required?: boolean;
  block?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const sizeStyles: Record<SelectSize, string> = {
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

function Select({
  label,
  options,
  value,
  onChange,
  size = 'md',
  error,
  helperText,
  required = false,
  block = false,
  placeholder = 'Select an option',
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  // close on outside click, close on Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex(options.findIndex((o) => o.value === value));
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onChange(options[highlightedIndex].value);
      setIsOpen(false);
    }
  }

  return (
    <div
      className={`flex flex-col gap-1 ${block ? 'w-full' : ''}`}
      ref={containerRef}
    >
      <label id={selectId} className="text-sm font-medium text-neutral-700">
        {label}
        {required && (
          <span className="text-error-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleTriggerKeyDown}
          className={`
            w-full rounded-md border bg-white text-left flex items-center justify-between transition-colors
            ${sizeStyles[size]}
            ${error ? 'border-error-500 focus:ring-error-500' : 'border-neutral-300 focus:ring-brand-500'}
            ${isOpen ? 'ring-2 ring-brand-500 border-brand-500' : ''}
            focus:outline-none focus:ring-2
            disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
            hover:border-neutral-400
          `}
        >
          <span className={selectedOption ? 'text-ink' : 'text-neutral-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <ul
            role="listbox"
            aria-labelledby={selectId}
            onKeyDown={handleListKeyDown}
            className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md border border-neutral-300 bg-white py-1 shadow-lg focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                    ${isHighlighted ? 'bg-brand-50 text-brand-700' : 'text-ink'}
                    ${isSelected ? 'font-medium' : 'font-normal'}
                  `}
                >
                  {option.label}
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 10l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-brand-600"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <span role="alert" className="text-sm text-error-600">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-sm text-neutral-500">{helperText}</span>
      )}
    </div>
  );
}

export default Select;
