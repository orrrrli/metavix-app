import type { GoalEvaluationResponse } from "@/types/goal-evaluation";
import { PARAMETROS_META, type DefParametro, type EvaluacionMeta } from "../data/parametros";

export interface ResultadoParametro {
  param: DefParametro;
  valor: string;
  evaluacion: EvaluacionMeta;
}

/**
 * Deriva `valoresEvaluados` (parameterId → valueUsed como string) desde la
 * respuesta de evaluación. Vacío cuando no hay evaluación. Extraído de
 * `MetasControl`.
 */
export function buildValoresEvaluados(
  evalResult: GoalEvaluationResponse | null,
): Record<string, string> {
  const map: Record<string, string> = {};
  evalResult?.items.forEach((item) => {
    map[item.parameterId] = item.valueUsed?.toString() ?? "";
  });
  return map;
}

/**
 * Ensambla la lista de resultados para `ResumenControl`/`ParametroMeta`.
 *
 * Regla del `||` (no `??`), preservada del componente original: si el backend
 * emitió `valueUsed: null`/ausente, `valoresEvaluados[id]` es "" y aún así
 * pisaría el valor pre-poblado; con `||` un string vacío cae al fallback de
 * `valores` (pre-poblado). Así el semáforo y el valor mostrado nunca quedan
 * desalineados.
 */
export function buildResumenResultados(input: {
  valores: Record<string, string>;
  valoresEvaluados: Record<string, string>;
  evaluaciones: Record<string, EvaluacionMeta>;
}): ResultadoParametro[] {
  return PARAMETROS_META.map((param) => ({
    param,
    valor:
      input.valoresEvaluados[param.id] || input.valores[param.id] || "",
    evaluacion: input.evaluaciones[param.id],
  }));
}
