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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="mvxdl-toggle"
        aria-label="Ver notificaciones"
        title="Notificaciones"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </PopoverTrigger>
      <NotificationPanel notifications={notifications} onNotificationClick={onNotificationClick} />
    </Popover>
  );
}
