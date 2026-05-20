export type DiabetesType = 'Type 1' | 'Type 2' | 'Prediabetes' | 'None';

export type ControlStatus = 'Good Control' | 'Caution' | 'Danger' | 'Unknown';

export interface PatientProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO Date string
  diabetesType: DiabetesType;
  heightCm: number;
  weightKg: number;
  pregnancyStatus: boolean;
  assignedDoctorId: string;
}

export interface HealthRecordDto {
  id: string;
  patientId: string;
  timestamp: string; // ISO Date string
  
  // Glucose (mg/dL)
  fastingGlucose: number | null;
  postprandial1hGlucose: number | null;
  postprandial2hGlucose: number | null;
  
  // Blood Pressure (mmHg)
  systolicBP: number | null;
  diastolicBP: number | null;
  
  // Cardiovascular (bpm)
  heartRate: number | null;
  
  // Laboratory
  hba1c: number | null; // %
  ldl: number | null; // mg/dL
  triglycerides: number | null; // mg/dL
  
  // Physical
  weightKg: number | null;
  
  // Additional
  notes: string | null;
  symptoms: string | null;
  medicationComments: string | null;
}
