import { AlertTriangle, HeartPulse } from "lucide-react";
import { cn } from "@/shared/utils/index";
import { TEXTOS_CLINICOS } from "../data/factores";
import { statusCalloutClasses, statusCalloutIconClasses } from "@/shared/utils/status-colors";

interface ResultadoRiesgoCVProps {
  puntaje: number;
  nivel: string;
  color: string;
  factoresEncontrados: string[];
}

export function ResultadoRiesgoCV({ puntaje, nivel, color, factoresEncontrados }: ResultadoRiesgoCVProps) {
  return (
    <div id="resultado-cardio" className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 mt-12 pt-8 border-t-2">
      <div className="bg-card border rounded-xl p-8 sm:p-12 shadow-md">

        <div className="text-center mb-10">
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-2">
            Tu Riesgo Cardiovascular Estimado
          </p>
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-6xl font-display font-bold text-foreground">
              {puntaje}
            </h2>
            <span className="text-2xl font-medium text-muted-foreground">
              pts
            </span>
          </div>
          <div className="mt-6 flex justify-center">
            <span className={cn("px-6 py-2 rounded-full font-bold text-lg border shadow-sm flex items-center gap-2", color)}>
              <HeartPulse className="w-5 h-5" />
              {nivel}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-display font-semibold border-b pb-2">Factores Clínicos Identificados</h3>

          {factoresEncontrados.length === 0 ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-lg text-emerald-800 dark:text-emerald-200 font-medium">
              {TEXTOS_CLINICOS["ninguno"]}
            </div>
          ) : (
            <ul className="space-y-3">
              {factoresEncontrados.map((llave, idx) => (
                <li key={idx} className="flex gap-3 items-start p-3 bg-muted/20 rounded-lg border">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5 shrink-0">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {TEXTOS_CLINICOS[llave]}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={cn("border-l-4 p-5 rounded-r-md shadow-sm", statusCalloutClasses("warning"))}>
        <div className="flex items-start">
          <AlertTriangle className={cn("h-5 w-5 mt-0.5 shrink-0", statusCalloutIconClasses("warning"))} />
          <div className="ml-3">
            <h4 className="text-sm font-bold mb-1">Aviso Clínico Obligatorio</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Esta evaluación es orientativa y no reemplaza una valoración médica completa con estudios de laboratorio. Consulte a su médico para una evaluación de riesgo cardiovascular formal (SCORE, Framingham).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
