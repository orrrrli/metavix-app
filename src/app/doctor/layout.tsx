"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import MetavixDashboardLayout, { type MetavixNavItem } from "@/shared/components/layout/MetavixDashboardLayout";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

function Icon({ children, size = 19 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const NAV: MetavixNavItem[] = [
  { label: "Panel Clínico", href: "/doctor/dashboard", icon: <Icon><path d="M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" /></Icon> },
  { label: "Mi Perfil", href: "/doctor/perfil", icon: <Icon><><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></></Icon> },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { role, _hasHydrated, fullName, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (role === 'PATIENT') {
      router.replace("/paciente/dashboard");
      return;
    }
    if (role !== 'DOCTOR') {
      router.replace("/");
    }
  }, [_hasHydrated, role, router]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) router.refresh();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  if (!_hasHydrated || role !== 'DOCTOR') {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>;
  }

  return (
    <MetavixDashboardLayout
      userName={fullName ?? "Doctor"}
      userRoleLabel="Médico"
      title="Portal Clínico"
      navLabel="Portal Médico"
      navItems={NAV}
      profileHref="/doctor/perfil"
      onLogout={logout}
      notificationsSlot={<NotificationBell />}
    >
      {children}
    </MetavixDashboardLayout>
  );
}
