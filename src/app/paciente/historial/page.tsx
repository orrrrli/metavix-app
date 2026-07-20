"use client";

import { useAuthStore } from "@/features/auth/store";
import { useHistorial } from "@/features/historial/hooks/use-historial";
import { HistorialDesktop } from "@/features/historial/components/HistorialDesktop";
import { HistorialMobile } from "@/features/historial/components/HistorialMobile";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";

export default function HistorialPage() {
  const fullName = useAuthStore((s) => s.fullName);
  const firstName = (fullName ?? "").split(" ")[0] || fullName;
  const subtitulo = firstName
    ? `Aquí tienes tus registros, ${firstName}.`
    : "Visualiza todos tus registros diarios y monitorea tus metas.";

  const { viewData, isLoading, isError } = useHistorial();
  const { registros, tipoDiabetes, hasDiabetes, isPregnant } = viewData;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--bad)' }}>Error al cargar el historial. Intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Mi Historial</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>{subtitulo}</p>
      </div>

      {registros.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: 'var(--mut)' }}>Aún no tienes registros. Comienza registrando tu primera lectura.</p>
      ) : (
        <>
          {/* Móvil */}
          <div className="lg:hidden">
            <HistorialMobile registros={registros} hasDiabetes={hasDiabetes} isPregnant={isPregnant} />
          </div>

          {/* Escritorio */}
          <div className="hidden lg:block">
            <HistorialDesktop
              registros={registros}
              tipoDiabetes={tipoDiabetes}
              hasDiabetes={hasDiabetes}
              isPregnant={isPregnant}
            />
          </div>
        </>
      )}
    </div>
  );
}
