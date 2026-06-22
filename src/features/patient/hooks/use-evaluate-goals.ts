import { useMutation } from '@tanstack/react-query';
import { evaluateGoals } from '@/lib/api/patient';

export function useEvaluateGoals(patientId: string) {
  return useMutation({
    mutationFn: () => evaluateGoals(patientId),
  });
}
