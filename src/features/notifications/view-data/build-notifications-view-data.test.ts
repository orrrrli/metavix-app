import { describe, it, expect } from "vitest";
import type { NotificationResponse } from "@/types/notification";
import { buildNotificationsViewData } from "./build-notifications-view-data";

function makeNotification(
  overrides: Partial<NotificationResponse> = {},
): NotificationResponse {
  return {
    id: "n-1",
    title: "Título",
    body: "Cuerpo",
    type: "info",
    isRead: false,
    createdAt: "2026-07-01T10:00:00Z",
    ...overrides,
  };
}

describe("buildNotificationsViewData", () => {
  it("sin notificaciones → vacío, 0 no leídas", () => {
    const vd = buildNotificationsViewData([]);
    expect(vd.items).toEqual([]);
    expect(vd.unreadCount).toBe(0);
  });

  it("preserva el orden del backend (no re-ordena)", () => {
    const vd = buildNotificationsViewData([
      makeNotification({ id: "nueva", createdAt: "2026-07-10T10:00:00Z" }),
      makeNotification({ id: "vieja", createdAt: "2026-07-01T10:00:00Z" }),
    ]);
    expect(vd.items.map((n) => n.id)).toEqual(["nueva", "vieja"]);
  });

  it("cuenta las no leídas", () => {
    const vd = buildNotificationsViewData([
      makeNotification({ id: "a", isRead: false }),
      makeNotification({ id: "b", isRead: true }),
      makeNotification({ id: "c", isRead: false }),
    ]);
    expect(vd.unreadCount).toBe(2);
  });
});
