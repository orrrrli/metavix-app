import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLabRecords, getLabRecordById, createLabRecord } from '@/lib/api/patient';
import { CreateLabRecordRequest } from '@/types/lab-record';

// patientId must match the authenticated user's userId — never pass URL params directly
export function useLabRecords(patientId: string) {
  return useQuery({
    queryKey: ['lab-records', patientId],
    queryFn: () => getLabRecords(patientId),
    enabled: !!patientId,
  });
}

export function useLabRecordById(patientId: string, recordId: string) {
  return useQuery({
    queryKey: ['lab-records', patientId, recordId],
    queryFn: () => getLabRecordById(patientId, recordId),
    enabled: !!patientId && !!recordId,
  });
}

export function useCreateLabRecord(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLabRecordRequest) => createLabRecord(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lab-records', patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-resumen', patientId] });
    },
  });
}
