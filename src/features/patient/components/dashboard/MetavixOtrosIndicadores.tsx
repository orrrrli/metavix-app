import React from "react";

/**
 * MetavixOtrosIndicadores — lista SECUNDARIA y de-enfatizada con el resto de
 * indicadores (presión, frecuencia cardíaca, IMC, HbA1c, colesterol…), agrupados
 * para que no compitan con la glucosa.
 *
 * Pásale los indicadores como datos; los que no tengan dato muestran un CTA
 * "+ Agregar". Consume las variables de tema de <MetavixDashboardLayout>.
 */

export type EstadoIndicador = "ok" | "warn" | "bad" | "info" | "vacio";

export interface MetavixIndicador {
  label: string;
  /** Sublínea (ej. "Medido hace 1 día") */
  meta?: string;
  /** Valor principal. Omítelo para mostrar el CTA "+ Agregar" */
  valor?: React.ReactNode;
  /** Etiqueta de estado (ej. "Normal", "Saludable") */
  estadoLabel?: string;
  estado?: EstadoIndicador;
  /** Icono (path/g de un SVG 24x24). Si lo omites usa un punto */
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface MetavixOtrosIndicadoresProps {
  titulo?: string;
  subtitulo?: string;
  indicadores?: MetavixIndicador[];
  onVerTodos?: () => void;
}

const F = "'Sora', sans-serif";

const ESTADO_VAR: Record<Exclude<EstadoIndicador, "vacio">, { color: string; bg: string }> = {
  ok: { color: "var(--ok)", bg: "var(--ok-bg)" },
  warn: { color: "var(--warn)", bg: "var(--warn-bg)" },
  bad: { color: "var(--bad)", bg: "var(--bad-bg)" },
  info: { color: "var(--info)", bg: "var(--info-bg)" },
};

const ICON_BG: Record<EstadoIndicador, string> = {
  ok: "var(--ok-bg)",
  warn: "var(--warn-bg)",
  bad: "var(--bad-bg)",
  info: "var(--info-bg)",
  vacio: "var(--ph)",
};
const ICON_STROKE: Record<EstadoIndicador, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  bad: "var(--bad)",
  info: "var(--info)",
  vacio: "var(--soft)",
};

const DEFAULT: MetavixIndicador[] = [
  {
    label: "Presión arterial",
    meta: "Medida hace 1 día",
    valor: (
      <>
        120
        <span style={{ fontSize: 14, color: "var(--soft)", fontWeight: 500 }}>/80</span>
      </>
    ),
    estadoLabel: "Normal",
    estado: "ok",
    icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
  },
  {
    label: "Frecuencia cardíaca",
    meta: "Medida hace 1 día",
    valor: (
      <>
        60<span style={{ fontSize: 13, color: "var(--soft)", fontWeight: 500 }}> lpm</span>
      </>
    ),
    estadoLabel: "Normal",
    estado: "info",
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  },
  {
    label: "Índice de masa corporal",
    meta: "Medido hace 3 días",
    valor: "23.4",
    estadoLabel: "Saludable",
    estado: "ok",
    icon: (
      <>
        <path d="M12 3v6" />
        <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z" />
      </>
    ),
  },
  {
    label: "HbA1c · Colesterol",
    meta: "Aún sin registros este trimestre",
    estado: "vacio",
    icon: (
      <>
        <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
        <path d="M8 3h8" />
      </>
    ),
  },
];

export default function MetavixOtrosIndicadores({
  titulo = "Otros indicadores",
  subtitulo = "Secundarios · actualízalos cuando tengas nuevos resultados.",
  indicadores = DEFAULT,
  onVerTodos,
}: MetavixOtrosIndicadoresProps) {
  return (
    <section style={{ fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, letterSpacing: "-0.01em" }}>{titulo}</h2>
          <p style={{ fontSize: 12.5, color: "var(--soft)", margin: "3px 0 0" }}>{subtitulo}</p>
        </div>
        <span
          className="mvxoi-chip"
          onClick={onVerTodos}
          style={{ fontSize: 13, fontWeight: 600, color: "var(--mut)" }}
        >
          Ver todos →
        </span>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--card-bd)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        {indicadores.map((ind, i) => {
          const est = ind.estado ?? "ok";
          const last = i === indicadores.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 22px",
                borderBottom: last ? "none" : "1.5px solid var(--bd)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: ICON_BG[est],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={ICON_STROKE[est]}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ind.icon ?? <circle cx="12" cy="12" r="3" />}
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{ind.label}</div>
                {ind.meta && <div style={{ fontSize: 12, color: "var(--soft)" }}>{ind.meta}</div>}
              </div>

              {ind.valor != null && (
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginRight: 4 }}>{ind.valor}</div>
              )}

              {est === "vacio" ? (
                <span
                  className="mvxoi-chip"
                  onClick={ind.onClick}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "var(--accent)",
                    background: "var(--nav-active-bg)",
                    padding: "6px 14px",
                    borderRadius: 999,
                  }}
                >
                  + Agregar
                </span>
              ) : ind.estadoLabel ? (
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: ESTADO_VAR[est].color,
                    background: ESTADO_VAR[est].bg,
                    padding: "4px 11px",
                    borderRadius: 999,
                    width: 78,
                    textAlign: "center",
                  }}
                >
                  {ind.estadoLabel}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
