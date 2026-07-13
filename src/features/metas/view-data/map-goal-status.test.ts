import { describe, it, expect } from "vitest";
import { mapGoalStatus } from "./map-goal-status";

describe("mapGoalStatus", () => {
  it("InRange → en_meta / var(--ok)", () => {
    expect(mapGoalStatus("InRange", null, false)).toEqual({
      estado: "en_meta",
      color: "var(--ok)",
      isCustomGoal: false,
      reason: null,
    });
  });

  it("AtRisk → cuidado / var(--warn)", () => {
    expect(mapGoalStatus("AtRisk", null, false).estado).toBe("cuidado");
    expect(mapGoalStatus("AtRisk", null, false).color).toBe("var(--warn)");
  });

  it("OutOfRange → fuera_meta / var(--bad)", () => {
    expect(mapGoalStatus("OutOfRange", null, false).estado).toBe("fuera_meta");
    expect(mapGoalStatus("OutOfRange", null, false).color).toBe("var(--bad)");
  });

  it("NoData → sin_dato / var(--ph) y propaga el reason", () => {
    const r = mapGoalStatus("NoData", "no-recent-data", false);
    expect(r.estado).toBe("sin_dato");
    expect(r.color).toBe("var(--ph)");
    expect(r.reason).toBe("no-recent-data");
  });

  it("propaga isCustomGoal en cualquier status", () => {
    expect(mapGoalStatus("InRange", null, true).isCustomGoal).toBe(true);
  });

  it("estados non-NoData no llevan reason aunque se pase uno", () => {
    expect(mapGoalStatus("InRange", "no-recent-data", false).reason).toBeNull();
  });
});
