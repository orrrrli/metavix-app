"use client";

import React from "react";
import Link from "next/link";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const DOCTOR_FEATURES = [
  "Glucosa, presión, peso y laboratorios en tiempo real.",
  "Alertas sobre valores fuera de rango.",
  "Tendencias con gráficas automáticas.",
  "Menos tiempo administrativo, mejores decisiones clínicas.",
];

export function DoctorCTA() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section id="medicos" className="mvx-home" style={{ padding: "104px 56px", background: "var(--doc-bg)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div>
          <span style={eyebrow}>Para médicos</span>
          <h2 style={{ fontFamily: F, fontSize: 42, fontWeight: 800, lineHeight: 1.1, color: "var(--doc-text)", letterSpacing: "-0.03em", margin: "14px 0 20px" }}>
            Información clínica cuando realmente importa.
          </h2>
          <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.7, color: "var(--doc-mut)", margin: "0 0 36px", maxWidth: 440 }}>
            Accede al historial completo de tus pacientes antes, durante y después de la consulta.
          </p>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <button className="mvx-btn mvx-btn-primary" style={{ position: "relative", overflow: "hidden", background: "var(--accent)", color: "#03251d", border: "none", borderRadius: 10, padding: "14px 28px", fontFamily: F, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
                Registrarme como profesional <span className="mvx-arrow">→</span>
              </span>
              <span className="mvx-shine" />
            </button>
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {DOCTOR_FEATURES.map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 24px", background: "var(--doc-card)", border: "1px solid var(--doc-border)", borderRadius: 14 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontFamily: F, fontSize: 15, lineHeight: 1.5, color: "var(--doc-text)" }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
