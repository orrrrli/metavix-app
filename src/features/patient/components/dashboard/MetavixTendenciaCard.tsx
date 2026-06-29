import React from "react";

/**
 * MetavixTendenciaCard — el CONTENEDOR (chrome) de la gráfica principal de glucosa:
 * título, selector de rango (7/14/30 días) y subtítulo con promedio y % en rango.
 *
 * NO dibuja la gráfica. Renderiza tu componente real por `children` — aquí es donde
 * enchufas tu "Curvas de glucosa del día":
 *
 *   <MetavixTendenciaCard promedio={112} porcentajeEnRango={86}
 *      rango="7d" onRangoChange={setRango}>
 *     <CurvasDeGlucosaDelDia data={lecturas} />
 *   </MetavixTendenciaCard>
 *
 * Consume las variables de tema de <MetavixDashboardLayout>.
 */

export interface MetavixRango {
  id: string;
  label: string;
}

export interface MetavixTendenciaCardProps {
  titulo?: string;
  /** Promedio a mostrar en el subtítulo */
  promedio?: number | string;
  /** Unidad del promedio */
  unidad?: string;
  /** % del tiempo en rango */
  porcentajeEnRango?: number;
  /** Opciones del selector de rango */
  rangos?: MetavixRango[];
  /** Id del rango activo */
  rango?: string;
  onRangoChange?: (id: string) => void;
  /** Tu gráfica real */
  children?: React.ReactNode;
  /** Altura mínima del área de gráfica (para el placeholder y el layout) */
  minChartHeight?: number;
}

const F = "'Sora', sans-serif";

const DEFAULT_RANGOS: MetavixRango[] = [
  { id: "7d", label: "7 días" },
  { id: "14d", label: "14 días" },
  { id: "30d", label: "30 días" },
];

export default function MetavixTendenciaCard({
  titulo = "Tu tendencia de glucosa",
  promedio = 112,
  unidad = "mg/dL",
  porcentajeEnRango = 86,
  rangos = DEFAULT_RANGOS,
  rango = "7d",
  onRangoChange,
  children,
  minChartHeight = 300,
}: MetavixTendenciaCardProps) {
  return (
    <section
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--card-bd)",
        borderRadius: 22,
        padding: "26px 30px 22px",
        boxShadow: "0 12px 30px rgba(20,40,30,.05)",
        fontFamily: F,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              margin: "0 0 4px",
            }}
          >
            {titulo}
          </h2>
          <p style={{ fontSize: 13, color: "var(--mut)", margin: 0 }}>
            Promedio <span style={{ color: "var(--text)", fontWeight: 600 }}>{promedio} {unidad}</span> ·{" "}
            <span style={{ color: "var(--ok)", fontWeight: 600 }}>{porcentajeEnRango}% del tiempo en rango</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          {rangos.map((r) => {
            const on = r.id === rango;
            return (
              <span
                key={r.id}
                className="mvxtc-chip"
                onClick={() => onRangoChange?.(r.id)}
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  borderRadius: 99,
                  padding: "7px 15px",
                  color: on ? "#03251d" : "var(--mut)",
                  background: on ? "var(--accent)" : "transparent",
                  border: `1.5px solid ${on ? "var(--accent)" : "var(--bd)"}`,
                }}
              >
                {r.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* área de la gráfica: aquí va tu componente real */}
      <div style={{ marginTop: 14, minHeight: minChartHeight }}>
        {children ?? (
          <div
            style={{
              height: minChartHeight,
              borderRadius: 14,
              background: "var(--ph)",
              border: "1.5px dashed var(--bd)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--soft)",
              fontSize: 13,
              fontFamily: "monospace",
            }}
          >
            ↳ Enchufa aquí tu &lt;CurvasDeGlucosaDelDia /&gt;
          </div>
        )}
      </div>
    </section>
  );
}
