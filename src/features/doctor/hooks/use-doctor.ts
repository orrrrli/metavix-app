import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDoctorProfile,
  getLinkedPatients,
  getLinkedPatientProfile,
  getLinkedPatientDailyRecords,
  getLinkedPatientLabResults,
  getPendingLinkRequests,
  acceptLinkRequest,
  rejectLinkRequest,
  unlinkPatient,
} from '@/lib/api/doctor';

export function useDoctorProfile(doctorId: string) {
  return useQuery({
    queryKey: ['doctor-profile', doctorId],
    queryFn: () => getDoctorProfile(doctorId),
    enabled: !!doctorId,
  });
}

export function useLinkedPatients(doctorId: string) {
  return useQuery({
    queryKey: ['linked-patients', doctorId],
    queryFn: () => getLinkedPatients(doctorId),
    enabled: !!doctorId,
  });
}

export function useLinkedPatientProfile(doctorId: string, patientId: string) {
  return useQuery({
    queryKey: ['linked-patient-profile', doctorId, patientId],
    queryFn: () => getLinkedPatientProfile(doctorId, patientId),
    enabled: !!doctorId && !!patientId,
  });
}

export function useLinkedPatientDailyRecords(doctorId: string, patientId: string) {
  return useQuery({
    queryKey: ['linked-patient-daily', doctorId, patientId],
    queryFn: () => getLinkedPatientDailyRecords(doctorId, patientId),
    enabled: !!doctorId && !!patientId,
  });
}

export function useLinkedPatientLabResults(doctorId: string, patientId: string) {
  return useQuery({
    queryKey: ['linked-patient-lab', doctorId, patientId],
    queryFn: () => getLinkedPatientLabResults(doctorId, patientId),
    enabled: !!doctorId && !!patientId,
  });
}

export function usePendingLinkRequests(doctorId: string) {
  return useQuery({
    queryKey: ['pending-requests', doctorId],
    queryFn: () => getPendingLinkRequests(doctorId),
    enabled: !!doctorId,
  });
}

export function useAcceptLinkRequest(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => acceptLinkRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', doctorId] });
      queryClient.invalidateQueries({ queryKey: ['linked-patients', doctorId] });
    },
  });
}

export function useRejectLinkRequest(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => rejectLinkRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', doctorId] });
    },
  });
}

export function useUnlinkPatient(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => unlinkPatient(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-patients', doctorId] });
    },
  });
}
