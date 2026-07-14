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
    expect(vd.ordenadas).toEqual([]);
    expect(vd.unreadCount).toBe(0);
    expect(vd.hasUnread).toBe(false);
  });

  it("ordena por fecha descendente (más reciente primero)", () => {
    const vd = buildNotificationsViewData([
      makeNotification({ id: "vieja", createdAt: "2026-07-01T10:00:00Z" }),
      makeNotification({ id: "nueva", createdAt: "2026-07-10T10:00:00Z" }),
    ]);
    expect(vd.ordenadas.map((n) => n.id)).toEqual(["nueva", "vieja"]);
  });

  it("cuenta las no leídas", () => {
    const vd = buildNotificationsViewData([
      makeNotification({ id: "a", isRead: false }),
      makeNotification({ id: "b", isRead: true }),
      makeNotification({ id: "c", isRead: false }),
    ]);
    expect(vd.unreadCount).toBe(2);
    expect(vd.hasUnread).toBe(true);
  });

  it("no muta el array original", () => {
    const input = [
      makeNotification({ id: "a", createdAt: "2026-07-01T10:00:00Z" }),
      makeNotification({ id: "b", createdAt: "2026-07-10T10:00:00Z" }),
    ];
    buildNotificationsViewData(input);
    expect(input[0].id).toBe("a");
  });
});
