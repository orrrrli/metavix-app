import { z } from 'zod';
import type { ClinicalGoalPayload, CustomGoalFormValues } from '@/types/clinical-goal';

/**
 * Schema Zod para el editor de metas clínicas personalizadas.
 *
 * Reglas (alineadas con `metavix-api/src/Application/UseCases/ClinicalGoals/
 * Validators/ClinicalGoalThresholdRules.cs` y el dominio en
 * `Domain.Models.ThresholdRange`):
 *   1. Cada umbral es opcional. Cadena vacía = "usar default del catálogo"
 *      (se traduce a `null` en el payload).
 *   2. Debe definirse al menos uno de los cuatro umbrales — sino la meta
 *      personalizada no tiene sentido (cubre todo el rango default).
 *   3. Coherencia por banda: outOfRangeLow ≤ atRiskLow, atRiskLow ≤
 *      atRiskHigh, atRiskHigh ≤ outOfRangeHigh. Sólo se compara si ambos
 *      lados están presentes.
 *   4. Lado parcial: si defines `atRiskLow` también debes definir
 *      `outOfRangeLow` (la banda de riesgo necesita un extremo para tener
 *      sentido). Mismo en el lado alto.
 *
 * Mantener sincronizado con el backend — el validador server es la fuente
 * de verdad, este es un espejo para feedback inmediato en UI.
 */

const emptyToUndefined = (v: unknown): unknown =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const optionalNumber = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number({ error: 'Debe ser un número' })
    .finite('Debe ser un número finito')
    .optional(),
);

export const customGoalFormSchema = z
  .object({
    customOutOfRangeLow: optionalNumber,
    customAtRiskLow: optionalNumber,
    customAtRiskHigh: optionalNumber,
    customOutOfRangeHigh: optionalNumber,
  })
  .superRefine((vals, ctx) => {
    const { customOutOfRangeLow, customAtRiskLow, customAtRiskHigh, customOutOfRangeHigh } = vals;

    const anySet =
      customOutOfRangeLow !== undefined ||
      customAtRiskLow !== undefined ||
      customAtRiskHigh !== undefined ||
      customOutOfRangeHigh !== undefined;

    if (!anySet) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Define al menos un umbral para la meta personalizada.',
        path: ['customOutOfRangeLow'],
      });
      return;
    }

    if (customAtRiskLow !== undefined && customOutOfRangeLow === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Si defines atRiskLow también debes definir outOfRangeLow.',
        path: ['customOutOfRangeLow'],
      });
    }

    if (customAtRiskHigh !== undefined && customOutOfRangeHigh === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Si defines atRiskHigh también debes definir outOfRangeHigh.',
        path: ['customOutOfRangeHigh'],
      });
    }

    if (
      customOutOfRangeLow !== undefined &&
      customAtRiskLow !== undefined &&
      customOutOfRangeLow > customAtRiskLow
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'outOfRangeLow debe ser ≤ atRiskLow.',
        path: ['customOutOfRangeLow'],
      });
    }

    if (
      customAtRiskLow !== undefined &&
      customAtRiskHigh !== undefined &&
      customAtRiskLow > customAtRiskHigh
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'atRiskLow debe ser ≤ atRiskHigh.',
        path: ['customAtRiskHigh'],
      });
    }

    if (
      customAtRiskHigh !== undefined &&
      customOutOfRangeHigh !== undefined &&
      customAtRiskHigh > customOutOfRangeHigh
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'atRiskHigh debe ser ≤ outOfRangeHigh.',
        path: ['customOutOfRangeHigh'],
      });
    }
  });

/** Convierte los valores del form (strings) en el payload que espera la API.
 *  - Cadena vacía → `null` (quitar el override y volver al default del catálogo).
 *  - Número válido → se envía tal cual.
 *  - Los campos quedan `undefined` (omitidos del JSON) sólo si se llamó
 *    explícitamente con `omitMissing=true` — usado por PUT para no pisar
 *    thresholds que el doctor no tocó. Por default, todos los 4 van
 *    explícitos para que el POST/PUT refleje exactamente el estado del form.
 */
export function valuesToApiPayload(
  values: CustomGoalFormValues,
  opts: { omitMissing?: boolean } = {},
): ClinicalGoalPayload {
  const toNum = (raw: string): number | null | undefined => {
    const trimmed = raw.trim();
    if (trimmed === '') return null;
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return undefined; // shouldn't happen post-validation
    return n;
  };

  const ool = toNum(values.customOutOfRangeLow);
  const arl = toNum(values.customAtRiskLow);
  const arh = toNum(values.customAtRiskHigh);
  const orh = toNum(values.customOutOfRangeHigh);

  if (opts.omitMissing) {
    return {
      ...(values.customOutOfRangeLow.trim() !== '' ? { customOutOfRangeLow: ool } : {}),
      ...(values.customAtRiskLow.trim() !== '' ? { customAtRiskLow: arl } : {}),
      ...(values.customAtRiskHigh.trim() !== '' ? { customAtRiskHigh: arh } : {}),
      ...(values.customOutOfRangeHigh.trim() !== '' ? { customOutOfRangeHigh: orh } : {}),
    };
  }

  return {
    customOutOfRangeLow: ool,
    customAtRiskLow: arl,
    customAtRiskHigh: arh,
    customOutOfRangeHigh: orh,
  };
}

/** Convierte una `ClinicalGoal` existente (o `null`) en los valores
 *  iniciales del form. Útil al abrir el editor sobre un parámetro que ya
 *  tiene meta personalizada. */
export function goalToFormValues(goal: ClinicalGoalPayload | null): CustomGoalFormValues {
  return {
    customOutOfRangeLow: goal?.customOutOfRangeLow == null ? '' : String(goal.customOutOfRangeLow),
    customAtRiskLow: goal?.customAtRiskLow == null ? '' : String(goal.customAtRiskLow),
    customAtRiskHigh: goal?.customAtRiskHigh == null ? '' : String(goal.customAtRiskHigh),
    customOutOfRangeHigh: goal?.customOutOfRangeHigh == null ? '' : String(goal.customOutOfRangeHigh),
  };
}
