import type { GoalStatus } from '@/types/goal-evaluation';
import { ClinicalNote } from './ClinicalNote';

export type GoalChipStatus = GoalStatus;

export interface GoalChipProps {
  status: GoalChipStatus;
  /** Human-readable parameter name (e.g. "HbA1c"). Resolved by the caller
   *  from the catalog; flows through to the label and aria-label. */
  name: string;
  value: number | null;
  unit: string;
  /** Only meaningful when status === 'NoData'. Domain emits non-null reasons like
   *  "not-evaluated-in-pregnancy" or "requires-specialist-evaluation". */
  reason?: string | null;
  /** Context-sensitive clinical note (e.g. pregnancy caveats). See clinical-notes.ts. */
  note?: string | null;
}

interface StatusVisual {
  label: string;
  fg: string;
  bg: string;
  border: string;
}

/**
 * Maps a GoalStatus to its user-facing label and theme-aware color triple.
 * Exported for unit testing and reuse by GoalEvaluationCard (T2).
 */
export function getStatusVisual(status: GoalChipStatus): StatusVisual {
  switch (status) {
    case 'InRange':
      return { label: 'En meta', fg: 'var(--ok)', bg: 'var(--ok-bg)', border: 'var(--ok)' };
    case 'AtRisk':
      return { label: 'Revisar', fg: 'var(--warn)', bg: 'var(--warn-bg)', border: 'var(--warn)' };
    case 'OutOfRange':
      return { label: 'Fuera de meta', fg: 'var(--bad)', bg: 'var(--bad-bg)', border: 'var(--bad)' };
    case 'NoData':
      return { label: 'Sin datos', fg: 'var(--mut)', bg: 'var(--ph)', border: 'var(--bd)' };
  }
}

/**
 * Formats the measured value for display. Integer values render without decimals
 * (110 mg/dL); fractional values keep one decimal (6.8 %).
 */
function formatValue(value: number | null): string {
  if (value === null) return '—';
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

/**
 * Builds the aria-label for a chip: "HbA1c: En meta, 6.8 %" (or "HbA1c: Sin datos"
 * when there's no value). Exported for unit testing without jsdom.
 */
export function formatChipAriaLabel(
  name: string,
  status: GoalChipStatus,
  value: number | null,
  unit: string,
): string {
  const v = getStatusVisual(status);
  const valuePart = value !== null ? `, ${value} ${unit}`.trim() : '';
  return `${name}: ${v.label}${valuePart}`;
}

/**
 * Single clinical-parameter status indicator: shows the parameter name, the
 * measured value with its unit, the status label, and (for NoData) the reason
 * string from the API. Pure presentational component — no data fetching, no auth.
 */
export function GoalChip({ status, name, value, unit, reason, note }: GoalChipProps) {
  const v = getStatusVisual(status);
  const showReason = status === 'NoData' && Boolean(reason);

  return (
    <div className="flex flex-col items-start gap-1 min-w-[7rem]">
      <div
        role="status"
        aria-label={formatChipAriaLabel(name, status, value, unit)}
        className="inline-flex flex-col items-start gap-1 rounded-lg px-3 py-2 w-full"
        style={{
          color: v.fg,
          background: v.bg,
          border: `1px solid ${v.border}`,
        }}
      >
        <span className="text-sm font-semibold break-words" style={{ color: 'var(--text)' }}>
          {name}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-semibold tabular-nums" style={{ color: v.fg }}>
            {formatValue(value)}
          </span>
          <span className="text-xs font-medium" style={{ color: v.fg }}>
            {unit}
          </span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide">{v.label}</span>
        {showReason && (
          <span className="text-[11px] leading-snug italic" style={{ color: 'var(--mut)' }}>
            {reason}
          </span>
        )}
      </div>
      {note && <ClinicalNote message={note} />}
    </div>
  );
}
