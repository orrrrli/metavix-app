"use client";

import React, { useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

@keyframes mvxSweep { from { left:-60%; } to { left:135%; } }
@keyframes mvxLivePulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.4; transform:scale(.8); } }
@keyframes mvxRowIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

.mvx-hero {
  --accent:#00c9a7;
  --bg:#ffffff; --panel:#fafafa; --nav-border:#f2f2f2; --divider:#f2f2f2;
  --logo:#0a0a0a; --nav-link:#666666;
  --text:#0a0a0a; --text-mut:#555555;
  --row-border:#ebebeb; --row-label:#aaaaaa; --row-val:#0a0a0a; --row-unit:#cccccc;
  --icon-bg:#e6faf7; --muted:#bbbbbb; --hl-text:#ffffff;
  --sec-text:#0a0a0a; --sec-border:#dddddd;
  --nav-cta-bg:#0a0a0a; --nav-cta-text:#ffffff; --primary-text:#ffffff;
  --add-bg:#0a0a0a; --add-text:#ffffff;
  --toggle-track:#e9e9e9; --toggle-knob:#0a0a0a;
}
.mvx-hero.dark {
  --bg:#0b1929; --panel:#0e2032; --nav-border:rgba(255,255,255,0.06); --divider:rgba(255,255,255,0.06);
  --logo:#ffffff; --nav-link:rgba(255,255,255,0.42);
  --text:#ffffff; --text-mut:rgba(255,255,255,0.5);
  --row-border:rgba(255,255,255,0.08); --row-label:rgba(255,255,255,0.4); --row-val:#ffffff; --row-unit:rgba(255,255,255,0.35);
  --icon-bg:rgba(0,201,167,0.12); --muted:rgba(255,255,255,0.3); --hl-text:#03251d;
  --sec-text:rgba(255,255,255,0.62); --sec-border:rgba(255,255,255,0.16);
  --nav-cta-bg:var(--accent); --nav-cta-text:#03251d; --primary-text:#03251d;
  --add-bg:var(--accent); --add-text:#03251d;
  --toggle-track:rgba(255,255,255,0.12); --toggle-knob:var(--accent);
}

.mvx-hero, .mvx-hero * { transition: background-color .5s ease, color .4s ease, border-color .5s ease, fill .4s ease, stroke .4s ease; }

.mvx-btn { transition: background-color .5s ease, color .4s ease, border-color .5s ease, transform .28s cubic-bezier(.2,.85,.25,1), box-shadow .3s ease; }
.mvx-btn:active { transform: translateY(-1px) scale(.97); }
.mvx-arrow { display:inline-block; transition: transform .28s cubic-bezier(.2,.85,.25,1); }
.mvx-btn-primary:hover .mvx-arrow { transform: translateX(6px); }
.mvx-shine { position:absolute; top:0; left:-60%; width:42%; height:100%; background:linear-gradient(110deg, transparent, rgba(255,255,255,.5), transparent); transform:skewX(-18deg); pointer-events:none; }
.mvx-btn-primary:hover .mvx-shine { animation: mvxSweep .75s ease; }
.mvx-plus { display:inline-block; transition: transform .3s cubic-bezier(.2,.85,.25,1); }
.mvx-add:hover .mvx-plus { transform: rotate(90deg); }

.mvx-btn-primary:hover { transform:translateY(-3px); box-shadow:0 16px 34px rgba(0,201,167,.42); }
.mvx-btn-secondary:hover { transform:translateY(-3px); border-color:var(--accent) !important; color:var(--accent) !important; }
.mvx-nav-cta:hover { transform:translateY(-2px); box-shadow:0 10px 22px rgba(0,201,167,.34); }
.mvx-add:hover { transform:translateY(-2px); box-shadow:0 12px 24px rgba(0,201,167,.4); }

.mvx-navlink { position:relative; cursor:pointer; color:var(--nav-link); text-decoration:none; transition:color .25s ease; }
.mvx-navlink::after { content:''; position:absolute; left:0; right:0; bottom:-7px; height:2px; background:var(--accent); border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform .3s cubic-bezier(.4,0,.2,1); }
.mvx-navlink:hover { color:var(--text); }
.mvx-navlink:hover::after { transform:scaleX(1); }

.mvx-logo { cursor:pointer; display:flex; align-items:center; gap:9px; text-decoration:none; }
.mvx-logo svg { transition: transform .45s cubic-bezier(.3,1.5,.5,1); }
.mvx-logo:hover svg { transform: scale(1.18) rotate(-8deg); }

.mvx-toggle { position:relative; width:58px; height:30px; border-radius:30px; border:none; cursor:pointer; background:var(--toggle-track); padding:0; flex-shrink:0; transition: background-color .5s ease, box-shadow .25s ease; }
.mvx-toggle:hover { box-shadow:0 0 0 4px rgba(0,201,167,.16); }
.mvx-toggle-knob { position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%; background:var(--toggle-knob); box-shadow:0 2px 7px rgba(0,0,0,.3); transition: left .42s cubic-bezier(.5,1.55,.5,1), transform .3s ease, background-color .5s ease; }
.mvx-hero.dark .mvx-toggle-knob { left:31px; }
.mvx-toggle:hover .mvx-toggle-knob { transform: scale(1.08); }
.mvx-knob-ico { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); transition:opacity .3s ease; }
.mvx-knob-moon { opacity:0; }
.mvx-hero.dark .mvx-knob-sun { opacity:0; }
.mvx-hero.dark .mvx-knob-moon { opacity:1; }

.mvx-hero-burger { display:none; align-items:center; justify-content:center; width:44px; height:44px; border:none; background:transparent; color:var(--logo); cursor:pointer; border-radius:10px; margin-left:auto; }
.mvx-hero-burger:hover { background:rgba(0,0,0,.05); }
.mvx-hero.dark .mvx-hero-burger:hover { background:rgba(255,255,255,.08); }
.mvx-hero-burger svg { width:22px; height:22px; }
.mvx-hero-drawer { display:none; flex-direction:column; gap:6px; padding:16px 20px 22px; border-top:1.5px solid var(--nav-border); background:var(--bg); }
.mvx-hero-drawer a { padding:14px 12px; border-radius:10px; color:var(--text); text-decoration:none; font-family:'Sora',sans-serif; font-size:15px; font-weight:600; min-height:44px; display:flex; align-items:center; }
.mvx-hero-drawer a:hover { background:rgba(0,201,167,.08); }
.mvx-hero-drawer .mvx-hero-drawer-login { color:var(--text-mut); font-weight:500; }

/* ponytail: !important overrides inline styles for nav/body/headings on Hero */
@media (max-width: 768px) {
  .mvx-hero-nav { padding:0 20px !important; }
  .mvx-hero-nav-links, .mvx-hero-nav-right { display:none !important; }
  .mvx-hero-burger { display:inline-flex; }
  .mvx-hero-body { flex-direction:column !important; }
  .mvx-hero-left { padding:40px 24px 32px !important; border-right:none !important; border-bottom:1.5px solid var(--divider) !important; }
  .mvx-hero-left h1 { font-size:42px !important; line-height:1.05 !important; }
  .mvx-hero-left p { max-width:100% !important; }
  .mvx-hero-ctas { flex-direction:column !important; align-items:stretch !important; gap:10px !important; }
  .mvx-hero-ctas a, .mvx-hero-ctas button { width:100% !important; justify-content:center; }
  .mvx-hero-right { width:100% !important; padding:28px 24px !important; }
  .mvx-hero-min-h { min-height:auto !important; }
  .mvx-hero-hl-pad { padding:2px 10px 4px !important; }
}

@media (max-width: 480px) {
  .mvx-hero-left h1 { font-size:34px !important; }
}
`;

let stylesInjected = false;
function useStyles() {
  if (typeof document !== "undefined" && !stylesInjected) {
    const tag = document.createElement("style");
    tag.setAttribute("data-mvx-hero", "");
    tag.textContent = CSS;
    document.head.appendChild(tag);
    stylesInjected = true;
  }
}

const F = "'Sora', sans-serif";

const METRICS = [
  {
    label: "Glucosa en sangre",
    value: <>98 <span style={{ fontSize: 13, color: "var(--row-unit)", fontWeight: 400 }}>mg/dL</span></>,
    spark: "0,24 15,18 30,21 44,10 58,15 73,6 88,12",
    trend: "↑ 4 vs ayer",
    icon: <path d="M12 2c0 0-7 9.5-7 13.5a7 7 0 0014 0C19 11.5 12 2 12 2z" />,
  },
  {
    label: "Presión arterial",
    value: <>120<span style={{ fontSize: 16, color: "var(--row-unit)", fontWeight: 500 }}>/80</span> <span style={{ fontSize: 13, color: "var(--row-unit)", fontWeight: 400 }}>mmHg</span></>,
    spark: "0,20 15,18 30,19 44,16 58,17 73,15 88,16",
    trend: "Estable · Normal",
    icon: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />,
  },
  {
    label: "Peso corporal",
    value: <>71.4 <span style={{ fontSize: 13, color: "var(--row-unit)", fontWeight: 400 }}>kg</span></>,
    spark: "0,26 15,24 30,23 44,22 58,21 73,20 88,18",
    trend: "↓ 0.6 esta semana",
    icon: <><path d="M12 3a3 3 0 100 6 3 3 0 000-6z" /><path d="M6.343 7.657L3.515 20h17l-2.829-12.343" /></>,
  },
];

export function Hero() {
  useStyles();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDark = () => {
    // Efecto "polygon": barrido diagonal con la View Transitions API.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void | Promise<void>) => { ready: Promise<void> };
    };
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || prefersReduced) {
      setDark((d) => !d);
      return;
    }

    doc.startViewTransition(() => {
      flushSync(() => setDark((d) => !d));
    });
  };

  return (
    <div className={`mvx-hero${dark ? " dark" : ""}`} style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* NAV */}
      <nav className="mvx-hero-nav" style={{ display: "flex", alignItems: "center", padding: "0 56px", height: 68, flexShrink: 0, borderBottom: "1.5px solid var(--nav-border)" }}>
        <Link href="/" className="mvx-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" /></svg>
          <span style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: "var(--logo)", letterSpacing: "-0.03em" }}>Metavix</span>
        </Link>
        <div className="mvx-hero-nav-links" style={{ display: "flex", gap: 36, margin: "0 auto" }}>
          <Link href="/caracteristicas" className="mvx-navlink" style={{ fontFamily: F, fontSize: 14 }}>Características</Link>
          <Link href="/precios" className="mvx-navlink" style={{ fontFamily: F, fontSize: 14 }}>Precios</Link>
          <Link href="/recursos" className="mvx-navlink" style={{ fontFamily: F, fontSize: 14 }}>Recursos</Link>
        </div>
        <div className="mvx-hero-nav-right" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button className="mvx-toggle" onClick={toggleDark} aria-label="Cambiar modo oscuro">
            <span className="mvx-toggle-knob">
              <svg className="mvx-knob-ico mvx-knob-sun" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
              <svg className="mvx-knob-ico mvx-knob-moon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#03251d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" /></svg>
            </span>
          </button>
          <Link href="/login" className="mvx-navlink" style={{ fontFamily: F, fontSize: 14 }}>Iniciar sesión</Link>
          <Link href="/register" style={{ textDecoration: "none" }}>
            <button className="mvx-btn mvx-nav-cta" style={{ background: "var(--nav-cta-bg)", color: "var(--nav-cta-text)", border: "none", borderRadius: 8, padding: "9px 22px", fontFamily: F, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Registrarse</button>
          </Link>
        </div>
        <button className="mvx-hero-burger" onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mvx-hero-drawer" style={{ display: "flex" }}>
          <Link href="/caracteristicas" onClick={() => setMenuOpen(false)}>Características</Link>
          <Link href="/precios" onClick={() => setMenuOpen(false)}>Precios</Link>
          <Link href="/recursos" onClick={() => setMenuOpen(false)}>Recursos</Link>
          <Link href="/login" className="mvx-hero-drawer-login" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
        </div>
      )}

      {/* BODY */}
      <div className="mvx-hero-body" style={{ flex: 1, display: "flex" }}>
        {/* LEFT: copy */}
        <div className="mvx-hero-left" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "52px 56px", borderRight: "1.5px solid var(--divider)" }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Salud personal digital</span>
          </div>
          <h1 style={{ fontFamily: F, fontSize: 66, fontWeight: 800, lineHeight: 1.0, color: "var(--text)", letterSpacing: "-0.04em", margin: "0 0 28px" }}>
            Conoce tu<br />
            cuerpo con<br />
            <span className="mvx-hero-hl-pad" style={{ background: "var(--accent)", color: "var(--hl-text)", padding: "2px 12px 4px", borderRadius: 8, display: "inline-block", lineHeight: 1.18 }}>datos reales.</span>
          </h1>
          <p style={{ fontFamily: F, fontSize: 16, lineHeight: 1.72, color: "var(--text-mut)", margin: "0 0 40px", maxWidth: 400 }}>
            Metavix registra tus métricas vitales y te ayuda a llevar tu historial siempre listo para tu médico.
          </p>
          <div className="mvx-hero-ctas" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button className="mvx-btn mvx-btn-primary" style={{ position: "relative", overflow: "hidden", background: "var(--accent)", color: "var(--primary-text)", border: "none", borderRadius: 10, padding: "14px 28px", fontFamily: F, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>Registrarse gratis <span className="mvx-arrow">→</span></span>
                <span className="mvx-shine" />
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className="mvx-btn mvx-btn-secondary" style={{ background: "transparent", color: "var(--sec-text)", border: "1.5px solid var(--sec-border)", borderRadius: 10, padding: "13px 28px", fontFamily: F, fontSize: 16, cursor: "pointer" }}>Acceder desde la web</button>
            </Link>
          </div>
          <div style={{ marginTop: 26, fontFamily: F, fontSize: 12, color: "var(--muted)", letterSpacing: "0.02em" }}>★ Completamente gratuito para pacientes</div>
        </div>

        {/* RIGHT: metric log */}
        <div className="mvx-hero-right" style={{ width: 540, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "36px 48px", background: "var(--panel)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 14, borderBottom: "1.5px solid var(--row-border)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "mvxLivePulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Registro · 28 jun 2026</span>
          </div>

          {METRICS.map((m, i) => (
            <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: "1.5px solid var(--row-border)", animation: `mvxRowIn .5s ease both ${0.1 * (i + 1)}s` }}>
              <div style={{ width: 40, height: 40, background: "var(--icon-bg)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F, fontSize: 11, color: "var(--row-label)", marginBottom: 3, fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: "var(--row-val)", lineHeight: 1.1 }}>{m.value}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <svg width="88" height="32" viewBox="0 0 88 32" preserveAspectRatio="none" style={{ display: "block" }}><polyline points={m.spark} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{ fontFamily: F, fontSize: 11, color: "#4ade80", marginTop: 3, fontWeight: 600 }}>{m.trend}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <button className="mvx-btn mvx-add" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--add-bg)", color: "var(--add-text)", border: "none", borderRadius: 10, padding: "11px 18px", fontFamily: F, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <span className="mvx-plus" style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> Agregar medición
            </button>
            <span style={{ fontFamily: F, fontSize: 12, color: "var(--muted)" }}>3 registros hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
