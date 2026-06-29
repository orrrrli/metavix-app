import React from 'react';
import { EstadoValor } from '../utils/semaforo';

interface BadgeValorProps {
  valor: number | string | null | undefined;
  estado: EstadoValor;
  suffix?: string;
  label?: string;
}

const COLOR_MAP: Record<Exclude<EstadoValor, 'sin_dato'>, React.CSSProperties> = {
  en_meta: {
    backgroundColor: 'var(--ok-bg)',
    color: 'var(--ok)',
    borderColor: 'var(--ok)',
  },
  revisar: {
    backgroundColor: 'var(--warn-bg)',
    color: 'var(--warn)',
    borderColor: 'var(--warn)',
  },
  fuera_de_meta: {
    backgroundColor: 'var(--bad-bg)',
    color: 'var(--bad)',
    borderColor: 'var(--bad)',
  },
};

export function BadgeValor({ valor, estado, suffix = '', label }: BadgeValorProps) {
  if (valor == null || valor === '' || estado === 'sin_dato') {
    return (
      <span
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        style={{ backgroundColor: 'var(--ph)', color: 'var(--mut)' }}
      >
        —
      </span>
    );
  }

  const colorStyle = COLOR_MAP[estado as Exclude<EstadoValor, 'sin_dato'>] ?? {};

  return (
    <span
      className="inline-flex flex-col items-center justify-center rounded-md border px-2 py-1 text-xs font-medium min-w-[3rem]"
      style={{ ...colorStyle, fontFamily: "'Sora', sans-serif" }}
    >
      {label && <span className="text-[10px] opacity-70 mb-0.5">{label}</span>}
      <span>{valor}{suffix}</span>
    </span>
  );
}
