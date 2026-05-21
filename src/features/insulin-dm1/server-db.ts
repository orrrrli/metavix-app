export interface InsulinaPerfilDb {
  id: string;
  user_id: string;
  nombre_insulina: string;
  ric: number;
  factor_sensibilidad: number;
  glucosa_meta: number;
  nombre_medico: string;
  telefono_medico: string;
  creado_en: string;
  actualizado_en: string;
}

export interface InsulinaRegistroDb {
  id: string;
  user_id: string;
  fecha: string;
  glucosa_antes: number;
  glucosa_despues: number;
  hc_totales: number;
  dosis_aplicada: number;
  que_comi: string;
  como_me_senti: string;
  creado_en: string;
}

export const profilesDb = new Map<string, InsulinaPerfilDb>();
export const recordsDb = new Map<string, InsulinaRegistroDb[]>();

// ── Seed: Sarah Jenkins (pt-sarah-jenkins-001) ───────────────────────────────
const SARAH_ID = "pt-sarah-jenkins-001";

profilesDb.set(SARAH_ID, {
  id: "ins-perfil-001",
  user_id: SARAH_ID,
  nombre_insulina: "Glargina (Lantus)",
  ric: 12,
  factor_sensibilidad: 45,
  glucosa_meta: 120,
  nombre_medico: "Dr. Alexander Thorne",
  telefono_medico: "664-555-0100",
  creado_en: "2026-05-01T10:00:00.000Z",
  actualizado_en: "2026-05-15T10:00:00.000Z",
});

recordsDb.set(SARAH_ID, [
  {
    id: "ins-r-001",
    user_id: SARAH_ID,
    fecha: "2026-05-15",
    glucosa_antes: 148,
    glucosa_despues: 130,
    hc_totales: 60,
    dosis_aplicada: 5.0,
    que_comi: "Arroz rojo con pollo y refresco",
    como_me_senti: "Regular, algo de mareo",
    creado_en: "2026-05-15T15:30:00.000Z",
  },
  {
    id: "ins-r-002",
    user_id: SARAH_ID,
    fecha: "2026-05-16",
    glucosa_antes: 122,
    glucosa_despues: 108,
    hc_totales: 45,
    dosis_aplicada: 3.5,
    que_comi: "Avena con canela sin azúcar",
    como_me_senti: "Bien",
    creado_en: "2026-05-16T09:30:00.000Z",
  },
  {
    id: "ins-r-003",
    user_id: SARAH_ID,
    fecha: "2026-05-17",
    glucosa_antes: 198,
    glucosa_despues: 175,
    hc_totales: 75,
    dosis_aplicada: 6.5,
    que_comi: "Pan dulce y tacos de canasta",
    como_me_senti: "Mal, mucho estrés y dolor de cabeza",
    creado_en: "2026-05-17T16:00:00.000Z",
  },
  {
    id: "ins-r-004",
    user_id: SARAH_ID,
    fecha: "2026-05-18",
    glucosa_antes: 130,
    glucosa_despues: 118,
    hc_totales: 50,
    dosis_aplicada: 4.0,
    que_comi: "Cereal con leche y fruta",
    como_me_senti: "Bien, día de laboratorio",
    creado_en: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "ins-r-005",
    user_id: SARAH_ID,
    fecha: "2026-05-19",
    glucosa_antes: 118,
    glucosa_despues: 105,
    hc_totales: 40,
    dosis_aplicada: 3.0,
    que_comi: "Pollo asado con ensalada y 2 tortillas",
    como_me_senti: "Muy bien",
    creado_en: "2026-05-19T16:00:00.000Z",
  },
  {
    id: "ins-r-006",
    user_id: SARAH_ID,
    fecha: "2026-05-20",
    glucosa_antes: 125,
    glucosa_despues: 112,
    hc_totales: 55,
    dosis_aplicada: 4.5,
    que_comi: "Huevos a la mexicana con tortillas",
    como_me_senti: "Bien, caminé 30 minutos",
    creado_en: "2026-05-20T10:15:00.000Z",
  },
  {
    id: "ins-r-007",
    user_id: SARAH_ID,
    fecha: "2026-05-21",
    glucosa_antes: 185,
    glucosa_despues: 160,
    hc_totales: 70,
    dosis_aplicada: 5.5,
    que_comi: "Tamales con atole",
    como_me_senti: "Regular, comí más de lo planeado",
    creado_en: "2026-05-21T10:00:00.000Z",
  },
]);
