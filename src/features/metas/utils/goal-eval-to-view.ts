import { PARAMETROS_META } from '../data/parametros';
import type { GoalEvaluationResponse, NoDataReason } from '@/types/goal-evaluation';
import type { GoalEvaluationItemView } from '../components/GoalEvaluationCard';
import { getParameterNote, getTriglyceridesCriticalAlert, getCreatinineIncreaseNote } from './clinical-notes';

const CATALOG_BY_ID = new Map(PARAMETROS_META.map((p) => [p.id, p]));

/**
 * Traduce un `NoDataReason` del backend al texto en español que se muestra al
 * paciente en el chip. Exportado para unit testing sin jsdom.
 *
 *   - "not-evaluated-in-pregnancy"        → "No se evalúa en el embarazo"
 *   - "requires-specialist-evaluation"     → "Requiere evaluación con especialista"
 *   - "no-recent-data"                     → "Sin datos recientes"
 *   - null / undefined                     → null (sin razón que mostrar)
 */
export function formatNoDataReason(reason: NoDataReason | null | undefined): string | null {
  if (!reason) return null;
  switch (reason) {
    case 'not-evaluated-in-pregnancy':
      return 'No se evalúa en el embarazo';
    case 'requires-specialist-evaluation':
      return 'Requiere evaluación con especialista';
    case 'no-recent-data':
      return 'Sin datos recientes';
  }
}

/**
 * Convierte la respuesta cruda del endpoint POST /goal-evaluations en la
 * estructura pre-formateada que GoalEvaluationCard espera. Resuelve el nombre
 * y la unidad de cada parámetro contra PARAMETROS_META; si el backend emite un
 * id que el catálogo del frontend no conoce (ej. nuevos parámetros agregados
 * al catálogo del backend antes de sincronizar el frontend), usa el id crudo
 * como nombre y deja la unidad vacía para que el chip aún se renderice.
 *
 * El campo `reason` (presente solo en items con `status === "NoData"`) se
 * traduce al texto en español correspondiente — el chip muestra texto, no
 * códigos.
 *
 * `isPregnant` se usa para derivar la nota clínica de cada parámetro
 * (tabla "Por parámetro" RF-005..RF-016, ver clinical-notes.ts) en tiempo
 * de render — la nota no viene del backend ni se persiste.
 *
 * `previousCreatinine` (opcional) es la creatinina del lab anterior al más
 * reciente; se usa para derivar el evento "aumento de creatinina ≤ 30 %"
 * (tabla "Por evento", ver clinical-notes.ts). Cuando ambas notas aplican
 * (embarazo + aumento de creatinina) se prioriza la nota de embarazo.
 */
export function goalEvalToViews(
  response: GoalEvaluationResponse,
  isPregnant: boolean,
  previousCreatinine?: number | null,
): GoalEvaluationItemView[] {
  return response.items.map((item) => {
    const catalog = CATALOG_BY_ID.get(item.parameterId);
    return {
      parameterId: item.parameterId,
      name: catalog?.nombre ?? item.parameterId,
      unit: catalog?.unidad ?? '',
      value: item.valueUsed,
      status: item.status,
      reason: formatNoDataReason(item.reason ?? null),
      note:
        getParameterNote({ parameterId: item.parameterId, status: item.status, isPregnant }) ??
        (item.parameterId === 'creatinine'
          ? getCreatinineIncreaseNote(item.valueUsed, previousCreatinine)
          : null),
      criticalAlert:
        item.parameterId === 'triglycerides'
          ? getTriglyceridesCriticalAlert(item.status, item.valueUsed)
          : null,
    };
  });
}
