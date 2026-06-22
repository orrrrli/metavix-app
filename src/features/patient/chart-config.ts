import { DiabetesType } from './types';

// --- Types ---

export type MetricStatus = 'en_meta' | 'revisar' | 'fuera_de_meta' | 'sin_datos';

export interface RefLimit {
  tipo: 'fijo' | 'dinamico';
  valor?: number;
  valores?: { sin_diabetes: number; con_diabetes: number };
}

export interface ChartDefinition {
  id: string;
  titulo: string;
  unidad: string;
  campo: string; // key in HealthRecordDto or special
  ruta: string;
  color: string;
  limites?: {
    superior?: RefLimit;
    inferior?: RefLimit;
  };
}

// --- Chart Definitions ---

export const CHART_DEFINITIONS: ChartDefinition[] = [
  {
    id: 'glucosa_ayuno',
    titulo: 'Glucosa en ayuno',
    unidad: 'mg/dL',
    campo: 'glucosa_ayuno', // special: extracted from glucosas_comidas
    ruta: '/paciente/graficas/glucosa-ayunas',
    color: '#00BFA5',
    limites: {
      superior: { tipo: 'dinamico', valores: { sin_diabetes: 100, con_diabetes: 130 } },
      inferior: { tipo: 'dinamico', valores: { sin_diabetes: 70, con_diabetes: 80 } },
    },
  },
  {
    id: 'presion_sistolica',
    titulo: 'Presión arterial sistólica',
    unidad: 'mmHg',
    campo: 'presion_sistolica',
    ruta: '/paciente/graficas/presion-arterial',
    color: '#EF4444',
    limites: {
      superior: { tipo: 'dinamico', valores: { sin_diabetes: 120, con_diabetes: 130 } },
    },
  },
  {
    id: 'frecuencia_cardiaca',
    titulo: 'Frecuencia cardiaca',
    unidad: 'lpm',
    campo: 'frecuencia_cardiaca',
    ruta: '/paciente/graficas/frecuencia-cardiaca',
    color: '#8B5CF6',
    limites: {
      superior: { tipo: 'fijo', valor: 100 },
      inferior: { tipo: 'fijo', valor: 60 },
    },
  },
  {
    id: 'imc',
    titulo: 'Índice de Masa Corporal',
    unidad: 'kg/m²',
    campo: 'imc',
    ruta: '/paciente/herramientas/calculadora-imc',
    color: '#14B8A6',
    limites: {
      superior: { tipo: 'fijo', valor: 24.9 },
      inferior: { tipo: 'fijo', valor: 18.5 },
    },
  },
  {
    id: 'hba1c',
    titulo: 'HbA1c',
    unidad: '%',
    campo: 'hba1c',
    ruta: '/paciente/graficas/hba1c',
    color: '#EC4899',
    limites: {
      superior: { tipo: 'dinamico', valores: { sin_diabetes: 5.7, con_diabetes: 7.0 } },
    },
  },
  {
    id: 'colesterol_total',
    titulo: 'Colesterol Total',
    unidad: 'mg/dL',
    campo: 'colesterol_total',
    ruta: '/paciente/graficas/colesterol-total',
    color: '#6366F1',
    limites: {
      superior: { tipo: 'fijo', valor: 200 },
    },
  },
  {
    id: 'colesterol_ldl',
    titulo: 'Colesterol LDL',
    unidad: 'mg/dL',
    campo: 'colesterol_ldl',
    ruta: '/paciente/graficas/colesterol-ldl',
    color: '#F43F5E',
    limites: {
      superior: { tipo: 'dinamico', valores: { sin_diabetes: 130, con_diabetes: 100 } },
    },
  },
  {
    id: 'colesterol_hdl',
    titulo: 'Colesterol HDL',
    unidad: 'mg/dL',
    campo: 'colesterol_hdl',
    ruta: '/paciente/graficas/colesterol-hdl',
    color: '#10B981',
    limites: {
      inferior: { tipo: 'fijo', valor: 40 },
    },
  },
  {
    id: 'trigliceridos',
    titulo: 'Triglicéridos',
    unidad: 'mg/dL',
    campo: 'trigliceridos',
    ruta: '/paciente/graficas/trigliceridos',
    color: '#F59E0B',
    limites: {
      superior: { tipo: 'fijo', valor: 150 },
    },
  },
  {
    id: 'creatinina',
    titulo: 'Creatinina',
    unidad: 'mg/dL',
    campo: 'creatinina',
    ruta: '/paciente/graficas/creatinina',
    color: '#0EA5E9',
    limites: {
      superior: { tipo: 'fijo', valor: 1.2 },
    },
  },
  {
    id: 'bun',
    titulo: 'BUN',
    unidad: 'mg/dL',
    campo: 'bun',
    ruta: '/paciente/graficas/bun',
    color: '#A855F7',
    limites: {
      superior: { tipo: 'fijo', valor: 20 },
      inferior: { tipo: 'fijo', valor: 7 },
    },
  },
];

// --- Utility Functions ---

export function resolveLimit(limit: RefLimit, diabetesType: DiabetesType): number {
  if (limit.tipo === 'fijo') return limit.valor!;
  const hasDiabetes = diabetesType !== 'Ninguna';
  return hasDiabetes ? limit.valores!.con_diabetes : limit.valores!.sin_diabetes;
}

export function getStatus(
  value: number | null | undefined,
  config: ChartDefinition,
  diabetesType: DiabetesType
): MetricStatus {
  if (value == null) return 'sin_datos';

  const sup = config.limites?.superior ? resolveLimit(config.limites.superior, diabetesType) : null;
  const inf = config.limites?.inferior ? resolveLimit(config.limites.inferior, diabetesType) : null;

  // Out of range
  if (sup != null && value > sup) return 'fuera_de_meta';
  if (inf != null && value < inf) return 'fuera_de_meta';

  // Close to limit (within 10%)
  if (sup != null && value > sup * 0.9) return 'revisar';
  if (inf != null && value < inf * 1.1) return 'revisar';

  return 'en_meta';
}

export function extractMetricValue(
  record: any,
  campo: string
): number | null {
  if (campo === 'glucosa_ayuno') {
    const reading = record.glucosas_comidas?.find((g: any) => g.tipo === 'ayuno');
    return reading?.valor ?? null;
  }
  if (campo === 'imc') {
    return record.imc ?? null;
  }
  return record[campo] ?? null;
}
