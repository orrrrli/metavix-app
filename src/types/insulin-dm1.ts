export interface UpsertInsulinProfileRequest {
  insulinName: string | null;
  ric: number | null;
  sensitivityFactor: number | null;
  targetGlucose: number | null;
  doctorName: string | null;
  doctorPhone: string | null;
}

export interface InsulinProfileResponse {
  id: string;
  patientId: string;
  insulinName: string | null;
  ric: number | null;
  sensitivityFactor: number | null;
  targetGlucose: number | null;
  doctorName: string | null;
  doctorPhone: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateInsulinRecordRequest {
  recordDate: string; // "YYYY-MM-DD"
  glucoseBefore: number | null;
  glucoseAfter: number | null;
  totalCarbs: number | null;
  doseApplied: number | null;
  mealDescription: string | null;
  howIFelt: string | null;
}

export interface InsulinRecordResponse {
  id: string;
  patientId: string;
  recordDate: string; // "dd/MM/yyyy"
  glucoseBefore: number | null;
  glucoseAfter: number | null;
  totalCarbs: number | null;
  doseApplied: number | null;
  mealDescription: string | null;
  howIFelt: string | null;
  createdAt: string; // ISO 8601
}
