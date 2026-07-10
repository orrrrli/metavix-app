import { NotificationResponse } from '@/types/notification';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const API  = `${BASE}/api/v1`;

export async function getMyNotifications(): Promise<NotificationResponse[]> {
  const res = await fetch(`${API}/notifications`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getMyNotifications] ${res.status}`);
  const body = await res.json();
  return body.data;
}
