import React from 'react';
import Link from 'next/link';
import { FilaRegistro, Registro } from './FilaRegistro';
import { TipoDiabetes } from '../utils/semaforo';
import { buttonVariants } from '@/shared/components/ui/button';

interface TablaHistorialProps {
  registros: Registro[];
  tipoDiabetes: TipoDiabetes;
}

export function TablaHistorial({ registros, tipoDiabetes }: TablaHistorialProps) {
  if (registros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl bg-card shadow-sm">
        <h3 className="text-xl font-display font-semibold mb-2 text-foreground">Aún no tienes registros</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Comienza registrando tus mediciones del día para llevar un control de tu salud.
        </p>
        <Link href="/paciente/nuevo-registro" className={buttonVariants()}>
          Registrar mediciones
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr className="text-left text-muted-foreground font-medium">
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
