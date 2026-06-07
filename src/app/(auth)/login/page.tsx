'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Stethoscope, User } from 'lucide-react';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/features/auth/store';
import type { UserRole } from '@/features/auth/store';
import AuthSignIn, { type SignInFormData } from '@/shared/components/auth/AuthSignIn';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

type SelectedRole = 'patient' | 'doctor' | null;

function mapRole(apiRole: string): UserRole {
  switch (apiRole) {
    case 'Patient': return 'PATIENT';
    case 'Doctor':  return 'DOCTOR';
    case 'Admin':   return 'ADMIN';
    default:        return null;
  }
}

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'PATIENT': return '/paciente/dashboard';
    case 'DOCTOR':  return '/doctor/dashboard';
    default:        return '/';
  }
}

function RoleSelector({ onSelect }: { onSelect: (role: SelectedRole) => void }): React.ReactElement {
  return (
    <div className="h-[100dvh] w-full bg-white md:bg-[#f2f2f2] flex items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-10">
          <h1
            style={{
              fontFamily: 'var(--font-display, system-ui, sans-serif)',
              fontSize: '1.875rem',
              fontWeight: 700,
              color: '#101010',
              margin: '0 0 8px',
            }}
          >
            ¿Cómo ingresas?
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>
            Elige tu perfil para continuar
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelect('patient')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '32px 24px',
              background: 'white',
              border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#00BFA5';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,191,165,0.15)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.08)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(0,191,165,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={26} color="#00BFA5" strokeWidth={2} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#101010', margin: '0 0 3px' }}>
                Paciente
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>
                Gestiona tu salud
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelect('doctor')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '32px 24px',
              background: 'white',
              border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: '20px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#00BFA5';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,191,165,0.15)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.08)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(0,191,165,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Stethoscope size={26} color="#00BFA5" strokeWidth={2} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#101010', margin: '0 0 3px' }}>
                Médico
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>
                Panel clínico
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage(): React.ReactElement {
  const router            = useRouter();
  const { setSession }    = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);

  const handleSignIn = async (credentials: SignInFormData) => {
    try {
      const response = await loginUser({
        email:    credentials.email,
        password: credentials.password,
      });
      const userRole = mapRole(response.role);

      setSession({
        userId:    response.userId,
        patientId: response.patientId,
        doctorId:  response.doctorId,
        role:      userRole,
        fullName:  response.fullName,
        email:     response.email,
      });

      document.cookie = '_session=1; path=/; secure; samesite=lax; max-age=900';

      return {
        user: {
          name:    response.fullName.split(' ')[0],
          isAdmin: userRole === 'ADMIN' || userRole === 'DOCTOR',
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('401')) {
        const isGoogleAccount = message.toLowerCase().includes('google');
        return { error: isGoogleAccount
          ? "Esta cuenta usa Google. Usa el botón 'Continuar con Google'."
          : 'Credenciales incorrectas' };
      }
      if (message.includes('429')) return { error: 'Demasiados intentos. Intenta más tarde.' };
      return { error: 'Error al iniciar sesión. Intenta de nuevo.' };
    }
  };

  const handleSuccess = () => {
    const currentRole = useAuthStore.getState().role;
    router.replace(getRedirectPath(currentRole));
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API}/api/auth/google?role=${selectedRole}`;
  };

  if (!selectedRole) {
    return <RoleSelector onSelect={setSelectedRole} />;
  }

  return (
    <AuthSignIn
      onSignIn={handleSignIn}
      onSuccess={handleSuccess}
      onGoogleSignIn={handleGoogleSignIn}
      imageSrc="/images/login.jpg"
      imageQuote="Metavix transformó la forma en que atendemos a nuestros pacientes."
      imageAuthor="Dr. Ramses Valenzuela"
      imageAuthorRole="Diabetologo y Educador"
      logoNode={<Image src="/icon.svg" alt="Metavix" width={32} height={32} />}
    />
  );
}
