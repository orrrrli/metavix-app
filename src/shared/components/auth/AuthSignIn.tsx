'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, ArrowLeft, HeartHandshake, User, Stethoscope } from 'lucide-react';
import AuthImagePanel from './AuthImagePanel';
import AuthFloatingInput from './AuthFloatingInput';

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  rememberMe: z.boolean(),
});

export type SignInFormData = z.infer<typeof signInSchema>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RoleSelection = 'patient' | 'doctor';

interface SignInResult {
  error?: string;
  user?: { name: string; isAdmin: boolean };
}

interface AuthSignInProps {
  onSignIn: (credentials: SignInFormData) => Promise<SignInResult>;
  onSuccess?: (user: { name: string; isAdmin: boolean }) => void;
  onGoogleSignIn?: (role: RoleSelection) => void;
  oauthError?: string;
  brandName?: string;
  accentColor?: string;
  imageSrc?: string;
  imageQuote?: string;
  imageAuthor?: string;
  imageAuthorRole?: string;
  homeHref?: string;
  signUpHref?: string;
  forgotPasswordHref?: string;
  adminRedirectLabel?: string;
  userRedirectLabel?: string;
  logoNode?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AuthSignIn({
  onSignIn,
  onSuccess,
  onGoogleSignIn,
  oauthError,
  brandName = 'Metavix',
  accentColor = '#00BFA5',
  imageSrc,
  imageQuote = '',
  imageAuthor = '',
  imageAuthorRole = '',
  homeHref = '/',
  signUpHref = '/register',
  forgotPasswordHref = '/forgot-password',
  adminRedirectLabel = 'Entrando al panel de administración...',
  userRedirectLabel = 'Preparando tu experiencia...',
}: AuthSignInProps): React.ReactElement {
  const [step, setStep] = useState<'role-select' | 'form'>('role-select');
  const [selectedRole, setSelectedRole] = useState<RoleSelection | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(oauthError ?? null);
  const [redirecting, setRedirecting] = useState<{ name: string; isAdmin: boolean } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: SignInFormData): Promise<void> => {
    setApiError(null);
    const result = await onSignIn(data);
    if (result.error) {
      setApiError(result.error);
    } else if (result.user) {
      setRedirecting(result.user);
      setTimeout(() => onSuccess?.(result.user!), 2000);
    }
  };

  // ----- Redirecting overlay -----
  if (redirecting) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#101010',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.4rem',
          animation: 'fadeIn 0.4s ease forwards',
          zIndex: 9999,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display, system-ui, sans-serif)',
            fontSize: '1.875rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: 'white',
          }}
        >
          {brandName}
        </span>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'white',
              margin: 0,
            }}
          >
            Bienvenido{redirecting.name ? `, ${redirecting.name}` : ''}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.45)',
              marginTop: '6px',
            }}
          >
            {redirecting.isAdmin ? adminRedirectLabel : userRedirectLabel}
          </p>
        </div>
        <div
          style={{
            width: '120px',
            height: '2px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'white',
              borderRadius: '9999px',
              animation: 'fullWidth 1.8s ease forwards',
            }}
          />
        </div>
      </div>
    );
  }

  // ----- Role selection step -----
  if (step === 'role-select') {
    return (
      <div className="h-[100dvh] w-full bg-white md:bg-[#f2f2f2] flex items-center justify-center md:p-6 p-0 overflow-hidden box-border">
        <div className="w-full max-w-[960px] bg-white md:rounded-[24px] rounded-none md:shadow-[0_4px_48px_rgba(0,0,0,0.1)] shadow-none flex flex-col md:flex-row h-full md:h-auto md:max-h-[90vh] overflow-hidden">
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

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                  }}
                >
                  ¿Cómo ingresas hoy?
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    fontSize: '0.875rem',
                    color: 'rgba(0,0,0,0.4)',
                    textAlign: 'center',
                    margin: '0 0 32px',
                  }}
                >
                  Selecciona tu perfil para continuar.
                </p>

                <ErrorBanner message={apiError} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(
                    [
                      {
                        role: 'patient' as RoleSelection,
                        icon: <User size={28} />,
                        title: 'Soy Paciente',
                        description: 'Accede a tu historial médico y registros diarios.',
                      },
                      {
                        role: 'doctor' as RoleSelection,
                        icon: <Stethoscope size={28} />,
                        title: 'Soy Doctor',
                        description: 'Consulta los registros de tus pacientes vinculados.',
                      },
                    ] as const
                  ).map(({ role, icon, title, description }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setSelectedRole(role); setStep('form'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1.5px solid rgba(0,0,0,0.1)',
                        background: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px ${accentColor}20`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.1)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '52px',
                          height: '52px',
                          borderRadius: '14px',
                          background: `${accentColor}15`,
                          color: accentColor,
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </span>
                      <span>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-display, system-ui, sans-serif)',
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: '#101010',
                            marginBottom: '2px',
                          }}
                        >
                          {title}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                            fontSize: '0.8125rem',
                            color: 'rgba(0,0,0,0.45)',
                          }}
                        >
                          {description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: '1px solid rgba(0,0,0,0.07)',
                    paddingTop: '16px',
                    marginTop: '28px',
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
                    ¿No tienes cuenta?{' '}
                    <Link
                      href={signUpHref}
                      style={{
                        fontWeight: 700,
                        color: accentColor,
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      Regístrate
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

  // ----- Main form -----
  return (
    <div className="h-[100dvh] w-full bg-white md:bg-[#f2f2f2] flex items-center justify-center md:p-6 p-0 overflow-hidden box-border">
      <div className="w-full max-w-[960px] bg-white md:rounded-[24px] rounded-none md:shadow-[0_4px_48px_rgba(0,0,0,0.1)] shadow-none flex flex-col md:flex-row h-full md:h-auto md:max-h-[90vh] overflow-hidden">
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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

          <div className="flex-1 flex flex-col justify-center px-6 py-6 md:px-10 md:py-8 overflow-y-auto">
            <div className="w-full max-w-[360px] mx-auto">
              {selectedRole && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: `${accentColor}12`,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: accentColor,
                    }}
                  >
                    {selectedRole === 'patient' ? <User size={14} /> : <Stethoscope size={14} />}
                    {selectedRole === 'patient' ? 'Paciente' : 'Doctor'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setStep('role-select'); setApiError(null); }}
                    style={{
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'rgba(0,0,0,0.45)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                  >
                    Cambiar
                  </button>
                </div>
              )}

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
                  gap: '10px',
                }}
              >
                ¡Hola de nuevo!
                <HeartHandshake size={28} color={accentColor} strokeWidth={2.5} />
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                  fontSize: '0.875rem',
                  color: 'rgba(0,0,0,0.4)',
                  textAlign: 'center',
                  margin: '0 0 24px',
                }}
              >
                Ingresa tus datos para acceder a tu panel de control.
              </p>

              <ErrorBanner message={apiError} />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '10px' }}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <AuthFloatingInput
                        label="Email"
                        type="email"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        accentColor={accentColor}
                        hasError={!!fieldState.error}
                        errorText={fieldState.error?.message}
                      />
                    )}
                  />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <AuthFloatingInput
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        accentColor={accentColor}
                        hasError={!!fieldState.error}
                        errorText={fieldState.error?.message}
                        suffix={
                          <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
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
                    )}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Link
                    href={forgotPasswordHref}
                    style={{
                      fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: accentColor,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                          fontSize: '0.875rem',
                          color: 'rgba(0,0,0,0.45)',
                        }}
                      >
                        Recordar mis datos
                      </span>
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        aria-label="Recordar datos de acceso"
                        style={{
                          width: '46px',
                          height: '26px',
                          borderRadius: '9999px',
                          border: 'none',
                          background: field.value ? accentColor : 'rgba(0,0,0,0.15)',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: field.value ? '23px' : '3px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            transition: 'left 0.2s ease',
                          }}
                        />
                      </button>
                    </div>
                  )}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
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
                    background: isSubmitting ? `${accentColor}80` : accentColor,
                    border: 'none',
                    borderRadius: '9999px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease',
                    letterSpacing: '0.02em',
                    marginBottom: '16px',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Entrando...
                    </>
                  ) : (
                    'Acceder a mi cuenta'
                  )}
                </button>
              </form>

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
                  o ingresa con
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
              </div>

              <button
                type="button"
                onClick={() => onGoogleSignIn?.(selectedRole ?? 'patient')}
                disabled={!onGoogleSignIn}
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
                  cursor: onGoogleSignIn ? 'pointer' : 'not-allowed',
                  opacity: onGoogleSignIn ? 1 : 0.5,
                  marginBottom: '20px',
                }}
              >
                <GoogleIcon />
                Continuar con Google
              </button>

              <div
                style={{
                  borderTop: '1px solid rgba(0,0,0,0.07)',
                  paddingTop: '16px',
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
                  ¿No tienes cuenta?{' '}
                  <Link
                    href={signUpHref}
                    style={{
                      fontWeight: 700,
                      color: accentColor,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Regístrate
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

function ErrorBanner({ message }: { message: string | null }): React.ReactElement | null {
  if (!message) return null;
  return (
    <div style={{ minHeight: '44px', marginBottom: '16px' }}>
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          fontWeight: 500,
          background: 'rgba(247,45,45,0.08)',
          color: '#d42020',
          border: '1px solid rgba(247,45,45,0.2)',
        }}
      >
        {message}
      </div>
    </div>
  );
}

function GoogleIcon(): React.ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
