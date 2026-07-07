import { GlucoseReadingType, GlucoseReadingResponse } from "@/types/daily-record";

/**
 * Modelo de UI + helpers para el wizard de registro de glucosa
 * (RegistroGlucosaMovil / RegistroGlucosaWeb).
 *
 * Cada `MealKey` mapea 1:1 a un `GlucoseReadingType` del backend, de modo que
 * el wizard captura vocabulario en español y lo traduce al enum del API al
 * guardar. El rango objetivo (70–180 mg/dL) sigue el estándar ADA de
 * "tiempo en rango" y coincide con las barras visuales del componente.
 */

// ── Momentos de medición ───────────────────────────────────────────

export const MEAL_KEYS = [
  "ayuno",
  "postDesayuno",
  "preComida",
  "postComida",
  "preCena",
  "postCena",
  "colacion",
  "madrugada",
] as const;

export type MealKey = (typeof MEAL_KEYS)[number];

export const MEAL_LABEL: Record<MealKey, string> = {
  ayuno: "En ayuno",
  postDesayuno: "Post desayuno",
  preComida: "Pre comida",
  postComida: "Post comida",
  preCena: "Pre cena",
  postCena: "Post cena",
  colacion: "Colación",
  madrugada: "Madrugada",
};

/** Puente MealKey → enum del backend. */
export const MEAL_TO_TYPE: Record<MealKey, GlucoseReadingType> = {
  ayuno: GlucoseReadingType.Fasting,
  postDesayuno: GlucoseReadingType.PostBreakfast,
  preComida: GlucoseReadingType.PreLunch,
  postComida: GlucoseReadingType.PostLunch,
  preCena: GlucoseReadingType.PreDinner,
  postCena: GlucoseReadingType.PostDinner,
  colacion: GlucoseReadingType.Snack,
  madrugada: GlucoseReadingType.Overnight,
};

const TYPE_TO_LABEL: Record<GlucoseReadingType, string> = {
  [GlucoseReadingType.Fasting]: MEAL_LABEL.ayuno,
  [GlucoseReadingType.PostBreakfast]: MEAL_LABEL.postDesayuno,
  [GlucoseReadingType.PreLunch]: MEAL_LABEL.preComida,
  [GlucoseReadingType.PostLunch]: MEAL_LABEL.postComida,
  [GlucoseReadingType.PreDinner]: MEAL_LABEL.preCena,
  [GlucoseReadingType.PostDinner]: MEAL_LABEL.postCena,
  [GlucoseReadingType.Snack]: MEAL_LABEL.colacion,
  [GlucoseReadingType.Overnight]: MEAL_LABEL.madrugada,
};

export function readingTypeLabel(t: GlucoseReadingType): string {
  return TYPE_TO_LABEL[t] ?? "";
}

/** Contenido interno del `<svg>` (lo envuelve el componente `MealIcon`). */
export const MEAL_ICON: Record<MealKey, string> = {
  ayuno: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />`,
  postDesayuno: `<path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><path d="M6 2c0 2-2 2-2 4" /><path d="M10 2c0 2-2 2-2 4" /><path d="M14 2c0 2-2 2-2 4" />`,
  preComida: `<circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" />`,
  postComida: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" /><path d="M21 15v7" />`,
  preCena: `<path d="M12 14v3" /><path d="M10 15.5l2 2 2-2" /><path d="M5 11a7 7 0 0 1 14 0" /><line x1="2" y1="11" x2="22" y2="11" /><line x1="5" y1="14" x2="19" y2="14" />`,
  postCena: `<circle cx="12" cy="13" r="7" /><circle cx="10" cy="11" r="2" />`,
  colacion: `<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" /><path d="M10 2c1 .5 2 2 2 5" />`,
  madrugada: `<path d="M12 2l1.5 7.5L21 11l-7.5 1.5L12 20l-1.5-7.5L3 11l7.5-1.5z" /><path d="M20 3l.4 1.2 1.2.4-1.2.4L20 6.2l-.4-1.2-1.2-.4 1.2-.4z" /><path d="M4 17l.3.9.9.3-.9.3-.3.9-.3-.9-.9-.3.9-.3z" />`,
};

// ── Modelos de la bitácora / guardado ──────────────────────────────

/** Lectura ya registrada, tal como la pinta la bitácora del wizard. */
export interface GlucosaLectura {
  id: string | number;
  t: string; // hora corta "07:30" (o "—" si no hay)
  label: string; // etiqueta del momento
  v: number; // mg/dL
}

/** Payload que emite el wizard al guardar (mapea a `GlucoseReadingRequest`). */
export interface NuevaLectura {
  readingType: GlucoseReadingType;
  valueMgDl: number;
  time: string | null; // "HH:mm:ss"
  foods: string | null;
}

/** Bitácora vacía por defecto (los datos reales llegan por props). */
export const GLUCOSA_SEED: GlucosaLectura[] = [];

// ── Rango clínico y helpers visuales ───────────────────────────────

const OBJETIVO_MIN = 70;
const OBJETIVO_MAX = 180;
const ESCALA_MIN = 40; // extremo izquierdo de la barra
const ESCALA_MAX = 300; // extremo derecho de la barra

export interface EstadoRango {
  estado: "" | "bajo" | "rango" | "alto";
  label: string;
  bg: string;
  color: string;
}

/** Clasifica un valor vs el rango objetivo. Cadena vacía / NaN → estado neutro. */
export function estadoRango(v: string | number): EstadoRango {
  const n = typeof v === "number" ? v : parseFloat(v);
  if (v === "" || Number.isNaN(n)) return { estado: "", label: "", bg: "", color: "" };
  if (n < OBJETIVO_MIN) return { estado: "bajo", label: "Baja", bg: "#fdecea", color: "#c14a2c" };
  if (n > OBJETIVO_MAX) return { estado: "alto", label: "Alta", bg: "#fdf3e0", color: "#b6791f" };
  return { estado: "rango", label: "En rango", bg: "#e8f7f0", color: "#1f9d6b" };
}

/** Posición (0–100 %) del marcador sobre la barra de rango. */
export function markerPct(v: string | number): number {
  const n = typeof v === "number" ? v : parseFloat(v);
  if (Number.isNaN(n)) return 0;
  const clamped = Math.min(ESCALA_MAX, Math.max(ESCALA_MIN, n));
  return ((clamped - ESCALA_MIN) / (ESCALA_MAX - ESCALA_MIN)) * 100;
}

export interface ResumenDia {
  total: number;
  enRango: number;
  promedio: number | string;
}

/** Totales del día para las tarjetas de resumen. */
export function resumenDia(lecturas: GlucosaLectura[]): ResumenDia {
  const total = lecturas.length;
  const enRango = lecturas.filter((l) => l.v >= OBJETIVO_MIN && l.v <= OBJETIVO_MAX).length;
  const promedio =
    total > 0 ? Math.round(lecturas.reduce((a, b) => a + b.v, 0) / total) : "—";
  return { total, enRango, promedio };
}

// ── Conversores API ↔ UI ───────────────────────────────────────────

/** Formatea "HH:mm:ss.fff" (del API) o "HH:mm" a "HH:mm". */
export function formatHoraCorta(time: string | null): string {
  if (!time) return "—";
  return time.slice(0, 5);
}

/** Convierte una lectura del API al modelo de la bitácora. */
export function readingToLectura(r: GlucoseReadingResponse): GlucosaLectura {
  return {
    id: r.id,
    t: formatHoraCorta(r.time),
    label: readingTypeLabel(r.readingType),
    v: r.valueMgDl,
  };
}

/** Normaliza "HH:mm" (input) a "HH:mm:ss" (API), o null. */
export function horaInputToApi(hora: string): string | null {
  if (!hora) return null;
  return hora.length === 5 ? `${hora}:00` : hora;
}

/** Hora local actual como "HH:mm" para <input type="time">. */
export function horaActual(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
