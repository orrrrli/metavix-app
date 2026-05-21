import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Stethoscope } from "lucide-react";

export function EncabezadoResumen({ nombrePaciente }: { nombrePaciente: string }) {
  const hoy = format(new Date(), "dd 'de' MMMM, yyyy", { locale: es });

  return (
    <div className="border-b-2 border-primary pb-6 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-md text-primary">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-primary leading-tight">Clínica Metavix</h1>
            <p className="text-xs text-muted-foreground">Medicina Especializada</p>
          </div>
        </div>
        
        <div className="text-right">
          <h2 className="text-2xl font-display font-bold text-foreground">Resumen Clínico</h2>
          <p className="text-sm text-muted-foreground">Generado: {hoy}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-muted bg-muted/20 -mx-6 px-6 py-4 rounded-md">
        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Paciente</p>
        <p className="text-lg font-bold text-foreground">{nombrePaciente}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xl">
          Basado en tus registros más recientes · Criterios según ADA Standards of Care 2026
        </p>
      </div>
    </div>
  );
}
