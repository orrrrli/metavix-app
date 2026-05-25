import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInsulinProfile,
  upsertInsulinProfile,
  getInsulinRecords,
  getInsulinRecordById,
  createInsulinRecord,
  deleteInsulinRecord,
} from '@/lib/api/patient';
import { UpsertInsulinProfileRequest, CreateInsulinRecordRequest } from '@/types/insulin-dm1';

// patientId must match the authenticated user's userId — never pass URL params directly

export function useInsulinProfile(patientId: string) {
  return useQuery({
    queryKey: ['insulin-profile', patientId],
    queryFn: () => getInsulinProfile(patientId),
    enabled: !!patientId,
  });
}

export function useUpsertInsulinProfile(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertInsulinProfileRequest) => upsertInsulinProfile(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insulin-profile', patientId] });
    },
  });
}

export function useInsulinRecords(patientId: string) {
  return useQuery({
    queryKey: ['insulin-records', patientId],
    queryFn: () => getInsulinRecords(patientId),
    enabled: !!patientId,
  });
}

export function useInsulinRecordById(patientId: string, recordId: string) {
  return useQuery({
    queryKey: ['insulin-records', patientId, recordId],
    queryFn: () => getInsulinRecordById(patientId, recordId),
    enabled: !!patientId && !!recordId,
  });
}

export function useCreateInsulinRecord(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInsulinRecordRequest) => createInsulinRecord(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insulin-records', patientId] });
    },
  });
}

export function useDeleteInsulinRecord(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) => deleteInsulinRecord(patientId, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insulin-records', patientId] });
    },
  });
}
