export interface BmiRecordDb {
  id: string;
  user_id: string;
  peso_kg: number;
  estatura_cm: number;
  imc: number;
  categoria: string;
  fecha: string;
}

export const bmiRecordsDb = new Map<string, BmiRecordDb[]>();

// ── Seed: Sarah Jenkins (pt-sarah-jenkins-001) ───────────────────────────────
const SARAH_ID = "pt-sarah-jenkins-001";

bmiRecordsDb.set(SARAH_ID, [
  {
    id: "bmi-001",
    user_id: SARAH_ID,
    peso_kg: 79.5,
    estatura_cm: 165,
    imc: 29.2,
    categoria: "Sobrepeso",
    fecha: "2026-05-15T07:45:00.000Z",
  },
  {
    id: "bmi-002",
    user_id: SARAH_ID,
    peso_kg: 79.2,
    estatura_cm: 165,
    imc: 29.1,
    categoria: "Sobrepeso",
    fecha: "2026-05-16T07:00:00.000Z",
  },
  {
    id: "bmi-003",
    user_id: SARAH_ID,
    peso_kg: 79.2,
    estatura_cm: 165,
    imc: 29.1,
    categoria: "Sobrepeso",
    fecha: "2026-05-17T08:15:00.000Z",
  },
  {
    id: "bmi-004",
    user_id: SARAH_ID,
    peso_kg: 79.0,
    estatura_cm: 165,
    imc: 29.0,
    categoria: "Sobrepeso",
    fecha: "2026-05-18T07:30:00.000Z",
  },
  {
    id: "bmi-005",
    user_id: SARAH_ID,
    peso_kg: 78.5,
    estatura_cm: 165,
    imc: 28.8,
    categoria: "Sobrepeso",
    fecha: "2026-05-19T08:00:00.000Z",
  },
  {
    id: "bmi-006",
    user_id: SARAH_ID,
    peso_kg: 78.7,
    estatura_cm: 165,
    imc: 28.9,
    categoria: "Sobrepeso",
    fecha: "2026-05-20T07:45:00.000Z",
  },
  {
    id: "bmi-007",
    user_id: SARAH_ID,
    peso_kg: 78.5,
    estatura_cm: 165,
    imc: 28.8,
    categoria: "Sobrepeso",
    fecha: "2026-05-21T07:30:00.000Z",
  },
]);
