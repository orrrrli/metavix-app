import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyNotifications, markNotificationRead } from '@/lib/api/notification';

export function useMyNotifications() {
  return useQuery({
    queryKey: ['my-notifications'],
    queryFn: getMyNotifications,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    },
  });
}
