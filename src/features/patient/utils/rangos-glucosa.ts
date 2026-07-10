/**
 * Fuente única de verdad para los rangos clínicos de glucosa.
 *
 * Se usa tanto en el dashboard (hero "última lectura" + % en rango) como en
 * el wizard de registro (preview del valor y re-pintado de la bitácora). Si
 * aquí cambia un umbral, cambia en los dos lados.
 *
 * Reglas por tipo de comida + diabetes:
 *   - Ayuno / pre-comida:    80–130 (con diabetes)  |  70–100 (sin diabetes)
 *   - Post-comida:          ≤180   (con diabetes)  |  ≤140  (sin diabetes)
 *   - Zona "Revisar" (warn): dentro del 10% del borde superior o 10% por encima
 *     del borde inferior — coincide con la banda warn del hero del dashboard.
 */

import { GlucoseReadingType } from "@/types/daily-record";

export type EstadoClinico = "ok" | "warn" | "bad";

export interface RangoPorLectura {
  inf: number; // mg/dL — por debajo: "Baja" (bad)
  sup: number; // mg/dL — por encima: "Alta" (bad)
}

const RANGO_CON_DIABETES: Record<GlucoseReadingType, RangoPorLectura> = {
  [GlucoseReadingType.Fasting]:       { inf: 80, sup: 130 },
  [GlucoseReadingType.PreLunch]:      { inf: 80, sup: 130 },
  [GlucoseReadingType.PreDinner]:     { inf: 80, sup: 130 },
  [GlucoseReadingType.PostBreakfast]: { inf: 80, sup: 180 },
  [GlucoseReadingType.PostLunch]:     { inf: 80, sup: 180 },
  [GlucoseReadingType.PostDinner]:    { inf: 80, sup: 180 },
  [GlucoseReadingType.Snack]:         { inf: 80, sup: 180 },
  [GlucoseReadingType.Overnight]:     { inf: 80, sup: 130 },
};

const RANGO_SIN_DIABETES: Record<GlucoseReadingType, RangoPorLectura> = {
  [GlucoseReadingType.Fasting]:       { inf: 70, sup: 100 },
  [GlucoseReadingType.PreLunch]:      { inf: 70, sup: 100 },
  [GlucoseReadingType.PreDinner]:     { inf: 70, sup: 100 },
  [GlucoseReadingType.PostBreakfast]: { inf: 70, sup: 140 },
  [GlucoseReadingType.PostLunch]:     { inf: 70, sup: 140 },
  [GlucoseReadingType.PostDinner]:    { inf: 70, sup: 140 },
  [GlucoseReadingType.Snack]:         { inf: 70, sup: 140 },
  [GlucoseReadingType.Overnight]:     { inf: 70, sup: 100 },
};

/** Ayuno es el caso por defecto cuando el wizard aún no eligió tipo de comida. */
export const RANGO_AYUNO_POR_DEFECTO = GlucoseReadingType.Fasting;

export function rangoPara(t: GlucoseReadingType | string | number | null, hasDiabetes: boolean): RangoPorLectura {
  if (t == null) return rangoAyuno(hasDiabetes);
  const tabla = hasDiabetes ? RANGO_CON_DIABETES : RANGO_SIN_DIABETES;
  const r = tabla[t as GlucoseReadingType];
  // Defensivo: si `t` es un string enum de la API (p.ej. "Fasting") o un valor
  // desconocido, la tabla numérica no lo resuelve → cae al default de ayuno.
  return r ?? rangoAyuno(hasDiabetes);
}

function rangoAyuno(hasDiabetes: boolean): RangoPorLectura {
  return hasDiabetes ? RANGO_CON_DIABETES[GlucoseReadingType.Fasting] : RANGO_SIN_DIABETES[GlucoseReadingType.Fasting];
}

export function rangoParaDefault(hasDiabetes: boolean): RangoPorLectura {
  return rangoAyuno(hasDiabetes);
}

export interface Evaluacion {
  estado: EstadoClinico;
  label: "Baja" | "Alta" | "Revisar" | "En rango";
}

/**
 * Evalúa un valor contra el rango:
 *   - "bad" / "Baja"  si v < inf
 *   - "bad" / "Alta"  si v > sup
 *   - "warn" / "Revisar" si v está en el 10% externo del rango
 *   - "ok"   / "En rango" en caso contrario
 */
export function evaluar(v: number, r: RangoPorLectura): Evaluacion {
  if (v < r.inf) return { estado: "bad", label: "Baja" };
  if (v > r.sup) return { estado: "bad", label: "Alta" };
  if (v > r.sup * 0.9 || v < r.inf * 1.1) return { estado: "warn", label: "Revisar" };
  return { estado: "ok", label: "En rango" };
}
