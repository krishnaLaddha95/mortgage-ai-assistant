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

  // For single-file fields, once a file exists, the dropzone hides in favor
  // of the file row + a "Replace" action. Multi-file fields always keep the
  // dropzone visible, since adding more is an expected, repeated action.
  const showDropzone = multiple || value.length === 0;

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

  const openFileDialog = () => {
    if (!disabled) inputRef.current?.click();
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

      {/* Hidden native input always exists regardless of dropzone visibility,
          since "Replace" still needs to trigger the same file dialog */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => e.target.files && validateAndSetFiles(e.target.files)}
        className="sr-only"
      />

      {showDropzone && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={openFileDialog}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
              e.preventDefault();
              openFileDialog();
            }
          }}
          className={`
            rounded-md border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-neutral-300'}
            ${displayError ? 'border-error-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : 'hover:border-brand-400'}
          `}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? errorId : helperText ? helperId : undefined}
        >
          <p className="text-sm text-neutral-600">
            <span className="text-brand-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {accept.replaceAll('.', '').toUpperCase()} up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {value.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between text-sm bg-neutral-50 rounded-md px-3 py-2 border border-neutral-300"
            >
              <span className="truncate">
                {file.name} <span className="text-neutral-500">({formatFileSize(file.size)})</span>
              </span>
              <span className="flex items-center gap-3 shrink-0 ml-2">
                {/* Replace only makes sense for single-file fields — for
                    multiple, the always-visible dropzone above already
                    covers adding more files */}
                {!multiple && (
                  <button
                    type="button"
                    onClick={openFileDialog}
                    disabled={disabled}
                    className="text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Replace
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className="text-neutral-500 hover:text-error-600"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </span>
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