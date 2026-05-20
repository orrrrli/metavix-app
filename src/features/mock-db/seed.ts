import { PatientProfileDto, HealthRecordDto } from '../patient/types';

export const MOCK_DOCTOR_ID = "dr-alexander-thorne-001";
export const MOCK_PATIENT_ID = "pt-sarah-jenkins-001";

export const initialPatients: PatientProfileDto[] = [
  {
    id: MOCK_PATIENT_ID,
    firstName: "Sarah",
    lastName: "Jenkins",
    dateOfBirth: "1978-05-14T00:00:00Z",
    diabetesType: "Type 2",
    heightCm: 165,
    weightKg: 78.5,
    pregnancyStatus: false,
    assignedDoctorId: MOCK_DOCTOR_ID,
  },
  {
    id: "pt-michael-chang-002",
    firstName: "Michael",
    lastName: "Chang",
    dateOfBirth: "1965-11-22T00:00:00Z",
    diabetesType: "Type 1",
    heightCm: 178,
    weightKg: 82.0,
    pregnancyStatus: false,
    assignedDoctorId: MOCK_DOCTOR_ID,
  },
  {
    id: "pt-emily-rose-003",
    firstName: "Emily",
    lastName: "Rose",
    dateOfBirth: "1992-03-10T00:00:00Z",
    diabetesType: "Prediabetes",
    heightCm: 160,
    weightKg: 64.0,
    pregnancyStatus: true,
    assignedDoctorId: MOCK_DOCTOR_ID,
  }
];

export const initialRecords: HealthRecordDto[] = [
  // Sarah Jenkins (Type 2) - Recent readings (Danger/Caution)
  {
    id: "rec-001",
    patientId: MOCK_PATIENT_ID,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    fastingGlucose: 135,
    postprandial1hGlucose: 180,
    postprandial2hGlucose: null,
    systolicBP: 145,
    diastolicBP: 92,
    heartRate: 88,
    hba1c: 7.8,
    ldl: 130,
    triglycerides: 160,
    weightKg: 78.5,
    notes: "Felt slightly dizzy in the morning.",
    symptoms: "Dizziness, Fatigue",
    medicationComments: "Took Metformin as prescribed."
  },
  {
    id: "rec-002",
    patientId: MOCK_PATIENT_ID,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    fastingGlucose: 128,
    postprandial1hGlucose: null,
    postprandial2hGlucose: 165,
    systolicBP: 138,
    diastolicBP: 88,
    heartRate: 85,
    hba1c: null,
    ldl: null,
    triglycerides: null,
    weightKg: 78.8,
    notes: "Normal day, mild exercise.",
    symptoms: null,
    medicationComments: null
  },
  {
    id: "rec-003",
    patientId: MOCK_PATIENT_ID,
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    fastingGlucose: 142,
    postprandial1hGlucose: 195,
    postprandial2hGlucose: null,
    systolicBP: 150,
    diastolicBP: 95,
    heartRate: 92,
    hba1c: null,
    ldl: null,
    triglycerides: null,
    weightKg: 79.1,
    notes: "Missed morning walk.",
    symptoms: "Headache",
    medicationComments: "Forgot morning dose."
  },
  
  // Michael Chang (Type 1) - Good Control
  {
    id: "rec-004",
    patientId: "pt-michael-chang-002",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fastingGlucose: 95,
    postprandial1hGlucose: 130,
    postprandial2hGlucose: 110,
    systolicBP: 120,
    diastolicBP: 78,
    heartRate: 72,
    hba1c: 6.2,
    ldl: 95,
    triglycerides: 110,
    weightKg: 82.0,
    notes: "Insulin dosage adjusted correctly.",
    symptoms: "None",
    medicationComments: "Novolog 5 units"
  }
];
