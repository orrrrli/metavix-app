import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDailyRecords, getDailyRecordById, getDailyRecordsInRange, getDailyRecordSnapshot, createDailyRecord } from '@/lib/api/patient';
import { CreateDailyRecordRequest } from '@/types/daily-record';

// patientId must match the authenticated user's userId — never pass URL params directly
export function useDailyRecords(patientId: string) {
  return useQuery({
    queryKey: ['daily-records', patientId],
    queryFn: () => getDailyRecords(patientId),
    enabled: !!patientId,
  });
}

export function useDailyRecordSnapshot(patientId: string, date: string) {
  return useQuery({
    queryKey: ['daily-record-snapshot', patientId, date],
    queryFn: () => getDailyRecordSnapshot(patientId, date),
    enabled: !!patientId,
    retry: false,
  });
}

export function useDailyRecordsInRange(patientId: string, from: string, to: string) {
  return useQuery({
    queryKey: ['daily-records', patientId, from, to],
    queryFn: () => getDailyRecordsInRange(patientId, from, to),
    enabled: !!patientId,
  });
}

export function useDailyRecordById(patientId: string, recordId: string) {
  return useQuery({
    queryKey: ['daily-records', patientId, recordId],
    queryFn: () => getDailyRecordById(patientId, recordId),
    enabled: !!patientId && !!recordId,
  });
}

export function useCreateDailyRecord(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDailyRecordRequest) => createDailyRecord(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-records', patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-resumen', patientId] });
    },
  });
}
