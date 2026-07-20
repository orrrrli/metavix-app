import { DailyRecordResponse, GlucoseReadingType } from "@/types/daily-record";
import { LabRecordResponse } from "@/types/lab-record";
import { Registro } from "../types";
import { TipoDiabetes } from "../utils/semaforo";
import { parseDailyDate } from "@/features/patient/utils/parse-api-date";

export interface HistorialViewData {
  registros: Registro[];
  tipoDiabetes: TipoDiabetes;
  hasDiabetes: boolean;
  isPregnant: boolean;
}

/** Deriva TipoDiabetes (semaforo.ts) del perfil real: diabetesType + isPregnant. */
export function tipoDiabetesDePerfil(diabetesType: string | undefined, isPregnant: boolean | undefined): TipoDiabetes {
  if (isPregnant && diabetesType && diabetesType !== "None") return "embarazo";
  switch (diabetesType) {
    case "Type1": return "dm1";
    case "Type2": return "dm2";
    case "Prediabetes": return "prediabetes";
    default: return "sin_diabetes";
  }
}

const READING_TYPE_TO_TIPO: Record<GlucoseReadingType, string> = {
  [GlucoseReadingType.Fasting]:       'ayuno',
  [GlucoseReadingType.PostBreakfast]: 'despues_desayuno',
  [GlucoseReadingType.PreLunch]:      'antes_comida',
  [GlucoseReadingType.PostLunch]:     'despues_comida',
  [GlucoseReadingType.PreDinner]:     'antes_cena',
  [GlucoseReadingType.PostDinner]:    'despues_cena',
  [GlucoseReadingType.Snack]:         'antes_colacion',
  [GlucoseReadingType.Overnight]:     'madrugada',
};

function mapDailyToRegistro(r: DailyRecordResponse): Registro {
  const fasting = r.glucoseReadings.find(g => g.readingType === GlucoseReadingType.Fasting);
  const meals = r.glucoseReadings
    .filter(g => g.readingType !== GlucoseReadingType.Fasting)
    .map(g => ({
      tipo: READING_TYPE_TO_TIPO[g.readingType] ?? String(g.readingType),
      readingType: g.readingType,
      valor: g.valueMgDl,
      hora: g.time ?? '',
      alimentos: g.foods ?? '',
    }));

  return {
    id: r.id,
    fecha: r.recordDate,
    glucosa_ayuno: fasting?.valueMgDl,
    glucosas_comidas: meals.length > 0 ? meals : undefined,
    presion_sistolica: r.systolicPressure ?? undefined,
    presion_diastolica: r.diastolicPressure ?? undefined,
    frecuencia_cardiaca: r.heartRate ?? undefined,
    peso: r.weightKg ?? undefined,
    cintura: r.waistCm ?? undefined,
    notas: r.notes ?? undefined,
  };
}

function mapLabToRegistro(r: LabRecordResponse): Registro {
  return {
    id: r.id,
    fecha: r.sampleDate,
    hba1c: r.hba1c ?? undefined,
    colesterol_total: r.totalCholesterol ?? undefined,
    colesterol_ldl: r.ldl ?? undefined,
    colesterol_hdl: r.hdl ?? undefined,
    trigliceridos: r.triglycerides ?? undefined,
    bun: r.bun ?? undefined,
    creatinina: r.creatinine ?? undefined,
    ego_proteinas: r.egoProteins ?? undefined,
    ego_glucosa: r.egoGlucose ?? undefined,
    notas: r.notes ?? undefined,
  };
}

function mergeDailyFields(target: Registro, source: Registro): void {
  if (target.glucosa_ayuno === undefined && source.glucosa_ayuno !== undefined) {
    target.glucosa_ayuno = source.glucosa_ayuno;
  }
  if (target.presion_sistolica === undefined && source.presion_sistolica !== undefined) {
    target.presion_sistolica = source.presion_sistolica;
  }
  if (target.presion_diastolica === undefined && source.presion_diastolica !== undefined) {
    target.presion_diastolica = source.presion_diastolica;
  }
  if (target.frecuencia_cardiaca === undefined && source.frecuencia_cardiaca !== undefined) {
    target.frecuencia_cardiaca = source.frecuencia_cardiaca;
  }
  if (target.peso === undefined && source.peso !== undefined) {
    target.peso = source.peso;
  }
  if (target.cintura === undefined && source.cintura !== undefined) {
    target.cintura = source.cintura;
  }
  if (source.glucosas_comidas && source.glucosas_comidas.length > 0) {
    const seen = new Set(
      (target.glucosas_comidas ?? []).map(
        (g) => `${g.tipo}|${g.hora}|${g.valor}|${g.alimentos}`
      )
    );
    for (const g of source.glucosas_comidas) {
      const key = `${g.tipo}|${g.hora}|${g.valor}|${g.alimentos}`;
      if (seen.has(key)) continue;
      seen.add(key);
      target.glucosas_comidas = [...(target.glucosas_comidas ?? []), g];
    }
  }
  if (source.notas !== undefined) {
    if (target.notas === undefined) {
      target.notas = source.notas;
    } else if (target.notas !== source.notas) {
      target.notas = `${target.notas}\n${source.notas}`;
    }
  }
}

function mergeLabFields(target: Registro, source: Registro): void {
  if (target.hba1c === undefined && source.hba1c !== undefined) target.hba1c = source.hba1c;
  if (target.colesterol_total === undefined && source.colesterol_total !== undefined) {
    target.colesterol_total = source.colesterol_total;
  }
  if (target.colesterol_ldl === undefined && source.colesterol_ldl !== undefined) {
    target.colesterol_ldl = source.colesterol_ldl;
  }
  if (target.colesterol_hdl === undefined && source.colesterol_hdl !== undefined) {
    target.colesterol_hdl = source.colesterol_hdl;
  }
  if (target.trigliceridos === undefined && source.trigliceridos !== undefined) {
    target.trigliceridos = source.trigliceridos;
  }
  if (target.bun === undefined && source.bun !== undefined) target.bun = source.bun;
  if (target.creatinina === undefined && source.creatinina !== undefined) {
    target.creatinina = source.creatinina;
  }
  if (target.ego_proteinas === undefined && source.ego_proteinas !== undefined) {
    target.ego_proteinas = source.ego_proteinas;
  }
  if (target.ego_glucosa === undefined && source.ego_glucosa !== undefined) {
    target.ego_glucosa = source.ego_glucosa;
  }
  if (source.notas !== undefined) {
    if (target.notas === undefined) {
      target.notas = source.notas;
    } else if (target.notas !== source.notas) {
      target.notas = `${target.notas}\n${source.notas}`;
    }
  }
}

function mergeByFecha(daily: Registro[], lab: Registro[]): Registro[] {
  const byFecha = new Map<string, Registro>();

  for (const l of lab) {
    byFecha.set(l.fecha, { ...l });
  }
  for (const d of daily) {
    const existing = byFecha.get(d.fecha);
    if (existing) {
      mergeLabFields(existing, d);
      mergeDailyFields(existing, d);
      existing.id = `${existing.id}+${d.id}`;
    } else {
      byFecha.set(d.fecha, { ...d });
    }
  }

  return [...byFecha.values()]
    .map(r => ({ r, date: parseDailyDate(r.fecha) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ r }) => r);
}

/**
 * Compone el view data del historial a partir de los registros diarios, de
 * laboratorio y el perfil. Función pura (sin hooks) para poder testearla con
 * fixtures estáticos — toda la transformación de la pantalla vive aquí.
 */
export function buildHistorialViewData(
  dailyRecords: DailyRecordResponse[] | undefined,
  labRecords: LabRecordResponse[] | undefined,
  diabetesType: string | undefined,
  isPregnant: boolean | undefined
): HistorialViewData {
  const daily = (dailyRecords ?? []).map(mapDailyToRegistro);
  const lab = (labRecords ?? []).map(mapLabToRegistro);
  return {
    registros: mergeByFecha(daily, lab),
    tipoDiabetes: tipoDiabetesDePerfil(diabetesType, isPregnant),
    hasDiabetes: !!diabetesType && diabetesType !== "None",
    isPregnant: isPregnant ?? false,
  };
}
