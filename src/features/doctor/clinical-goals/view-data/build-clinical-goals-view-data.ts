import type { ClinicalGoal } from "@/types/clinical-goal";
import { PARAMETROS_META, type DefParametro } from "@/features/metas/data/parametros";

export interface ParametroGoalView {
  param: DefParametro;
  /** Meta personalizada del doctor para este parámetro, o null si usa el default. */
  existing: ClinicalGoal | null;
  /** Resumen legible de los umbrales personalizados ("Fuera < 5 mg/dL · …"). Vacío si no hay meta. */
  customSummaryItems: string[];
}

export interface ClinicalGoalsViewData {
  parametros: ParametroGoalView[];
  hasCustomGoals: boolean;
}

/**
 * Construye el resumen legible de los umbrales de una meta personalizada.
 * Extraído del componente `CustomGoalSummary` a datos puros (sin JSX).
 */
export function buildCustomSummaryItems(goal: ClinicalGoal, unit: string): string[] {
  const u = unit ? ` ${unit}` : "";
  const items: string[] = [];
  if (goal.customOutOfRangeLow !== null) items.push(`Fuera < ${goal.customOutOfRangeLow}${u}`);
  if (goal.customAtRiskLow !== null) items.push(`Revisar ≥ ${goal.customAtRiskLow}${u}`);
  if (goal.customAtRiskHigh !== null) items.push(`Revisar > ${goal.customAtRiskHigh}${u}`);
  if (goal.customOutOfRangeHigh !== null) items.push(`Fuera ≥ ${goal.customOutOfRangeHigh}${u}`);
  return items;
}

/**
 * View data del editor de metas clínicas: agrupa las metas por `parameterId`
 * contra el catálogo `PARAMETROS_META` y precomputa el resumen de cada meta
 * personalizada. Puro; el fetch vive en `use-clinical-goals-editor`.
 */
export function buildClinicalGoalsViewData(
  goals: ClinicalGoal[],
): ClinicalGoalsViewData {
  const byParam = new Map<string, ClinicalGoal>(goals.map((g) => [g.parameterId, g]));

  const parametros: ParametroGoalView[] = PARAMETROS_META.map((param) => {
    const existing = byParam.get(param.id) ?? null;
    return {
      param,
      existing,
      customSummaryItems: existing ? buildCustomSummaryItems(existing, param.unidad) : [],
    };
  });

  return { parametros, hasCustomGoals: goals.length > 0 };
}
