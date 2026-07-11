import { PARAMETROS_META } from '../data/parametros';
import type { GoalEvaluationResponse } from '@/types/goal-evaluation';
import type { GoalEvaluationItemView } from '../components/GoalEvaluationCard';

const CATALOG_BY_ID = new Map(PARAMETROS_META.map((p) => [p.id, p]));

/**
 * Convierte la respuesta cruda del endpoint POST /goal-evaluations en la
 * estructura pre-formateada que GoalEvaluationCard espera. Resuelve el nombre
 * y la unidad de cada parámetro contra PARAMETROS_META; si el backend emite un
 * id que el catálogo del frontend no conoce (ej. nuevos parámetros agregados
 * al catálogo del backend antes de sincronizar el frontend), usa el id crudo
 * como nombre y deja la unidad vacía para que el chip aún se renderice.
 *
 * La respuesta de la API puede incluir un campo `reason` por item (no en el
 * tipo compartido aún); lo leemos de forma defensiva por si el backend ya lo
 * emite.
 */
export function goalEvalToViews(response: GoalEvaluationResponse): GoalEvaluationItemView[] {
  return response.items.map((item) => {
    const catalog = CATALOG_BY_ID.get(item.parameterId);
    return {
      parameterId: item.parameterId,
      name: catalog?.nombre ?? item.parameterId,
      unit: catalog?.unidad ?? '',
      value: item.valueUsed,
      status: item.status,
      reason: (item as { reason?: string | null }).reason ?? null,
    };
  });
}
