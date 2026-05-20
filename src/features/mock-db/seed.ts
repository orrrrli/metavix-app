import { PatientProfileDto, HealthRecordDto } from '../patient/types';

export const MOCK_DOCTOR_ID = "dr-alexander-thorne-001";
export const MOCK_PATIENT_ID = "pt-sarah-jenkins-001";

export const initialPatients: PatientProfileDto[] = [
  {
    id: MOCK_PATIENT_ID,
    firstName: "Sarah",
    lastName: "Jenkins",
    dateOfBirth: "1978-05-14T00:00:00Z",
    gender: "F",
    diabetesType: "Tipo 2",
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
    gender: "M",
    diabetesType: "Tipo 1",
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
    gender: "F",
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
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    glucosas_comidas: [
      { tipo: "ayuno", valor: 135, hora: "07:30", alimentos: null },
      { tipo: "despues_desayuno", valor: 180, hora: "09:30", alimentos: "Avena con leche y plátano" }
    ],
    presion_sistolica: 145,
    presion_diastolica: 92,
    frecuencia_cardiaca: 88,
    peso: 78.5,
    cintura: 88,
    hba1c: 7.8,
    colesterol_total: 190,
    colesterol_ldl: 130,
    colesterol_hdl: 45,
    trigliceridos: 160,
    bun: null,
    creatinina: null,
    ego_proteinas: "trazas",
    ego_glucosa: "0",
    notas: "Me sentí un poco mareada en la mañana. Tomé Metformina según lo recetado.",
  },
  {
    id: "rec-002",
    patientId: MOCK_PATIENT_ID,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    glucosas_comidas: [
      { tipo: "ayuno", valor: 128, hora: "08:00", alimentos: null },
      { tipo: "despues_comida", valor: 165, hora: "16:00", alimentos: "Pollo asado, ensalada, 2 tortillas" }
    ],
    presion_sistolica: 138,
    presion_diastolica: 88,
    frecuencia_cardiaca: 85,
    peso: 78.8,
    cintura: null,
    hba1c: null,
    colesterol_total: null,
    colesterol_ldl: null,
    colesterol_hdl: null,
    trigliceridos: null,
    bun: null,
    creatinina: null,
    ego_proteinas: null,
    ego_glucosa: null,
    notas: "Día normal, ejercicio leve.",
  },
  {
    id: "rec-003",
    patientId: MOCK_PATIENT_ID,
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    glucosas_comidas: [
      { tipo: "ayuno", valor: 142, hora: "07:45", alimentos: null },
      { tipo: "despues_desayuno", valor: 195, hora: "10:00", alimentos: "Huevos fritos, frijoles y jugo" }
    ],
    presion_sistolica: 150,
    presion_diastolica: 95,
    frecuencia_cardiaca: 92,
    peso: 79.1,
    cintura: null,
    hba1c: null,
    colesterol_total: null,
    colesterol_ldl: null,
    colesterol_hdl: null,
    trigliceridos: null,
    bun: null,
    creatinina: null,
    ego_proteinas: null,
    ego_glucosa: null,
    notas: "Falté a la caminata matutina. Dolor de cabeza. Olvidé la dosis de la mañana.",
  },
  
  // Michael Chang (Type 1) - Good Control
  {
    id: "rec-004",
    patientId: "pt-michael-chang-002",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    glucosas_comidas: [
      { tipo: "ayuno", valor: 95, hora: "07:00", alimentos: null },
      { tipo: "despues_desayuno", valor: 130, hora: "09:00", alimentos: "Tostada integral con huevo" },
      { tipo: "despues_comida", valor: 110, hora: "14:30", alimentos: "Pescado con vegetales" }
    ],
    presion_sistolica: 120,
    presion_diastolica: 78,
    frecuencia_cardiaca: 72,
    peso: 82.0,
    cintura: 90,
    hba1c: 6.2,
    colesterol_total: 160,
    colesterol_ldl: 95,
    colesterol_hdl: 55,
    trigliceridos: 110,
    bun: 14,
    creatinina: 0.9,
    ego_proteinas: "negativo",
    ego_glucosa: "0",
    notas: "Dosis de insulina ajustada correctamente. Novolog 5 unidades",
  }
];
