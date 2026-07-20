import { GlucoseReadingType, normalizeReadingType } from '@/types/daily-record';
import { GlucosaComida } from '../types';

/** Etiqueta corta para el momento de una lectura (acepta enum inglés o clave español). */
const TIPO_COMIDA_ABBR: Record<string, string> = {
  // Enum inglés de la API
  Fasting: 'Ayuno',
  PostBreakfast: 'Después Desayuno',
  PreLunch: 'Antes Comida',
  PostLunch: 'Después Comida',
  PreDinner: 'Antes Cena',
  PostDinner: 'Después Cena',
  Snack: 'Colación',
  Overnight: 'Madrugada',
  // Claves español (mapeo interno del historial)
  ayuno: 'Ayuno',
  antes_desayuno: 'Antes Desayuno',
  despues_desayuno: 'Después Desayuno',
  antes_comida: 'Antes Comida',
  despues_comida: 'Después Comida',
  antes_cena: 'Antes Cena',
  despues_cena: 'Después Cena',
  antes_colacion: 'Antes Colación',
  despues_colacion: 'Después Colación',
  madrugada: 'Madrugada',
};

/** Clave español (`mapDailyToRegistro`) → enum numérico, para clasificar el chip. */
const TIPO_ES_A_ENUM: Record<string, GlucoseReadingType> = {
  ayuno: GlucoseReadingType.Fasting,
  despues_desayuno: GlucoseReadingType.PostBreakfast,
  antes_comida: GlucoseReadingType.PreLunch,
  despues_comida: GlucoseReadingType.PostLunch,
  antes_cena: GlucoseReadingType.PreDinner,
  despues_cena: GlucoseReadingType.PostDinner,
  antes_colacion: GlucoseReadingType.Snack,
  madrugada: GlucoseReadingType.Overnight,
};

export function labelMomento(tipo: string): string {
  return TIPO_COMIDA_ABBR[tipo] ?? tipo;
}

/** Nombre del día de la semana (Lunes, Martes…) desde una fecha "dd/MM/yyyy". */
export function nombreDia(fecha: string): string {
  const [day, month, year] = fecha.split('/').map(Number);
  if (!day || !month || !year) return '';
  const d = new Date(year, month - 1, day);
  const nombre = d.toLocaleDateString('es-MX', { weekday: 'long' });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

/**
 * Resuelve el `GlucoseReadingType` de una comida: prioriza el campo explícito,
 * luego la clave español y finalmente el enum inglés (`normalizeReadingType`).
 */
export function readingTypeDe(m: GlucosaComida): GlucoseReadingType {
  if (m.readingType != null) return m.readingType;
  return TIPO_ES_A_ENUM[m.tipo] ?? normalizeReadingType(m.tipo);
}
