/**
 * Fuente única de verdad para los rangos clínicos de glucosa.
 *
 * Se usa tanto en el dashboard (hero "última lectura" + % en rango) como en
 * el wizard de registro (preview del valor y re-pintado de la bitácora). Si
 * aquí cambia un umbral, cambia en los dos lados.
 *
 * Reglas por momento + diabetes: solo Ayuno vs Postprandial (todo lo que no
 * sea Ayuno) — ya no hay distinción Pre-comida vs Post-comida.
 *
 * Cada rango se modela como hasta 5 bandas ordenadas por valor de glucosa
 * (ver `Banda`), en vez de un simple inf/sup:
 *
 *   1. Hipoglucemia   — bad.  Piso ADA 2026: siempre < 70 mg/dL.
 *   2. Fuera de meta (baja) — bad, pero clínicamente distinto de
 *      hipoglucemia real. Ausente en Ayuno embarazada (pasa directo de
 *      Hipoglucemia a En meta).
 *   3. En meta        — ok.
 *   4. Revisar        — warn.
 *   5. Fuera de meta (alta) — bad.
 *
 * Umbrales por caso (ADA Standards of Care 2026 + guías de embarazo):
 *
 *   Ayuno, con diabetes (no embarazada):
 *     <70 Hipo | 70–79 Fuera-meta-baja | 80–130 En meta | 131–179 Revisar | >179 Fuera-meta-alta
 *   Ayuno, sin diabetes:
 *     <70 Hipo | 70–79 Fuera-meta-baja | 80–99 En meta | 100–125 Revisar (prediabetes) | >125 Fuera-meta-alta
 *   Ayuno, embarazada con DM/DMG:
 *     <70 Hipo | 70–95 En meta | 96–109 Revisar | >109 Fuera-meta-alta (sin banda "fuera-meta-baja")
 *   Postprandial, con diabetes (no embarazada):
 *     <70 Hipo | 70–79 Fuera-meta-baja | 80–179 En meta | 180–250 Revisar | >250 Fuera-meta-alta
 *   Postprandial, sin diabetes:
 *     <70 Hipo | 70–79 Fuera-meta-baja | 80–139 En meta | 140–199 Revisar (prediabetes) | ≥200 Fuera-meta-alta
 *   Postprandial, embarazada con DM/DMG:
 *     <70 Hipo | 70–99 Fuera-meta-baja | 100–120 En meta | 121–139 Revisar | ≥140 Fuera-meta-alta
 */

import { GlucoseReadingType } from "@/types/daily-record";

export type EstadoClinico = "ok" | "warn" | "bad";

export type EtiquetaBanda = "Hipoglucemia" | "Fuera de meta (baja)" | "En meta" | "Revisar" | "Fuera de meta (alta)";

/** Una banda clínica: válida desde `desde` (inclusive) hasta el inicio de la siguiente banda. */
export interface Banda {
  desde: number; // mg/dL, límite inferior inclusive
  estado: EstadoClinico;
  label: EtiquetaBanda;
}

/**
 * Rango clínico de un caso (momento + diabetes + embarazo): lista de bandas
 * ordenadas ascendentemente por `desde`. La última banda no tiene techo (se
 * extiende a +∞).
 */
export type RangoPorLectura = Banda[];

const HIPOGLUCEMIA: Banda = { desde: -Infinity, estado: "bad", label: "Hipoglucemia" };

function fueraMetaBaja(desde: number): Banda {
  return { desde, estado: "bad", label: "Fuera de meta (baja)" };
}
function enMeta(desde: number): Banda {
  return { desde, estado: "ok", label: "En meta" };
}
function revisar(desde: number): Banda {
  return { desde, estado: "warn", label: "Revisar" };
}
function fueraMetaAlta(desde: number): Banda {
  return { desde, estado: "bad", label: "Fuera de meta (alta)" };
}

/** Ayuno, con diabetes (no embarazada). */
const RANGO_AYUNO_CON_DIABETES: RangoPorLectura = [
  HIPOGLUCEMIA,
  fueraMetaBaja(70),
  enMeta(80),
  revisar(131),
  fueraMetaAlta(180),
];

/** Ayuno, sin diabetes. */
const RANGO_AYUNO_SIN_DIABETES: RangoPorLectura = [
  HIPOGLUCEMIA,
  fueraMetaBaja(70),
  enMeta(80),
  revisar(100),
  fueraMetaAlta(126),
];

/** Ayuno, embarazada con diabetes (gestacional o pregestacional): sin banda "fuera de meta (baja)". */
const RANGO_AYUNO_EMBARAZO_DM: RangoPorLectura = [
  HIPOGLUCEMIA,
  enMeta(70),
  revisar(96),
  fueraMetaAlta(110),
];

/** Postprandial, con diabetes (no embarazada). */
const RANGO_POSTPRANDIAL_CON_DIABETES: RangoPorLectura = [
  HIPOGLUCEMIA,
  fueraMetaBaja(70),
  enMeta(80),
  revisar(180),
  fueraMetaAlta(251),
];

/** Postprandial, sin diabetes. */
const RANGO_POSTPRANDIAL_SIN_DIABETES: RangoPorLectura = [
  HIPOGLUCEMIA,
  fueraMetaBaja(70),
  enMeta(80),
  revisar(140),
  fueraMetaAlta(200),
];

/** Postprandial, embarazada con diabetes (gestacional o pregestacional). */
const RANGO_POSTPRANDIAL_EMBARAZO_DM: RangoPorLectura = [
  HIPOGLUCEMIA,
  fueraMetaBaja(70),
  enMeta(100),
  revisar(121),
  fueraMetaAlta(140),
];

const RANGO_CON_DIABETES: Record<GlucoseReadingType, RangoPorLectura> = {
  [GlucoseReadingType.Fasting]:       RANGO_AYUNO_CON_DIABETES,
  [GlucoseReadingType.PreLunch]:      RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PreDinner]:     RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PostBreakfast]: RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PostLunch]:     RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PostDinner]:    RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.Snack]:         RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.Overnight]:     RANGO_POSTPRANDIAL_CON_DIABETES,
};

const RANGO_SIN_DIABETES: Record<GlucoseReadingType, RangoPorLectura> = {
  [GlucoseReadingType.Fasting]:       RANGO_AYUNO_SIN_DIABETES,
  [GlucoseReadingType.PreLunch]:      RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PreDinner]:     RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PostBreakfast]: RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PostLunch]:     RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PostDinner]:    RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.Snack]:         RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.Overnight]:     RANGO_POSTPRANDIAL_SIN_DIABETES,
};

/** Ayuno es el caso por defecto cuando el wizard aún no eligió tipo de comida. */
export const RANGO_AYUNO_POR_DEFECTO = GlucoseReadingType.Fasting;

export function rangoPara(
  t: GlucoseReadingType | string | number | null,
  hasDiabetes: boolean,
  isPregnant = false
): RangoPorLectura {
  if (hasDiabetes && isPregnant) {
    if (t == null || t === GlucoseReadingType.Fasting) return RANGO_AYUNO_EMBARAZO_DM;
    return RANGO_POSTPRANDIAL_EMBARAZO_DM;
  }
  if (t == null) return rangoAyuno(hasDiabetes);
  const tabla = hasDiabetes ? RANGO_CON_DIABETES : RANGO_SIN_DIABETES;
  const r = tabla[t as GlucoseReadingType];
  // Defensivo: si `t` es un string enum de la API (p.ej. "Fasting") o un valor
  // desconocido, la tabla numérica no lo resuelve → cae al default de ayuno.
  return r ?? rangoAyuno(hasDiabetes);
}

function rangoAyuno(hasDiabetes: boolean): RangoPorLectura {
  return hasDiabetes ? RANGO_AYUNO_CON_DIABETES : RANGO_AYUNO_SIN_DIABETES;
}

export function rangoParaDefault(hasDiabetes: boolean, isPregnant = false): RangoPorLectura {
  if (hasDiabetes && isPregnant) return RANGO_AYUNO_EMBARAZO_DM;
  return rangoAyuno(hasDiabetes);
}

/** Límite inferior/superior "duro" del rango (bordes de la primera/última banda). Útil para % en-rango y escalas visuales. */
export function limites(r: RangoPorLectura): { inf: number; sup: number } {
  const primeraNoInf = r.find((b) => Number.isFinite(b.desde));
  return { inf: primeraNoInf?.desde ?? 0, sup: Infinity };
}

/** Banda "En meta" del rango, si existe. */
export function bandaEnMeta(r: RangoPorLectura): { desde: number; hasta: number } | null {
  const idx = r.findIndex((b) => b.label === "En meta");
  if (idx === -1) return null;
  const siguiente = r[idx + 1];
  return { desde: r[idx].desde, hasta: siguiente ? siguiente.desde - 1 : Infinity };
}

export interface Evaluacion {
  estado: EstadoClinico;
  label: EtiquetaBanda;
}

/** Evalúa un valor contra la lista de bandas: retorna la última banda cuyo `desde` es <= v. */
export function evaluar(v: number, r: RangoPorLectura): Evaluacion {
  let actual = r[0];
  for (const banda of r) {
    if (v >= banda.desde) actual = banda;
    else break;
  }
  return { estado: actual.estado, label: actual.label };
}
