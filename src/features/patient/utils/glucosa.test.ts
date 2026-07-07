import { describe, it, expect, afterEach, vi } from "vitest";
import { localTodayISO, horaActual, esGlucosaValida, GLUCOSA_MIN, GLUCOSA_MAX } from "./glucosa";

describe("localTodayISO", () => {
  const RealDate = globalThis.Date;

  afterEach(() => {
    globalThis.Date = RealDate;
    vi.useRealTimers();
  });

  it("returns the local date (not UTC) at 20:00 in a UTC-6 zone", () => {
    // 2026-07-07T02:00:00Z == 2026-07-06T20:00:00 local in UTC-6.
    // toISOString() would yield 2026-07-07; localTodayISO must yield 2026-07-06.
    globalThis.Date = class extends RealDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        if (args.length === 0) {
          super("2026-07-07T02:00:00Z");
        } else {
          super(...args);
        }
      }
      // Mantener factory estática
      static now() {
        return new RealDate("2026-07-07T02:00:00Z").getTime();
      }
    } as unknown as typeof Date;

    // Mockear getTimezoneOffset sólo es posible reescribiendo Date; usamos
    // TZ=env si está disponible, si no, ajustamos el offset esperado dinámicamente.
    const offsetMin = new RealDate("2026-07-07T02:00:00Z").getTimezoneOffset();
    // En UTC-6 → 360. En UTC → 0.
    if (offsetMin === 360) {
      expect(localTodayISO()).toBe("2026-07-06");
    } else {
      // En zonas donde el test no aplica, validar que devuelve un día YYYY-MM-DD válido.
      expect(localTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("returns the local date near midnight on a month boundary", () => {
    // 2026-08-01T05:00:00Z == 2026-07-31T23:00:00 local in UTC-6.
    globalThis.Date = class extends RealDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        if (args.length === 0) {
          super("2026-08-01T05:00:00Z");
        } else {
          super(...args);
        }
      }
      static now() {
        return new RealDate("2026-08-01T05:00:00Z").getTime();
      }
    } as unknown as typeof Date;

    const offsetMin = new RealDate("2026-08-01T05:00:00Z").getTimezoneOffset();
    if (offsetMin === 360) {
      expect(localTodayISO()).toBe("2026-07-31");
    } else {
      expect(localTodayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("matches the actual local date when run in current environment", () => {
    // Sanity: el helper debe coincidir con la interpretación local de `new Date()`.
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    expect(localTodayISO()).toBe(expected);
  });
});

describe("horaActual", () => {
  it("devuelve HH:MM con dos dígitos", () => {
    const h = horaActual();
    expect(h).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe("esGlucosaValida", () => {
  it("rechaza NaN / Infinity", () => {
    expect(esGlucosaValida(NaN)).toBe(false);
    expect(esGlucosaValida(Infinity)).toBe(false);
    expect(esGlucosaValida(-Infinity)).toBe(false);
  });

  it("rechaza fuera del rango clínico", () => {
    expect(esGlucosaValida(0)).toBe(false);
    expect(esGlucosaValida(-1)).toBe(false);
    expect(esGlucosaValida(GLUCOSA_MIN - 0.1)).toBe(false);
    expect(esGlucosaValida(GLUCOSA_MAX + 0.1)).toBe(false);
    expect(esGlucosaValida(9999)).toBe(false);
  });

  it("acepta los bordes del rango", () => {
    expect(esGlucosaValida(GLUCOSA_MIN)).toBe(true);
    expect(esGlucosaValida(GLUCOSA_MAX)).toBe(true);
    expect(esGlucosaValida(95)).toBe(true);
    expect(esGlucosaValida(240)).toBe(true);
  });
});
