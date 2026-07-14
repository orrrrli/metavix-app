"use client";

import {
  useClinicalGoals,
  useSaveClinicalGoal,
} from "@/features/doctor/hooks/use-clinical-goals";
import type { ClinicalGoal, ClinicalGoalPayload } from "@/types/clinical-goal";
import {
  buildClinicalGoalsViewData,
  type ClinicalGoalsViewData,
} from "../view-data/build-clinical-goals-view-data";

export interface SaveCallbacks {
  /** `existing` indica si fue update (true) o create (false), para el copy del toast. */
  onSuccess?: (wasUpdate: boolean) => void;
  onError?: () => void;
}

/**
 * Domain hook del editor de metas clínicas: carga las metas, compone el view
 * data, y expone `save` (decide POST/PUT) con callbacks para los toasts del
 * Control. La visibilidad del parámetro abierto es estado presentacional y
 * vive en el Control (ver `feature-composition.md`), no aquí.
 */
export function useClinicalGoalsEditor(doctorId: string, patientId: string) {
  const { data: goals = [], isLoading } = useClinicalGoals(doctorId, patientId);
  const { mutateAsync: saveGoal, isPending: isSaving } = useSaveClinicalGoal(
    doctorId,
    patientId,
  );

  const viewData: ClinicalGoalsViewData = buildClinicalGoalsViewData(goals);

  const save = async (
    parameterId: string,
    existing: ClinicalGoal | null,
    payload: ClinicalGoalPayload,
    cb: SaveCallbacks = {},
  ) => {
    try {
      await saveGoal({ goalId: existing?.id ?? null, parameterId, payload });
      cb.onSuccess?.(Boolean(existing));
    } catch {
      cb.onError?.();
    }
  };

  return { viewData, isLoading, isSaving, save };
}
