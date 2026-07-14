import type { InsulinRecordResponse } from "@/types/insulin-dm1";

export function makeInsulinRecord(
  overrides: Partial<InsulinRecordResponse> = {},
): InsulinRecordResponse {
  return {
    id: "ins-1",
    patientId: "patient-1",
    recordDate: "01/07/2026",
    glucoseBefore: 110,
    glucoseAfter: 140,
    totalCarbs: 45,
    doseApplied: 5,
    mealDescription: null,
    howIFelt: null,
    createdAt: "2026-07-01T00:00:00Z",
    ...overrides,
  };
}
