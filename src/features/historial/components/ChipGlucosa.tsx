import React from 'react';
import { estadoRango } from '@/features/patient/utils/glucosa';
import { GlucoseReadingType } from '@/types/daily-record';

interface ChipGlucosaProps {
  valor: number | null | undefined;
  readingType: GlucoseReadingType | null;
  hasDiabetes: boolean;
  isPregnant: boolean;
  /** Etiqueta pequeña encima del valor (ej. "Después Comida"). */
  label?: string;
}

/**
 * Chip de glucosa con los mismos colores del wizard de nuevo-registro:
 * lavanda para valores bajos (`--low`), verde en meta, amarillo revisar,
 * rojo alto. El color respeta tipo de diabetes / embarazo / momento vía
 * `estadoRango` (fuente única de verdad, `rangos-glucosa.ts`).
 */
export function ChipGlucosa({ valor, readingType, hasDiabetes, isPregnant, label }: ChipGlucosaProps) {
  if (valor == null) {
    return (
      <span
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        style={{ backgroundColor: 'var(--ph)', color: 'var(--mut)' }}
      >
        —
      </span>
    );
  }

  const e = estadoRango(valor, { hasDiabetes, isPregnant, readingType });

  return (
    <span
      className="inline-flex flex-col items-center justify-center rounded-md px-2 py-1 text-xs font-medium min-w-[3rem]"
      style={{ background: e.bg, color: e.color, fontFamily: "'Sora', sans-serif" }}
    >
      {label && <span className="text-[10px] opacity-70 mb-0.5">{label}</span>}
      <span>{valor}</span>
    </span>
  );
}
