"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import MetavixDashboardLayout, { type MetavixNavItem } from "@/shared/components/layout/MetavixDashboardLayout";

function Icon({ children, size = 19 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const NAV: MetavixNavItem[] = [
  { label: "Inicio", href: "/paciente/dashboard", icon: <Icon><path d="M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" /></Icon> },
  { label: "Mi historial", href: "/paciente/historial", icon: <Icon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="13" y2="18" /></Icon> },
  { label: "Mis metas", href: "/paciente/herramientas/metas", icon: <Icon><><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></></Icon> },
  { label: "Mis médicos", href: "/paciente/doctores", icon: <Icon><><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></></Icon> },
];

const TOOLS: MetavixNavItem[] = [
  { label: "Curvas de glucosa", href: "/paciente/herramientas/curvas-glucosa", icon: <Icon><><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></></Icon> },
  { label: "Calculadora IMC", href: "/paciente/herramientas/calculadora-imc", icon: <Icon><><path d="M12 3v6" /><path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z" /></></Icon> },
  { label: "Conversor HbA1c", href: "/paciente/herramientas/convertidor-hba1c", icon: <Icon><><path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" /><path d="M8 3h8" /></></Icon> },
  { label: "Ver todas las herramientas", href: "/paciente/herramientas", icon: <Icon><><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></></Icon>, muted: true },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { role, _hasHydrated, fullName, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (role === "DOCTOR") {
      router.replace("/doctor/dashboard");
      return;
    }
    if (role !== "PATIENT") {
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

  if (!_hasHydrated || role !== "PATIENT") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando…
      </div>
    );
  }

  return (
    <MetavixDashboardLayout
      userName={fullName ?? "Paciente"}
      userRoleLabel="Paciente"
      title="Portal del Paciente"
      navItems={NAV}
      toolsItems={TOOLS}
      profileHref="/paciente/perfil"
      onLogout={logout}
      cta={{
        label: "Registrar nueva lectura",
        onClick: () => router.push("/paciente/nuevo-registro"),
      }}
    >
      {children}
    </MetavixDashboardLayout>
  );
}
