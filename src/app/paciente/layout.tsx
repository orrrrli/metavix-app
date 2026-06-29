"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { MetavixDashboardLayout } from "@/features/patient/components/dashboard";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const { role, _hasHydrated } = useAuthStore();
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

  return <MetavixDashboardLayout>{children}</MetavixDashboardLayout>;
}
