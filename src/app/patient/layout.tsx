"use client";

import { useEffect, useState } from "react";
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
      { name: "Mi dashboard", href: "/patient/dashboard", icon: <Home className="size-5" /> },
      { name: "Registrar hoy", href: "/patient/new-record", icon: <PlusCircle className="size-5" /> },
      { name: "Mi historial", href: "/patient/history", icon: <ClipboardList className="size-5" /> },
      { name: "Mi resumen", href: "/patient/summary", icon: <FileText className="size-5" /> },
    ]
  },
  {
    category: "Herramientas",
    items: [
      { name: "Curvas de glucosa", href: "/patient/tools/glucose-curves", icon: <TrendingUp className="size-5" /> },
      { name: "Guía de insulina", href: "/patient/tools/insulin-guide", icon: <Syringe className="size-5" /> },
      { name: "Calculadora IMC", href: "/patient/tools/bmi-calculator", icon: <Scale className="size-5" /> },
      { name: "Conversor HbA1c", href: "/patient/tools/hba1c-converter", icon: <FlaskConical className="size-5" /> },
      { name: "Riesgo diabetes", href: "/patient/tools/diabetes-risk", icon: <Stethoscope className="size-5" /> },
      { name: "Riesgo cardiovascular", href: "/patient/tools/cardio-risk", icon: <HeartPulse className="size-5" /> },
      { name: "Neuropatía", href: "/patient/tools/neuropathy", icon: <Footprints className="size-5" /> },
      { name: "Mis metas", href: "/patient/tools/goals", icon: <Target className="size-5" /> },
    ]
  },
  {
    category: "Contacto",
    items: [
      { name: "WhatsApp Dr.", href: "/patient/contact/whatsapp", icon: <MessageCircle className="size-5" /> },
      { name: "Agendar cita", href: "/patient/contact/schedule", icon: <Calendar className="size-5" /> },
    ]
  }
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
    <DashboardLayout navGroups={PATIENT_NAV_GROUPS} title="Portal del Paciente">
      {children}
    </DashboardLayout>
  );
}
