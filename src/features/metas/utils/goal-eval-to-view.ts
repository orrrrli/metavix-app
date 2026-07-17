import { PARAMETROS_META_BY_ID } from '../data/parametros';
import type { GoalEvaluationResponse, NoDataReason, CkdStage, GoalStatus } from '@/types/goal-evaluation';
import { getParameterNotes } from './clinical-notes';

/**
 * Vista pre-formateada de un ítem de evaluación, ensamblada a partir de la
 * respuesta cruda de la API + el catálogo de parámetros. Los componentes que
 * la consumen no conocen la API ni el catálogo — solo reciben la lista lista
 * para renderizar.
 */
export interface GoalEvaluationItemView {
  parameterId: string;
  name: string;
  unit: string;
  value: number | null;
  status: GoalStatus;
  reason?: string | null;
  /** Nota clínica contextual (ej. advertencias por embarazo). Ver clinical-notes.ts. */
  note?: string | null;
  /** Alerta crítica urgente (ej. TG ≥ 500). Ver clinical-notes.ts. */
  criticalAlert?: string | null;
  /** Etapa KDIGO 2024 de ERC. Solo presente para el parámetro `egfr` y
   *  cuando hay un valor numérico; null en cualquier otro caso. */
  ckdStage?: CkdStage | null;
}

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
 * `isPregnant` y `previousCreatinine` alimentan la derivación de notas
 * clínicas por parámetro en tiempo de render (ver clinical-notes.ts para el
 * detalle de los flags `pregnancyNote`/`criticalAlert`/`increaseNote`
 * declarados en `PARAMETROS_META`) — las notas no vienen del backend ni se
 * persisten. `previousCreatinine` sólo tiene efecto en el parámetro
 * `creatinine` (el único con `increaseNote` declarado hoy); para cualquier
 * otro parámetro se ignora sin necesidad de una rama especial aquí.
 */
export function goalEvalToViews(
  response: GoalEvaluationResponse,
  isPregnant: boolean,
  previousCreatinine?: number | null,
): GoalEvaluationItemView[] {
  return response.items.map((item) => {
    const catalog = PARAMETROS_META_BY_ID.get(item.parameterId);
    const { note, criticalAlert } = getParameterNotes({
      parameterId: item.parameterId,
      status: item.status,
      valueUsed: item.valueUsed,
      isPregnant,
      previousValue: item.parameterId === 'creatinine' ? previousCreatinine : undefined,
    });
    return {
      parameterId: item.parameterId,
      name: catalog?.nombre ?? item.parameterId,
      unit: catalog?.unidad ?? '',
      value: item.valueUsed,
      status: item.status,
      reason: formatNoDataReason(item.reason ?? null),
      note,
      criticalAlert,
      // ckdStage solo lo emite el backend para el item egfr y solo si
      // valueUsed es numérico. Para cualquier otro parámetro queda null y
      // el caller (CkdStageExplainer) no se monta. Pasamos el valor crudo
      // sin derivar nada aquí — la clasificación ocurre en el backend
      // (single source of truth clínica).
      ckdStage: (item.ckdStage ?? null) as CkdStage | null,
    };
  });
}
