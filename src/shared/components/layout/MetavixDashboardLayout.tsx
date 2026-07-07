"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { NavigationLoader } from "@/shared/components/ui/navigation-loader";

/**
 * MetavixDashboardLayout — marco del dashboard con identidad Metavix:
 * sidebar de navegación + topbar + (opcional) CTA flotante + slot de contenido.
 *
 * El layout no toca auth ni store: recibe userName, role label, onLogout,
 * etc. por props. El padre (app/(rol)/layout.tsx) lee el store y pasa los
 * datos. Esto mantiene la separación shared/ sin imports hacia features/.
 *
 * Define las variables de tema (colores clínicos, dark mode, --accent)
 * sobre el wrapper `.mvx-dash`. Las piezas de contenido (MetavixUltimaLectura,
 * MetavixProgresoDia, etc.) se renderizan como children y heredan esas
 * variables vía cascada CSS.
 */

export interface MetavixNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  muted?: boolean;
  external?: boolean;
}

export interface MetavixCta {
  label: string;
  onClick: () => void;
}

export interface MetavixDashboardLayoutProps {
  userName: string;
  userRoleLabel: string;
  onLogout: () => void;
  title: string;
  navItems: MetavixNavItem[];

  profileHref?: string;
  userInitials?: string;
  brand?: string;
  toolsItems?: MetavixNavItem[];
  navLabel?: string;
  toolsLabel?: string;
  cta?: MetavixCta;
  greetingPrefix?: string;
  subSaludo?: React.ReactNode;
  accent?: string;
  children?: React.ReactNode;
}

const F = "'Sora', sans-serif";

const ICON = {
  inicio: <path d="M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />,
  historial: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="14" x2="15" y2="14" />
      <line x1="9" y1="18" x2="13" y2="18" />
    </>
  ),
  metas: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  medicos: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  curvas: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </>
  ),
  imc: (
    <>
      <path d="M12 3v6" />
      <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z" />
    </>
  ),
  hba1c: (
    <>
      <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
      <path d="M8 3h8" />
    </>
  ),
  mas: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </>
  ),
  whatsapp: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />,
};

function Icon({ children, size = 19 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export default function MetavixDashboardLayout({
  userName,
  userRoleLabel,
  userInitials: userInitialsProp,
  onLogout,
  title,
  navItems,
  toolsItems,
  profileHref,
  brand = "Metavix",
  navLabel = "Principal",
  toolsLabel = "Herramientas",
  cta,
  greetingPrefix = "Hola, ",
  subSaludo,
  accent = "#00c9a7",
  children,
}: MetavixDashboardLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- needed to avoid hydration mismatch with next-themes
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menus on route change
    setProfileOpen(false);
    setNavOpen(false);
  }, [pathname]);

  const isDark = mounted && theme === "dark";

  const userInitials = userInitialsProp
    ?? userName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase();
  const firstName = userName.split(" ")[0] || userName;
  const saludo = `${greetingPrefix}${firstName}`;

  const rootStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    background: "var(--canvas)",
    fontFamily: F,
    ["--accent" as string]: accent,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.13em",
    color: "var(--soft)",
    padding: "6px 10px",
    textTransform: "uppercase",
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    if (!window.confirm("¿Cerrar sesión?")) return;
    onLogout();
    window.location.href = "/";
  };

  return (
    <div className="mvx-dash" style={rootStyle}>
      {/* backdrop del drawer (solo visible en <lg) */}
      <div
        className={`mvxdl-backdrop${navOpen ? " open" : ""}`}
        onClick={() => setNavOpen(false)}
        aria-hidden={!navOpen}
      />

      {/* ════ SIDEBAR ════ */}
      <aside className={`mvxdl-sidebar${navOpen ? " open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 8px 22px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
          <span style={{ fontSize: 19, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>{brand}</span>
        </div>

        <div style={sectionLabel}>{navLabel}</div>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mvxdl-nav${active ? " on" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {toolsItems && toolsItems.length > 0 && (
          <>
            <div style={{ ...sectionLabel, paddingTop: 22 }}>{toolsLabel}</div>
            {toolsItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mvxdl-nav${active ? " on" : ""}`}
                  style={item.muted ? { color: "var(--soft)", fontSize: 13.5 } : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </>
        )}

        <div style={{ marginTop: "auto", paddingTop: 22 }}>
          <a
            className="mvxdl-nav"
            href="https://wa.me/523121355297"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: "var(--ok-bg)", color: "var(--ok)", fontWeight: 600 }}
          >
            <Icon>{ICON.whatsapp}</Icon>
            Soporte por WhatsApp
          </a>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* topbar */}
        <header
          className="mvxdl-topbar"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "0 40px",
            height: 66,
            background: "var(--topbar)",
            borderBottom: "1.5px solid var(--bd)",
          }}
        >
          <button
            type="button"
            className="mvxdl-hamburger"
            onClick={() => setNavOpen(true)}
            aria-label="Abrir menú de navegación"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{title}</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
            <button
              className="mvxdl-toggle"
              onClick={handleToggleTheme}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {/* En claro se ve la luna (clic → oscuro); en oscuro el sol (clic → claro). Alternancia por CSS vía .dark */}
              <svg className="mvxdl-icon-moon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg className="mvxdl-icon-sun" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Abrir menú de perfil"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: F,
                }}
              >
                <div className="mvxdl-usermeta" style={{ textAlign: "right", lineHeight: 1.25, whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)" }}>{userName}</div>
                  <div style={{ fontSize: 11.5, color: "var(--soft)" }}>{userRoleLabel}</div>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#03251d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    boxShadow: profileOpen ? "0 0 0 3px var(--nav-active-bg)" : "none",
                    transition: "box-shadow .2s",
                  }}
                >
                  {userInitials}
                </div>
              </button>
              {profileOpen && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    minWidth: 220,
                    background: "var(--card)",
                    border: "1.5px solid var(--card-bd)",
                    borderRadius: 14,
                    boxShadow: "0 18px 40px rgba(20,40,30,.16)",
                    padding: 6,
                    zIndex: 50,
                    fontFamily: F,
                  }}
                >
                  {profileHref && (
                    <Link
                      href={profileHref}
                      role="menuitem"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "10px 12px",
                        borderRadius: 9,
                        textDecoration: "none",
                        color: "var(--text)",
                        fontSize: 14,
                        fontWeight: 600,
                        transition: "background-color .15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--nav-active-bg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Ver perfil
                    </Link>
                  )}
                  {profileHref && <div style={{ height: 1, background: "var(--bd)", margin: "4px 8px" }} />}
                  <button
                    type="button"
                    onClick={handleLogout}
                    role="menuitem"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: "10px 12px",
                      borderRadius: 9,
                      background: "transparent",
                      border: "none",
                      color: "var(--bad)",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: F,
                      textAlign: "left",
                      transition: "background-color .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bad-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* contenido */}
        <main className="mvxdl-main" style={{ flex: 1, padding: "34px 40px 120px", maxWidth: 1240, width: "100%" }}>
          <NavigationLoader>
            <div style={{ marginBottom: 26 }}>
              <h1
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                  margin: "0 0 4px",
                }}
              >
                {saludo}
              </h1>
              <p style={{ fontSize: 14.5, color: "var(--mut)", margin: 0 }}>
                {subSaludo}
              </p>
            </div>
            {children}
          </NavigationLoader>
        </main>
      </div>

      {/* ════ CTA FLOTANTE ════ */}
      {cta && (
        <button className="mvxdl-fab" aria-label={cta.label} onClick={cta.onClick}>
          <span className="mvxdl-fp">+</span> {cta.label}
        </button>
      )}
    </div>
  );
}
