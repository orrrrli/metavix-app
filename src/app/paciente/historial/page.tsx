"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { TablaHistorial } from "@/features/historial/components/TablaHistorial";
import { Registro } from "@/features/historial/components/FilaRegistro";
import { TipoDiabetes } from "@/features/historial/utils/semaforo";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";

export default function HistorialPage() {
  const router = useRouter();
  const { role } = useAuthStore();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Asumiremos que el tipo de diabetes viene del usuario en el store, si no, 'dm2' por defecto
  const tipoDiabetes: TipoDiabetes = 'dm2';

  useEffect(() => {
    // Redirigir si no hay rol de paciente
    if (role !== 'PATIENT') {
      router.replace("/");
      return;
    }

    const fetchRegistros = async () => {
      try {
        const response = await fetch('/api/registros?limit=100');
        if (!response.ok) {
          throw new Error('Error al obtener registros');
        }
        const data = await response.json();
        
        // Ordenar por fecha descendente
        const sortedData = data.sort((a: Registro, b: Registro) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
        
        setRegistros(sortedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistros();
  }, [role, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <GooeyLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Mi Historial</h2>
        <p className="text-muted-foreground mt-1">
          Visualiza todos tus registros diarios y monitorea tus metas.
        </p>
      </div>

      <TablaHistorial registros={registros} tipoDiabetes={tipoDiabetes} />
    </div>
  );
}
