'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type InternalRole = 'paciente' | 'doctor';
type RoleSelection = 'patient' | 'doctor';

interface SignInResult {
  error?: string;
  user?: { name: string; isAdmin: boolean };
}

export interface AuthSignInProps {
  onSignIn: (credentials: SignInFormData) => Promise<SignInResult>;
  onSuccess?: (user: { name: string; isAdmin: boolean }) => void;
  onGoogleSignIn?: (role: RoleSelection) => void;
  oauthError?: string;
  brandName?: string;
  accentColor?: string;
  imageQuote?: string;
  imageAuthor?: string;
  imageAuthorRole?: string;
  homeHref?: string;
  signUpHref?: string;
  forgotPasswordHref?: string;
  adminRedirectLabel?: string;
  userRedirectLabel?: string;
  imageSrc?: string;
  logoNode?: React.ReactNode;
}

// ─── CSS injection ────────────────────────────────────────────────────────────

const F = "'Sora', sans-serif";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

.mxl, .mxl *, .mxl *::before, .mxl *::after { box-sizing: border-box; }
.mxl {
  --mxl-accent: #00c9a7;
  font-family: ${F};
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef0f1;
  padding: 32px;
}

.mxl-card {
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 620px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,.08);
}

.mxl-brand {
  position: relative;
  width: 40%;
  flex-shrink: 0;
  background: linear-gradient(155deg,#0d2a26 0%,#08201d 55%,#041513 100%);
  padding: 34px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mxl-brand::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 78% 18%, rgba(0,201,167,.22), transparent 52%);
}
.mxl-brand-inner { position: relative; }

.mxl-form {
  flex: 1;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
}

.mxl-input {
  width: 100%;
  border: 1.5px solid #ececec;
  background: #fafafa;
  border-radius: 12px;
  padding: 15px 16px 15px 46px;
  font-family: ${F};
  font-size: 15px;
  color: #0a0a0a;
  outline: none;
  transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
.mxl-input::placeholder { color: #9a9a9a; }
.mxl-input:focus {
  border-color: var(--mxl-accent);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0,201,167,.12);
}

.mxl-cta {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-family: ${F};
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: var(--mxl-accent);
  cursor: pointer;
  transition: transform .2s cubic-bezier(.2,.85,.25,1), box-shadow .25s ease, opacity .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.mxl-cta:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,201,167,.4); }
.mxl-cta:active:not(:disabled) { transform: translateY(0) scale(.99); }
.mxl-cta:disabled { opacity: .65; cursor: not-allowed; }
.mxl-arrow { display: inline-block; transition: transform .25s cubic-bezier(.2,.85,.25,1); }
.mxl-cta:hover:not(:disabled) .mxl-arrow { transform: translateX(5px); }

.mxl-soc {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1.5px solid #ececec;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  font-family: ${F};
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .2s ease, background .2s ease;
}
.mxl-soc:hover { border-color: #cfcfcf; background: #fafafa; }
.mxl-soc b { font-weight: 700; }

.mxl-link {
  color: #00a98c;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
}
.mxl-link:hover { text-decoration: underline; }

.mxl-eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #9a9a9a;
  background: none;
  border: none;
  padding: 0;
  display: flex;
}
.mxl-eye:hover { color: #555; }

.mxl-toggle {
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 26px;
  background: #e4e4e4;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background .25s ease;
  flex-shrink: 0;
}
.mxl-toggle.on { background: var(--mxl-accent); }
.mxl-toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
  transition: left .25s cubic-bezier(.5,1.5,.5,1);
}
.mxl-toggle.on::after { left: 25px; }

.mxl-seg {
  display: flex;
  gap: 6px;
  background: #f1f1f1;
  border-radius: 14px;
  padding: 5px;
}
.mxl-rt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 10px;
  border-radius: 11px;
  font-family: ${F};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  color: #8a8a8a;
  background: transparent;
  border: none;
  transition: all .22s cubic-bezier(.2,.85,.25,1);
}
.mxl-rt svg { stroke: #9a9a9a; transition: stroke .2s ease; }
.mxl-rt .mxl-check { display: none; }
.mxl[data-role="paciente"] .mxl-rt-pac,
.mxl[data-role="doctor"] .mxl-rt-doc {
  background: var(--mxl-accent);
  color: #fff;
  box-shadow: 0 8px 20px rgba(0,201,167,.32);
}
.mxl[data-role="paciente"] .mxl-rt-pac svg,
.mxl[data-role="doctor"] .mxl-rt-doc svg { stroke: #fff; }
.mxl[data-role="paciente"] .mxl-rt-pac .mxl-check,
.mxl[data-role="doctor"] .mxl-rt-doc .mxl-check { display: inline-flex; }

.mxl-divider { display: flex; align-items: center; gap: 12px; }
.mxl-divider .mxl-line { flex: 1; height: 1px; background: #eee; }
.mxl-divider span { font-size: 12px; color: #aaa; white-space: nowrap; }

.mxl-overline {
  font-size: 11px;
  font-weight: 700;
  color: #aaa;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.mxl-error {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-family: ${F};
  font-weight: 500;
  background: rgba(247,45,45,.08);
  color: #d42020;
  border: 1px solid rgba(247,45,45,.2);
  margin-bottom: 14px;
}

.mxl-logo-m { display: none; }
.mxl-only-d { display: none !important; }

@media (max-width: 720px) {
  .mxl {
    padding: 0;
    background: #fafafa;
    align-items: stretch;
  }
  .mxl-card {
    flex-direction: column;
    justify-content: center;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;
    background: #fafafa;
    padding: 24px;
  }
  .mxl-brand { display: none; }
  .mxl-form {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    justify-content: center;
    background: #fff;
    border-radius: 22px;
    padding: 34px 28px;
    box-shadow: 0 10px 40px rgba(0,0,0,.06);
  }
  .mxl-only-a { display: none !important; }
  .mxl-only-d { display: flex !important; }
  .mxl-logo-m { display: flex; }
  .mxl-row { flex-direction: column; align-items: flex-start !important; gap: 12px; }
  .mxl-soc-role { display: none; }
}
`;

let stylesInjected = false;
function useStyles() {
  if (typeof document !== 'undefined' && !stylesInjected) {
    const tag = document.createElement('style');
    tag.setAttribute('data-mxl-login', '');
    tag.textContent = CSS;
    document.head.appendChild(tag);
    stylesInjected = true;
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Logo = ({ size = 20, color = '#00c9a7' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  </svg>
);

const IconPatient = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
  </svg>
);

const IconDoctor = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4v6a6 6 0 0 0 12 0V4" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const Check = () => (
  <span className="mxl-check">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-7.8z" />
    <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8L6 14.4z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.4L6 10.2c.9-2.6 3.2-4.8 6-4.8z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuthSignIn({
  onSignIn,
  onSuccess,
  onGoogleSignIn,
  oauthError,
  brandName = 'Metavix',
  accentColor = '#00c9a7',
  imageQuote = 'Metavix transformó la forma en que atendemos a nuestros pacientes.',
  imageAuthor = 'Dr. Ramses Valenzuela',
  imageAuthorRole = 'Diabetólogo y Educador',
  homeHref = '/',
  signUpHref = '/register',
  forgotPasswordHref = '/forgot-password',
  adminRedirectLabel = 'Entrando al panel de administración...',
  userRedirectLabel = 'Preparando tu experiencia...',
}: AuthSignInProps): React.ReactElement {
  useStyles();

  const [role, setRole] = useState<InternalRole>('paciente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(oauthError ?? null);
  const [redirecting, setRedirecting] = useState<{ name: string; isAdmin: boolean } | null>(null);

  const roleLabel = role === 'doctor' ? 'Doctor' : 'Paciente';
  const externalRole: RoleSelection = role === 'doctor' ? 'doctor' : 'patient';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;
    setApiError(null);
    setIsSubmitting(true);
    try {
      const result = await onSignIn({ email, password, rememberMe: remember });
      if (result.error) {
        setApiError(result.error);
      } else if (result.user) {
        setRedirecting(result.user);
        setTimeout(() => onSuccess?.(result.user!), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Redirecting overlay ──
  if (redirecting) {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#101010',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '2.4rem', zIndex: 9999,
      }}>
        <span style={{ fontFamily: F, fontSize: '1.875rem', fontWeight: 700, letterSpacing: '0.16em', color: 'white' }}>
          {brandName}
        </span>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: F, fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>
            Bienvenido{redirecting.name ? `, ${redirecting.name}` : ''}
          </p>
          <p style={{ fontFamily: F, fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
            {redirecting.isAdmin ? adminRedirectLabel : userRedirectLabel}
          </p>
        </div>
        <div style={{ width: '120px', height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'white', borderRadius: '9999px', animation: 'fullWidth 1.8s ease forwards' }} />
        </div>
      </div>
    );
  }

  const rootStyle = { ['--mxl-accent' as string]: accentColor } as React.CSSProperties;

  return (
    <div className="mxl" data-role={role} style={rootStyle}>
      <div className="mxl-card">

        {/* ── Brand panel (desktop) ── */}
        <aside className="mxl-brand">
          <div className="mxl-brand-inner" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Logo color={accentColor} />
            <span style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '.18em' }}>{brandName.toUpperCase()}</span>
          </div>
          <div className="mxl-brand-inner" style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: 34, lineHeight: 1, color: 'rgba(0,201,167,.55)', fontWeight: 800 }}>&ldquo;</div>
            <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.32, color: '#fff', margin: '4px 0 22px', letterSpacing: '-.02em' }}>{imageQuote}</p>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{imageAuthor}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{imageAuthorRole}</div>
          </div>
        </aside>

        {/* ── Form ── */}
        <form className="mxl-form" onSubmit={handleSubmit}>

          {/* top bar */}
          <div className="mxl-only-a" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link className="mxl-link" href={homeHref} style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Volver al inicio
            </Link>
            <span style={{ fontSize: 13, color: '#777' }}>
              ¿Sin cuenta? <Link className="mxl-link" href={signUpHref}>Regístrate</Link>
            </span>
          </div>

          {/* top bar (mobile) */}
          <Link className="mxl-only-d mxl-link" href={homeHref} style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Volver al inicio
          </Link>

          {/* logo (mobile) */}
          <div className="mxl-logo-m" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#e6faf7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Logo size={26} color={accentColor} />
            </div>
          </div>

          {/* titles */}
          <div className="mxl-only-a" style={{ marginTop: 14, display: 'block' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-.03em', margin: 0 }}>¡Hola de nuevo!</h2>
            <p style={{ fontSize: 14, color: '#888', margin: '6px 0 0' }}>Primero dinos quién eres, luego ingresa.</p>
          </div>
          <div className="mxl-only-d" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ fontSize: 23, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-.03em', margin: 0 }}>
              Inicia sesión como {roleLabel}
            </h2>
            <p style={{ fontSize: 13, color: '#999', margin: '6px 0 0' }}>Bienvenido a {brandName}</p>
          </div>

          {/* role selector */}
          <div style={{ marginTop: 18 }}>
            <div className="mxl-overline mxl-only-a" style={{ marginBottom: 9, display: 'block' }}>Inicio de sesión como</div>
            <div className="mxl-seg">
              <button type="button" className="mxl-rt mxl-rt-pac" onClick={() => setRole('paciente')} aria-pressed={role === 'paciente'}>
                <IconPatient />
                Paciente
                <Check />
              </button>
              <button type="button" className="mxl-rt mxl-rt-doc" onClick={() => setRole('doctor')} aria-pressed={role === 'doctor'}>
                <IconDoctor />
                Doctor
                <Check />
              </button>
            </div>
          </div>

          {/* error banner */}
          {apiError && <div className="mxl-error" style={{ marginTop: 14 }}>{apiError}</div>}

          {/* fields */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" />
              </svg>
              <input
                className="mxl-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                className="mxl-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button type="button" className="mxl-eye" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPw
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                    : <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* remember + forgot */}
          <div className="mxl-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#555', cursor: 'pointer' }}>
              <button type="button" className={`mxl-toggle${remember ? ' on' : ''}`} onClick={() => setRemember(r => !r)} aria-pressed={remember} aria-label="Recordarme" />
              Recordarme
            </label>
            <Link className="mxl-link" href={forgotPasswordHref} style={{ fontSize: 13 }}>¿Olvidaste tu contraseña?</Link>
          </div>

          {/* CTA */}
          <button type="submit" className="mxl-cta" style={{ marginTop: 16 }} disabled={isSubmitting}>
            {isSubmitting
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Entrando...</>
              : <>Acceder como {roleLabel} <span className="mxl-arrow">→</span></>
            }
          </button>

          {/* divider */}
          <div className="mxl-divider" style={{ margin: '16px 0' }}>
            <span className="mxl-line" />
            <span>o continúa como {roleLabel} con</span>
            <span className="mxl-line" />
          </div>

          {/* Google */}
          <button type="button" className="mxl-soc" onClick={() => onGoogleSignIn?.(externalRole)}>
            <GoogleIcon />
            <span>Continuar con Google<span className="mxl-soc-role"> como <b>{roleLabel}</b></span></span>
          </button>

          {/* footer (mobile) */}
          <p className="mxl-only-d" style={{ justifyContent: 'center', fontSize: 13, color: '#888', marginTop: 18 }}>
            ¿No tienes cuenta?&nbsp;<a className="mxl-link" href={signUpHref}>Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  );
}
