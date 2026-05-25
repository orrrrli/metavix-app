// Dates come from the API as "dd/MM/yyyy".
// When sending sampleDate to the API, use ISO format "YYYY-MM-DD".

export interface CreateLabRecordRequest {
  sampleDate: string; // "YYYY-MM-DD"
  hba1c: number | null;
  totalCholesterol: number | null;
  ldl: number | null;
  hdl: number | null;
  triglycerides: number | null;
  creatinine: number | null;
  bun: number | null;
  egoProteins: string | null;
  egoGlucose: string | null;
  notes: string | null;
}

export interface LabRecordResponse {
  id: string;
  patientId: string;
  sampleDate: string; // "dd/MM/yyyy"
  hba1c: number | null;
  totalCholesterol: number | null;
  ldl: number | null;
  hdl: number | null;
  triglycerides: number | null;
  creatinine: number | null;
  bun: number | null;
  egoProteins: string | null;
  egoGlucose: string | null;
  notes: string | null;
  createdAt: string; // ISO 8601
}
