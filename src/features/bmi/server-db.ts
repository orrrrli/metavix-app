export interface BmiRecordDb {
  id: string;
  user_id: string;
  peso_kg: number;
  estatura_cm: number;
  imc: number;
  categoria: string;
  fecha: string;
}

// Maps user_id to an array of their BMI records
export const bmiRecordsDb = new Map<string, BmiRecordDb[]>();
