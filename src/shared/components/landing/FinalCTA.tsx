"use client";

import React from "react";
import Link from "next/link";
import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

export function FinalCTA() {
  useLandingStyles();

  const eyebrow: React.CSSProperties = {
    fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)",
    letterSpacing: "0.12em", textTransform: "uppercase",
  };

  return (
    <section className="mvx-home" style={{ padding: "120px 56px", background: "var(--bg)", textAlign: "center" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <span style={eyebrow}>Empieza hoy</span>
        <h2 style={{ fontFamily: F, fontSize: 56, fontWeight: 800, lineHeight: 1.04, color: "var(--text)", letterSpacing: "-0.04em", margin: "16px 0 22px" }}>
          Empieza hoy,{" "}
          <span style={{ background: "var(--accent)", color: "var(--hl-text)", padding: "2px 14px 5px", borderRadius: 10, display: "inline-block", lineHeight: 1.18 }}>
            sin costo.
          </span>
        </h2>
        <p style={{ fontFamily: F, fontSize: 17, lineHeight: 1.7, color: "var(--text-mut)", margin: "0 auto 40px", maxWidth: 480 }}>
          Centraliza tu historial de salud y toma mejores decisiones con información siempre disponible.
        </p>
        <Link href="/register" style={{ textDecoration: "none" }}>
          <button className="mvx-btn mvx-btn-primary" style={{ position: "relative", overflow: "hidden", background: "var(--accent)", color: "var(--primary-text)", border: "none", borderRadius: 12, padding: "17px 38px", fontFamily: F, fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
            <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Crear cuenta gratis <span className="mvx-arrow">→</span>
            </span>
            <span className="mvx-shine" />
          </button>
        </Link>
      </div>
    </section>
  );
}
