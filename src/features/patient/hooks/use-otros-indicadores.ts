"use client";

import { useMemo } from "react";
import { useDailyRecords } from "./use-daily-records";
import { useLabRecords } from "./use-lab-records";
import { usePatientProfile } from "./use-patient-profile";
import {
  buildOtrosIndicadoresViewData,
  type IndicadorData,
} from "../view-data/build-otros-indicadores-view-data";

export type { IndicadorData };

/**
 * Orquesta las 3 queries de los indicadores secundarios del dashboard y delega
 * la composición a `buildOtrosIndicadoresViewData` (datos puros, sin JSX). La
 * Screen mapea cada `IndicadorData` a su `MetavixIndicador` con icono y valor.
 */
export function useOtrosIndicadores(patientId: string | null): {
  indicadores: IndicadorData[];
  loading: boolean;
} {
  const { data: profile } = usePatientProfile(patientId ?? "");
  const { data: daily } = useDailyRecords(patientId ?? "");
  const { data: lab } = useLabRecords(patientId ?? "");

  return useMemo(
    () => ({
      indicadores: buildOtrosIndicadoresViewData({
        dailyRecords: daily ?? [],
        labRecords: lab ?? [],
        profile: profile ?? null,
      }).indicadores,
      loading: false,
    }),
    [daily, lab, profile],
  );
}
