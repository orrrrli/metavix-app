import type { NotificationResponse } from "@/types/notification";

export interface NotificationsViewData {
  /** Todas las notificaciones ordenadas por fecha descendente (más reciente primero). */
  ordenadas: NotificationResponse[];
  /** Número de no leídas (alimenta el badge de la campana). */
  unreadCount: number;
}

/**
 * Compone el view data de la bandeja de notificaciones: ordena por fecha
 * descendente y cuenta las no leídas. Puro y testeable; el fetch vive en
 * `NotificationControl`.
 */
export function buildNotificationsViewData(
  notifications: NotificationResponse[] = [],
): NotificationsViewData {
  const ordenadas = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const unreadCount = ordenadas.filter((n) => !n.isRead).length;
  return { ordenadas, unreadCount };
}
