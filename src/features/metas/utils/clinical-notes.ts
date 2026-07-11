import type { GoalStatus } from '@/types/goal-evaluation';
import { PARAMETROS_META_BY_ID } from '../data/parametros';

export interface ParameterNoteContext {
  parameterId: string;
  status: GoalStatus;
  valueUsed: number | null;
  isPregnant: boolean;
  /** Valor del mismo parámetro en el lab/registro anterior, cuando aplica
   *  (hoy sólo lo usa `increaseNote`, ej. creatinina). */
  previousValue?: number | null;
}

export interface ParameterNotes {
  note: string | null;
  criticalAlert: string | null;
}

/**
 * Deriva las notas clínicas de un parámetro en tiempo de render, leyendo los
 * flags declarativos (`pregnancyNote`, `criticalAlert`, `increaseNote`) del
 * catálogo `PARAMETROS_META` — no hay ramas por `parameterId` aquí; agregar
 * una nota nueva es cuestión de declarar el flag en `parametros.ts`, no de
 * tocar esta función. Las notas no vienen del backend ni se persisten en
 * `GoalEvaluation` (preservan su inmutabilidad — Rule #9).
 */
export function getParameterNotes(ctx: ParameterNoteContext): ParameterNotes {
  const spec = PARAMETROS_META_BY_ID.get(ctx.parameterId);

  let note: string | null = null;
  if (spec?.pregnancyNote && ctx.isPregnant) {
    const { text, requiresAbnormalStatus } = spec.pregnancyNote;
    if (!requiresAbnormalStatus || ctx.status !== 'InRange') {
      note = text;
    }
  }

  if (!note && spec?.increaseNote && ctx.valueUsed !== null) {
    const { previousValue } = ctx;
    if (previousValue !== null && previousValue !== undefined && previousValue > 0) {
      // Redondeado a 6 decimales para evitar falsos negativos en el límite
      // por error de precisión de punto flotante (ej. (1.3-1.0)/1.0*100 da
      // 30.000000000000004 en vez de 30).
      const pctIncrease = Math.round(((ctx.valueUsed - previousValue) / previousValue) * 100 * 1e6) / 1e6;
      if (pctIncrease > 0 && pctIncrease <= spec.increaseNote.maxPercentIncrease) {
        note = spec.increaseNote.text;
      }
    }
  }

  let criticalAlert: string | null = null;
  if (spec?.criticalAlert && ctx.status === spec.criticalAlert.status && ctx.valueUsed !== null) {
    if (ctx.valueUsed >= spec.criticalAlert.minValue) {
      criticalAlert = spec.criticalAlert.text;
    }
  }

  return { note, criticalAlert };
}
