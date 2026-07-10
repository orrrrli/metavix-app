"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { NotificationResponse } from "@/types/notification";
import {
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils";

export interface NotificationPanelProps {
  notifications: NotificationResponse[];
  onNotificationClick?: (id: string) => void;
}

export function NotificationPanel({ notifications, onNotificationClick }: NotificationPanelProps) {
  return (
    <PopoverContent align="end" className="w-80">
      <PopoverHeader>
        <PopoverTitle>Notificaciones</PopoverTitle>
      </PopoverHeader>

      {notifications.length === 0 ? (
        <p className="py-6 text-center text-muted-foreground">No hay notificaciones nuevas</p>
      ) : (
        <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => onNotificationClick?.(notification.id)}
                className={cn(
                  "flex w-full flex-col gap-0.5 rounded-md p-2 text-left transition-colors hover:bg-accent",
                  !notification.isRead && "bg-accent/50"
                )}
              >
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(notification.createdAt), "d MMM yyyy, HH:mm", { locale: es })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </PopoverContent>
  );
}
