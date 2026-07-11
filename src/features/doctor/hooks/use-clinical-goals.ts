import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getClinicalGoals,
  createClinicalGoal,
  updateClinicalGoal,
} from '../api/clinical-goals';
import type { ClinicalGoalPayload } from '@/types/clinical-goal';

/**
 * Hooks de TanStack Query para el editor de metas clínicas personalizadas
 * (flujo del doctor).
 *
 * Query keys:
 *   - `['clinical-goals', doctorId, patientId]` — lista de metas del
 *     paciente. La invalidación cruzada con la cache de evaluación del
 *     paciente (`['patient-goal-evaluations', patientId]`) se hace en el
 *     editor al guardar — ver T4.
 */

export function useClinicalGoals(doctorId: string, patientId: string) {
  return useQuery({
    queryKey: ['clinical-goals', doctorId, patientId],
    queryFn: () => getClinicalGoals(doctorId, patientId),
    enabled: !!doctorId && !!patientId,
  });
}

interface SaveClinicalGoalInput {
  goalId: string | null;
  parameterId: string;
  payload: ClinicalGoalPayload;
}

/**
 * Mutación unificada para crear o actualizar una meta. El caller decide
 * según tenga o no un `goalId` existente. Tras el éxito invalida la lista
 * de metas para forzar refetch y mantener la UI sincronizada.
 */
export function useSaveClinicalGoal(doctorId: string, patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, parameterId, payload }: SaveClinicalGoalInput) => {
      if (goalId) {
        return updateClinicalGoal(doctorId, patientId, goalId, payload);
      }
      return createClinicalGoal(doctorId, patientId, parameterId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical-goals', doctorId, patientId] });
    },
  });
}
