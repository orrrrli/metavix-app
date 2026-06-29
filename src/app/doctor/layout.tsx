"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, UserRound } from "lucide-react";
import { DashboardLayout, NavGroup } from "@/shared/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/store";

const DOCTOR_NAV_GROUPS: NavGroup[] = [
  {
    category: "Portal Médico",
    items: [
      { name: "Panel Clínico", href: "/doctor/dashboard", icon: <Home className="size-5" /> },
      { name: "Mi Perfil", href: "/doctor/perfil", icon: <UserRound className="size-5" /> },
    ]
  }
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { role, _hasHydrated } = useAuthStore();
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
    <DashboardLayout navGroups={DOCTOR_NAV_GROUPS} title="Portal Clínico">
      {children}
    </DashboardLayout>
  );
}
