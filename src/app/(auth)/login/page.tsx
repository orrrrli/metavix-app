'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginUser } from '@/lib/api/auth';
import { useAuthStore } from '@/features/auth/store';
import type { UserRole } from '@/features/auth/store';
import AuthSignIn, { type SignInFormData } from '@/shared/components/auth/AuthSignIn';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

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

export default function LoginPage(): React.ReactElement {
  const router         = useRouter();
  const { setSession } = useAuthStore();

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
    window.location.href = `${API}/api/auth/google?role=patient`;
  };

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
