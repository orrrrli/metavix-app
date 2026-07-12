import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDoctors, getLinkedDoctors, getPendingSentRequests, sendLinkRequest, revokeLinkRequest } from '@/lib/api/patient';
import { LinkedDoctorResponse, SendLinkRequestBody } from '@/types/link-request';

export function useAllDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: getAllDoctors,
  });
}

// patientId must match the authenticated user's userId — never pass URL params directly
export function useLinkedDoctors(patientId: string) {
  return useQuery({
    queryKey: ['linked-doctors', patientId],
    queryFn: () => getLinkedDoctors(patientId),
    enabled: !!patientId,
  });
}

export function usePendingSentRequests(patientId: string) {
  return useQuery({
    queryKey: ['pending-sent-requests', patientId],
    queryFn: () => getPendingSentRequests(patientId),
    enabled: !!patientId,
  });
}

export function useSendLinkRequest(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendLinkRequestBody) => sendLinkRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linked-doctors', patientId] });
      queryClient.invalidateQueries({ queryKey: ['pending-sent-requests', patientId] });
    },
  });
}

export function useRevokeLinkRequest(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => revokeLinkRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.setQueryData<LinkedDoctorResponse[]>(
        ['linked-doctors', patientId],
        (old) => old?.filter((d) => d.requestId !== requestId) ?? []
      );
      queryClient.setQueryData(
        ['pending-sent-requests', patientId],
        (old: { requestId: string }[] | undefined) => old?.filter((r) => r.requestId !== requestId) ?? []
      );
    },
  });
}
