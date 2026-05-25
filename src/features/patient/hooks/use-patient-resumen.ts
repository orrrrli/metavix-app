import { useQuery } from '@tanstack/react-query';
import { getPatientResumen } from '@/lib/api/patient';

// patientId must match the authenticated user's userId — never pass URL params directly
export function usePatientResumen(patientId: string) {
  return useQuery({
    queryKey: ['patient-resumen', patientId],
    queryFn: () => getPatientResumen(patientId),
    enabled: !!patientId,
  });
}
