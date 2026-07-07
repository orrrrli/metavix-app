"use client";

import React from "react";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const METRIC_TAGS = [
  "Glucosa",
  "Presión arterial",
  "Peso",
  "IMC",
  "Colesterol",
  "Triglicéridos",
  "Hemoglobina glucosilada",
];

export function Features() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section id="registrar" className="mvx-home" style={{ padding: "104px 56px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div>
          <span style={eyebrow}>Qué puedes registrar</span>
          <h2 style={{ fontFamily: F, fontSize: 44, fontWeight: 800, lineHeight: 1.08, color: "var(--text)", letterSpacing: "-0.03em", margin: "14px 0 22px" }}>
            Todo tu historial de salud en un solo lugar.
          </h2>
          <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.72, color: "var(--text-mut)", margin: 0, maxWidth: 440 }}>
            Cada dato queda organizado automáticamente y listo para consultar cuando quieras.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {METRIC_TAGS.map((t) => (
            <span key={t} className="mvx-chip" style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "var(--text)", background: "var(--chip-bg)", border: "1.5px solid var(--chip-border)", borderRadius: 999, padding: "12px 22px" }}>
              {t}
            </span>
          ))}
          <span className="mvx-chip" style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "var(--accent)", background: "var(--icon-bg)", border: "1.5px solid var(--chip-border)", borderRadius: 999, padding: "12px 22px" }}>
            y mucho más +
          </span>
        </div>
      </div>
    </section>
  );
}
