import { PARAMETROS_META_BY_ID } from "../data/parametros";
import { ClinicalNote } from "./ClinicalNote";
import { formatNoDataReason } from "../utils/goal-eval-to-view";
import type { GoalEvaluationItemResponse, NoDataReason } from "@/types/goal-evaluation";

interface NoDataReasonsTableProps {
  /** Items de la respuesta de POST /goal-evaluations. El componente filtra
   *  internamente por status === "NoData" && reason != null. */
  items: GoalEvaluationItemResponse[];
}

/**
 * Lista de parámetros clínicos que el backend no pudo evaluar automáticamente
 * tras apretar "Evaluar mis metas", con la razón en español y, cuando aplica,
 * un CTA para que el paciente consulte a su médico.
 *
 * El backend clasifica los `NoData` con tres razones (alineadas con las
 * constantes de AdaGoalConstants.NoDataReason*):
 *   - "not-evaluated-in-pregnancy"        → "No se evalúa en el embarazo" (sin CTA)
 *   - "requires-specialist-evaluation"     → "Requiere evaluación con especialista" (con CTA)
 *   - "no-recent-data"                     → "Sin datos recientes" (sin CTA; ya lo cubre ResumenControl)
 *
 * Se renderiza debajo de `<ResumenControl>` y antes de `<GoalEvaluationCard>`.
 * Si no hay razones, no se muestra nada (componente retorna null).
 */
export function NoDataReasonsTable({ items }: NoDataReasonsTableProps) {
  const noDataWithReason = items.filter(
    (i) => i.status === "NoData" && i.reason != null,
  );

  if (noDataWithReason.length === 0) return null;

  return (
    <div
      className="bg-card border rounded-xl p-6 sm:p-8 shadow-sm"
      style={{ borderColor: "var(--bd)" }}
    >
      <div className="mb-5">
        <h3 className="text-lg font-display font-semibold" style={{ color: "var(--text)" }}>
          Parámetros que requieren atención especial
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--mut)" }}>
          Estos parámetros no se pueden evaluar automáticamente con tus datos actuales.
          La razón y, cuando aplica, el siguiente paso se detallan abajo.
        </p>
      </div>

      <ul className="space-y-3">
        {noDataWithReason.map((item) => {
          const catalog = PARAMETROS_META_BY_ID.get(item.parameterId);
          const name = catalog?.nombre ?? item.parameterId;
          const reasonText = formatNoDataReason(item.reason ?? null);
          const showCta = item.reason === ("requires-specialist-evaluation" as NoDataReason);
          return (
            <li
              key={item.parameterId}
              className="rounded-lg p-4 border"
              style={{ background: "var(--ph)", borderColor: "var(--bd)" }}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <span className="font-semibold" style={{ color: "var(--text)" }}>
                  {name}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--mut)" }}
                >
                  {reasonText}
                </span>
              </div>
              {showCta && (
                <div className="mt-3">
                  <ClinicalNote message="Consulta con tu médico para definir metas individuales para este parámetro." />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 text-xs leading-relaxed" style={{ color: "var(--mut)" }}>
        Tu médico puede ajustar las metas de cualquier parámetro desde su portal. Una vez que
        lo haga, la evaluación automática volverá a clasificarlo en tu próxima revisión.
      </div>
    </div>
  );
}
