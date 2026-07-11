import type { GoalStatus } from '@/types/goal-evaluation';

export type GoalChipStatus = GoalStatus;

export interface GoalChipProps {
  status: GoalChipStatus;
  value: number | null;
  unit: string;
  /** Only meaningful when status === 'NoData'. Domain emits non-null reasons like
   *  "not-evaluated-in-pregnancy" or "requires-specialist-evaluation". */
  reason?: string | null;
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
 * Single clinical-parameter status indicator: shows the measured value with its
 * unit, the status label, and (for NoData) the reason string from the API.
 * Pure presentational component — no data fetching, no auth.
 */
export function GoalChip({ status, value, unit, reason }: GoalChipProps) {
  const v = getStatusVisual(status);
  const showReason = status === 'NoData' && Boolean(reason);

  return (
    <div
      role="status"
      aria-label={`${v.label}${value !== null ? `: ${value} ${unit}` : ''}`}
      className="inline-flex flex-col items-start gap-1 rounded-lg px-3 py-2 min-w-[7rem]"
      style={{
        color: v.fg,
        background: v.bg,
        border: `1px solid ${v.border}`,
      }}
    >
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
  );
}
