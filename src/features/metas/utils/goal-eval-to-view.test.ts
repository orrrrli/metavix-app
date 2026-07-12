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
    const views = goalEvalToViews(response, false);
    expect(views[0]).toMatchObject({ name: 'HbA1c', unit: '%', status: 'InRange' });
    expect(views[1]).toMatchObject({ name: 'Glucosa en ayuno', unit: 'mg/dL', status: 'AtRisk' });
    expect(views[2]).toMatchObject({ name: 'Presión arterial sistólica', unit: 'mmHg', status: 'OutOfRange' });
    expect(views[4]).toMatchObject({ name: 'Colesterol LDL', unit: 'mg/dL', status: 'InRange' });
  });

  it('forwards a null value through unchanged', () => {
    const views = goalEvalToViews(response, false);
    expect(views[3].value).toBeNull();
    expect(views[3].status).toBe('NoData');
  });

  it('falls back to raw parameterId and empty unit for unknown ids', () => {
    const views = goalEvalToViews(response, false);
    const unknown = views[5];
    expect(unknown.name).toBe('unknown_future_param');
    expect(unknown.unit).toBe('');
  });

  it('derives a pregnancy clinical note per-item when isPregnant is true', () => {
    const views = goalEvalToViews(response, true);
    // systolic_bp, status OutOfRange -> RF-005 note applies
    expect(views[2].note).toBe(
      'En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.',
    );
    // hba1c has no pregnancy note in the RF-005..RF-016 table
    expect(views[0].note).toBeNull();
  });

  it('leaves note as null when isPregnant is false', () => {
    const views = goalEvalToViews(response, false);
    expect(views[2].note).toBeNull();
  });

  it('adds a critical alert for triglycerides OutOfRange >= 500', () => {
    const withTg: GoalEvaluationResponse = {
      evaluationId: 'ev-3',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [{ parameterId: 'triglycerides', valueUsed: 540, goalUsed: 150, status: 'OutOfRange' }],
    };
    const views = goalEvalToViews(withTg, false);
    expect(views[0].criticalAlert).toBe(
      'Riesgo de pancreatitis aguda. Tratamiento farmacológico urgente (fibrato + aceite de pescado).',
    );
  });

  it('leaves criticalAlert null for other parameters and for triglycerides below 500', () => {
    const views = goalEvalToViews(response, false);
    expect(views[0].criticalAlert).toBeNull();
    const belowThreshold: GoalEvaluationResponse = {
      evaluationId: 'ev-4',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [{ parameterId: 'triglycerides', valueUsed: 300, goalUsed: 150, status: 'OutOfRange' }],
    };
    expect(goalEvalToViews(belowThreshold, false)[0].criticalAlert).toBeNull();
  });

  it('derives a creatinine-increase note from previousCreatinine when not pregnant', () => {
    const withCreatinine: GoalEvaluationResponse = {
      evaluationId: 'ev-5',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [{ parameterId: 'creatinine', valueUsed: 1.1, goalUsed: 1.3, status: 'InRange' }],
    };
    const views = goalEvalToViews(withCreatinine, false, 1.0);
    expect(views[0].note).toBe(
      'Aumento menor de creatinina. Si coincide con inicio de IECA/ARA-II/iSGLT2, es esperado. No suspender.',
    );
  });

  it('prioritizes the pregnancy note over the creatinine-increase note when both apply', () => {
    const withCreatinine: GoalEvaluationResponse = {
      evaluationId: 'ev-6',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [{ parameterId: 'creatinine', valueUsed: 1.1, goalUsed: 1.3, status: 'InRange' }],
    };
    const views = goalEvalToViews(withCreatinine, true, 1.0);
    expect(views[0].note).toBe(
      'En embarazo, creatinina ≥ 1.0 mg/dL ya es anormal. Consultar con especialista.',
    );
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
    const views = goalEvalToViews(withReason, false);
    expect(views[0].reason).toBe('No se evalúa en el embarazo');
    expect(views[1].reason).toBe('Requiere evaluación con especialista');
  });

  it('leaves reason as null when the API does not include it', () => {
    const views = goalEvalToViews(response, false);
    expect(views[0].reason).toBeNull();
    expect(views[3].reason).toBeNull();
  });

  it('forwards the ckdStage from the API onto the view (egfr with numeric value)', () => {
    const withEgfr: GoalEvaluationResponse = {
      evaluationId: 'ev-7',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [
        { parameterId: 'egfr', valueUsed: 47, goalUsed: 60, status: 'AtRisk', ckdStage: 'G3a' },
      ],
    };
    const views = goalEvalToViews(withEgfr, false);
    expect(views[0].ckdStage).toBe('G3a');
  });

  it('forwards ckdStage null when the API omits it (non-egfr parameter)', () => {
    const views = goalEvalToViews(response, false);
    expect(views[0].ckdStage).toBeNull();
    expect(views[4].ckdStage).toBeNull();
  });

  it('forwards ckdStage null for egfr when no numeric value is present', () => {
    const noCreatinine: GoalEvaluationResponse = {
      evaluationId: 'ev-8',
      evaluatedAt: '2026-07-10T15:00:00Z',
      items: [
        { parameterId: 'egfr', valueUsed: null, goalUsed: 60, status: 'NoData', reason: 'no-recent-data' },
      ],
    };
    const views = goalEvalToViews(noCreatinine, false);
    expect(views[0].ckdStage).toBeNull();
  });

  it('returns an empty array when the response has no items', () => {
    expect(
      goalEvalToViews({ evaluationId: 'x', evaluatedAt: '2026-07-10T15:00:00Z', items: [] }, false),
    ).toEqual([]);
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
