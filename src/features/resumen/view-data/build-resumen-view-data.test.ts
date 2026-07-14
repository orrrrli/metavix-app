import { describe, it, expect } from "vitest";
import { makeResumen } from "@/features/resumen/__fixtures__/make-resumen";
import { buildResumenViewData } from "./build-resumen-view-data";

describe("buildResumenViewData", () => {
  it("devuelve las 5 secciones en orden", () => {
    const vd = buildResumenViewData(makeResumen());
    expect(vd.secciones.map((s) => s.titulo)).toEqual([
      "Control Glucémico",
      "Presión Arterial y Corazón",
      "Peso y Composición Corporal",
      "Perfil de Lípidos",
      "Función Renal",
    ]);
  });

  it("todasNulas true cuando no hay ninguna métrica", () => {
    expect(buildResumenViewData(makeResumen()).todasNulas).toBe(true);
  });

  it("todasNulas false cuando hay al menos una métrica", () => {
    const vd = buildResumenViewData(
      makeResumen({ metricas: { hba1c: { valor: 6.5, fecha: "01/07/2026" } } }),
    );
    expect(vd.todasNulas).toBe(false);
  });

  it("evalúa estado/meta para métricas con status", () => {
    const vd = buildResumenViewData(
      makeResumen({
        perfil: { tipoDiabetes: "tipo_2" },
        metricas: { glucosaAyuno: { valor: 100, fecha: "01/07/2026" } },
      }),
    );
    const glucosa = vd.secciones[0].metricas.find((m) => m.id === "glucosaAyuno");
    // con diabetes tipo 2, 80-130 → en_meta
    expect(glucosa?.estado).toBe("en_meta");
    expect(glucosa?.meta).toBeTruthy();
    expect(glucosa?.valor).toBe(100);
  });

  it("el peso es informativo: sin estado ni meta", () => {
    const vd = buildResumenViewData(
      makeResumen({ metricas: { peso: { valor: 70, fecha: "01/07/2026" } } }),
    );
    const peso = vd.secciones[2].metricas.find((m) => m.id === "peso");
    expect(peso?.valor).toBe(70);
    expect(peso?.estado).toBeUndefined();
    expect(peso?.meta).toBeUndefined();
  });

  it("propaga el nombre del paciente", () => {
    const vd = buildResumenViewData(makeResumen({ perfil: { nombre: "Juan Pérez" } }));
    expect(vd.nombrePaciente).toBe("Juan Pérez");
  });
});
