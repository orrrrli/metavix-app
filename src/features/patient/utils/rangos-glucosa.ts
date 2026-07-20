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
 * Cada rango se modela como hasta 4 bandas ordenadas por valor de glucosa
 * (ver `Banda`), en vez de un simple inf/sup:
 *
 *   1. Fuera de meta (baja) — bad. Incluye la hipoglucemia (ADA 2026: <70
 *      mg/dL es el caso más severo dentro de esta misma banda, pero no se
 *      etiqueta aparte — "fuera de meta por debajo" es una sola categoría).
 *   2. En meta        — ok.
 *   3. Revisar        — warn.
 *   4. Fuera de meta (alta) — bad.
 *
 * Umbrales por caso (ADA Standards of Care 2026 + guías de embarazo). El
 * piso de "Fuera de meta (baja)" NO es uniforme: coincide con el inicio de la
 * banda "En meta" de cada caso (todo lo que quede por debajo cae en
 * fuera-meta-baja). Es <80 en ayuno-con-diabetes, <110 en postprandial-
 * embarazo, y <70 en el resto (el corte ADA de hipoglucemia):
 *
 *   Ayuno, con diabetes (no embarazada):
 *     <80 Fuera-meta-baja | 80–130 En meta | 131–180 Revisar | >180 Fuera-meta-alta
 *   Ayuno, sin diabetes:
 *     <70 Fuera-meta-baja | 70–99 En meta | 100–125 Revisar (prediabetes) | >125 Fuera-meta-alta
 *   Ayuno, embarazada con DM/DMG:
 *     <70 Fuera-meta-baja | 70–95 En meta | 96–125 Revisar | >125 Fuera-meta-alta
 *   Postprandial, con diabetes (no embarazada):
 *     <70 Fuera-meta-baja | 70–179 En meta | 180–250 Revisar | >250 Fuera-meta-alta
 *   Postprandial, sin diabetes:
 *     <70 Fuera-meta-baja | 70–139 En meta | 140–199 Revisar (prediabetes) | ≥200 Fuera-meta-alta
 *   Postprandial, embarazada con DM/DMG:
 *     <70 Fuera-meta-baja | 110–140 En meta | 141–180 Revisar | >180 Fuera-meta-alta
 */

import { GlucoseReadingType } from "@/types/daily-record";

export type EstadoClinico = "ok" | "warn" | "bad";

export type EtiquetaBanda = "Fuera de meta (baja)" | "En meta" | "Revisar" | "Fuera de meta (alta)";

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

/** Primera banda de un rango: cubre desde -∞ hasta `hasta` (inclusive del piso de la siguiente banda). */
function fueraMetaBaja(): Banda {
  return { desde: -Infinity, estado: "bad", label: "Fuera de meta (baja)" };
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
  fueraMetaBaja(),
  enMeta(80),
  revisar(131),
  fueraMetaAlta(181),
];

/** Ayuno, sin diabetes. */
const RANGO_AYUNO_SIN_DIABETES: RangoPorLectura = [
  fueraMetaBaja(),
  enMeta(70),
  revisar(100),
  fueraMetaAlta(126),
];

/** Ayuno, embarazada con diabetes (gestacional o pregestacional). */
const RANGO_AYUNO_EMBARAZO_DM: RangoPorLectura = [
  fueraMetaBaja(),
  enMeta(70),
  revisar(96),
  fueraMetaAlta(126),
];

/** Postprandial, con diabetes (no embarazada). */
const RANGO_POSTPRANDIAL_CON_DIABETES: RangoPorLectura = [
  fueraMetaBaja(),
  enMeta(70),
  revisar(180),
  fueraMetaAlta(251),
];

/** Postprandial, sin diabetes. */
const RANGO_POSTPRANDIAL_SIN_DIABETES: RangoPorLectura = [
  fueraMetaBaja(),
  enMeta(70),
  revisar(140),
  fueraMetaAlta(200),
];

/** Postprandial, embarazada con diabetes (gestacional o pregestacional). */
const RANGO_POSTPRANDIAL_EMBARAZO_DM: RangoPorLectura = [
  fueraMetaBaja(),
  enMeta(110),
  revisar(141),
  fueraMetaAlta(181),
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

/**
 * "Fuera de meta (baja)" usa morado (`--low`) en vez del rojo de "Fuera de
 * meta (alta)" (`--bad`) para que la barra y el chip distingan a simple
 * vista un valor bajo de uno alto, aunque ambos compartan `estado: "bad"`.
 */
const COLOR_POR_BANDA: Record<EtiquetaBanda, string> = {
  "Fuera de meta (baja)": "var(--low,#8873c2)",
  "En meta": "var(--ok,#1f9d6b)",
  "Revisar": "#e6b53f",
  "Fuera de meta (alta)": "#e8836e",
};

export interface SegmentoVisual {
  pct: number; // ancho del segmento, 0–100
  color: string;
}

/**
 * Escala visual [min, max] para pintar la barra de un rango: los extremos
 * abiertos (Fuera de meta baja/alta) reciben un margen fijo en vez de
 * estirarse a una escala global — así una banda angosta (ej. ayuno sin
 * diabetes: Revisar es solo 100–125) no queda aplastada junto a un tramo
 * "Alto" desproporcionadamente largo. El margen es proporcional al ancho de
 * la banda "En meta" (mínimo 20 mg/dL) para que se vea consistente sin
 * importar qué tan angosto o ancho sea el rango clínico del caso.
 */
export function escalaPara(r: RangoPorLectura): { min: number; max: number } {
  const meta = bandaEnMeta(r);
  const anchoMeta = meta && Number.isFinite(meta.hasta) ? meta.hasta - meta.desde : 30;
  const margen = Math.max(20, anchoMeta * 0.6);
  const primeraNoInf = r.find((b) => Number.isFinite(b.desde));
  const ultima = r[r.length - 1];
  return {
    min: Math.max(0, (primeraNoInf?.desde ?? 0) - margen),
    max: ultima.desde + margen,
  };
}

/**
 * Traduce las bandas del rango a segmentos de color con ancho porcentual,
 * para pintar la barra del wizard. El ancho de cada banda es proporcional a
 * su rango numérico dentro de [escalaMin, escalaMax] — la primera banda
 * (Fuera de meta baja, sin piso) arranca en `escalaMin` y la última (Fuera
 * de meta alta, sin techo) termina en `escalaMax`, para que los límites de
 * los segmentos coincidan exactamente con la escala lineal que usa
 * `markerPct` y el marcador no caiga en un segmento del color equivocado.
 */
export function segmentosVisuales(r: RangoPorLectura, escalaMin: number, escalaMax: number): SegmentoVisual[] {
  const anchos = r.map((b, i) => {
    const desde = Number.isFinite(b.desde) ? b.desde : escalaMin;
    const siguiente = r[i + 1];
    const hasta = siguiente ? siguiente.desde : escalaMax;
    return Math.max(0, hasta - desde);
  });
  const total = anchos.reduce((a, b) => a + b, 0);
  const segmentos: SegmentoVisual[] = [];
  for (let i = 0; i < r.length; i++) {
    const pct = (anchos[i] / total) * 100;
    const color = COLOR_POR_BANDA[r[i].label];
    const ultimo = segmentos[segmentos.length - 1];
    if (ultimo && ultimo.color === color) ultimo.pct += pct;
    else segmentos.push({ pct, color });
  }
  return segmentos;
}

/** Texto de leyenda "Bajo <X / Objetivo A–B / Alto ≥C" para la barra del wizard. */
export function leyendaRango(r: RangoPorLectura): { bajo: string; objetivo: string; alto: string } {
  const banda = bandaEnMeta(r);
  const desdeObjetivo = banda?.desde ?? r.find((b) => b.estado !== "bad")?.desde ?? 0;
  const fueraAlta = r.find((b) => b.label === "Fuera de meta (alta)");
  return {
    bajo: `Bajo <${desdeObjetivo}`,
    objetivo: banda ? `Objetivo ${banda.desde}–${Number.isFinite(banda.hasta) ? banda.hasta : ""}` : "Objetivo",
    alto: fueraAlta ? `Alto ≥${fueraAlta.desde}` : "",
  };
}
