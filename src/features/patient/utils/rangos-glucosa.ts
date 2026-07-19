/**
 * Fuente única de verdad para los rangos clínicos de glucosa.
 *
 * Se usa tanto en el dashboard (hero "última lectura" + % en rango) como en
 * el wizard de registro (preview del valor y re-pintado de la bitácora). Si
 * aquí cambia un umbral, cambia en los dos lados.
 *
 * Reglas por momento + diabetes: ya no hay distinción Pre-comida vs
 * Post-comida — solo Ayuno vs Postprandial (todo lo que no sea Ayuno).
 *
 *   - Hipoglucemia (`inf`): piso único de 80 mg/dL en todos los casos —
 *     Ayuno o Postprandial, con o sin diabetes, embarazada o no. Por debajo
 *     de 80 siempre es "Baja" (bad).
 *   - Ayuno (Fasting): bandas clínicas explícitas de 3 categorías (sin
 *     diabetes / con diabetes / embarazada con DM) — ver `enMetaInf`/
 *     `enMetaSup` en `RANGO_CON_DIABETES`/`RANGO_SIN_DIABETES`/
 *     `RANGO_AYUNO_EMBARAZO_DM`.
 *   - Postprandial (cualquier momento que no sea Fasting: post-desayuno,
 *     pre-comida, post-comida, pre-cena, post-cena, colación, madrugada):
 *     bandas clínicas explícitas de 2 categorías — con diabetes no
 *     embarazada (en meta <180, revisar 180–250) y embarazada con DM/DMG
 *     (en meta 100–120, revisar 121–139 y 80–99). Sin diabetes sigue el
 *     rango genérico 80–140 (sin banda "Revisar" explícita).
 *   - Zona "Revisar" (warn) para tipos sin bandas explícitas: dentro del 10%
 *     del borde superior o 10% por encima del borde inferior.
 */

import { GlucoseReadingType } from "@/types/daily-record";

export type EstadoClinico = "ok" | "warn" | "bad";

export interface RangoPorLectura {
  inf: number; // mg/dL — por debajo: "Baja" (bad)
  sup: number; // mg/dL — por encima: "Alta" (bad)
  /**
   * Borde "En meta" explícito (mg/dL), dentro de [inf, sup]. Si se omite,
   * `evaluar` usa la regla genérica del ±10% sobre inf/sup para decidir
   * "Revisar". Cuando está presente, todo lo que cae en [inf, sup] pero
   * fuera de [enMetaInf, enMetaSup] es "Revisar".
   */
  enMetaInf?: number;
  enMetaSup?: number;
}

/** Banda postprandial (con diabetes, no embarazada): en meta <180, revisar 180–250. */
const RANGO_POSTPRANDIAL_CON_DIABETES: RangoPorLectura = { inf: 80, sup: 250, enMetaInf: 80, enMetaSup: 179 };
/** Banda postprandial (sin diabetes): rango genérico, sin banda "Revisar" explícita. */
const RANGO_POSTPRANDIAL_SIN_DIABETES: RangoPorLectura = { inf: 80, sup: 140 };

const RANGO_CON_DIABETES: Record<GlucoseReadingType, RangoPorLectura> = {
  [GlucoseReadingType.Fasting]:       { inf: 80, sup: 179, enMetaInf: 80, enMetaSup: 130 },
  [GlucoseReadingType.PreLunch]:      RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PreDinner]:     RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PostBreakfast]: RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PostLunch]:     RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.PostDinner]:    RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.Snack]:         RANGO_POSTPRANDIAL_CON_DIABETES,
  [GlucoseReadingType.Overnight]:     RANGO_POSTPRANDIAL_CON_DIABETES,
};

const RANGO_SIN_DIABETES: Record<GlucoseReadingType, RangoPorLectura> = {
  [GlucoseReadingType.Fasting]:       { inf: 80, sup: 125, enMetaInf: 80, enMetaSup: 99 },
  [GlucoseReadingType.PreLunch]:      RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PreDinner]:     RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PostBreakfast]: RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PostLunch]:     RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.PostDinner]:    RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.Snack]:         RANGO_POSTPRANDIAL_SIN_DIABETES,
  [GlucoseReadingType.Overnight]:     RANGO_POSTPRANDIAL_SIN_DIABETES,
};

/**
 * Ayuno para paciente embarazada con diabetes (gestacional o pregestacional).
 * Solo se usa para `GlucoseReadingType.Fasting`.
 */
const RANGO_AYUNO_EMBARAZO_DM: RangoPorLectura = { inf: 80, sup: 109, enMetaInf: 80, enMetaSup: 95 };

/**
 * Postprandial para paciente embarazada con diabetes (gestacional o
 * pregestacional). Aplica a cualquier momento que no sea Ayuno.
 */
const RANGO_POSTPRANDIAL_EMBARAZO_DM: RangoPorLectura = { inf: 80, sup: 139, enMetaInf: 100, enMetaSup: 120 };

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
  return hasDiabetes ? RANGO_CON_DIABETES[GlucoseReadingType.Fasting] : RANGO_SIN_DIABETES[GlucoseReadingType.Fasting];
}

export function rangoParaDefault(hasDiabetes: boolean, isPregnant = false): RangoPorLectura {
  if (hasDiabetes && isPregnant) return RANGO_AYUNO_EMBARAZO_DM;
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
 *   - Si el rango define `enMetaInf`/`enMetaSup` (bandas clínicas explícitas):
 *     "ok" dentro de esa sub-banda, "warn" / "Revisar" en el resto de [inf, sup]
 *   - Si no las define: "warn" / "Revisar" dentro del ±10% de inf/sup (regla genérica)
 *   - "ok"   / "En rango" en caso contrario
 */
export function evaluar(v: number, r: RangoPorLectura): Evaluacion {
  if (v < r.inf) return { estado: "bad", label: "Baja" };
  if (v > r.sup) return { estado: "bad", label: "Alta" };
  if (r.enMetaInf != null && r.enMetaSup != null) {
    if (v >= r.enMetaInf && v <= r.enMetaSup) return { estado: "ok", label: "En rango" };
    return { estado: "warn", label: "Revisar" };
  }
  if (v > r.sup * 0.9 || v < r.inf * 1.1) return { estado: "warn", label: "Revisar" };
  return { estado: "ok", label: "En rango" };
}
