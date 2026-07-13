import { describe, it, expect } from "vitest";
import { calcularDosis } from "./calcular-dosis";

// Base: RIC 10, FS 50, meta 110. dosisComida = hc/ric.
const base = { hc: 50, glucosa: 110, meta: 110, ric: 10, fs: 50 };

describe("calcularDosis — guards", () => {
  it("devuelve null si falta HC", () => {
    expect(calcularDosis({ ...base, hc: 0 })).toBeNull();
  });
  it("devuelve null si falta glucosa", () => {
    expect(calcularDosis({ ...base, glucosa: 0 })).toBeNull();
  });
  it("devuelve null si RIC es 0 (evita división por cero)", () => {
    expect(calcularDosis({ ...base, ric: 0 })).toBeNull();
  });
  it("devuelve null si FS es 0", () => {
    expect(calcularDosis({ ...base, fs: 0 })).toBeNull();
  });
  it("devuelve null si meta es 0", () => {
    expect(calcularDosis({ ...base, meta: 0 })).toBeNull();
  });
  it("devuelve null con NaN (input no numérico)", () => {
    expect(calcularDosis({ ...base, hc: NaN })).toBeNull();
  });
});

describe("calcularDosis — hipoglucemia (< 70)", () => {
  it("glucosa 69 → danger, todas las dosis en 0", () => {
    const r = calcularDosis({ ...base, glucosa: 69 });
    expect(r).toEqual({
      dosisComida: 0,
      dosisCorreccion: 0,
      total: 0,
      alerta: { variant: "danger", msg: expect.stringContaining("HIPOGLUCEMIA") },
    });
  });

  it("glucosa 70 NO es hipoglucemia (límite inferior)", () => {
    const r = calcularDosis({ ...base, glucosa: 70, meta: 70 });
    expect(r?.alerta?.variant).not.toBe("danger");
    expect(r?.dosisComida).toBeGreaterThan(0);
  });
});

describe("calcularDosis — bandas de alerta por glucosa", () => {
  it("glucosa 110 (≤130) → success EN META", () => {
    expect(calcularDosis({ ...base, glucosa: 110 })?.alerta).toEqual({
      variant: "success",
      msg: expect.stringContaining("EN META"),
    });
  });

  it("glucosa 130 → success (frontera: >130 es la que sube a warning)", () => {
    expect(calcularDosis({ ...base, glucosa: 130, meta: 130 })?.alerta?.variant).toBe(
      "success",
    );
  });

  it("glucosa 131 → warning ALTA", () => {
    expect(calcularDosis({ ...base, glucosa: 131 })?.alerta).toEqual({
      variant: "warning",
      msg: expect.stringContaining("ALTA"),
    });
  });

  it("glucosa 250 → warning (frontera: >250 es la que sube a danger)", () => {
    expect(calcularDosis({ ...base, glucosa: 250 })?.alerta?.variant).toBe("warning");
  });

  it("glucosa 251 → danger MUY ALTA", () => {
    expect(calcularDosis({ ...base, glucosa: 251 })?.alerta).toEqual({
      variant: "danger",
      msg: expect.stringContaining("MUY ALTA"),
    });
  });
});

describe("calcularDosis — cálculo de dosis", () => {
  it("en meta: sólo dosis por comida, sin corrección", () => {
    // hc 50 / ric 10 = 5.0; glucosa == meta → sin corrección
    const r = calcularDosis({ ...base, glucosa: 110, meta: 110 });
    expect(r?.dosisComida).toBe(5);
    expect(r?.dosisCorreccion).toBe(0);
    expect(r?.total).toBe(5);
  });

  it("alta: añade corrección (glucosa − meta) / fs", () => {
    // comida 5.0 + corrección (200-110)/50 = 1.8 → total 6.8 → redondeo 0.5 = 7.0
    const r = calcularDosis({ hc: 50, glucosa: 200, meta: 110, ric: 10, fs: 50 });
    expect(r?.dosisComida).toBe(5);
    expect(r?.dosisCorreccion).toBe(1.8);
    expect(r?.total).toBe(7);
  });

  it("no corrige si glucosa ≤ meta aunque esté 'alta' por banda", () => {
    // glucosa 130 pero meta 140 → no hay corrección
    const r = calcularDosis({ hc: 50, glucosa: 130, meta: 140, ric: 10, fs: 50 });
    expect(r?.dosisCorreccion).toBe(0);
  });

  it("redondea el total a 0.5 U", () => {
    // comida 45/10 = 4.5; corrección (160-110)/50 = 1.0 → 5.5
    const r = calcularDosis({ hc: 45, glucosa: 160, meta: 110, ric: 10, fs: 50 });
    expect(r?.total).toBe(5.5);
  });

  it("muy alta (>250) también calcula corrección", () => {
    const r = calcularDosis({ hc: 30, glucosa: 300, meta: 100, ric: 10, fs: 50 });
    // comida 3.0 + corrección (300-100)/50 = 4.0 → 7.0
    expect(r?.dosisComida).toBe(3);
    expect(r?.dosisCorreccion).toBe(4);
    expect(r?.total).toBe(7);
    expect(r?.alerta?.variant).toBe("danger");
  });
});
