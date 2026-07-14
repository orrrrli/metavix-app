"use client";

import {
  useMyNotifications,
  useMarkNotificationRead,
} from "../../hooks/use-notifications";
import { buildNotificationsViewData } from "../../view-data/build-notifications-view-data";
import { NotificationBell } from "../NotificationBell";

/**
 * Wrapper de la bandeja de notificaciones: cablea las queries/mutation y pasa
 * las notificaciones ya ordenadas (view-data) a la campana. Reemplaza el
 * cableado inline que vivía en `doctor/layout.tsx`.
 */
export function NotificationControl() {
  const { data: notifications } = useMyNotifications();
  const { mutate: markNotificationRead } = useMarkNotificationRead();

  const { ordenadas } = buildNotificationsViewData(notifications ?? []);

  return (
    <NotificationBell
      notifications={ordenadas}
      onNotificationClick={markNotificationRead}
    />
  );
}
