'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, type UserRole } from '@/features/auth/store';

function redirectForRole(role: UserRole): string {
  switch (role) {
    case 'PATIENT': return '/paciente/dashboard';
    case 'DOCTOR':  return '/doctor/dashboard';
    case 'ADMIN':   return '/admin';
    default:        return '/';
  }
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, _hasHydrated, logout } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (role !== null) {
      // If the session cookie is gone (expired) but Zustand still has a role,
      // clear the stale state so the user can log in instead of being bounced.
      const hasSessionCookie = document.cookie.split(';').some(
        (c) => c.trim().startsWith('_session=')
      );
      if (!hasSessionCookie) {
        logout();
        return;
      }
      router.replace(redirectForRole(role));
    }
  }, [_hasHydrated, role, router, logout]);

  if (!_hasHydrated || role !== null) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.985, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.985, y: -8 }}
        transition={{ duration: 0.5, ease: [0.2, 0.85, 0.25, 1] }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
