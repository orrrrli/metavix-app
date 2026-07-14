import type { NotificationResponse } from "@/types/notification";

export interface NotificationsViewData {
  /** Notificaciones tal cual las devuelve el backend (ya ordenadas newest-first). */
  items: NotificationResponse[];
  /** Número de no leídas (alimenta el badge de la campana). */
  unreadCount: number;
}

/**
 * Compone el view data de la bandeja de notificaciones y cuenta las no leídas.
 * El backend ya devuelve las notificaciones ordenadas por fecha descendente
 * (`OrderByDescending(CreatedAt)`), así que aquí no se re-ordena. Puro y
 * testeable; el fetch vive en `NotificationControl`.
 */
export function buildNotificationsViewData(
  notifications: NotificationResponse[] = [],
): NotificationsViewData {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return { items: notifications, unreadCount };
}
