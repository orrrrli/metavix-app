'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, ArrowLeft, ChevronDown } from 'lucide-react';
import AuthImagePanel from './AuthImagePanel';
import AuthFloatingInput from './AuthFloatingInput';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RegisterData {
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

interface AuthSignUpProps {
  /**
   * Called when the user submits a valid form.
   * Return `{ success }` for a success message or `{ error }` on failure.
   */
  onRegister: (data: RegisterData) => Promise<RegisterResult>;
  /** Optional: called when the Google button is clicked. */
  onGoogleSignUp?: () => void;
  brandName?: string;
  accentColor?: string;
  /** Side panel image */
  imageSrc?: string;
  imageQuote?: string;
  imageAuthor?: string;
  imageAuthorRole?: string;
  /** Route links */
  homeHref?: string;
  signInHref?: string;
  /** Subtitle shown below the heading */
  subtitle?: string;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function validateName(value: string): string | undefined {
  if (!value || value.trim().length < 2) return 'Debe tener al menos 2 caracteres';
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Z]/.test(value)) return 'La contraseña debe incluir al menos una letra mayúscula';
  if (!/[0-9]/.test(value)) return 'La contraseña debe incluir al menos un número';
  return undefined;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuthSignUp({
  onRegister,
  onGoogleSignUp,
  brandName = 'Metavix',
  accentColor = '#00BFA5',
  imageSrc,
  imageQuote = '',
  imageAuthor = '',
  imageAuthorRole = '',
  homeHref = '/',
  signInHref = '/login',
  subtitle = 'Creá tu cuenta para comenzar.',
}: AuthSignUpProps): React.ReactElement {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('doctor');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [lastNameError, setLastNameError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const fnError = validateName(firstName);
    const lnError = validateName(lastName);
    if (fnError) setFirstNameError(fnError);
    if (lnError) setLastNameError(lnError);
    if (fnError || lnError) return;

    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await onRegister({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (result.error) {
        setStatus({ type: 'error', message: result.error });
      } else if (result.success) {
        setStatus({ type: 'success', message: result.success });
      }
    } catch {
      setStatus({ type: 'error', message: 'Algo salió mal. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-white md:bg-[#f2f2f2] flex items-center justify-center md:p-6 p-0 overflow-hidden box-border">
      <div className="w-full max-w-[960px] bg-white md:rounded-[24px] rounded-none md:shadow-[0_4px_48px_rgba(0,0,0,0.1)] shadow-none flex flex-col md:flex-row h-full md:h-auto md:max-h-[90vh] overflow-hidden">
        {/* Left: image panel */}
        {imageSrc && (
          <div className="hidden lg:flex" style={{ width: '400px', flexShrink: 0 }}>
            <AuthImagePanel
              imageSrc={imageSrc}
              quote={imageQuote}
              author={imageAuthor}
              authorRole={imageAuthorRole}
              brandName={brandName}
              brandHref={homeHref}
            />
          </div>
        )}

        {/* Right: form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Back button */}
          <div style={{ padding: '16px 16px 0' }}>
            <Link
              href={homeHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'rgba(0,0,0,0.5)',
                textDecoration: 'none',
                background: 'rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '9999px',
                padding: '6px 14px 6px 10px',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </div>

          {/* Form area */}
          <div className="flex-1 flex flex-col justify-center px-6 py-6 md:px-10 md:py-8 overflow-y-auto">
            <div className="w-full max-w-[360px] mx-auto">
              <h1
                style={{
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  color: '#101010',
                  margin: '0 0 6px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Únete a {brandName}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.2 1.2L3 12l5.8 1.9a2 2 0 0 1 1.2 1.2L12 21l1.9-5.8a2 2 0 0 1 1.2-1.2L21 12l-5.8-1.9a2 2 0 0 1-1.2-1.2Z" />
                </svg>
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '0.875rem',
                  color: 'rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  margin: '0 0 14px',
                }}
              >
                Regístrate como especialista o paciente y transforma tu experiencia.
              </p>

              {/* Status */}
              <div style={{ minHeight: '44px', marginBottom: '4px' }}>
                {status && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontWeight: 500,
                      background:
                        status.type === 'success'
                          ? 'rgba(59,150,32,0.08)'
                          : 'rgba(247,45,45,0.08)',
                      color: status.type === 'success' ? '#2d7a18' : '#d42020',
                      border: `1px solid ${status.type === 'success' ? 'rgba(59,150,32,0.2)' : 'rgba(247,45,45,0.2)'}`,
                    }}
                  >
                    {status.message}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Role selection */}
                <RoleDropdown value={role} onChange={setRole} accentColor={accentColor} />

                {/* First / Last name row */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <AuthFloatingInput
                      label="Nombre"
                      type="text"
                      value={firstName}
                      accentColor={accentColor}
                      onChange={(v) => {
                        setFirstName(v);
                        if (firstNameError) setFirstNameError(validateName(v));
                      }}
                      onBlur={() => setFirstNameError(validateName(firstName))}
                      hasError={!!firstNameError}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <AuthFloatingInput
                      label="Apellido"
                      type="text"
                      value={lastName}
                      accentColor={accentColor}
                      onChange={(v) => {
                        setLastName(v);
                        if (lastNameError) setLastNameError(validateName(v));
                      }}
                      onBlur={() => setLastNameError(validateName(lastName))}
                      hasError={!!lastNameError}
                      required
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '2px',
                    height: '14px',
                  }}
                >
                  <ErrorText text={firstNameError} />
                  <ErrorText text={lastNameError} />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '10px' }}>
                  <AuthFloatingInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    accentColor={accentColor}
                    required
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: '4px' }}>
                  <AuthFloatingInput
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    accentColor={accentColor}
                    onChange={(v) => {
                      setPassword(v);
                      if (passwordError) setPasswordError(validatePassword(v));
                    }}
                    onBlur={() => setPasswordError(validatePassword(password))}
                    hasError={!!passwordError}
                    required
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                          background: 'rgba(0,0,0,0.05)',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(0,0,0,0.45)',
                          display: 'flex',
                          padding: '5px',
                          borderRadius: '6px',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    display: 'block',
                    marginBottom: '2px',
                    height: '14px',
                    visibility: passwordError ? 'visible' : 'hidden',
                  }}
                >
                  {passwordError ?? ' '}
                </span>

                {/* Confirm password */}
                <div style={{ marginBottom: '4px' }}>
                  <AuthFloatingInput
                    label="Confirmar contraseña"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    accentColor={accentColor}
                    hasError={passwordMismatch}
                    required
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        style={{
                          background: 'rgba(0,0,0,0.05)',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(0,0,0,0.45)',
                          display: 'flex',
                          padding: '5px',
                          borderRadius: '6px',
                        }}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    display: 'block',
                    marginBottom: '6px',
                    height: '14px',
                    visibility: passwordMismatch ? 'visible' : 'hidden',
                  }}
                >
                  Las contraseñas no coinciden
                </span>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px 24px',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-display, system-ui, sans-serif)',
                    fontWeight: 700,
                    color: 'white',
                    background: loading ? `${accentColor}80` : accentColor,
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease',
                    letterSpacing: '0.02em',
                    marginBottom: '16px',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear mi cuenta ahora'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    fontSize: '0.875rem',
                    color: 'rgba(0,0,0,0.35)',
                  }}
                >
                  o regístrate con
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={onGoogleSignUp}
                disabled={!onGoogleSignUp}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '12px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontWeight: 600,
                  color: '#101010',
                  background: '#fafafa',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  cursor: onGoogleSignUp ? 'pointer' : 'not-allowed',
                  opacity: onGoogleSignUp ? 1 : 0.5,
                  marginBottom: '14px',
                }}
              >
                <GoogleIcon />
                Registrarse con Google
              </button>

              {/* Sign in link */}
              <div
                style={{
                  borderTop: '1px solid rgba(0,0,0,0.07)',
                  paddingTop: '16px',
                  paddingBottom: '24px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    fontSize: '0.875rem',
                    color: 'rgba(0,0,0,0.4)',
                    margin: 0,
                  }}
                >
                  ¿Ya tenés cuenta?{' '}
                  <Link
                    href={signInHref}
                    style={{
                      fontWeight: 700,
                      color: accentColor,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Iniciá sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom Role Dropdown
// ---------------------------------------------------------------------------
function RoleDropdown({ 
  value, 
  onChange, 
  accentColor 
}: { 
  value: 'patient' | 'doctor'; 
  onChange: (val: 'patient' | 'doctor') => void; 
  accentColor: string; 
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
      <label 
        style={{ 
          fontSize: '0.75rem', 
          color: open ? accentColor : 'rgba(0,0,0,0.4)', 
          position: 'absolute', 
          left: '16px', 
          top: '8px', 
          zIndex: 1,
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          transition: 'color 0.15s ease'
        }}
      >
        Soy...
      </label>
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', 
          height: '54px',
          border: open ? `1px solid ${accentColor}` : '1px solid rgba(0,0,0,0.12)',
          borderRadius: '10px',
          background: open ? 'white' : '#fafafa',
          padding: '24px 16px 8px',
          textAlign: 'left',
          fontSize: '1rem',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          color: '#101010',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: open ? `0 0 0 3px ${accentColor}1F` : 'none',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span>{value === 'patient' ? 'Paciente' : 'Médico especialista'}</span>
        <ChevronDown size={16} color="rgba(0,0,0,0.4)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', 
          top: '58px', 
          left: 0, 
          right: 0, 
          background: 'white', 
          borderRadius: '10px', 
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', 
          zIndex: 10, 
          overflow: 'hidden',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        }}>
          <div 
            onClick={() => { onChange('doctor'); setOpen(false); }}
            style={{ 
              padding: '12px 16px', 
              cursor: 'pointer', 
              fontSize: '0.875rem', 
              background: value === 'doctor' ? 'rgba(0,0,0,0.03)' : 'transparent',
              fontWeight: value === 'doctor' ? 600 : 400
            }}
          >
            Médico especialista
          </div>
          <div 
            onClick={() => { onChange('patient'); setOpen(false); }}
            style={{ 
              padding: '12px 16px', 
              cursor: 'pointer', 
              fontSize: '0.875rem', 
              background: value === 'patient' ? 'rgba(0,0,0,0.03)' : 'transparent',
              fontWeight: value === 'patient' ? 600 : 400
            }}
          >
            Paciente
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function ErrorText({ text }: { text: string | undefined }): React.ReactElement {
  return (
    <span
      style={{
        flex: 1,
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        fontSize: '0.75rem',
        color: '#ef4444',
        visibility: text ? 'visible' : 'hidden',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {text ?? ' '}
    </span>
  );
}

function GoogleIcon(): React.ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
