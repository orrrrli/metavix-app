import { describe, it, expect } from 'vitest';
import { goalEvalToViews, formatNoDataReason } from './goal-eval-to-view';
import type { GoalEvaluationResponse } from '@/types/goal-evaluation';

const response: GoalEvaluationResponse = {
  evaluationId: 'ev-1',
  evaluatedAt: '2026-07-10T15:00:00Z',
  items: [
    { parameterId: 'hba1c', valueUsed: 6.8, goalUsed: 7, status: 'InRange' },
    { parameterId: 'fasting_glucose', valueUsed: 145, goalUsed: 130, status: 'AtRisk' },
    { parameterId: 'systolic_bp', valueUsed: 150, goalUsed: 130, status: 'OutOfRange' },
    { parameterId: 'bmi', valueUsed: null, goalUsed: 25, status: 'NoData' },
    { parameterId: 'ldl_primary', valueUsed: 95, goalUsed: 100, status: 'InRange' },
    { parameterId: 'unknown_future_param', valueUsed: 1, goalUsed: 0, status: 'InRange' },
  ],
};

describe('goalEvalToViews', () => {
  it('resolves name and unit from the catalog for known parameterIds', () => {
    const views = goalEvalToViews(response);
    expect(views[0]).toMatchObject({ name: 'HbA1c', unit: '%', status: 'InRange' });
    expect(views[1]).toMatchObject({ name: 'Glucosa en ayuno', unit: 'mg/dL', status: 'AtRisk' });
    expect(views[2]).toMatchObject({ name: 'Presión arterial sistólica', unit: 'mmHg', status: 'OutOfRange' });
    expect(views[4]).toMatchObject({ name: 'Colesterol LDL', unit: 'mg/dL', status: 'InRange' });
  });

  it('forwards a null value through unchanged', () => {
    const views = goalEvalToViews(response);
    expect(views[3].value).toBeNull();
    expect(views[3].status).toBe('NoData');
  });

  it('falls back to raw parameterId and empty unit for unknown ids', () => {
    const views = goalEvalToViews(response);
    const unknown = views[5];
    expect(unknown.name).toBe('unknown_future_param');
    expect(unknown.unit).toBe('');
  });

  it('translates a NoData reason to Spanish user-facing text', () => {
    const withReason: GoalEvaluationResponse = {
      evaluationId: 'ev-2',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [
        {
          parameterId: 'total_cholesterol',
          valueUsed: null,
          goalUsed: 200,
          status: 'NoData',
          reason: 'not-evaluated-in-pregnancy',
        },
        {
          parameterId: 'postprandial_1h',
          valueUsed: null,
          goalUsed: 180,
          status: 'NoData',
          reason: 'requires-specialist-evaluation',
        },
      ],
    };
    const views = goalEvalToViews(withReason);
    expect(views[0].reason).toBe('No se evalúa en el embarazo');
    expect(views[1].reason).toBe('Requiere evaluación con especialista');
  });

  it('leaves reason as null when the API does not include it', () => {
    const views = goalEvalToViews(response);
    expect(views[0].reason).toBeNull();
    expect(views[3].reason).toBeNull();
  });

  it('returns an empty array when the response has no items', () => {
    expect(goalEvalToViews({ evaluationId: 'x', evaluatedAt: '2026-07-10T15:00:00Z', items: [] })).toEqual([]);
  });
});

describe('formatNoDataReason', () => {
  it('translates "not-evaluated-in-pregnancy" to Spanish', () => {
    expect(formatNoDataReason('not-evaluated-in-pregnancy')).toBe('No se evalúa en el embarazo');
  });

  it('translates "requires-specialist-evaluation" to Spanish', () => {
    expect(formatNoDataReason('requires-specialist-evaluation')).toBe('Requiere evaluación con especialista');
  });

  it('translates "no-recent-data" to Spanish', () => {
    expect(formatNoDataReason('no-recent-data')).toBe('Sin datos recientes');
  });

  it('returns null for null or undefined', () => {
    expect(formatNoDataReason(null)).toBeNull();
    expect(formatNoDataReason(undefined)).toBeNull();
  });
});
