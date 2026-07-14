import { describe, it, expect } from "vitest";
import { buildProfileIdentity, formatMemberSince } from "./profile-identity";

describe("buildProfileIdentity", () => {
  it("nombre y apellido → fullName e iniciales", () => {
    expect(buildProfileIdentity("Carlos", "Ramírez")).toEqual({
      fullName: "Carlos Ramírez",
      initials: "CR",
    });
  });

  it("sin nombre → fullName '—' e iniciales '?'", () => {
    expect(buildProfileIdentity("", "")).toEqual({ fullName: "—", initials: "?" });
    expect(buildProfileIdentity(null, undefined)).toEqual({
      fullName: "—",
      initials: "?",
    });
  });

  it("sólo nombre → una inicial", () => {
    expect(buildProfileIdentity("Ana", null)).toEqual({
      fullName: "Ana",
      initials: "A",
    });
  });
});

describe("formatMemberSince", () => {
  it("ISO válido → 'mes año' en español", () => {
    expect(formatMemberSince("2026-01-15T00:00:00Z")).toBe("enero 2026");
  });

  it("fecha inválida o vacía → '—'", () => {
    expect(formatMemberSince("no-date")).toBe("—");
    expect(formatMemberSince(null)).toBe("—");
    expect(formatMemberSince(undefined)).toBe("—");
  });
});
