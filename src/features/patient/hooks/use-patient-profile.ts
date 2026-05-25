import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatientProfile, updatePatientProfile } from '@/lib/api/patient';
import { UpdatePatientProfileRequest } from '@/types/patient-profile';

export function usePatientProfile(patientId: string) {
  return useQuery({
    queryKey: ['patient-profile', patientId],
    queryFn: () => getPatientProfile(patientId),
    enabled: !!patientId,
  });
}

export function useUpdatePatientProfile(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePatientProfileRequest) => updatePatientProfile(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-profile', patientId] });
    },
  });
}
