import { describe, it, expect } from 'vitest';
import { goalEvalToViews } from './goal-eval-to-view';
import type { GoalEvaluationResponse } from '@/types/goal-evaluation';

const response: GoalEvaluationResponse = {
  evaluationId: 'ev-1',
  evaluatedAt: '2026-07-10T15:00:00Z',
  items: [
    { parameterId: 'hba1c', valueUsed: 6.8, goalUsed: 7, status: 'InRange' },
    { parameterId: 'glucosa', valueUsed: 145, goalUsed: 130, status: 'AtRisk' },
    { parameterId: 'pas', valueUsed: 150, goalUsed: 130, status: 'OutOfRange' },
    { parameterId: 'imc', valueUsed: null, goalUsed: 25, status: 'NoData' },
    { parameterId: 'unknown_future_param', valueUsed: 1, goalUsed: 0, status: 'InRange' },
  ],
};

describe('goalEvalToViews', () => {
  it('resolves name and unit from the catalog for known parameterIds', () => {
    const views = goalEvalToViews(response);
    expect(views[0]).toMatchObject({ name: 'HbA1c', unit: '%', status: 'InRange' });
    expect(views[1]).toMatchObject({ name: 'Glucosa en ayuno', unit: 'mg/dL', status: 'AtRisk' });
    expect(views[2]).toMatchObject({ name: 'Presión arterial sistólica', unit: 'mmHg', status: 'OutOfRange' });
  });

  it('forwards a null value through unchanged', () => {
    const views = goalEvalToViews(response);
    expect(views[3].value).toBeNull();
    expect(views[3].status).toBe('NoData');
  });

  it('falls back to raw parameterId and empty unit for unknown ids', () => {
    const views = goalEvalToViews(response);
    const unknown = views[4];
    expect(unknown.name).toBe('unknown_future_param');
    expect(unknown.unit).toBe('');
  });

  it('forwards a reason field if the API includes it (defensive)', () => {
    const withReason = {
      evaluationId: 'ev-2',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [
        { parameterId: 'bmi', valueUsed: null, goalUsed: 25, status: 'NoData', reason: 'not-evaluated-in-pregnancy' },
      ],
    } as unknown as GoalEvaluationResponse;
    const views = goalEvalToViews(withReason);
    expect(views[0].reason).toBe('not-evaluated-in-pregnancy');
  });

  it('returns an empty array when the response has no items', () => {
    expect(goalEvalToViews({ evaluationId: 'x', evaluatedAt: '2026-07-10T15:00:00Z', items: [] })).toEqual([]);
  });
});
