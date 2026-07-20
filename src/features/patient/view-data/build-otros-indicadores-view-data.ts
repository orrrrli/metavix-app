import type { DailyRecordResponse } from "@/types/daily-record";
import type { LabRecordResponse } from "@/types/lab-record";
import type { PatientProfileResponse } from "@/types/patient-profile";
import type { EstadoIndicador } from "../components/dashboard";
import { parseDailyDate } from "@/features/patient/utils/parse-api-date";

/** Icono a renderizar en la Screen. El builder es puro y no produce JSX. */
export type IndicadorIcon = "presion" | "corazon" | "imc" | "lab";

export type IndicadorHref =
  | "/paciente/nuevo-registro"
  | "/paciente/perfil"
  | "/paciente/herramientas/calculadora-imc"
  | "/paciente/graficas/hba1c"
  | "/paciente/graficas/colesterol-total";

/**
 * Descriptor puro de un indicador secundario. La Screen lo mapea a
 * `MetavixIndicador` componiendo el icono (`iconKey`) y el nodo `valor`
 * (`valorPrincipal` + `valorUnidad` / `valorSecundario`).
 */
export interface IndicadorData {
  label: string;
  meta: string;
  estado: EstadoIndicador;
  estadoLabel?: string;
  iconKey: IndicadorIcon;
  href: IndicadorHref;
  /** Número/texto principal del valor. null → CTA "+ Agregar". */
  valorPrincipal?: string | number;
  /** Unidad o sufijo con estilo atenuado (ej. " mg/dL", " lpm", "%"). */
  valorUnidad?: string;
  /** Segunda parte del valor con estilo atenuado (ej. "/78" en presión). */
  valorSecundario?: string;
}

export interface OtrosIndicadoresData {
  indicadores: IndicadorData[];
}

function formatHace(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 60) return `Medida hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Medida hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `Medida hace ${dias} ${dias === 1 ? "día" : "días"}`;
  const meses = Math.floor(dias / 30);
  return `Medida hace ${meses} ${meses === 1 ? "mes" : "meses"}`;
}

function clasificarPresion(
  sistolica: number,
  diastolica: number,
): { estadoLabel: string; estado: EstadoIndicador } {
  if (sistolica >= 140 || diastolica >= 90) return { estadoLabel: "Alta", estado: "bad" };
  if (sistolica >= 130 || diastolica >= 80) return { estadoLabel: "Elevada", estado: "warn" };
  if (sistolica < 90 || diastolica < 60) return { estadoLabel: "Baja", estado: "warn" };
  return { estadoLabel: "Normal", estado: "ok" };
}

function clasificarFrecuenciaCardiaca(hr: number): {
  estadoLabel: string;
  estado: EstadoIndicador;
} {
  if (hr < 60) return { estadoLabel: "Bradicardia", estado: "warn" };
  if (hr > 100) return { estadoLabel: "Taquicardia", estado: "bad" };
  return { estadoLabel: "Normal", estado: "info" };
}

function clasificarIMC(imc: number): { estadoLabel: string; estado: EstadoIndicador } {
  if (imc < 18.5) return { estadoLabel: "Bajo peso", estado: "warn" };
  if (imc < 25) return { estadoLabel: "Saludable", estado: "ok" };
  if (imc < 30) return { estadoLabel: "Sobrepeso", estado: "warn" };
  return { estadoLabel: "Obesidad", estado: "bad" };
}

function clasificarHbA1c(
  hba1c: number,
  hasDiabetes: boolean,
): { estadoLabel: string; estado: EstadoIndicador } {
  if (hasDiabetes) {
    if (hba1c > 7) return { estadoLabel: "Alta", estado: "bad" };
    if (hba1c > 6.5) return { estadoLabel: "Revisar", estado: "warn" };
    return { estadoLabel: "En meta", estado: "ok" };
  }
  if (hba1c > 5.7) return { estadoLabel: "Prediabetes", estado: "warn" };
  return { estadoLabel: "Normal", estado: "ok" };
}

function clasificarColesterol(
  total: number | null,
  ldl: number | null,
  hdl: number | null,
): { estadoLabel: string; estado: EstadoIndicador } {
  if (total !== null && total > 240) return { estadoLabel: "Alto", estado: "bad" };
  if (total !== null && total > 200) return { estadoLabel: "Límite", estado: "warn" };
  if (ldl !== null && ldl > 160) return { estadoLabel: "LDL alto", estado: "bad" };
  if (hdl !== null && hdl < 40) return { estadoLabel: "HDL bajo", estado: "warn" };
  return { estadoLabel: "Normal", estado: "ok" };
}

export interface OtrosIndicadoresInput {
  dailyRecords: DailyRecordResponse[];
  labRecords: LabRecordResponse[];
  profile: PatientProfileResponse | null;
  /** Inyectable en tests para determinismo del "Medida hace…". */
  now?: Date;
}

/**
 * Compone los 5 indicadores secundarios del dashboard (presión, frecuencia
 * cardíaca, IMC, HbA1c, colesterol) como datos puros. Sin JSX: el icono se
 * expresa como `iconKey` y el valor como partes de texto que la Screen
 * ensambla en un `MetavixIndicador`.
 */
export function buildOtrosIndicadoresViewData(
  input: OtrosIndicadoresInput,
): OtrosIndicadoresData {
  const { dailyRecords: daily, labRecords: lab, profile } = input;
  const now = input.now ?? new Date();
  const hasDiabetes = (profile?.diabetesType ?? "None") !== "None";

  const inds: IndicadorData[] = [];

  const sortedDaily = (daily ?? [])
    .map((r) => ({ r, date: parseDailyDate(r.recordDate) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);
  const sortedLab = (lab ?? [])
    .map((r) => ({ r, date: parseDailyDate(r.sampleDate) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);

  // 1) Presión arterial
  const lastBP = sortedDaily.find(
    (r) => r.systolicPressure !== null && r.diastolicPressure !== null,
  );
  if (lastBP && lastBP.systolicPressure !== null && lastBP.diastolicPressure !== null) {
    const { estadoLabel, estado } = clasificarPresion(
      lastBP.systolicPressure,
      lastBP.diastolicPressure,
    );
    inds.push({
      label: "Presión arterial",
      meta: formatHace(parseDailyDate(lastBP.recordDate), now),
      valorPrincipal: lastBP.systolicPressure,
      valorSecundario: `/${lastBP.diastolicPressure}`,
      estadoLabel,
      estado,
      iconKey: "presion",
      href: "/paciente/nuevo-registro",
    });
  } else {
    inds.push({
      label: "Presión arterial",
      meta: "Aún sin registros",
      estado: "vacio",
      iconKey: "presion",
      href: "/paciente/nuevo-registro",
    });
  }

  // 2) Frecuencia cardíaca
  const lastHR = sortedDaily.find((r) => r.heartRate !== null);
  if (lastHR && lastHR.heartRate !== null) {
    const { estadoLabel, estado } = clasificarFrecuenciaCardiaca(lastHR.heartRate);
    inds.push({
      label: "Frecuencia cardíaca",
      meta: formatHace(parseDailyDate(lastHR.recordDate), now),
      valorPrincipal: lastHR.heartRate,
      valorUnidad: " lpm",
      estadoLabel,
      estado,
      iconKey: "corazon",
      href: "/paciente/nuevo-registro",
    });
  } else {
    inds.push({
      label: "Frecuencia cardíaca",
      meta: "Aún sin registros",
      estado: "vacio",
      iconKey: "corazon",
      href: "/paciente/nuevo-registro",
    });
  }

  // 3) IMC
  const heightCm = profile?.heightCm ?? null;
  const lastWeight = sortedDaily.find((r) => r.weightKg !== null);
  if (lastWeight && lastWeight.weightKg !== null && heightCm !== null) {
    const peso = Number(lastWeight.weightKg);
    const imc = Math.round((peso / Math.pow(heightCm / 100, 2)) * 10) / 10;
    const { estadoLabel, estado } = clasificarIMC(imc);
    inds.push({
      label: "Índice de masa corporal",
      meta: formatHace(parseDailyDate(lastWeight.recordDate), now),
      valorPrincipal: imc.toFixed(1),
      estadoLabel,
      estado,
      iconKey: "imc",
      href: "/paciente/herramientas/calculadora-imc",
    });
  } else {
    inds.push({
      label: "Índice de masa corporal",
      meta: heightCm === null ? "Falta tu estatura en el perfil" : "Sin registros",
      estado: "vacio",
      iconKey: "imc",
      href: heightCm === null ? "/paciente/perfil" : "/paciente/herramientas/calculadora-imc",
    });
  }

  // 4) HbA1c
  const lastLabWithA1c = sortedLab.find((r) => r.hba1c !== null);
  if (lastLabWithA1c && lastLabWithA1c.hba1c !== null) {
    const { estadoLabel, estado } = clasificarHbA1c(Number(lastLabWithA1c.hba1c), hasDiabetes);
    inds.push({
      label: "HbA1c",
      meta: formatHace(parseDailyDate(lastLabWithA1c.sampleDate), now),
      valorPrincipal: Number(lastLabWithA1c.hba1c),
      valorUnidad: " %",
      estadoLabel,
      estado,
      iconKey: "lab",
      href: "/paciente/graficas/hba1c",
    });
  } else {
    inds.push({
      label: "HbA1c",
      meta: "Aún sin registros este trimestre",
      estado: "vacio",
      iconKey: "lab",
      href: "/paciente/nuevo-registro",
    });
  }

  // 5) Colesterol
  const lastLabWithLipids = sortedLab.find(
    (r) => r.totalCholesterol !== null || r.ldl !== null || r.hdl !== null,
  );
  if (lastLabWithLipids) {
    const total =
      lastLabWithLipids.totalCholesterol !== null
        ? Number(lastLabWithLipids.totalCholesterol)
        : null;
    const ldl = lastLabWithLipids.ldl !== null ? Number(lastLabWithLipids.ldl) : null;
    const hdl = lastLabWithLipids.hdl !== null ? Number(lastLabWithLipids.hdl) : null;
    const { estadoLabel, estado } = clasificarColesterol(total, ldl, hdl);
    inds.push({
      label: "Colesterol",
      meta: formatHace(parseDailyDate(lastLabWithLipids.sampleDate), now),
      valorPrincipal: total !== null ? total : undefined,
      valorUnidad: total !== null ? " mg/dL" : undefined,
      estadoLabel,
      estado,
      iconKey: "lab",
      href: "/paciente/graficas/colesterol-total",
    });
  } else {
    inds.push({
      label: "Colesterol",
      meta: "Aún sin registros este trimestre",
      estado: "vacio",
      iconKey: "lab",
      href: "/paciente/nuevo-registro",
    });
  }

  return { indicadores: inds };
}
