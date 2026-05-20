"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, BarChart3, Settings } from "lucide-react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/store";

const DOCTOR_NAV_ITEMS = [
  { name: "Panel Clínico", href: "/doctor/dashboard", icon: <Home className="size-5" /> },
  { name: "Registro de Pacientes", href: "/doctor/patients", icon: <Users className="size-5" /> },
  { name: "Tendencias de Población", href: "/doctor/trends", icon: <BarChart3 className="size-5" /> },
  { name: "Configuración de Clínica", href: "/doctor/settings", icon: <Settings className="size-5" /> },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (role !== 'DOCTOR') {
      router.replace("/");
    }
  }, [role, router]);

  if (!mounted || role !== 'DOCTOR') {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>;
  }

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS} title="Portal Clínico">
      {children}
    </DashboardLayout>
  );
}
