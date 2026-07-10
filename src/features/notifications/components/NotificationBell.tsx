"use client";

import { useState } from "react";
import type { NotificationResponse } from "@/types/notification";
import { Popover, PopoverTrigger } from "@/shared/components/ui/popover";
import { NotificationPanel } from "./NotificationPanel";

export interface NotificationBellProps {
  notifications?: NotificationResponse[];
  onNotificationClick?: (id: string) => void;
}

export function NotificationBell({ notifications = [], onNotificationClick }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <span style={{ position: "relative", display: "inline-flex" }}>
        <PopoverTrigger
          className="mvxdl-toggle"
          aria-label={unreadCount > 0 ? `Ver notificaciones (${unreadCount} sin leer)` : "Ver notificaciones"}
          title="Notificaciones"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </PopoverTrigger>
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: "50%",
              background: "var(--bad)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              lineHeight: "16px",
              textAlign: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </span>
      <NotificationPanel notifications={notifications} onNotificationClick={onNotificationClick} />
    </Popover>
  );
}
