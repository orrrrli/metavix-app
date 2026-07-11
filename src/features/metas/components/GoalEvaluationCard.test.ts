import { describe, it, expect } from 'vitest';
import { formatEvaluatedAt } from './GoalEvaluationCard';

describe('formatEvaluatedAt', () => {
  it('formats a valid ISO timestamp in es-MX locale', () => {
    const out = formatEvaluatedAt('2026-07-10T15:30:00Z');
    // es-MX day/month/year is locale-dependent; assert we get a non-empty,
    // non-raw string that includes a 4-digit year.
    expect(out).not.toBe('2026-07-10T15:30:00Z');
    expect(out).toMatch(/2026/);
  });

  it('returns the original string when the timestamp is unparseable', () => {
    expect(formatEvaluatedAt('not-a-date')).toBe('not-a-date');
  });
});
