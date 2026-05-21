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
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderColor: '#a7f3d0',
  },
  revisar: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderColor: '#fde68a',
  },
  fuera_de_meta: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderColor: '#fecaca',
  },
};

export function BadgeValor({ valor, estado, suffix = '', label }: BadgeValorProps) {
  if (valor == null || valor === '' || estado === 'sin_dato') {
    return (
      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
        —
      </span>
    );
  }

  const colorStyle = COLOR_MAP[estado as Exclude<EstadoValor, 'sin_dato'>] ?? {};

  return (
    <span
      className="inline-flex flex-col items-center justify-center rounded-md border px-2 py-1 text-xs font-medium min-w-[3rem]"
      style={colorStyle}
    >
      {label && <span className="text-[10px] opacity-70 mb-0.5">{label}</span>}
      <span>{valor}{suffix}</span>
    </span>
  );
}
