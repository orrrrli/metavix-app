import { describe, it, expect } from 'vitest';
import { getParameterNotes } from './clinical-notes';

describe('getParameterNotes — pregnancyNote flag', () => {
  it('returns no note when the patient is not pregnant', () => {
    const { note } = getParameterNotes({
      parameterId: 'hdl',
      status: 'InRange',
      valueUsed: 45,
      isPregnant: false,
    });
    expect(note).toBeNull();
  });

  it('returns no note for a parameter with no pregnancyNote spec (e.g. hba1c)', () => {
    const { note } = getParameterNotes({
      parameterId: 'hba1c',
      status: 'OutOfRange',
      valueUsed: 8.5,
      isPregnant: true,
    });
    expect(note).toBeNull();
  });

  it('returns the BP preeclampsia note when pregnant and status is not InRange (requiresAbnormalStatus)', () => {
    expect(
      getParameterNotes({ parameterId: 'systolic_bp', status: 'AtRisk', valueUsed: 135, isPregnant: true }).note,
    ).toBe('En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.');
    expect(
      getParameterNotes({ parameterId: 'diastolic_bp', status: 'OutOfRange', valueUsed: 95, isPregnant: true }).note,
    ).toBe('En embarazo, la PA elevada puede indicar preeclampsia. Confirmar con especialista.');
  });

  it('suppresses the BP note when status is InRange even if pregnant (requiresAbnormalStatus)', () => {
    expect(
      getParameterNotes({ parameterId: 'systolic_bp', status: 'InRange', valueUsed: 120, isPregnant: true }).note,
    ).toBeNull();
  });

  it('returns the BMI pregnancy note regardless of status (no requiresAbnormalStatus)', () => {
    expect(
      getParameterNotes({ parameterId: 'bmi', status: 'NoData', valueUsed: null, isPregnant: true }).note,
    ).toBe('El IMC no se evalúa durante la gestación. Mostrar peso pregestacional como referencia.');
  });

  it('returns the correct pregnancy note for each remaining catalog parameter', () => {
    const cases: Array<[string, string]> = [
      ['ldl_primary', 'Estatinas contraindicadas en embarazo. Meta numérica no aplica.'],
      ['hdl', 'HDL en embarazo: usar solo como referencia basal. Los rangos estándar no aplican.'],
      [
        'total_cholesterol',
        'El colesterol total aumenta 25-50 % fisiológicamente en embarazo. No se evalúa.',
      ],
      ['creatinine', 'En embarazo, creatinina ≥ 1.0 mg/dL ya es anormal. Consultar con especialista.'],
      ['egfr', 'eGFR (CKD-EPI) en embarazo: interpretar con cautela. Fórmula validada en no-embarazadas.'],
      ['bun', 'En embarazo, BUN > 15 mg/dL sugiere disfunción renal.'],
      ['waist_circumference', 'La circunferencia de cintura no se evalúa durante la gestación.'],
    ];
    for (const [parameterId, expected] of cases) {
      expect(
        getParameterNotes({ parameterId, status: 'InRange', valueUsed: 1, isPregnant: true }).note,
      ).toBe(expected);
    }
  });
});

describe('getParameterNotes — criticalAlert flag', () => {
  it('returns the pancreatitis alert when triglycerides is OutOfRange and value >= 500', () => {
    expect(
      getParameterNotes({ parameterId: 'triglycerides', status: 'OutOfRange', valueUsed: 500, isPregnant: false })
        .criticalAlert,
    ).toBe('Riesgo de pancreatitis aguda. Tratamiento farmacológico urgente (fibrato + aceite de pescado).');
    expect(
      getParameterNotes({ parameterId: 'triglycerides', status: 'OutOfRange', valueUsed: 620, isPregnant: false })
        .criticalAlert,
    ).toBe('Riesgo de pancreatitis aguda. Tratamiento farmacológico urgente (fibrato + aceite de pescado).');
  });

  it('returns no alert when OutOfRange but below the minValue threshold', () => {
    expect(
      getParameterNotes({ parameterId: 'triglycerides', status: 'OutOfRange', valueUsed: 480, isPregnant: false })
        .criticalAlert,
    ).toBeNull();
  });

  it('returns no alert when value is null', () => {
    expect(
      getParameterNotes({ parameterId: 'triglycerides', status: 'OutOfRange', valueUsed: null, isPregnant: false })
        .criticalAlert,
    ).toBeNull();
  });

  it('returns no alert when status does not match the spec', () => {
    expect(
      getParameterNotes({ parameterId: 'triglycerides', status: 'AtRisk', valueUsed: 600, isPregnant: false })
        .criticalAlert,
    ).toBeNull();
  });

  it('returns no alert for a parameter with no criticalAlert spec', () => {
    expect(
      getParameterNotes({ parameterId: 'hba1c', status: 'OutOfRange', valueUsed: 12, isPregnant: false })
        .criticalAlert,
    ).toBeNull();
  });
});

describe('getParameterNotes — increaseNote flag', () => {
  it('returns the note for an increase strictly between 0% and the max (creatinine, maxPercentIncrease=30)', () => {
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 1.2,
        isPregnant: false,
        previousValue: 1.0,
      }).note,
    ).toBe('Aumento menor de creatinina. Si coincide con inicio de IECA/ARA-II/iSGLT2, es esperado. No suspender.');
  });

  it('returns the note at exactly the max percent (inclusive boundary, float-safe)', () => {
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 1.3,
        isPregnant: false,
        previousValue: 1.0,
      }).note,
    ).toBe('Aumento menor de creatinina. Si coincide con inicio de IECA/ARA-II/iSGLT2, es esperado. No suspender.');
  });

  it('returns no note when the increase exceeds the max percent', () => {
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 1.4,
        isPregnant: false,
        previousValue: 1.0,
      }).note,
    ).toBeNull();
  });

  it('returns no note when the value decreased or stayed the same', () => {
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 1.0,
        isPregnant: false,
        previousValue: 1.0,
      }).note,
    ).toBeNull();
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 0.9,
        isPregnant: false,
        previousValue: 1.0,
      }).note,
    ).toBeNull();
  });

  it('returns no note when previousValue is missing', () => {
    expect(
      getParameterNotes({ parameterId: 'creatinine', status: 'InRange', valueUsed: 1.2, isPregnant: false }).note,
    ).toBeNull();
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 1.2,
        isPregnant: false,
        previousValue: null,
      }).note,
    ).toBeNull();
  });

  it('returns no note for a parameter with no increaseNote spec (e.g. hba1c)', () => {
    expect(
      getParameterNotes({
        parameterId: 'hba1c',
        status: 'InRange',
        valueUsed: 7.5,
        isPregnant: false,
        previousValue: 7.0,
      }).note,
    ).toBeNull();
  });

  it('prioritizes the pregnancy note over the increase note when both apply', () => {
    expect(
      getParameterNotes({
        parameterId: 'creatinine',
        status: 'InRange',
        valueUsed: 1.1,
        isPregnant: true,
        previousValue: 1.0,
      }).note,
    ).toBe('En embarazo, creatinina ≥ 1.0 mg/dL ya es anormal. Consultar con especialista.');
  });
});
