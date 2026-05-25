// Dates come from the API as "dd/MM/yyyy". Times as "HH:mm:ss.fff".
// When sending dates, use "YYYY-MM-DD". When sending times, use "HH:mm:ss" or "HH:mm:ss.fff".

export enum GlucoseReadingType {
  Fasting = 0,
  PostBreakfast = 1,
  PreLunch = 2,
  PostLunch = 3,
  PreDinner = 4,
  PostDinner = 5,
  Snack = 6,
  Overnight = 7,
}

export interface GlucoseReadingRequest {
  readingType: GlucoseReadingType;
  valueMgDl: number;
  time: string | null; // "HH:mm:ss"
  foods: string | null;
}

export interface GlucoseReadingResponse {
  id: string;
  readingType: GlucoseReadingType;
  valueMgDl: number;
  time: string | null; // "HH:mm:ss.fff"
  foods: string | null;
}

export interface CreateDailyRecordRequest {
  recordDate: string;        // "YYYY-MM-DD"
  recordTime: string | null; // "HH:mm:ss"
  systolicPressure: number | null;
  diastolicPressure: number | null;
  heartRate: number | null;
  weightKg: number | null;
  waistCm: number | null;
  notes: string | null;
  glucoseReadings: GlucoseReadingRequest[] | null;
}

export interface DailyRecordResponse {
  id: string;
  patientId: string;
  recordDate: string;        // "dd/MM/yyyy"
  recordTime: string | null; // "HH:mm:ss.fff"
  systolicPressure: number | null;
  diastolicPressure: number | null;
  heartRate: number | null;
  weightKg: number | null;
  waistCm: number | null;
  notes: string | null;
  createdAt: string;         // ISO 8601
  glucoseReadings: GlucoseReadingResponse[];
}
