import React from "react";

/**
 * MetavixEstadoVacio — el dashboard cuando el paciente AÚN no tiene registros.
 * En lugar de mostrar tarjetas vacías, invita a registrar la primera lectura.
 * Renderízalo como único children de <MetavixDashboardLayout> cuando no haya datos:
 *
 *   {lecturas.length === 0
 *     ? <MetavixEstadoVacio onRegistrar={abrir} />
 *     : <> ...piezas con datos... </>}
 *
 * Consume las variables de tema de <MetavixDashboardLayout>.
 */

export interface MetavixEstadoVacioProps {
  titulo?: string;
  descripcion?: string;
  ctaLabel?: string;
  onRegistrar?: () => void;
}

const F = "'Sora', sans-serif";

export default function MetavixEstadoVacio({
  titulo = "Empieza tu primer registro",
  descripcion = "Registra tu primera medición de glucosa y Metavix empezará a construir tu tendencia, tus metas y tu progreso del día.",
  ctaLabel = "Registrar mi primera lectura",
  onRegistrar,
}: MetavixEstadoVacioProps) {
  return (
    <section
      style={{
        background: "var(--card)",
        border: "1.5px solid var(--card-bd)",
        borderRadius: 24,
        padding: "64px 40px",
        textAlign: "center",
        boxShadow: "0 12px 30px rgba(20,40,30,.05)",
        maxWidth: 720,
        margin: "10px auto 0",
        fontFamily: F,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 26,
          background: "var(--nav-active-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 26px",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 0-7 9.5-7 13.5a7 7 0 0 0 14 0C19 11.5 12 2 12 2z" />
        </svg>
      </div>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "var(--text)",
          letterSpacing: "-0.03em",
          margin: "0 0 12px",
        }}
      >
        {titulo}
      </h2>
      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.65,
          color: "var(--mut)",
          margin: "0 auto 30px",
          maxWidth: 430,
        }}
      >
        {descripcion}
      </p>
      <button
        className="mvxev-btn"
        onClick={onRegistrar}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "var(--accent)",
          color: "#03251d",
          border: "none",
          borderRadius: 14,
          padding: "17px 34px",
          fontFamily: F,
          fontSize: 16.5,
          fontWeight: 700,
          boxShadow: "0 14px 30px rgba(0,201,167,.36)",
        }}
      >
        <span style={{ fontSize: 21, lineHeight: 1 }}>+</span> {ctaLabel}
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          marginTop: 34,
          paddingTop: 26,
          borderTop: "1.5px solid var(--bd)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--mut)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ok)" }} />
          Toma menos de 1 minuto
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--mut)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--info)" }} />
          Listo para compartir con tu médico
        </div>
      </div>
    </section>
  );
}
