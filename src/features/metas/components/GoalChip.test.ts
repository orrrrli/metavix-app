import { describe, it, expect } from 'vitest';
import { getStatusVisual, formatChipAriaLabel } from './GoalChip';

describe('getStatusVisual', () => {
  it('maps InRange to "En meta" with the green theme tokens', () => {
    const v = getStatusVisual('InRange');
    expect(v.label).toBe('En meta');
    expect(v.fg).toBe('var(--ok)');
    expect(v.bg).toBe('var(--ok-bg)');
    expect(v.border).toBe('var(--ok)');
  });

  it('maps AtRisk to "Revisar" with the amber theme tokens', () => {
    const v = getStatusVisual('AtRisk');
    expect(v.label).toBe('Revisar');
    expect(v.fg).toBe('var(--warn)');
    expect(v.bg).toBe('var(--warn-bg)');
    expect(v.border).toBe('var(--warn)');
  });

  it('maps OutOfRange to "Fuera de meta" with the red theme tokens', () => {
    const v = getStatusVisual('OutOfRange');
    expect(v.label).toBe('Fuera de meta');
    expect(v.fg).toBe('var(--bad)');
    expect(v.bg).toBe('var(--bad-bg)');
    expect(v.border).toBe('var(--bad)');
  });

  it('maps NoData to "Sin datos" with the neutral theme tokens', () => {
    const v = getStatusVisual('NoData');
    expect(v.label).toBe('Sin datos');
    expect(v.fg).toBe('var(--mut)');
    expect(v.bg).toBe('var(--ph)');
    expect(v.border).toBe('var(--bd)');
  });
});

describe('formatChipAriaLabel', () => {
  it('includes the parameter name and the measured value with its unit', () => {
    expect(formatChipAriaLabel('HbA1c', 'InRange', 6.8, '%')).toBe('HbA1c: En meta, 6.8 %');
  });

  it('omits the value part when value is null (NoData case)', () => {
    expect(formatChipAriaLabel('IMC', 'NoData', null, 'kg/m²')).toBe('IMC: Sin datos');
  });

  it('still includes the unit label even for integer values', () => {
    expect(formatChipAriaLabel('Glucosa en ayuno', 'AtRisk', 145, 'mg/dL'))
      .toBe('Glucosa en ayuno: Revisar, 145 mg/dL');
  });
});
