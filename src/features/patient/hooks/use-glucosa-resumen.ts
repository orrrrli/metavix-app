"use client";

import { useMemo } from "react";
import { GlucoseReadingType, DailyRecordResponse } from "@/types/daily-record";
import { useDailyRecords } from "./use-daily-records";
import { usePatientProfile } from "./use-patient-profile";
import { tsDeLectura } from "./use-glucosa-resumen.helpers";

export type EstadoClinico = "ok" | "warn" | "bad";

export interface GlucosaResumen {
  /** Última lectura de glucosa del día (en mg/dL) o null si no hay */
  valor: number | null;
  /** Estado clínico vs rango objetivo */
  estado: EstadoClinico | null;
  /** Etiqueta legible del estado */
  estadoLabel: string | null;
  /** Texto del contexto (ej. "hoy a las 7:30 AM, en ayuno") */
  contexto: string | null;
  /** Cuánto hace que se registró (ej. "2 horas") */
  registradaHace: string | null;
  /** Rango objetivo [min, max] en mg/dL */
  rangoObjetivo: [number, number];
  /** Texto de la próxima medición sugerida */
  proximaMedicion: string | null;
  /** Total de mediciones del día de hoy */
  medicionesHoy: number;
  /** Meta diaria por defecto */
  metaDiaria: number;
  /** Tiempo desde la última lectura en horas (para el card "horasDesde") */
  horasDesde: string;
  /** Cuántas lecturas del día están dentro del objetivo */
  enMeta: number;
  /** Total de lecturas del día evaluadas (para "en meta de N") */
  totalLecturas: number;
  /** Última lectura completa del día (para mostrar detalles) */
  ultimaLectura: { valor: number; hora: string | null; tipo: GlucoseReadingType } | null;
  /** Series para el chart: promedio diario de los últimos N días */
  serieGrafica: Array<{ fecha: string; promedio: number; min: number; max: number; lecturas: number }>;
  /** % del tiempo en rango (0–100), basado en los últimos 30 días */
  porcentajeEnRango: number;
  /** Promedio de los últimos 30 días */
  promedio30d: number | null;
  /** Hay al menos un registro */
  tieneRegistros: boolean;
  /** Cargando datos */
  loading: boolean;
}

const SUP_AYUNO_CON_DIABETES = 130;
const SUP_AYUNO_SIN_DIABETES = 100;
const SUP_POST_CON_DIABETES = 180;
const SUP_POST_SIN_DIABETES = 140;
const INF_CON_DIABETES = 80;
const INF_SIN_DIABETES = 70;
const META_DIARIA = 3;

function isPostMeal(t: GlucoseReadingType) {
  return (
    t === GlucoseReadingType.PostBreakfast ||
    t === GlucoseReadingType.PostLunch ||
    t === GlucoseReadingType.PostDinner
  );
}

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function formatHace(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return "hace un momento";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
}

function formatHorasCorta(diffMs: number): string {
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas} h`;
  const dias = Math.floor(horas / 24);
  return `${dias} d`;
}

function formatHora(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

const READING_TYPE_LABEL: Record<GlucoseReadingType, string> = {
  [GlucoseReadingType.Fasting]: "en ayuno",
  [GlucoseReadingType.PostBreakfast]: "después de desayunar",
  [GlucoseReadingType.PreLunch]: "antes de comer",
  [GlucoseReadingType.PostLunch]: "después de comer",
  [GlucoseReadingType.PreDinner]: "antes de cenar",
  [GlucoseReadingType.PostDinner]: "después de cenar",
  [GlucoseReadingType.Snack]: "en colación",
  [GlucoseReadingType.Overnight]: "de madrugada",
};

function supParaLectura(t: GlucoseReadingType, hasDiabetes: boolean) {
  return isPostMeal(t)
    ? (hasDiabetes ? SUP_POST_CON_DIABETES : SUP_POST_SIN_DIABETES)
    : (hasDiabetes ? SUP_AYUNO_CON_DIABETES : SUP_AYUNO_SIN_DIABETES);
}

function infParaLectura(hasDiabetes: boolean) {
  return hasDiabetes ? INF_CON_DIABETES : INF_SIN_DIABETES;
}

export function useGlucosaResumen(patientId: string | null): GlucosaResumen {
  const { data: profile } = usePatientProfile(patientId ?? "");
  const { data: records, isLoading } = useDailyRecords(patientId ?? "");

  return useMemo<GlucosaResumen>(() => {
    const empty: GlucosaResumen = {
      valor: null,
      estado: null,
      estadoLabel: null,
      contexto: null,
      registradaHace: null,
      rangoObjetivo: [INF_SIN_DIABETES, SUP_AYUNO_SIN_DIABETES],
      proximaMedicion: null,
      medicionesHoy: 0,
      metaDiaria: META_DIARIA,
      horasDesde: "—",
      enMeta: 0,
      totalLecturas: 0,
      ultimaLectura: null,
      serieGrafica: [],
      porcentajeEnRango: 0,
      promedio30d: null,
      tieneRegistros: false,
      loading: isLoading,
    };

    if (!records || records.length === 0) return empty;

    const diabetesRaw = profile?.diabetesType ?? "None";
    const hasDiabetes = diabetesRaw !== "None" && diabetesRaw !== "";

    const inf = infParaLectura(hasDiabetes);
    const supAyuno = hasDiabetes ? SUP_AYUNO_CON_DIABETES : SUP_AYUNO_SIN_DIABETES;

    const now = new Date();

    // Series para gráfica: agrupar por día
    const grupos = new Map<string, { values: number[]; date: Date }>();
    for (const r of records) {
      const date = parseDailyDate(r.recordDate);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      for (const g of r.glucoseReadings) {
        const arr = grupos.get(key)?.values ?? [];
        arr.push(g.valueMgDl);
        if (!grupos.has(key)) grupos.set(key, { values: arr, date });
        else (grupos.get(key) as { values: number[] }).values = arr;
      }
    }
    const serieGrafica = Array.from(grupos.entries())
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([ , { values, date }]) => ({
        fecha: `${date.getDate()}/${date.getMonth() + 1}`,
        promedio: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        min: Math.min(...values),
        max: Math.max(...values),
        lecturas: values.length,
      }));

    // % en rango y promedio (últimos 30 días)
    const hace30 = new Date(now);
    hace30.setDate(hace30.getDate() - 30);
    const ultimas30 = records
      .filter((r) => parseDailyDate(r.recordDate).getTime() >= hace30.getTime())
      .flatMap((r) => r.glucoseReadings);
    const total30 = ultimas30.length;
    const enRango30 = ultimas30.filter((g) => {
      const lim = supParaLectura(g.readingType, hasDiabetes);
      return g.valueMgDl <= lim && g.valueMgDl >= inf;
    }).length;
    const porcentajeEnRango = total30 > 0 ? Math.round((enRango30 / total30) * 100) : 0;
    const promedio30d = total30 > 0
      ? Math.round(ultimas30.reduce((a, b) => a + b.valueMgDl, 0) / total30)
      : null;

    // Día de hoy
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const todayRecords = records.filter((r) => {
      const d = parseDailyDate(r.recordDate);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` === today;
    });
    const todayReadings = todayRecords.flatMap((r) => r.glucoseReadings);
    const medicionesHoy = todayReadings.length;
    const enMetaHoy = todayReadings.filter((g) => {
      const lim = supParaLectura(g.readingType, hasDiabetes);
      return g.valueMgDl <= lim && g.valueMgDl >= inf;
    }).length;

    // Última lectura (no solo de hoy — la más reciente global con glucosa)
    const allWithGlucose: Array<{ rec: DailyRecordResponse; g: typeof records[0]["glucoseReadings"][0] }> = [];
    for (const r of records) {
      for (const g of r.glucoseReadings) allWithGlucose.push({ rec: r, g });
    }
    allWithGlucose.sort((a, b) =>
      tsDeLectura(b.rec.recordDate, b.g.time) - tsDeLectura(a.rec.recordDate, a.g.time)
    );
    const last = allWithGlucose[0] ?? null;

    let valor: number | null = null;
    let estado: EstadoClinico | null = null;
    let estadoLabel: string | null = null;
    let contexto: string | null = null;
    let registradaHace: string | null = null;
    let horasDesde = "—";
    let proximaMedicion: string | null = null;

    if (last) {
      valor = last.g.valueMgDl;
      const limSup = supParaLectura(last.g.readingType, hasDiabetes);
      const limInf = inf;
      if (valor < limInf) {
        estado = "bad";
        estadoLabel = "Baja";
      } else if (valor > limSup) {
        estado = "bad";
        estadoLabel = "Alta";
      } else if (valor > limSup * 0.9 || valor < limInf * 1.1) {
        estado = "warn";
        estadoLabel = "Revisar";
      } else {
        estado = "ok";
        estadoLabel = "En rango";
      }

      const lastDate = parseDailyDate(last.rec.recordDate);
      const lastTime = last.g.time;
      const fullDate = lastTime
        ? new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate(),
            Number(lastTime.split(":")[0] ?? 0), Number(lastTime.split(":")[1] ?? 0))
        : lastDate;

      registradaHace = formatHace(fullDate, now);
      horasDesde = formatHorasCorta(Math.max(0, now.getTime() - fullDate.getTime()));

      const tipoLabel = READING_TYPE_LABEL[last.g.readingType] ?? "";
      if (diffDays(now, lastDate) === 0) {
        contexto = `hoy a las ${formatHora(lastTime)}${tipoLabel ? ", " + tipoLabel : ""}`;
        proximaMedicion = "Antes de comer · cerca de la 1:00 PM";
      } else {
        contexto = `${formatHora(lastTime)}${tipoLabel ? ", " + tipoLabel : ""}`;
        proximaMedicion = "Cuando puedas — te toca una nueva lectura";
      }
    }

    return {
      ...empty,
      valor,
      estado,
      estadoLabel,
      contexto,
      registradaHace,
      rangoObjetivo: [inf, supAyuno],
      proximaMedicion,
      medicionesHoy,
      enMeta: enMetaHoy,
      totalLecturas: medicionesHoy,
      horasDesde,
      ultimaLectura: last
        ? { valor: last.g.valueMgDl, hora: last.g.time, tipo: last.g.readingType }
        : null,
      serieGrafica,
      porcentajeEnRango,
      promedio30d,
      tieneRegistros: records.some((r) => r.glucoseReadings.length > 0),
    };
  }, [records, profile, isLoading]);
}
