'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor';
}

interface RegisterResult {
  error?: string;
  success?: string;
}

type RoleSelection = 'patient' | 'doctor';
type InternalRole = 'paciente' | 'doctor';

interface AuthSignUpProps {
  onRegister: (data: RegisterData) => Promise<RegisterResult>;
  onGoogleSignUp?: (role: RoleSelection) => void;
  brandName?: string;
  accentColor?: string;
  signInHref?: string;
  title?: string;
  subtitle?: string;
  defaultRole?: RoleSelection;
}

const F = "'Sora', sans-serif";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

.mxs, .mxs *, .mxs *::before, .mxs *::after { box-sizing: border-box; }
.mxs {
  --mxs-accent: #00c9a7;
  font-family: ${F};
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef1f0;
  padding: 32px;
}

.mxs-card {
  display: flex;
  width: 100%;
  max-width: 980px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,.12);
}

.mxs-brand {
  position: relative;
  width: 40%;
  flex-shrink: 0;
  background: linear-gradient(155deg,#0d2a26 0%,#08201d 55%,#041513 100%);
  padding: 38px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mxs-brand::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 78% 18%, rgba(0,201,167,.22), transparent 52%);
}
.mxs-brand-inner { position: relative; }

.mxs-form {
  flex: 1;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
}

.mxs-lbl {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
  display: block;
}
.mxs-lbl span { color: #00a98c; }

.mxs-input {
  width: 100%;
  border: 1.5px solid #ececec;
  background: #fafafa;
  border-radius: 12px;
  padding: 14px 15px;
  font-family: ${F};
  font-size: 14.5px;
  color: #0a0a0a;
  outline: none;
  transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
}
.mxs-input::placeholder { color: #9a9a9a; }
.mxs-input:focus {
  border-color: var(--mxs-accent);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0,201,167,.12);
}

.mxs-cta {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-family: ${F};
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: var(--mxs-accent);
  cursor: pointer;
  transition: transform .2s cubic-bezier(.2,.85,.25,1), box-shadow .25s ease, opacity .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.mxs-cta:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(0,201,167,.4); }
.mxs-cta:active:not(:disabled) { transform: translateY(0) scale(.99); }
.mxs-cta:disabled { opacity: .65; cursor: not-allowed; }

.mxs-soc {
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
  transition: border-color .2s ease, background .2s ease;
}
.mxs-soc:hover { border-color: #cfcfcf; background: #fafafa; }

.mxs-link {
  color: #00a98c;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
}
.mxs-link:hover { text-decoration: underline; }

.mxs-eye {
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
.mxs-eye:hover { color: #555; }

.mxs-seg {
  display: flex;
  gap: 6px;
  background: #f1f1f1;
  border-radius: 14px;
  padding: 5px;
}
.mxs-rt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 10px;
  border-radius: 11px;
  font-family: ${F};
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  color: #8a8a8a;
  background: transparent;
  border: none;
  transition: all .22s cubic-bezier(.2,.85,.25,1);
}
.mxs-rt svg { stroke: #9a9a9a; transition: stroke .2s ease; }
.mxs-rt .mxs-check { display: none; }
.mxs[data-role="paciente"] .mxs-rt-pac,
.mxs[data-role="doctor"] .mxs-rt-doc {
  background: var(--mxs-accent);
  color: #fff;
  box-shadow: 0 8px 20px rgba(0,201,167,.32);
}
.mxs[data-role="paciente"] .mxs-rt-pac svg,
.mxs[data-role="doctor"] .mxs-rt-doc svg { stroke: #fff; }
.mxs[data-role="paciente"] .mxs-rt-pac .mxs-check,
.mxs[data-role="doctor"] .mxs-rt-doc .mxs-check { display: inline-flex; }

.mxs-divider { display: flex; align-items: center; gap: 12px; }
.mxs-divider .mxs-line { flex: 1; height: 1px; background: #eee; }
.mxs-divider span { font-size: 12px; color: #aaa; white-space: nowrap; }

.mxs-overline {
  font-size: 11px;
  font-weight: 700;
  color: #aaa;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.mxs-feat { display: flex; align-items: center; gap: 11px; }
.mxs-feat-ico {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(0,201,167,.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mxs-error {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-family: ${F};
  font-weight: 500;
  background: rgba(247,45,45,.08);
  color: #d42020;
  border: 1px solid rgba(247,45,45,.2);
}
.mxs-success {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-family: ${F};
  font-weight: 500;
  background: rgba(59,150,32,.08);
  color: #2d7a18;
  border: 1px solid rgba(59,150,32,.2);
}

@keyframes mxsPulse { 0%,100%{ opacity:1; } 50%{ opacity:.45; } }

.mxs-logo-m { display: none; }

@media (max-width: 720px) {
  .mxs { padding: 0; background: #fafafa; align-items: stretch; }
  .mxs-card {
    flex-direction: column;
    max-width: 100%;
    min-height: 100vh;
    border-radius: 0;
    box-shadow: none;
    background: #fafafa;
    padding: 24px;
    justify-content: center;
  }
  .mxs-brand { display: none; }
  .mxs-form {
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    background: #fff;
    border-radius: 22px;
    padding: 30px 24px;
    box-shadow: 0 10px 40px rgba(0,0,0,.06);
  }
  .mxs-logo-m { display: flex; }
  .mxs-row { flex-direction: column !important; gap: 13px !important; }
}
`;

let stylesInjected = false;
function useStyles() {
  if (typeof document !== 'undefined' && !stylesInjected) {
    const tag = document.createElement('style');
    tag.setAttribute('data-mxs-signup', '');
    tag.textContent = CSS;
    document.head.appendChild(tag);
    stylesInjected = true;
  }
}

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
  <span className="mxs-check">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    }
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-7.8z" />
    <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8L6 14.4z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.4L6 10.2c.9-2.6 3.2-4.8 6-4.8z" />
  </svg>
);

const toCallback = (r: InternalRole): RoleSelection => (r === 'paciente' ? 'patient' : 'doctor');

export default function AuthSignUp({
  onRegister,
  onGoogleSignUp,
  brandName = 'Metavix',
  accentColor = '#00c9a7',
  signInHref = '/login',
  title = 'Únete a Metavix',
  subtitle = 'Regístrate como especialista o paciente y transforma tu experiencia.',
  defaultRole = 'doctor',
}: AuthSignUpProps): React.ReactElement {
  useStyles();

  const [role, setRole] = useState<InternalRole>(defaultRole === 'patient' ? 'paciente' : 'doctor');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validate = (): string | null => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      return 'Completa todos los campos';
    }
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir al menos una mayúscula';
    if (!/\d/.test(password)) return 'La contraseña debe incluir al menos un dígito';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const err = validate();
    if (err) {
      setStatus({ type: 'error', message: err });
      return;
    }
    setStatus(null);
    setIsSubmitting(true);
    try {
      const result = await onRegister({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: toCallback(role),
      });
      if (result.error) setStatus({ type: 'error', message: result.error });
      else if (result.success) setStatus({ type: 'success', message: result.success });
    } finally {
      setIsSubmitting(false);
    }
  };

  const rootStyle: React.CSSProperties = { ['--mxs-accent' as string]: accentColor } as React.CSSProperties;

  return (
    <div className="mxs" data-role={role} style={rootStyle}>
      <div className="mxs-card">

        <aside className="mxs-brand">
          <div className="mxs-brand-inner" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Logo color={accentColor} />
            <span style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '.18em' }}>{brandName.toUpperCase()}</span>
          </div>

          <div className="mxs-brand-inner" style={{ marginTop: 42 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, color: '#fff', margin: 0, letterSpacing: '-.03em' }}>{title}</h1>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,.62)', margin: '14px 0 0' }}>{subtitle}</p>
          </div>

          <div className="mxs-brand-inner" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="mxs-feat">
              <span className="mxs-feat-ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.78)' }}>Registros y lecturas en un solo lugar</span>
            </div>
            <div className="mxs-feat">
              <span className="mxs-feat-ico">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z" /><path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,.78)' }}>Cumplimiento HIPAA · datos cifrados</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 6, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.1)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, animation: 'mxsPulse 2s infinite' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>+12,400 pacientes monitoreados a diario</span>
            </div>
          </div>
        </aside>

        <form className="mxs-form" onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 13, color: '#777' }}>
              ¿Ya tienes cuenta? <Link className="mxs-link" href={signInHref}>Inicia sesión</Link>
            </span>
          </div>

          <div className="mxs-logo-m" style={{ justifyContent: 'center', marginTop: 4 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#e6faf7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Logo size={26} color={accentColor} />
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-.03em', margin: '10px 0 0' }}>Crea tu cuenta</h2>

          <div style={{ marginTop: 18 }}>
            <div className="mxs-overline" style={{ marginBottom: 9 }}>Soy...</div>
            <div className="mxs-seg">
              <button type="button" className="mxs-rt mxs-rt-doc" onClick={() => setRole('doctor')} aria-pressed={role === 'doctor'}>
                <IconDoctor />
                Médico especialista
                <Check />
              </button>
              <button type="button" className="mxs-rt mxs-rt-pac" onClick={() => setRole('paciente')} aria-pressed={role === 'paciente'}>
                <IconPatient />
                Paciente
                <Check />
              </button>
            </div>
          </div>

          {status && (
            <div className={status.type === 'success' ? 'mxs-success' : 'mxs-error'} style={{ marginTop: 14 }}>
              {status.message}
            </div>
          )}

          <div className="mxs-row" style={{ marginTop: 14, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="mxs-lbl">Nombre<span>*</span></label>
              <input className="mxs-input" placeholder="Tu nombre" value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" required />
            </div>
            <div style={{ flex: 1 }}>
              <label className="mxs-lbl">Apellido<span>*</span></label>
              <input className="mxs-input" placeholder="Tu apellido" value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" required />
            </div>
          </div>

          <div style={{ marginTop: 13 }}>
            <label className="mxs-lbl">Email<span>*</span></label>
            <input className="mxs-input" type="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          </div>

          <div className="mxs-row" style={{ marginTop: 13, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="mxs-lbl">Contraseña<span>*</span></label>
              <div style={{ position: 'relative' }}>
                <input className="mxs-input" type={showPw ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
                <button type="button" className="mxs-eye" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label className="mxs-lbl">Confirmar contraseña<span>*</span></label>
              <div style={{ position: 'relative' }}>
                <input className="mxs-input" type={showPw2 ? 'text' : 'password'} placeholder="Repite tu contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" required />
                <button type="button" className="mxs-eye" onClick={() => setShowPw2(s => !s)} aria-label={showPw2 ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <EyeIcon open={showPw2} />
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="mxs-cta" style={{ marginTop: 20 }} disabled={isSubmitting}>
            {isSubmitting
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creando cuenta...</>
              : 'Crear mi cuenta ahora'
            }
          </button>

          <div className="mxs-divider" style={{ margin: '16px 0' }}>
            <span className="mxs-line" />
            <span>o regístrate con</span>
            <span className="mxs-line" />
          </div>

          <button type="button" className="mxs-soc" onClick={() => onGoogleSignUp?.(toCallback(role))}>
            <GoogleIcon />
            Registrarse con Google
          </button>

          <p style={{ fontSize: 11.5, color: '#aaa', textAlign: 'center', lineHeight: 1.5, margin: '16px 0 0' }}>
            Al crear tu cuenta aceptas los <a className="mxs-link" href="#">Términos</a> y la <a className="mxs-link" href="#">Política de privacidad</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
