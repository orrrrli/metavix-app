'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/api/auth';
import { useAuthStore } from '@/features/auth/store';
import type { UserRole } from '@/features/auth/store';

function mapRole(apiRole: string): UserRole {
  switch (apiRole) {
    case 'Patient': return 'PATIENT';
    case 'Doctor':  return 'DOCTOR';
    case 'Admin':   return 'ADMIN';
    default:        return null;
  }
}

function getDashboard(role: UserRole): string {
  switch (role) {
    case 'PATIENT': return '/paciente/dashboard';
    case 'DOCTOR':  return '/doctor/dashboard';
    default:        return '/';
  }
}

function mapRequestedRole(value: string | null): UserRole {
  switch (value) {
    case 'patient': return 'PATIENT';
    case 'doctor':  return 'DOCTOR';
    default:        return null;
  }
}

function OAuthCallbackInner(): React.ReactElement {
  const router         = useRouter();
  const params         = useSearchParams();
  const { setSession } = useAuthStore();

  useEffect(() => {
    if (params.get('error')) {
      sessionStorage.removeItem('oauth_requested_role');
      router.replace('/login?error=oauth_failed');
      return;
    }

    getCurrentUser()
      .then((user) => {
        const actualRole    = mapRole(user.role);
        const requestedRole = mapRequestedRole(sessionStorage.getItem('oauth_requested_role'));
        sessionStorage.removeItem('oauth_requested_role');

        if (requestedRole && requestedRole !== actualRole) {
          router.replace('/login?error=role_mismatch');
          return;
        }

        setSession({
          userId:    user.userId,
          patientId: user.patientId,
          doctorId:  user.doctorId,
          role:      actualRole,
          fullName:  user.fullName,
          email:     user.email,
        });

        document.cookie = '_session=1; path=/; samesite=lax; max-age=604800';
        router.replace(getDashboard(actualRole));
      })
      .catch(() => {
        sessionStorage.removeItem('oauth_requested_role');
        router.replace('/login?error=oauth_failed');
      });
  }, [params, router, setSession]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/40 dark:bg-background">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Completando inicio de sesión...</p>
    </div>
  );
}

export default function AuthCallbackPage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-muted/40 dark:bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    }>
      <OAuthCallbackInner />
    </Suspense>
  );
}
