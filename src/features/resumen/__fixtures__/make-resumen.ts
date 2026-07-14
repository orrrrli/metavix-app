import type {
  PatientMetricasResponse,
  PatientResumenResponse,
  MetricaEntry,
} from "@/types/patient-resumen";

const nula: MetricaEntry = { valor: null, fecha: null };

function makeMetricas(
  overrides: Partial<PatientMetricasResponse> = {},
): PatientMetricasResponse {
  return {
    glucosaAyuno: nula,
    presionSistolica: nula,
    presionDiastolica: nula,
    frecuenciaCardiaca: nula,
    peso: nula,
    estaturasCm: nula,
    imc: nula,
    cintura: nula,
    hba1c: nula,
    colesterolTotal: nula,
    colesterolLdl: nula,
    colesterolHdl: nula,
    trigliceridos: nula,
    creatinina: nula,
    bun: nula,
    ...overrides,
  };
}

export function makeResumen(
  overrides: {
    perfil?: Partial<PatientResumenResponse["perfil"]>;
    metricas?: Partial<PatientMetricasResponse>;
  } = {},
): PatientResumenResponse {
  return {
    perfil: {
      nombre: "Ana López",
      tipoDiabetes: "tipo_2",
      embarazada: false,
      sexo: "F",
      ...overrides.perfil,
    },
    metricas: makeMetricas(overrides.metricas),
  };
}
