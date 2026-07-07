import React from "react";

/**
 * MetavixProgresoDia — franja de 3 tarjetas orientadas a la acción que reemplazan
 * al resumen redundante (Promedio/Máxima/Mínima cuando solo hay una medición).
 *
 * Responden: ¿cuántas mediciones llevo hoy?, ¿cuánto hace de la última?,
 * ¿voy dentro de mi objetivo?
 *
 * Consume las variables de tema de <MetavixDashboardLayout>. Para probar aislado,
 * envuélvelo en <div className="mvx-dash">…</div>.
 */

export interface MetavixProgresoDiaProps {
  /** Mediciones registradas hoy */
  medicionesHoy?: number;
  /** Meta de mediciones diarias */
  metaDiaria?: number;
  /** Texto del tiempo desde la última (ej. "2 h") */
  horasDesde?: string;
  /** Lecturas dentro de objetivo */
  enMeta?: number;
  /** Total de lecturas evaluadas */
  totalLecturas?: number;
}

const F = "'Sora', sans-serif";

export default function MetavixProgresoDia({
  medicionesHoy = 1,
  metaDiaria = 3,
  horasDesde = "2 h",
  enMeta = 1,
  totalLecturas = 1,
}: MetavixProgresoDiaProps) {
  const card: React.CSSProperties = {
    background: "var(--card)",
    border: "1.5px solid var(--card-bd)",
    borderRadius: 16,
    padding: "20px 22px",
    fontFamily: F,
  };
  const head: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 };
  const headLabel: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "var(--mut)" };
  const big: React.CSSProperties = { fontSize: 30, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" };
  const pill = (color: string, bg: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: bg,
    color,
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 11px",
    borderRadius: 999,
  });

  const pendientes = Math.max(0, metaDiaria - medicionesHoy);

  // Issue #8: derivar pills del estado real, no hardcodear texto/color.
  const metaCompleta = medicionesHoy >= metaDiaria && metaDiaria > 0;
  const sinMedicionesHoy = medicionesHoy === 0;
  const ratioEnMeta = totalLecturas > 0 ? enMeta / totalLecturas : null;

  type PillEstado = "ok" | "warn" | "bad" | "muted";
  const pillFromEstado = (estado: PillEstado): React.CSSProperties => {
    const map: Record<PillEstado, [string, string]> = {
      ok:    ["var(--ok)",    "var(--ok-bg)"],
      warn:  ["var(--warn)",  "var(--warn-bg)"],
      bad:   ["var(--bad)",   "var(--bad-bg)"],
      muted: ["var(--soft)",  "var(--ph)"],
    };
    const [color, bg] = map[estado];
    return { ...pill(color, bg) };
  };

  // Lógica "horas desde la última medición"
  // Sin horas legibles → no medido hoy. Con horas → comparar contra umbral de 4h.
  const horasSinDato = horasDesde === "—";
  const pillTiempoLabel = sinMedicionesHoy
    ? "Aún sin mediciones hoy"
    : metaCompleta
      ? "Meta del día completa"
      : horasSinDato
        ? "Te toca medir pronto"
        : "Vas bien, sigue así";
  const pillTiempoEstado: PillEstado = sinMedicionesHoy
    ? "muted"
    : metaCompleta
      ? "ok"
      : horasSinDato
        ? "warn"
        : "ok";

  // Lógica "dentro de tu objetivo"
  const pillEnMetaLabel =
    ratioEnMeta == null
      ? "Sin lecturas para evaluar"
      : enMeta === totalLecturas
        ? "¡Todas en rango!"
        : ratioEnMeta >= 0.7
          ? "Vas muy bien hoy"
          : ratioEnMeta >= 0.4
            ? "Algunas fuera de rango"
            : "Fuera de rango — revisa";
  const pillEnMetaEstado: PillEstado =
    ratioEnMeta == null
      ? "muted"
      : enMeta === totalLecturas
        ? "ok"
        : ratioEnMeta >= 0.7
          ? "ok"
          : ratioEnMeta >= 0.4
            ? "warn"
            : "bad";

  return (
    <section className="mvxpr-grid">
      {/* mediciones de hoy */}
      <div className="mvxpr-card" style={card}>
        <div style={head}>
          <span style={headLabel}>Mediciones de hoy</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
          <span style={big}>{medicionesHoy}</span>
          <span style={{ fontSize: 15, color: "var(--soft)", fontWeight: 500 }}>de {metaDiaria}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: metaDiaria }).map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 99,
                background: i < medicionesHoy ? "var(--accent)" : "var(--skel)",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--soft)", marginTop: 10 }}>
          {pendientes > 0 ? `Te faltan ${pendientes} registros hoy` : "Completaste tus registros de hoy"}
        </div>
      </div>

      {/* tiempo desde la última */}
      <div className="mvxpr-card" style={card}>
        <div style={head}>
          <span style={headLabel}>Desde tu última medición</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 14" />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
          <span style={big}>{horasDesde}</span>
        </div>
        <span style={pillFromEstado(pillTiempoEstado)}>{pillTiempoLabel}</span>
      </div>

      {/* en meta */}
      <div className="mvxpr-card" style={card}>
        <div style={head}>
          <span style={headLabel}>Dentro de tu objetivo</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
          <span style={{ ...big, color: "var(--ok)" }}>{enMeta}</span>
          <span style={{ fontSize: 15, color: "var(--soft)", fontWeight: 500 }}>de {totalLecturas} lectura{totalLecturas === 1 ? "" : "s"}</span>
        </div>
        <span style={pillFromEstado(pillEnMetaEstado)}>{pillEnMetaLabel}</span>
      </div>
    </section>
  );
}
