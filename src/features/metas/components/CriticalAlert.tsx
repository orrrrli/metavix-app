import { AlertTriangle } from 'lucide-react';

export interface CriticalAlertProps {
  message: string;
}

/**
 * Urgent clinical alert shown under a GoalChip for conditions requiring
 * immediate action (e.g. TG >= 500 mg/dL pancreatitis risk). Uses
 * role="alert" (not "status") so assistive tech announces it immediately.
 * For non-urgent context notes, use ClinicalNote (T1) instead.
 */
export function CriticalAlert({ message }: CriticalAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 mt-1 p-2 rounded-md border"
      style={{ background: 'var(--bad-bg)', borderColor: 'var(--bad)' }}
    >
      <AlertTriangle className="size-4 shrink-0 mt-0.5" style={{ color: 'var(--bad)' }} aria-hidden="true" />
      <p className="text-xs leading-snug font-medium" style={{ color: 'var(--bad)' }}>
        {message}
      </p>
    </div>
  );
}
