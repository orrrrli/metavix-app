'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/features/auth/store';
import type { UserRole } from '@/features/auth/store';
import AuthSignIn, { type SignInFormData } from '@/shared/components/auth/AuthSignIn';

function getOAuthErrorMessage(error: string | null): string | undefined {
  if (error === 'role_mismatch') {
    return 'El perfil seleccionado no coincide con tu cuenta. Ingresa con el perfil correcto.';
  }
  if (error === 'oauth_failed') {
    return 'Error al iniciar sesión con Google. Intenta de nuevo.';
  }
  return undefined;
}

const API = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/v1`;

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

function LoginPageContent(): React.ReactElement {
  const router         = useRouter();
  const params         = useSearchParams();
  const { setSession } = useAuthStore();
  const oauthError     = getOAuthErrorMessage(params.get('error'));

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

  const handleGoogleSignIn = (role: 'patient' | 'doctor') => {
    sessionStorage.setItem('oauth_requested_role', role);
    window.location.href = `${API}/auth/google?role=${role}`;
  };

  return (
    <AuthSignIn
      onSignIn={handleSignIn}
      onSuccess={handleSuccess}
      onGoogleSignIn={handleGoogleSignIn}
      oauthError={oauthError}
      imageSrc="/images/login.jpg"
      imageQuote="Metavix transformó la forma en que atendemos a nuestros pacientes."
      imageAuthor="Dr. Ramses Valenzuela"
      imageAuthorRole="Diabetologo y Educador"
      logoNode={<Image src="/icon.svg" alt="Metavix" width={32} height={32} />}
    />
  );
}

export default function LoginPage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <Loader2 className="size-8 animate-spin text-teal-500" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
