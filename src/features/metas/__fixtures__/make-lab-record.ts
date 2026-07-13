import type { LabRecordResponse } from "@/types/lab-record";

export function makeLabRecord(
  overrides: Partial<LabRecordResponse> = {},
): LabRecordResponse {
  return {
    id: "lab-1",
    patientId: "patient-1",
    sampleDate: "01/07/2026",
    hba1c: 6.5,
    totalCholesterol: 180,
    ldl: 95,
    hdl: 50,
    triglycerides: 120,
    creatinine: 0.9,
    bun: 15,
    egoProteins: null,
    egoGlucose: null,
    notes: null,
    createdAt: "2026-07-01T00:00:00Z",
    ...overrides,
  };
}

export function makeLabRecords(
  overrides: Partial<LabRecordResponse>[] = [],
): LabRecordResponse[] {
  return overrides.length > 0 ? overrides.map(makeLabRecord) : [makeLabRecord()];
}
