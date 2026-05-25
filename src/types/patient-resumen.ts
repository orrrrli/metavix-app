export interface MetricaEntry {
  valor: number | null;
  fecha: string | null; // "dd/MM/yyyy"
}

export interface PatientMetricasResponse {
  glucosaAyuno: MetricaEntry;
  presionSistolica: MetricaEntry;
  presionDiastolica: MetricaEntry;
  frecuenciaCardiaca: MetricaEntry;
  peso: MetricaEntry;
  estaturasCm: MetricaEntry;
  imc: MetricaEntry;
  cintura: MetricaEntry;
  hba1c: MetricaEntry;
  colesterolTotal: MetricaEntry;
  colesterolLdl: MetricaEntry;
  colesterolHdl: MetricaEntry;
  trigliceridos: MetricaEntry;
  creatinina: MetricaEntry;
  bun: MetricaEntry;
}

export interface PatientPerfilResponse {
  nombre: string;
  tipoDiabetes: string;
  embarazada: boolean;
  sexo: string;
}

export interface PatientResumenResponse {
  perfil: PatientPerfilResponse;
  metricas: PatientMetricasResponse;
}
