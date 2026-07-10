import { useQuery } from '@tanstack/react-query';
import { getMyNotifications } from '@/lib/api/notification';

export function useMyNotifications() {
  return useQuery({
    queryKey: ['my-notifications'],
    queryFn: getMyNotifications,
  });
}
