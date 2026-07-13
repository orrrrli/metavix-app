"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { useLabRecords } from "@/features/patient/hooks/use-lab-records";
import { useDailyRecords } from "@/features/patient/hooks/use-daily-records";
import { usePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { useEvaluateGoals } from "@/features/patient/hooks/use-evaluate-goals";
import type { GoalEvaluationResponse } from "@/types/goal-evaluation";
import {
  buildMetasViewData,
  type MetasViewData,
} from "../view-data/build-metas-view-data";

export interface UseMetasResult {
  viewData: MetasViewData;
  isLoading: boolean;
  /** Dispara la evaluación y guarda el resultado en el view data. Propaga el error. */
  evaluate: () => Promise<void>;
  isEvaluating: boolean;
}

/**
 * Orquesta las 3 queries + 1 mutation de la pantalla Metas y compone el
 * `MetasViewData`. El componente `MetasControl` sólo consume esto; toda la
 * transformación vive en `view-data/`.
 *
 * `evalResult` es estado local del hook (no del componente): mantiene el
 * comportamiento original donde la evaluación se guarda en memoria tras el
 * click de "Evaluar mis metas".
 */
export function useMetas(): UseMetasResult {
  const patientId = useAuthStore((s) => s.patientId);
  const effectiveId = patientId ?? "";

  const { data: labRecords, isLoading: loadingLab } = useLabRecords(effectiveId);
  const { data: dailyRecords, isLoading: loadingDaily } =
    useDailyRecords(effectiveId);
  const { data: profile, isLoading: loadingProfile } =
    usePatientProfile(effectiveId);
  const { mutateAsync, isPending: isEvaluating } = useEvaluateGoals(effectiveId);

  const [evalResult, setEvalResult] = useState<GoalEvaluationResponse | null>(
    null,
  );

  const viewData = useMemo<MetasViewData>(
    () =>
      buildMetasViewData({
        labRecords: labRecords ?? [],
        dailyRecords: dailyRecords ?? [],
        profile: profile ?? null,
        evalResult,
      }),
    [labRecords, dailyRecords, profile, evalResult],
  );

  const evaluate = async () => {
    const result = await mutateAsync();
    setEvalResult(result);
  };

  return {
    viewData,
    isLoading: loadingLab || loadingDaily || loadingProfile,
    evaluate,
    isEvaluating,
  };
}
