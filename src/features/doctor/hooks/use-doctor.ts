import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDoctorProfile,
  getMyDoctorProfile,
  updateDoctorProfile,
  getLinkedPatients,
  getLinkedPatientProfile,
  getLinkedPatientDailyRecords,
  getLinkedPatientLabResults,
  getPendingLinkRequests,
  acceptLinkRequest,
  rejectLinkRequest,
  unlinkPatient,
} from '@/lib/api/doctor';
import { useAuthStore } from '@/features/auth/store';

/**
 * Waits for the Zustand auth store to rehydrate from localStorage before
 * letting the dependent query fire. Without this, on a hard reload the
 * store returns `null` for doctorId on first render → queries fire with
 * empty ids → backend's `:guid` route constraint rejects with 404.
 */
function useStoreHydrated(): boolean {
  return useAuthStore((s) => s._hasHydrated);
}

export function useDoctorProfile(doctorId: string) {
  const hydrated = useStoreHydrated();
  const isValidId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId);
  return useQuery({
    queryKey: ['doctor-profile', doctorId],
    queryFn: () => getDoctorProfile(doctorId),
    enabled: hydrated && isValidId,
    retry: false,
  });
}

export function useLinkedPatients(doctorId: string) {
  const hydrated = useStoreHydrated();
  // Defensive: only fire when the id is a plausible GUID. Empty strings or
  // partial values (e.g. "" from a not-yet-hydrated Zustand store, or
  // malformed values) would hit the backend's :guid route constraint
  // and 404, then React Query would retry in a tight loop.
  const isValidId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId);
  return useQuery({
    queryKey: ['linked-patients', doctorId],
    queryFn: () => getLinkedPatients(doctorId),
    enabled: hydrated && isValidId,
    retry: false,
  });
}

export function useLinkedPatientProfile(doctorId: string, patientId: string) {
  const hydrated = useStoreHydrated();
  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(patientId);
  return useQuery({
    queryKey: ['linked-patient-profile', doctorId, patientId],
    queryFn: () => getLinkedPatientProfile(doctorId, patientId),
    enabled: hydrated && isValidId,
    retry: false,
  });
}

export function useLinkedPatientDailyRecords(doctorId: string, patientId: string) {
  const hydrated = useStoreHydrated();
  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(patientId);
  return useQuery({
    queryKey: ['linked-patient-daily', doctorId, patientId],
    queryFn: () => getLinkedPatientDailyRecords(doctorId, patientId),
    enabled: hydrated && isValidId,
    retry: false,
  });
}

export function useLinkedPatientLabResults(doctorId: string, patientId: string) {
  const hydrated = useStoreHydrated();
  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(patientId);
  return useQuery({
    queryKey: ['linked-patient-lab', doctorId, patientId],
    queryFn: () => getLinkedPatientLabResults(doctorId, patientId),
    enabled: hydrated && isValidId,
    retry: false,
  });
}

export function usePendingLinkRequests(doctorId: string) {
  const hydrated = useStoreHydrated();
  const isValidId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId);
  return useQuery({
    queryKey: ['pending-requests', doctorId],
    queryFn: () => getPendingLinkRequests(doctorId),
    enabled: hydrated && isValidId,
    retry: false,
  });
}

export function useMyDoctorProfile() {
  return useQuery({
    queryKey: ['my-doctor-profile'],
    queryFn: getMyDoctorProfile,
  });
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDoctorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-doctor-profile'] });
    },
  });
}

export function useAcceptLinkRequest(doctorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { requestId: string; medicalRecordNumber: string }) =>
      acceptLinkRequest(input),
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
