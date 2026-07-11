import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/shared/utils/index";
import { InterpretacionRiesgo } from "../data/interpretacion";
import { statusCalloutClasses, statusCalloutIconClasses } from "@/shared/utils/status-colors";

interface ResultadoFINDRISCProps {
  puntaje: number;
  interpretacion: InterpretacionRiesgo;
  onReset: () => void;
}

export function ResultadoFINDRISC({ puntaje, interpretacion, onReset }: ResultadoFINDRISCProps) {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="bg-card border rounded-xl p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-4">
          Tu Puntaje FINDRISC
        </p>

        <div className="flex items-baseline justify-center gap-2 mb-6">
          <h2 className="text-8xl font-display font-bold text-foreground">
            {puntaje}
          </h2>
          <span className="text-2xl font-medium text-muted-foreground">
            puntos
          </span>
        </div>

        <div className="space-y-3 w-full max-w-md">
          <div className={cn("py-3 px-6 rounded-lg border font-bold text-lg shadow-sm flex items-center justify-center gap-2", interpretacion.color)}>
            <Activity className="h-5 w-5" />
            Riesgo {interpretacion.nivel}
          </div>

          <div className="bg-muted/30 py-3 px-6 rounded-lg border text-sm font-medium text-muted-foreground">
            Probabilidad a 10 años: <strong className="text-foreground">{interpretacion.probabilidad}</strong>
          </div>
        </div>

        <p className="mt-8 text-lg font-medium text-foreground max-w-lg">
          {interpretacion.recomendacion}
        </p>

        <Button onClick={onReset} variant="outline" className="mt-10 h-12 px-8">
          Hacer el cuestionario de nuevo
        </Button>
      </div>

      <div className={cn("border-l-4 p-5 rounded-r-md", statusCalloutClasses("warning"))}>
        <div className="flex items-start">
          <AlertTriangle className={cn("h-5 w-5 mt-0.5 shrink-0", statusCalloutIconClasses("warning"))} />
          <div className="ml-3">
            <h4 className="text-sm font-bold mb-1">Aviso Clínico Obligatorio</h4>
            <p className="text-sm opacity-90">
              Este cuestionario es una herramienta de orientación basada en el test FINDRISC (Finnish Diabetes Risk Score). No reemplaza el diagnóstico médico. Solo un análisis de sangre puede confirmar diabetes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
