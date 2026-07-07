import { describe, it, expect } from "vitest";
import { tsDeLectura } from "./use-glucosa-resumen.helpers";

describe("tsDeLectura (helper de 'última lectura')", () => {
  it("combina fecha dd/MM/yyyy con hora HH:mm", () => {
    const a = tsDeLectura("07/07/2026", "07:30");
    const b = tsDeLectura("07/07/2026", "21:00");
    // b - a = +13.5h
    expect(b - a).toBe((13 * 60 + 30) * 60 * 1000);
  });

  it("acepta hora con segundos HH:mm:ss", () => {
    const a = tsDeLectura("07/07/2026", "07:30:00");
    const b = tsDeLectura("07/07/2026", "21:00:00");
    expect(b - a).toBe((13 * 60 + 30) * 60 * 1000);
  });

  it("lectura sin hora queda por debajo de lectura con hora el mismo día", () => {
    const sinHora = tsDeLectura("07/07/2026", null);
    const conHora = tsDeLectura("07/07/2026", "00:00");
    expect(sinHora).toBeLessThan(conHora);
  });

  it("orden: ayuno 07:30 + post-cena 21:00 → gana 21:00", () => {
    const ayuno = tsDeLectura("07/07/2026", "07:30");
    const cena = tsDeLectura("07/07/2026", "21:00");
    // Simular el comparador que usa useGlucosaResumen: b - a
    expect(cena - ayuno).toBeGreaterThan(0);
  });

  it("orden: día posterior gana aunque se insertó antes", () => {
    const ayerTemprano = tsDeLectura("06/07/2026", "23:00");
    const hoyTemprano = tsDeLectura("07/07/2026", "06:00");
    expect(hoyTemprano - ayerTemprano).toBeGreaterThan(0);
  });
});
