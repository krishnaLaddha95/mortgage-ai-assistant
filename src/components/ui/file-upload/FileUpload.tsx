import { useCallback, useId, useRef, useState } from 'react';

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUpload({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  multiple = false,
  error,
  helperText,
  required = false,
  disabled = false,
  value = [],
  onChange,
}: FileUploadProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const validateAndSetFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList);
      const oversized = files.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized) {
        setSizeError(`"${oversized.name}" exceeds the ${maxSizeMB}MB limit`);
        return;
      }
      setSizeError(null);
      onChange?.(multiple ? [...value, ...files] : files);
    },
    [maxSizeMB, multiple, onChange, value]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files.length) validateAndSetFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const displayError = error || sizeError;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
        {label}
        {required && (
          <span className="text-error-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`
          rounded-md border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-neutral-300'}
          ${displayError ? 'border-error-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : 'hover:border-brand-400'}
        `}
        aria-invalid={!!displayError}
        aria-describedby={
          displayError ? errorId : helperText ? helperId : undefined
        }
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) =>
            e.target.files && validateAndSetFiles(e.target.files)
          }
          className="sr-only"
        />
        <p className="text-sm text-neutral-600">
          <span className="text-brand-600 font-medium">Click to upload</span> or
          drag and drop
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          {accept.replaceAll('.', '').toUpperCase()} up to {maxSizeMB}MB
        </p>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between text-sm bg-neutral-50 rounded-md px-3 py-2"
            >
              <span className="truncate">
                {file.name}{' '}
                <span className="text-neutral-500">
                  ({formatFileSize(file.size)})
                </span>
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="text-neutral-500 hover:text-error-600 ml-2 shrink-0"
                aria-label={`Remove ${file.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {displayError && (
        <span id={errorId} role="alert" className="text-sm text-error-600">
          {displayError}
        </span>
      )}
      {!displayError && helperText && (
        <span id={helperId} className="text-sm text-neutral-500">
          {helperText}
        </span>
      )}
    </div>
  );
}

export default FileUpload;
