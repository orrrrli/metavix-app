import { GlucoseReadingType } from '@/types/daily-record';

export interface GlucosaComida {
  tipo: string;
  /** Momento de la lectura (enum numérico) para clasificar el chip con el rango correcto. */
  readingType?: GlucoseReadingType;
  valor: number;
  hora: string;
  alimentos: string;
}

export interface Registro {
  id: string;
  fecha: string;
  glucosa_ayuno?: number;
  glucosas_comidas?: GlucosaComida[];
  presion_sistolica?: number;
  presion_diastolica?: number;
  frecuencia_cardiaca?: number;
  peso?: number;
  cintura?: number;
  hba1c?: number;
  colesterol_total?: number;
  colesterol_ldl?: number;
  colesterol_hdl?: number;
  trigliceridos?: number;
  bun?: number;
  creatinina?: number;
  ego_proteinas?: string;
  ego_glucosa?: string;
  notas?: string;
}
