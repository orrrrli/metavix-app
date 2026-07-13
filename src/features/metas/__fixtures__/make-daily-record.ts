import {
  GlucoseReadingType,
  type DailyRecordResponse,
  type GlucoseReadingResponse,
} from "@/types/daily-record";

export function makeGlucoseReading(
  overrides: Partial<GlucoseReadingResponse> = {},
): GlucoseReadingResponse {
  return {
    id: "glu-1",
    readingType: GlucoseReadingType.Fasting,
    valueMgDl: 100,
    time: "07:00:00.000",
    foods: null,
    ...overrides,
  };
}

export function makeDailyRecord(
  overrides: Partial<DailyRecordResponse> = {},
): DailyRecordResponse {
  return {
    id: "daily-1",
    patientId: "patient-1",
    recordDate: "01/07/2026",
    recordTime: "07:00:00.000",
    systolicPressure: 120,
    diastolicPressure: 78,
    heartRate: 72,
    weightKg: 70,
    waistCm: 85,
    notes: null,
    createdAt: "2026-07-01T00:00:00Z",
    glucoseReadings: [],
    ...overrides,
  };
}

export function makeDailyRecords(
  overrides: Partial<DailyRecordResponse>[] = [],
): DailyRecordResponse[] {
  return overrides.length > 0
    ? overrides.map(makeDailyRecord)
    : [makeDailyRecord()];
}
