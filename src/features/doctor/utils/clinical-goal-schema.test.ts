import { describe, it, expect } from 'vitest';
import {
  customGoalFormSchema,
  valuesToApiPayload,
  goalToFormValues,
} from './clinical-goal-schema';

/**
 * Validador client-side para la meta clínica personalizada.
 * Las reglas viven duplicadas en el backend
 * (Application/UseCases/ClinicalGoals/Validators/ClinicalGoalThresholdRules.cs)
 * — cualquier PR que las cambie debe tocar ambos lados.
 */
describe('customGoalFormSchema', () => {
  describe('casos válidos', () => {
    it('acepta los 4 umbrales en orden coherente', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '50',
        customAtRiskLow: '70',
        customAtRiskHigh: '130',
        customOutOfRangeHigh: '180',
      });
      expect(r.success).toBe(true);
    });

    it('acepta sólo el lado alto (atRiskHigh + outOfRangeHigh)', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '',
        customAtRiskLow: '',
        customAtRiskHigh: '135',
        customOutOfRangeHigh: '150',
      });
      expect(r.success).toBe(true);
    });

    it('acepta sólo el lado bajo (outOfRangeLow + atRiskLow)', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '50',
        customAtRiskLow: '70',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(true);
    });

    it('acepta un único umbral', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '70',
        customAtRiskLow: '',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(true);
    });

    it('acepta valores en el límite de la igualdad (≤)', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '70',
        customAtRiskLow: '70',
        customAtRiskHigh: '130',
        customOutOfRangeHigh: '130',
      });
      expect(r.success).toBe(true);
    });

    it('acepta decimales', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '4.0',
        customAtRiskLow: '5.5',
        customAtRiskHigh: '6.9',
        customOutOfRangeHigh: '7.0',
      });
      expect(r.success).toBe(true);
    });
  });

  describe('casos inválidos', () => {
    it('rechaza form completamente vacío', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '',
        customAtRiskLow: '',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('Define al menos un umbral para la meta personalizada.');
      }
    });

    it('rechaza atRiskLow sin outOfRangeLow', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '',
        customAtRiskLow: '70',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('Si defines atRiskLow también debes definir outOfRangeLow.');
      }
    });

    it('rechaza atRiskHigh sin outOfRangeHigh', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '',
        customAtRiskLow: '',
        customAtRiskHigh: '130',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('Si defines atRiskHigh también debes definir outOfRangeHigh.');
      }
    });

    it('rechaza outOfRangeLow > atRiskLow', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '80',
        customAtRiskLow: '70',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('outOfRangeLow debe ser ≤ atRiskLow.');
      }
    });

    it('rechaza atRiskLow > atRiskHigh', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '',
        customAtRiskLow: '140',
        customAtRiskHigh: '130',
        customOutOfRangeHigh: '180',
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('atRiskLow debe ser ≤ atRiskHigh.');
      }
    });

    it('rechaza atRiskHigh > outOfRangeHigh', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: '',
        customAtRiskLow: '',
        customAtRiskHigh: '150',
        customOutOfRangeHigh: '140',
      });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('atRiskHigh debe ser ≤ outOfRangeHigh.');
      }
    });

    it('rechaza valores no numéricos', () => {
      const r = customGoalFormSchema.safeParse({
        customOutOfRangeLow: 'abc',
        customAtRiskLow: '',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      });
      expect(r.success).toBe(false);
    });
  });
});

describe('valuesToApiPayload', () => {
  it('convierte cadena vacía en null y números en número', () => {
    expect(
      valuesToApiPayload({
        customOutOfRangeLow: '50',
        customAtRiskLow: '',
        customAtRiskHigh: '130',
        customOutOfRangeHigh: '',
      }),
    ).toEqual({
      customOutOfRangeLow: 50,
      customAtRiskLow: null,
      customAtRiskHigh: 130,
      customOutOfRangeHigh: null,
    });
  });

  it('omite campos vacíos cuando omitMissing=true', () => {
    const payload = valuesToApiPayload(
      {
        customOutOfRangeLow: '',
        customAtRiskLow: '',
        customAtRiskHigh: '130',
        customOutOfRangeHigh: '150',
      },
      { omitMissing: true },
    );
    expect(payload).toEqual({ customAtRiskHigh: 130, customOutOfRangeHigh: 150 });
    expect('customOutOfRangeLow' in payload).toBe(false);
    expect('customAtRiskLow' in payload).toBe(false);
  });

  it('envía null explícito cuando no se omite y el form está vacío', () => {
    const payload = valuesToApiPayload(
      {
        customOutOfRangeLow: '',
        customAtRiskLow: '',
        customAtRiskHigh: '',
        customOutOfRangeHigh: '',
      },
      { omitMissing: true },
    );
    expect(payload).toEqual({});
  });
});

describe('goalToFormValues', () => {
  it('convierte null en strings vacíos', () => {
    expect(
      goalToFormValues({
        customOutOfRangeLow: null,
        customAtRiskLow: null,
        customAtRiskHigh: null,
        customOutOfRangeHigh: null,
      }),
    ).toEqual({
      customOutOfRangeLow: '',
      customAtRiskLow: '',
      customAtRiskHigh: '',
      customOutOfRangeHigh: '',
    });
  });

  it('preserva números como strings', () => {
    expect(
      goalToFormValues({
        customOutOfRangeLow: 50,
        customAtRiskLow: 70,
        customAtRiskHigh: 130,
        customOutOfRangeHigh: 180,
      }),
    ).toEqual({
      customOutOfRangeLow: '50',
      customAtRiskLow: '70',
      customAtRiskHigh: '130',
      customOutOfRangeHigh: '180',
    });
  });

  it('maneja null de input como form vacío', () => {
    expect(goalToFormValues(null)).toEqual({
      customOutOfRangeLow: '',
      customAtRiskLow: '',
      customAtRiskHigh: '',
      customOutOfRangeHigh: '',
    });
  });
});
