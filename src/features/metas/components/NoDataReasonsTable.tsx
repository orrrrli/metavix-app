import { ClinicalNote } from "./ClinicalNote";
import type { MetavixNoEvaluado } from "../view-data/to-metavix-view";

interface NoDataReasonsTableProps {
  items: MetavixNoEvaluado[];
}

/**
 * Lista de parámetros clínicos que el backend no pudo evaluar automáticamente
 * tras apretar "Evaluar mis metas", con la razón y, cuando aplica, un CTA para
 * que el paciente consulte a su médico. Transparencia clínica: explica
 * huecos, no solo los oculta.
 */
export function NoDataReasonsTable({ items }: NoDataReasonsTableProps) {
  if (items.length === 0) return null;

  const especialista = items.filter((it) => it.razon === "especialista");
  const noEmbarazo = items.filter((it) => it.razon === "no_embarazo");

  return (
    <div
      className="rounded-xl p-6 sm:p-8"
      style={{ background: "var(--card)", border: "1.5px solid var(--card-bd)" }}
    >
      <div className="mb-5">
        <h3 className="text-lg font-display font-semibold" style={{ color: "var(--text)" }}>
          Parámetros que requieren atención especial
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--mut)" }}>
          Estos parámetros no se pueden evaluar automáticamente con tus datos actuales.
        </p>
      </div>

      {especialista.length > 0 && (
        <ul className="space-y-3">
          {especialista.map((it) => (
            <li key={it.id} className="rounded-lg p-4 border" style={{ background: "var(--ph)", borderColor: "var(--bd)" }}>
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <span className="font-semibold" style={{ color: "var(--text)" }}>{it.label}</span>
                <span className="text-xs font-bold rounded-full px-3 py-1.5 whitespace-nowrap" style={{ color: "var(--warn)", background: "var(--warn-bg)" }}>
                  Requiere especialista
                </span>
              </div>
              <div className="mt-3">
                {it.nota ? (
                  <ClinicalNote texto={it.nota.texto} tono={it.nota.tono} />
                ) : (
                  <ClinicalNote texto="Consulta con tu médico para definir metas individuales para este parámetro." />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {noEmbarazo.length > 0 && (
        <ul className={especialista.length > 0 ? "mt-4 space-y-1.5" : "space-y-1.5"}>
          {noEmbarazo.map((it) => (
            <li key={it.id} className="flex items-baseline justify-between gap-3 py-1.5">
              <span className="text-xs" style={{ color: "var(--mut)" }}>{it.label}</span>
              <span className="text-xs" style={{ color: "var(--soft)" }}>
                No se evalúa en embarazo
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--mut)" }}>
        Tu médico puede ajustar las metas de cualquier parámetro desde su portal. Una vez que
        lo haga, la evaluación automática volverá a clasificarlo en tu próxima revisión.
      </p>
    </div>
  );
}
