import { ReactNode } from 'react';

interface ReviewField {
  label: string;
  value: string;
}

interface ReviewSectionCardProps {
  title: string;
  onEdit: () => void;
  fields?: ReviewField[];
  children?: ReactNode;
}

function ReviewSectionCard({
  title,
  onEdit,
  fields,
  children,
}: ReviewSectionCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Edit
        </button>
      </div>

      <div className="bg-white border border-neutral-300 rounded-md p-4">
        {fields ? (
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.label}>
                <div className="text-xs text-neutral-500 mb-0.5">
                  {field.label}
                </div>
                <div className="text-sm text-ink">{field.value || '—'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}

export default ReviewSectionCard;
