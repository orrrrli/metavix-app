import { describe, it, expect } from "vitest";
import { buildPregnancyBanners } from "./build-pregnancy-banners";
import { makeProfile } from "../__fixtures__/make-profile";

const NOW = new Date(2026, 6, 13); // 13/07/2026

describe("buildPregnancyBanners", () => {
  it("profile null → todo false", () => {
    expect(buildPregnancyBanners(null, NOW)).toEqual({
      showPregnancyMode: false,
      pregnancyDeactivated: false,
      dueDateReached: false,
    });
  });

  it("isPregnant → showPregnancyMode true", () => {
    expect(
      buildPregnancyBanners(makeProfile({ isPregnant: true }), NOW).showPregnancyMode,
    ).toBe(true);
  });

  it("!isPregnant con pregnancyStartDate → pregnancyDeactivated true", () => {
    const b = buildPregnancyBanners(
      makeProfile({ isPregnant: false, pregnancyStartDate: "01/01/2026" }),
      NOW,
    );
    expect(b.pregnancyDeactivated).toBe(true);
  });

  it("isPregnant con dueDate pasada → dueDateReached true", () => {
    const b = buildPregnancyBanners(
      makeProfile({ isPregnant: true, pregnancyDueDate: "01/07/2026" }),
      NOW,
    );
    expect(b.dueDateReached).toBe(true);
  });

  it("isPregnant con dueDate futura → dueDateReached false", () => {
    const b = buildPregnancyBanners(
      makeProfile({ isPregnant: true, pregnancyDueDate: "01/12/2026" }),
      NOW,
    );
    expect(b.dueDateReached).toBe(false);
  });
});
