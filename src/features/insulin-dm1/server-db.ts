// In-memory data store for the Insulina DM1 feature.
// Simulates PostgreSQL behavior for the REST API.

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

// Maps user_id to their profile
export const profilesDb = new Map<string, InsulinaPerfilDb>();

// Maps user_id to an array of their records
export const recordsDb = new Map<string, InsulinaRegistroDb[]>();
