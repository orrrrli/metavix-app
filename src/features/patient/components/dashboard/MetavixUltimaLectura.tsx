import React from "react";

/**
 * MetavixUltimaLectura — tarjeta HERO del dashboard: "Tu última lectura de glucosa".
 * Es el elemento de mayor prioridad visual: valor grande, estado clínico con color,
 * tiempo desde la medición, barra de rango y el CTA principal.
 *
 * Consume las variables de tema (--ok, --warn, --card, --accent, …) que provee
 * <MetavixDashboardLayout>. Para probarlo aislado, envuélvelo en:
 *   <div className="mvx-dash" style={{ padding: 40, background: "var(--canvas)" }}>...</div>
 *
 * El color del estado (verde/amarillo/rojo) se deriva de `estado`.
 */

export type EstadoClinico = "ok" | "warn" | "bad";

export interface MetavixUltimaLecturaProps {
  /** Valor numérico de la última lectura */
  valor: number | string;
  /** Unidad (mg/dL por defecto) */
  unidad?: string;
  /** Estado clínico vs rango objetivo */
  estado?: EstadoClinico;
  /** Etiqueta del estado (ej. "En rango", "Alta", "Baja") */
  estadoLabel?: string;
  /** Texto del momento de registro (ej. "hoy a las 7:30 AM, en ayuno") */
  contexto?: string;
  /** Cuánto hace que se registró (ej. "2 horas") */
  registradaHace?: string;
  /** Rango objetivo [min, max] */
  rangoObjetivo?: [number, number];
  /** Posición del marcador en la barra, 0–1. Si lo omites, se calcula desde valor */
  markerPct?: number;
  /** Texto de la próxima medición sugerida */
  proximaMedicion?: string;
  onRegistrar?: () => void;
  onHistorial?: () => void;
}

const F = "'Sora', sans-serif";

const ESTADO_VAR: Record<EstadoClinico, { color: string; bg: string }> = {
  ok: { color: "var(--ok)", bg: "var(--ok-bg)" },
  warn: { color: "var(--warn)", bg: "var(--warn-bg)" },
  bad: { color: "var(--bad)", bg: "var(--bad-bg)" },
};

export default function MetavixUltimaLectura({
  valor,
  unidad = "mg/dL",
  estado = "ok",
  estadoLabel = "En rango",
  contexto = "hoy a las 7:30 AM, en ayuno",
  registradaHace = "2 horas",
  rangoObjetivo = [70, 180],
  markerPct,
  proximaMedicion = "Antes de comer · cerca de la 1:00 PM",
  onRegistrar,
  onHistorial,
}: MetavixUltimaLecturaProps) {
  const e = ESTADO_VAR[estado];

  const num = typeof valor === "number" ? valor : parseFloat(String(valor));
  const pct = markerPct ?? Math.max(0.04, Math.min(0.96, (num - 40) / (250 - 40)));

  const card: React.CSSProperties = {
    background: "var(--card)",
    border: "1.5px solid var(--card-bd)",
    borderRadius: 22,
    padding: "30px 34px",
    boxShadow: "0 12px 30px rgba(20,40,30,.05)",
    fontFamily: F,
  };

  return (
    <section className="mvxul-card" style={card}>
      {/* izquierda: la lectura */}
      <div className="mvxul-divider">
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: e.color,
              display: "inline-block",
              animation: "mvxulDot 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.13em",
              color: "var(--soft)",
              textTransform: "uppercase",
            }}
          >
            Tu última lectura de glucosa
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 74,
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            {valor}
          </span>
          <span style={{ fontSize: 18, color: "var(--soft)", fontWeight: 500, marginBottom: 10 }}>{unidad}</span>
          <span
            style={{
              marginBottom: 13,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: e.bg,
              color: e.color,
              fontSize: 13.5,
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: 999,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {estadoLabel}
          </span>
        </div>

        <p style={{ fontSize: 13.5, color: "var(--mut)", margin: "10px 0 22px" }}>
          Registrada hace <span style={{ color: "var(--text)", fontWeight: 600 }}>{registradaHace}</span> · {contexto}
        </p>

        {/* barra de rango */}
        <div style={{ marginTop: 4 }}>
          <div style={{ position: "relative", height: 11, borderRadius: 999, overflow: "hidden", display: "flex" }}>
            <div style={{ width: "16%", background: "var(--bad)", opacity: 0.85 }} />
            <div style={{ width: "62%", background: "var(--ok)" }} />
            <div style={{ width: "22%", background: "var(--warn)", opacity: 0.9 }} />
          </div>
          <div style={{ position: "relative", height: 0 }}>
            <div
              style={{
                position: "absolute",
                left: `${pct * 100}%`,
                top: -15,
                transform: "translateX(-50%)",
                width: 3,
                height: 19,
                background: "var(--text)",
                borderRadius: 2,
                boxShadow: "0 0 0 3px var(--card)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              fontSize: 11,
              color: "var(--soft)",
              fontWeight: 500,
            }}
          >
            <span>
              Bajo &lt;{rangoObjetivo[0]}
            </span>
            <span style={{ color: "var(--ok)", fontWeight: 700 }}>
              Objetivo {rangoObjetivo[0]}–{rangoObjetivo[1]}
            </span>
            <span>
              Alto &gt;{rangoObjetivo[1]}
            </span>
          </div>
        </div>
      </div>

      {/* derecha: nudge de acción */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            background: "var(--warn-bg)",
            borderRadius: 14,
            marginBottom: 14,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--warn)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 14" />
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Próxima medición sugerida</div>
            <div style={{ fontSize: 13, color: "var(--mut)" }}>{proximaMedicion}</div>
          </div>
        </div>
        <button
          className="mvxul-btn"
          onClick={onRegistrar}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            background: "var(--accent)",
            color: "#03251d",
            border: "none",
            borderRadius: 13,
            padding: 16,
            fontFamily: F,
            fontSize: 15.5,
            fontWeight: 700,
            boxShadow: "var(--btn-glow)",
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Registrar nueva lectura
        </button>
        <button
          className="mvxul-btn"
          onClick={onHistorial}
          style={{
            width: "100%",
            marginTop: 10,
            background: "transparent",
            color: "var(--mut)",
            border: "1.5px solid var(--bd)",
            borderRadius: 13,
            padding: 13,
            fontFamily: F,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Ver historial completo
        </button>
      </div>
    </section>
  );
}
