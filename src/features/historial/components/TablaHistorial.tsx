import React from 'react';
import Link from 'next/link';
import { FilaRegistro, Registro } from './FilaRegistro';
import { TipoDiabetes } from '../utils/semaforo';
import { MetavixButton } from '@/shared/components/ui/metavix';

interface TablaHistorialProps {
  registros: Registro[];
  tipoDiabetes: TipoDiabetes;
}

export function TablaHistorial({ registros, tipoDiabetes }: TablaHistorialProps) {
  if (registros.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--card-bd)',
          fontFamily: "'Sora', sans-serif",
        }}
      >
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Aún no tienes registros</h3>
        <p className="mb-6 max-w-sm" style={{ color: 'var(--mut)' }}>
          Comienza registrando tus mediciones del día para llevar un control de tu salud.
        </p>
        <Link href="/paciente/nuevo-registro">
          <MetavixButton variant="primary">Registrar mediciones</MetavixButton>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-x-auto rounded-2xl"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--card-bd)',
        fontFamily: "'Sora', sans-serif",
        color: 'var(--text)',
      }}
    >
      <table className="w-full min-w-max text-sm">
        <thead style={{ background: 'var(--ph)', borderBottom: '1px solid var(--bd)' }}>
          <tr style={{ color: 'var(--mut)', fontWeight: 600 }} className="text-left">
            <th className="px-4 py-3 whitespace-nowrap">Fecha</th>
            <th className="px-4 py-3 whitespace-nowrap">Glucosa ayuno (mg/dL)</th>
            <th className="px-4 py-3 min-w-[200px]">Glucosas comidas (mg/dL)</th>
            <th className="px-4 py-3 whitespace-nowrap">Presión (mmHg)</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">FC (lpm)</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">Peso (kg)</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">Cintura (cm)</th>
            <th className="px-4 py-3 whitespace-nowrap">HbA1c (%)</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">Col. Total (mg/dL)</th>
            <th className="px-4 py-3 whitespace-nowrap">LDL (mg/dL)</th>
            <th className="px-4 py-3 whitespace-nowrap">HDL (mg/dL)</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">TG (mg/dL)</th>
            <th className="px-4 py-3 whitespace-nowrap text-center">Creatinina (mg/dL)</th>
            <th className="px-4 py-3 min-w-[150px]">Notas</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <FilaRegistro
              key={registro.id}
              registro={registro}
              tipoDiabetes={tipoDiabetes}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
