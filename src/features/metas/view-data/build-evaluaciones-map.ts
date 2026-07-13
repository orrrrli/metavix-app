import type { GoalEvaluationResponse } from "@/types/goal-evaluation";
import { PARAMETROS_META, type EvaluacionMeta } from "../data/parametros";
import { mapGoalStatus } from "./map-goal-status";

/** Default `sin_dato` para un parámetro que el backend no incluyó en la evaluación. */
const DEFAULT_EVALUACION: EvaluacionMeta = {
  estado: "sin_dato",
  color: "var(--ph)",
  isCustomGoal: false,
  reason: null,
};

/**
 * Construye el mapa `parameterId → EvaluacionMeta` a partir de la respuesta de
 * evaluación. Los parámetros ausentes en `evalResult.items` caen al default
 * `sin_dato`. Cuando `evalResult` es null, todos los parámetros son `sin_dato`.
 * Extraído de `MetasControl` (T6/T7 + `DEFAULT_EVALUACIONES`).
 */
export function buildEvaluacionesMap(
  evalResult: GoalEvaluationResponse | null,
): Record<string, EvaluacionMeta> {
  const map: Record<string, EvaluacionMeta> = {};
  for (const param of PARAMETROS_META) {
    const item = evalResult?.items.find((i) => i.parameterId === param.id);
    map[param.id] = item
      ? mapGoalStatus(item.status, item.reason ?? null, item.isCustomGoal === true)
      : { ...DEFAULT_EVALUACION };
  }
  return map;
}
