"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useDailyRecords } from "@/features/patient/hooks/use-daily-records";
import { useLabRecords } from "@/features/patient/hooks/use-lab-records";
import { usePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { buildHistorialViewData, type HistorialViewData } from "../view-data/build-historial-view-data";

export interface UseHistorialResult {
  viewData: HistorialViewData;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Orquesta las queries de la pantalla de Historial y compone el view data.
 * Toda la transformación vive en `view-data/buildHistorialViewData`.
 */
export function useHistorial(): UseHistorialResult {
  const patientId = useAuthStore((s) => s.patientId) ?? "";

  const { data: dailyRecords, isLoading: loadingDaily, isError: errorDaily } = useDailyRecords(patientId);
  const { data: labRecords, isLoading: loadingLab, isError: errorLab } = useLabRecords(patientId);
  const { data: profile } = usePatientProfile(patientId);

  const viewData = useMemo(
    () => buildHistorialViewData(dailyRecords, labRecords, profile?.diabetesType, profile?.isPregnant),
    [dailyRecords, labRecords, profile?.diabetesType, profile?.isPregnant]
  );

  return {
    viewData,
    isLoading: loadingDaily || loadingLab,
    isError: errorDaily || errorLab,
  };
}
