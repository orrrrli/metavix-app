import { describe, it, expect } from 'vitest';
import { getParameterNote } from './clinical-notes';

describe('getParameterNote', () => {
  it('returns null when the patient is not pregnant', () => {
    expect(getParameterNote({ parameterId: 'hdl', status: 'InRange', isPregnant: false })).toBeNull();
  });

  it('returns null for a parameter with no pregnancy note (e.g. hba1c)', () => {
    expect(getParameterNote({ parameterId: 'hba1c', status: 'OutOfRange', isPregnant: true })).toBeNull();
  });

  it('returns the BP preeclampsia note when pregnant and status is not InRange (RF-005)', () => {
    expect(getParameterNote({ parameterId: 'systolic_bp', status: 'AtRisk', isPregnant: true })).toBe(
      'En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.',
    );
    expect(getParameterNote({ parameterId: 'diastolic_bp', status: 'OutOfRange', isPregnant: true })).toBe(
      'En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.',
    );
  });

  it('suppresses the BP note when status is InRange even if pregnant (RF-005)', () => {
    expect(getParameterNote({ parameterId: 'systolic_bp', status: 'InRange', isPregnant: true })).toBeNull();
  });

  it('returns the BMI pregnancy note regardless of status (RF-007)', () => {
    expect(getParameterNote({ parameterId: 'bmi', status: 'NoData', isPregnant: true })).toBe(
      'El IMC no se evalúa durante la gestación. Mostrar peso pregestacional como referencia.',
    );
  });

  it('returns the correct pregnancy note for each remaining RF-005..RF-016 parameter', () => {
    expect(getParameterNote({ parameterId: 'ldl_primary', status: 'InRange', isPregnant: true })).toBe(
      'Estatinas contraindicadas en embarazo. Meta numérica no aplica.',
    );
    expect(getParameterNote({ parameterId: 'hdl', status: 'InRange', isPregnant: true })).toBe(
      'HDL en embarazo: usar solo como referencia basal. Los rangos estándar no aplican.',
    );
    expect(getParameterNote({ parameterId: 'total_cholesterol', status: 'InRange', isPregnant: true })).toBe(
      'El colesterol total aumenta 25-50 % fisiológicamente en embarazo. No se evalúa.',
    );
    expect(getParameterNote({ parameterId: 'creatinine', status: 'InRange', isPregnant: true })).toBe(
      'En embarazo, creatinina ≥ 1.0 mg/dL ya es anormal. Consultar con especialista.',
    );
    expect(getParameterNote({ parameterId: 'egfr', status: 'InRange', isPregnant: true })).toBe(
      'eGFR (CKD-EPI) en embarazo: interpretar con cautela. Fórmula validada en no-embarazadas.',
    );
    expect(getParameterNote({ parameterId: 'bun', status: 'InRange', isPregnant: true })).toBe(
      'En embarazo, BUN > 15 mg/dL sugiere disfunción renal.',
    );
    expect(getParameterNote({ parameterId: 'waist_circumference', status: 'InRange', isPregnant: true })).toBe(
      'La circunferencia de cintura no se evalúa durante la gestación.',
    );
  });
});
