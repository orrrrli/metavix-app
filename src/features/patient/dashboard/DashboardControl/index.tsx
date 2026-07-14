"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store";
import { useGlucosaResumen } from "@/features/patient/hooks/use-glucosa-resumen";
import { useOtrosIndicadores } from "@/features/patient/hooks/use-otros-indicadores";
import { DashboardScreen } from "../DashboardScreen";

/**
 * Wrapper del dashboard del paciente: cablea los domain hooks, mantiene el
 * estado de UI (ventana de rango) y los handlers de navegación/retry. Toda la
 * derivación vive en `view-data/`; la UI en `DashboardScreen`.
 */
export function DashboardControl() {
  const { patientId } = useAuthStore();
  const router = useRouter();
  const [rango, setRango] = useState<"7d" | "14d" | "30d">("7d");

  const resumen = useGlucosaResumen(patientId, rango);
  const { indicadores } = useOtrosIndicadores(patientId);

  const handleRetry = () => {
    // El hook no expone refetch; un reload limpia caché y re-fetchea.
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <DashboardScreen
      resumen={resumen}
      indicadores={indicadores}
      rango={rango}
      onRangoChange={setRango}
      onRegistrar={() => router.push("/paciente/nuevo-registro")}
      onHistorial={() => router.push("/paciente/historial")}
      onRetry={handleRetry}
      onIndicadorClick={(href) => router.push(href)}
    />
  );
}
