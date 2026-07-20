import { describe, it, expect } from "vitest";
import { parseApiDate } from "./parse-api-date";

// La API serializa DateOnly como "dd/MM/yyyy"; parseISO no lo resolvía y devolvía
// Invalid Date, lo que hacía que el banner de embarazo se mostrara siempre (NaN >= 0).

describe("parseApiDate", () => {
  it("parsea el formato de la API dd/MM/yyyy", () => {
    const d = parseApiDate("01/12/2026")!;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(11); // diciembre (0-index)
    expect(d.getDate()).toBe(1);
  });

  it("parsea ISO yyyy-MM-dd", () => {
    const d = parseApiDate("2026-12-01")!;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(11);
    expect(d.getDate()).toBe(1);
  });

  it("parsea ISO 8601 completo (createdAt)", () => {
    const d = parseApiDate("2026-07-10T15:56:36Z")!;
    expect(d.getUTCFullYear()).toBe(2026);
  });

  it("devuelve null para entradas inválidas o vacías", () => {
    expect(parseApiDate("")).toBeNull();
    expect(parseApiDate(null)).toBeNull();
    expect(parseApiDate(undefined)).toBeNull();
    expect(parseApiDate("no-es-una-fecha")).toBeNull();
  });

  it("devuelve null para dd/MM/yyyy con mes fuera de rango en vez de desbordar al año siguiente", () => {
    // new Date(2026, 12, 1) desborda a enero 2027; debe rechazarse, no aceptarse.
    expect(parseApiDate("01/13/2026")).toBeNull();
  });

  it("devuelve null para dd/MM/yyyy con día fuera de rango en vez de desbordar al mes siguiente", () => {
    // new Date(2026, 1, 30) desborda a marzo (febrero no tiene 30 días).
    expect(parseApiDate("30/02/2026")).toBeNull();
  });
});