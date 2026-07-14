"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { usePatientResumen } from "@/features/patient/hooks/use-patient-resumen";
import {
  buildResumenViewData,
  type ResumenViewData,
} from "../view-data/build-resumen-view-data";

/**
 * Domain hook del resumen clínico: carga los datos y delega la composición de
 * las 5 secciones a `buildResumenViewData`. `viewData` es null mientras carga o
 * si hay error (el Control resuelve esos estados).
 */
export function useResumen(): {
  viewData: ResumenViewData | null;
  isLoading: boolean;
  isError: boolean;
} {
  const { patientId } = useAuthStore();
  const { data, isLoading, isError } = usePatientResumen(patientId ?? "");

  const viewData = useMemo(
    () => (data ? buildResumenViewData(data) : null),
    [data],
  );

  return { viewData, isLoading, isError: isError || (!isLoading && !data) };
}
