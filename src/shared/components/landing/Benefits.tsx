"use client";

import React from "react";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const BENEFITS = [
  {
    title: "Gráficas claras",
    desc: "Visualiza tu evolución con gráficos fáciles de interpretar.",
    icon: <><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></>,
  },
  {
    title: "Alertas inteligentes",
    desc: "Recibe avisos cuando un valor salga de tu rango habitual.",
    icon: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  },
  {
    title: "Siempre disponible",
    desc: "Accede a tus registros desde cualquier dispositivo, cuando los necesites.",
    icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  },
];

export function Benefits() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section id="beneficios" className="mvx-home" style={{ padding: "104px 56px", background: "var(--panel)", borderTop: "1.5px solid var(--divider)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={eyebrow}>Beneficios</span>
          <h2 style={{ fontFamily: F, fontSize: 44, fontWeight: 800, lineHeight: 1.08, color: "var(--text)", letterSpacing: "-0.03em", margin: "14px auto 0", maxWidth: 640 }}>
            Entiende tu salud sin complicaciones.
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {BENEFITS.map((b) => (
            <div key={b.title} className="mvx-card" style={{ background: "var(--card)", border: "1.5px solid var(--card-border)", borderRadius: 18, padding: "34px 30px" }}>
              <div style={{ width: 48, height: 48, background: "var(--icon-bg)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  {b.icon}
                </svg>
              </div>
              <h3 style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{b.title}</h3>
              <p style={{ fontFamily: F, fontSize: 15, lineHeight: 1.6, color: "var(--text-mut)", margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
