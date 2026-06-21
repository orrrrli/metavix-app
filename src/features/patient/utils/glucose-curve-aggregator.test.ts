import { describe, it, expect } from "vitest";
import { aggregateGlucoseCurvesByDate } from "./glucose-curve-aggregator";
import { GlucoseReadingType, DailyRecordResponse } from "@/types/daily-record";

function makeRecord(overrides: Partial<DailyRecordResponse>): DailyRecordResponse {
  return {
    id: crypto.randomUUID(),
    patientId: "patient-1",
    recordDate: "21/06/2026",
    recordTime: null,
    systolicPressure: null,
    diastolicPressure: null,
    heartRate: null,
    weightKg: null,
    waistCm: null,
    notes: null,
    createdAt: new Date().toISOString(),
    glucoseReadings: [],
    ...overrides,
  };
}

const readingA = { id: "r1", readingType: GlucoseReadingType.Fasting,       valueMgDl: 95,  time: "07:00:00", foods: null };
const readingB = { id: "r2", readingType: GlucoseReadingType.PostBreakfast,  valueMgDl: 140, time: "09:00:00", foods: null };
const readingC = { id: "r3", readingType: GlucoseReadingType.PreLunch,       valueMgDl: 110, time: "13:00:00", foods: null };

describe("aggregateGlucoseCurvesByDate", () => {
  it("merges glucoseReadings from two same-date records into one day entry", () => {
    const records = [
      makeRecord({ createdAt: "2026-06-21T08:00:00Z", glucoseReadings: [readingA] }),
      makeRecord({ createdAt: "2026-06-21T14:00:00Z", glucoseReadings: [readingB] }),
    ];

    const result = aggregateGlucoseCurvesByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0].glucoseReadings).toHaveLength(2);
    expect(result[0].glucoseReadings.map(r => r.id)).toContain("r1");
    expect(result[0].glucoseReadings.map(r => r.id)).toContain("r2");
  });

  it("places readings from the earlier-created record first (T3 sort order)", () => {
    const records = [
      makeRecord({ createdAt: "2026-06-21T14:00:00Z", glucoseReadings: [readingB] }),
      makeRecord({ createdAt: "2026-06-21T08:00:00Z", glucoseReadings: [readingA] }),
    ];

    const result = aggregateGlucoseCurvesByDate(records);

    expect(result[0].glucoseReadings[0].id).toBe("r1");
    expect(result[0].glucoseReadings[1].id).toBe("r2");
  });

  it("keeps separate day entries for different dates", () => {
    const records = [
      makeRecord({ recordDate: "21/06/2026", createdAt: "2026-06-21T08:00:00Z", glucoseReadings: [readingA] }),
      makeRecord({ recordDate: "20/06/2026", createdAt: "2026-06-20T08:00:00Z", glucoseReadings: [readingB] }),
    ];

    const result = aggregateGlucoseCurvesByDate(records);

    expect(result).toHaveLength(2);
  });

  it("excludes records with no glucose readings", () => {
    const records = [
      makeRecord({ glucoseReadings: [] }),
      makeRecord({ glucoseReadings: [readingC] }),
    ];

    const result = aggregateGlucoseCurvesByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0].glucoseReadings[0].id).toBe("r3");
  });

  it("returns an empty array when all records have no glucose readings", () => {
    const records = [makeRecord({ glucoseReadings: [] })];

    const result = aggregateGlucoseCurvesByDate(records);

    expect(result).toHaveLength(0);
  });

  it("is unchanged for a single record per date", () => {
    const records = [makeRecord({ glucoseReadings: [readingA, readingB] })];

    const result = aggregateGlucoseCurvesByDate(records);

    expect(result).toHaveLength(1);
    expect(result[0].glucoseReadings).toHaveLength(2);
  });
});
