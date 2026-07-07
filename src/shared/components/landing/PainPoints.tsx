"use client";

import React from "react";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const PROBLEMS = [
  "No recordar tus últimos resultados durante una consulta.",
  "Tener tus registros dispersos en papel, fotos y varias apps.",
  "No saber si una medición está dentro de un rango saludable.",
  "Empezar con un nuevo médico sin tu historial clínico a mano.",
];

export function PainPoints() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section className="mvx-home" style={{ padding: "104px 56px", background: "var(--panel)", borderTop: "1.5px solid var(--divider)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <span style={eyebrow}>El problema</span>
        <h2 style={{ fontFamily: F, fontSize: 44, fontWeight: 800, lineHeight: 1.08, color: "var(--text)", letterSpacing: "-0.03em", margin: "14px 0 56px", maxWidth: 620 }}>
          ¿Te ha pasado alguna vez?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
          {PROBLEMS.map((p, i) => (
            <div key={i} className="mvx-card" style={{ background: "var(--card)", border: "1.5px solid var(--card-border)", borderRadius: 16, display: "flex", alignItems: "flex-start", gap: 16, padding: "26px 28px" }}>
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 800, color: "var(--accent)", flexShrink: 0, width: 24 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.55, color: "var(--text-mut)", margin: 0 }}>{p}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: F, fontSize: 18, lineHeight: 1.6, color: "var(--text)", margin: "48px 0 0", maxWidth: 640, fontWeight: 500 }}>
          Metavix organiza toda tu información para que{" "}
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>siempre esté lista cuando la necesites.</span>
        </p>
      </div>
    </section>
  );
}
