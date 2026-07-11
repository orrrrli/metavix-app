import { Info } from 'lucide-react';

export interface ClinicalNoteProps {
  message: string;
}

/**
 * Compact, non-critical clinical note shown under a GoalChip (e.g. pregnancy
 * caveats, reference-only notes). For urgent conditions requiring immediate
 * action, use CriticalAlert (T2) instead.
 */
export function ClinicalNote({ message }: ClinicalNoteProps) {
  return (
    <div
      role="status"
      className="flex items-start gap-2 mt-1 p-2 rounded-md border"
      style={{ background: 'var(--info-bg)', borderColor: 'var(--info)' }}
    >
      <Info className="size-4 shrink-0 mt-0.5" style={{ color: 'var(--info)' }} aria-hidden="true" />
      <p className="text-xs leading-snug" style={{ color: 'var(--text)' }}>
        {message}
      </p>
    </div>
  );
}
