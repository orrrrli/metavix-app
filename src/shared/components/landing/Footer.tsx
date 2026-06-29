"use client";

import { useLandingStyles } from "./useLandingStyles";

const F = "'Sora', sans-serif";

const LINKS = [
  { label: "Características", href: "#registrar" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Para médicos", href: "#medicos" },
];

export function Footer() {
  useLandingStyles();

  return (
    <footer
      className="mvx-footer"
      style={{
        padding: "52px 56px",
        background: "#fafafa",
        borderTop: "1.5px solid #f2f2f2",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00c9a7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
          <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.03em" }}>Metavix</span>
        </div>
        <div className="mvx-footer-links" style={{ display: "flex", gap: 30 }}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{ fontFamily: F, fontSize: 14, color: "#666666", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
        </div>
        <span style={{ fontFamily: F, fontSize: 13, color: "#bbbbbb" }}>
          © {new Date().getFullYear()} Metavix · Salud personal digital
        </span>
      </div>
    </footer>
  );
}
