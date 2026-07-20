import { describe, it, expect } from "vitest";
import { buildHistorialViewData, tipoDiabetesDePerfil } from "./build-historial-view-data";
import { makeDailyRecord, makeGlucoseReading } from "@/features/metas/__fixtures__/make-daily-record";
import { makeLabRecord } from "@/features/metas/__fixtures__/make-lab-record";
import { GlucoseReadingType } from "@/types/daily-record";

describe("tipoDiabetesDePerfil", () => {
  it("embarazo con diabetes gana sobre el tipo", () => {
    expect(tipoDiabetesDePerfil("Type2", true)).toBe("embarazo");
  });
  it("embarazo sin diabetes NO es 'embarazo'", () => {
    expect(tipoDiabetesDePerfil("None", true)).toBe("sin_diabetes");
  });
  it("mapea tipos base", () => {
    expect(tipoDiabetesDePerfil("Type1", false)).toBe("dm1");
    expect(tipoDiabetesDePerfil("Prediabetes", false)).toBe("prediabetes");
    expect(tipoDiabetesDePerfil(undefined, undefined)).toBe("sin_diabetes");
  });
});

describe("buildHistorialViewData", () => {
  it("deriva flags de diabetes/embarazo del perfil", () => {
    const vd = buildHistorialViewData([], [], "Type2", true);
    expect(vd.hasDiabetes).toBe(true);
    expect(vd.isPregnant).toBe(true);
    expect(vd.tipoDiabetes).toBe("embarazo");
  });

  it("mapea daily: separa ayuno de comidas y conserva readingType", () => {
    const daily = makeDailyRecord({
      recordDate: "05/07/2026",
      glucoseReadings: [
        makeGlucoseReading({ readingType: GlucoseReadingType.Fasting, valueMgDl: 90 }),
        makeGlucoseReading({ readingType: GlucoseReadingType.PostLunch, valueMgDl: 140 }),
      ],
    });
    const { registros } = buildHistorialViewData([daily], [], "None", false);
    expect(registros).toHaveLength(1);
    expect(registros[0].glucosa_ayuno).toBe(90);
    expect(registros[0].glucosas_comidas).toHaveLength(1);
    expect(registros[0].glucosas_comidas![0].readingType).toBe(GlucoseReadingType.PostLunch);
  });

  it("fusiona daily + lab de la misma fecha en un solo registro", () => {
    const daily = makeDailyRecord({ recordDate: "05/07/2026" });
    const lab = makeLabRecord({ sampleDate: "05/07/2026", hba1c: 7.1 });
    const { registros } = buildHistorialViewData([daily], [lab], "None", false);
    expect(registros).toHaveLength(1);
    expect(registros[0].hba1c).toBe(7.1);
    expect(registros[0].peso).toBe(70);
  });

  it("ordena por fecha descendente", () => {
    const a = makeDailyRecord({ id: "a", recordDate: "01/07/2026" });
    const b = makeDailyRecord({ id: "b", recordDate: "10/07/2026" });
    const { registros } = buildHistorialViewData([a, b], [], "None", false);
    expect(registros.map((r) => r.fecha)).toEqual(["10/07/2026", "01/07/2026"]);
  });

  it("deduplica comidas idénticas al fusionar dos daily de la misma fecha", () => {
    const reading = makeGlucoseReading({ readingType: GlucoseReadingType.PostLunch, valueMgDl: 140, time: "13:00:00.000" });
    const d1 = makeDailyRecord({ id: "d1", recordDate: "05/07/2026", glucoseReadings: [reading] });
    const d2 = makeDailyRecord({ id: "d2", recordDate: "05/07/2026", glucoseReadings: [reading] });
    const { registros } = buildHistorialViewData([d1, d2], [], "None", false);
    expect(registros[0].glucosas_comidas).toHaveLength(1);
  });
});
