import { ClinicalNote } from "./ClinicalNote";
import type { EstadoMeta, MetavixMetaParametro } from "../view-data/to-metavix-view";

export interface EvaluacionMetasGridProps {
  fechaTexto?: string;
  parametros: MetavixMetaParametro[];
}

const ESTADO_STYLE: Record<EstadoMeta, { label: string; color: string; bg: string; border: string }> = {
  ok: { label: "EN META", color: "var(--ok)", bg: "var(--ok-bg)", border: "var(--ok)" },
  warn: { label: "REVISAR", color: "var(--warn)", bg: "var(--warn-bg)", border: "var(--warn)" },
  bad: { label: "FUERA DE META", color: "var(--bad)", bg: "var(--bad-bg)", border: "var(--bad)" },
  vacio: { label: "SIN DATOS", color: "var(--soft)", bg: "var(--ph)", border: "var(--bd)" },
};

const RAZON_LABEL: Record<"especialista" | "no_embarazo", string> = {
  especialista: "Requiere evaluación con especialista",
  no_embarazo: "No se evalúa en el embarazo",
};

/**
 * Detalle exhaustivo: TODOS los parámetros tras evaluar, en cuadrícula, con
 * valor + unidad, etiqueta de estado y, cuando aplica, la nota clínica que
 * explica una lectura especial. La prioridad ya se comunicó arriba en
 * "Necesita tu atención" / "Vas bien en esto" — esto es el respaldo completo.
 */
export function EvaluacionMetasGrid({ fechaTexto, parametros }: EvaluacionMetasGridProps) {
  return (
    <div
      className="rounded-xl p-5 sm:p-6"
      style={{ background: "var(--card)", border: "1.5px solid var(--card-bd)" }}
    >
      <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>
        Evaluación de metas
      </h3>
      {fechaTexto && (
        <p className="text-xs mt-1 mb-4" style={{ color: "var(--mut)" }}>
          Evaluación: {fechaTexto}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {parametros.map((p) => {
          const s = ESTADO_STYLE[p.estado];
          return (
            <div
              key={p.id}
              className="rounded-lg p-4 border"
              style={{ background: p.estado === "vacio" ? "var(--ph)" : s.bg, borderColor: s.border }}
            >
              <div className="text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>{p.label}</div>
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className="text-lg font-bold" style={{ color: p.estado === "vacio" ? "var(--soft)" : s.color }}>
                  {p.valor ?? "—"}
                </span>
                {p.unidad && <span className="text-xs" style={{ color: "var(--soft)" }}>{p.unidad}</span>}
              </div>
              <div className="text-xs font-semibold tracking-wide" style={{ color: s.color }}>{s.label}</div>
              {p.razonNoEvaluable && (
                <p className="text-xs italic mt-1" style={{ color: "var(--mut)" }}>
                  {RAZON_LABEL[p.razonNoEvaluable]}
                </p>
              )}
              {p.nota && (
                <div className="mt-2.5 pt-2.5 border-t" style={{ borderColor: s.border }}>
                  <ClinicalNote texto={p.nota.texto} tono={p.nota.tono} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
