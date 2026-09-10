import { ReactNode } from 'react';
import Button from '../button/button';

interface RepeatableFieldListProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderRow: (
    item: T,
    index: number,
    updateItem: (updated: T) => void
  ) => ReactNode;
  addButtonLabel?: string;
  minItems?: number;
  maxItems?: number;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

function RepeatableFieldList<T>({
  label,
  items,
  onChange,
  createItem,
  renderRow,
  addButtonLabel = 'Add another',
  minItems = 0,
  maxItems = Infinity,
  error,
  helperText,
  disabled = false,
}: RepeatableFieldListProps<T>) {
  const addRow = () => {
    if (items.length >= maxItems) return;
    onChange([...items, createItem()]);
  };

  const removeRow = (index: number) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, updated: T) => {
    onChange(items.map((item, i) => (i === index ? updated : item)));
  };

  const canRemove = items.length > minItems;
  const canAdd = items.length < maxItems;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-neutral-700">{label}</span>

      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative rounded-md border border-neutral-300 p-4 flex flex-col gap-3"
          >
            {renderRow(item, index, (updated) => updateRow(index, updated))}

            {canRemove && (
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={disabled}
                className="absolute top-3 right-3 text-sm text-neutral-500 hover:text-error-600"
                aria-label={`Remove row ${index + 1}`}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-sm text-neutral-500 italic">Nothing added yet.</p>
      )}

      {canAdd && (
        <Button
          type="button"
          color="secondary"
          size="md"
          onClick={addRow}
          disabled={disabled}
          className="self-start"
        >
          + {addButtonLabel}
        </Button>
      )}

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

export default RepeatableFieldList;
