import { describe, it, expect } from "vitest";
import {
  GlucoseReadingType,
  normalizeReadingType,
  normalizeDailyRecord,
  type DailyRecordResponse,
} from "./daily-record";

// La API serializa `readingType` como string (JsonStringEnumConverter);
// el frontend trabaja con el enum numérico. El normalizador de la capa de fetch
// es lo que evita el TypeError "Cannot read properties of undefined (reading 'sup')".

describe("normalizeReadingType", () => {
  it("convierte el string enum de la API al valor numérico", () => {
    expect(normalizeReadingType("Fasting")).toBe(GlucoseReadingType.Fasting);
    expect(normalizeReadingType("PostBreakfast")).toBe(GlucoseReadingType.PostBreakfast);
    expect(normalizeReadingType("Overnight")).toBe(GlucoseReadingType.Overnight);
  });

  it("deja intacto un valor numérico válido", () => {
    expect(normalizeReadingType(0)).toBe(GlucoseReadingType.Fasting);
    expect(normalizeReadingType(7)).toBe(GlucoseReadingType.Overnight);
  });

  it("cae a Fasting ante tipos desconocidos para no romper los rangos", () => {
    expect(normalizeReadingType("Desayuno")).toBe(GlucoseReadingType.Fasting);
    expect(normalizeReadingType(99)).toBe(GlucoseReadingType.Fasting);
    expect(normalizeReadingType(null)).toBe(GlucoseReadingType.Fasting);
    expect(normalizeReadingType(undefined)).toBe(GlucoseReadingType.Fasting);
  });
});

describe("normalizeDailyRecord", () => {
  it("normaliza readingType en cada lectura", () => {
    const rec = {
      id: "r1",
      patientId: "p1",
      recordDate: "10/07/2026",
      recordTime: null,
      systolicPressure: null,
      diastolicPressure: null,
      heartRate: null,
      weightKg: null,
      waistCm: null,
      notes: null,
      createdAt: "2026-07-10T00:00:00Z",
      glucoseReadings: [
        { id: "g1", readingType: "Fasting" as unknown as GlucoseReadingType, valueMgDl: 95, time: "07:00:00", foods: null },
        { id: "g2", readingType: "PostLunch" as unknown as GlucoseReadingType, valueMgDl: 160, time: "14:00:00", foods: null },
      ],
    } as DailyRecordResponse;

    const out = normalizeDailyRecord(rec);
    expect(out.glucoseReadings[0].readingType).toBe(GlucoseReadingType.Fasting);
    expect(out.glucoseReadings[1].readingType).toBe(GlucoseReadingType.PostLunch);
  });
});