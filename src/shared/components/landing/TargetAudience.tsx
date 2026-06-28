"use client";

import React from "react";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const AUDIENCE = ["Diabetes", "Hipertensión", "Riesgo cardiovascular"];

export function TargetAudience() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section className="mvx-home" style={{ padding: "104px 56px", background: "var(--panel)", borderTop: "1.5px solid var(--divider)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
        <div>
          <span style={eyebrow}>Para quién</span>
          <h2 style={{ fontFamily: F, fontSize: 44, fontWeight: 800, lineHeight: 1.08, color: "var(--text)", letterSpacing: "-0.03em", margin: "14px 0 22px" }}>
            Diseñado para quienes cuidan su salud.
          </h2>
          <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.72, color: "var(--text-mut)", margin: 0, maxWidth: 420 }}>
            Y también para los familiares que acompañan el tratamiento de un ser querido.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {AUDIENCE.map((a) => (
            <div key={a} className="mvx-card" style={{ background: "var(--card)", border: "1.5px solid var(--card-border)", borderRadius: 14, display: "flex", alignItems: "center", gap: 16, padding: "22px 26px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{a}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
