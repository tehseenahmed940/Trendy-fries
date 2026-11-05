import { primaryButtonClass, secondaryButtonClass } from '@/lib/styles';

interface FormActionsProps {
  submitLabel: string;
  onCancel: () => void;
}

export default function FormActions({ submitLabel, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} className={secondaryButtonClass}>
        Cancel
      </button>
      <button type="submit" className={primaryButtonClass}>
        {submitLabel}
      </button>
    </div>
  );
}
