"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, FileText, PlusCircle, Settings } from "lucide-react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/store";

const PATIENT_NAV_ITEMS = [
  { name: "Panel Principal", href: "/patient/dashboard", icon: <Home className="size-5" /> },
  { name: "Historial de Salud", href: "/patient/history", icon: <FileText className="size-5" /> },
  { name: "Nuevo Registro", href: "/patient/new-record", icon: <PlusCircle className="size-5" /> },
  { name: "Herramientas y Educación", href: "/patient/tools", icon: <Settings className="size-5" /> },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { role } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (role !== 'PATIENT') {
      router.replace("/");
    }
  }, [role, router]);

  if (!mounted || role !== 'PATIENT') {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>;
  }

  return (
    <DashboardLayout navItems={PATIENT_NAV_ITEMS} title="Portal del Paciente">
      {children}
    </DashboardLayout>
  );
}
