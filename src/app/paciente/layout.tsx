"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, 
  PlusCircle, 
  ClipboardList, 
  FileText, 
  TrendingUp, 
  Syringe, 
  Scale, 
  FlaskConical, 
  Stethoscope, 
  HeartPulse, 
  Footprints, 
  Target, 
  MessageCircle, 
  Calendar 
} from "lucide-react";
import { DashboardLayout, NavGroup } from "@/shared/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/store";

const PATIENT_NAV_GROUPS: NavGroup[] = [
  {
    category: "Principal",
    items: [
      { name: "Mi dashboard", href: "/paciente/dashboard", icon: <Home className="size-5" /> },
      { name: "Registrar hoy", href: "/paciente/nuevo-registro", icon: <PlusCircle className="size-5" /> },
      { name: "Mi historial", href: "/paciente/historial", icon: <ClipboardList className="size-5" /> },
      { name: "Mi resumen", href: "/paciente/resumen", icon: <FileText className="size-5" /> },
    ]
  },
  {
    category: "Herramientas",
    items: [
      { name: "Curvas de glucosa", href: "/paciente/herramientas/curvas-glucosa", icon: <TrendingUp className="size-5" /> },
      { name: "Guía de insulina", href: "/paciente/herramientas/guia-insulina", icon: <Syringe className="size-5" /> },
      { name: "Calculadora IMC", href: "/paciente/herramientas/calculadora-imc", icon: <Scale className="size-5" /> },
      { name: "Conversor HbA1c", href: "/paciente/herramientas/convertidor-hba1c", icon: <FlaskConical className="size-5" /> },
      { name: "Riesgo diabetes", href: "/paciente/herramientas/riesgo-diabetes", icon: <Stethoscope className="size-5" /> },
      { name: "Riesgo cardiovascular", href: "/paciente/herramientas/riesgo-cardiovascular", icon: <HeartPulse className="size-5" /> },
      { name: "Neuropatía", href: "/paciente/herramientas/neuropatia", icon: <Footprints className="size-5" /> },
      { name: "Mis metas", href: "/paciente/herramientas/metas", icon: <Target className="size-5" /> },
    ]
  },
  {
    category: "Contacto",
    items: [
      { name: "WhatsApp", href: "https://wa.me/523121355297", icon: <MessageCircle className="size-5" /> },
      { name: "Agendar cita", href: "/paciente/contacto/agendar", icon: <Calendar className="size-5" /> },
    ]
  }
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { role, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (role !== 'PATIENT' && role !== 'GUEST') {
      router.replace("/");
    }
  }, [_hasHydrated, role, router]);

  if (!_hasHydrated || (role !== 'PATIENT' && role !== 'GUEST')) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>;
  }

  return (
    <DashboardLayout navGroups={PATIENT_NAV_GROUPS} title="Portal del Paciente">
      {children}
    </DashboardLayout>
  );
}
