"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Users, BarChart3, Settings } from "lucide-react";
import { DashboardLayout } from "@/shared/components/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/store";

const DOCTOR_NAV_ITEMS = [
  { name: "Clinical Dashboard", href: "/doctor/dashboard", icon: <Home className="size-5" /> },
  { name: "Patient Registry", href: "/doctor/patients", icon: <Users className="size-5" /> },
  { name: "Population Trends", href: "/doctor/trends", icon: <BarChart3 className="size-5" /> },
  { name: "Clinic Settings", href: "/doctor/settings", icon: <Settings className="size-5" /> },
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
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <DashboardLayout navItems={DOCTOR_NAV_ITEMS} title="Clinical Portal">
      {children}
    </DashboardLayout>
  );
}
