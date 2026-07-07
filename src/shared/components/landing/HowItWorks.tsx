"use client";

import React from "react";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const STEPS = [
  { title: "Crea tu cuenta", desc: "Accede gratis desde cualquier navegador." },
  { title: "Registra tus mediciones", desc: "Captura tus datos en menos de dos minutos." },
  { title: "Consulta tu historial", desc: "Comparte tus registros y gráficas con tu médico en cualquier momento." },
];

export function HowItWorks() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section id="como" className="mvx-home" style={{ padding: "104px 56px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <span style={eyebrow}>Cómo funciona</span>
          <h2 style={{ fontFamily: F, fontSize: 44, fontWeight: 800, lineHeight: 1.08, color: "var(--text)", letterSpacing: "-0.03em", margin: "14px 0 0", maxWidth: 620 }}>
            Tres pasos para llevar el control de tu salud.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ padding: "32px 30px", borderTop: "3px solid var(--accent)", background: "var(--panel)", borderRadius: "0 0 16px 16px" }}>
              <div style={{ fontFamily: F, fontSize: 46, fontWeight: 800, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 18 }}>
                {i + 1}
              </div>
              <h3 style={{ fontFamily: F, fontSize: 19, fontWeight: 700, color: "var(--text)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{s.title}</h3>
              <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.6, color: "var(--text-mut)", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
