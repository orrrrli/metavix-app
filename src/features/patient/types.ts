export type DiabetesType = 'Tipo 1' | 'Tipo 2' | 'Prediabetes' | 'Ninguna';

export type ControlStatus = 'Buen Control' | 'Precaución' | 'Peligro' | 'Desconocido';

export interface PatientProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO Date string
  gender: 'F' | 'M' | 'O';
  diabetesType: DiabetesType;
  heightCm: number;
  weightKg: number;
  pregnancyStatus: boolean;
  assignedDoctorId: string;
}

export interface GlucoseReading {
  tipo: string;
  valor: number;
  hora?: string | null;
  alimentos?: string | null;
}

export interface HealthRecordDto {
  id: string;
  patientId: string;
  timestamp: string; // ISO Date string
  
  // Glucose Array
  glucosas_comidas: GlucoseReading[];
  
  // Blood Pressure (mmHg)
  presion_sistolica: number | null;
  presion_diastolica: number | null;
  frecuencia_cardiaca: number | null;
  
  // Anthropometry
  peso: number | null;
  cintura: number | null;
  imc: number | null;
  
  // Laboratory
  hba1c: number | null; // %
  colesterol_total: number | null;
  colesterol_ldl: number | null;
  colesterol_hdl: number | null;
  trigliceridos: number | null;
  bun: number | null;
  creatinina: number | null;
  
  // EGO
  ego_proteinas: string | null;
  ego_glucosa: string | null;
  
  // Additional
  notas: string | null;
}
