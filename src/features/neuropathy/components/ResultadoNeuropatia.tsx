import { AlertTriangle, ActivitySquare } from "lucide-react";
import { cn } from "@/shared/utils/index";
import { InterpretacionNeuropatia, SintomaNeuropatia } from "../data/sintomas";

interface ResultadoNeuropatiaProps {
  interpretacion: InterpretacionNeuropatia;
  sintomasMarcados: SintomaNeuropatia[];
}

export function ResultadoNeuropatia({ interpretacion, sintomasMarcados }: ResultadoNeuropatiaProps) {
  return (
    <div id="resultado-neuropatia" className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 mt-12 pt-8 border-t-2">
      <div className="bg-card border rounded-xl p-8 sm:p-12 shadow-md">
        
        <div className="text-center mb-10">
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-4">
            Resultado de la Evaluación
          </p>
          
          <div className="flex justify-center mb-6">
            <span className={cn("px-6 py-2 rounded-full font-bold text-lg border shadow-sm", interpretacion.colorNivel)}>
              Nivel: {interpretacion.nivel}
            </span>
          </div>

          <h3 className="text-3xl font-display font-bold text-foreground mb-3">
            {interpretacion.titulo}
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {interpretacion.subtitulo}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-display font-semibold border-b pb-2">
            Síntomas reportados en los últimos 3 meses:
          </h4>
          
          {sintomasMarcados.length === 0 ? (
            <p className="text-muted-foreground italic px-2">Ningún síntoma seleccionado.</p>
          ) : (
            <ul className="space-y-2">
              {sintomasMarcados.map(s => (
                <li key={s.id} className="flex gap-3 items-start p-2">
                  <ActivitySquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{s.titulo}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={cn("border-l-4 p-5 rounded-r-md shadow-sm", interpretacion.colorAviso)}>
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 opacity-80" />
          <div className="ml-3">
            <h4 className="text-sm font-bold mb-1 opacity-90">Recomendación Clínica</h4>
            <p className="text-sm leading-relaxed opacity-90">
              {interpretacion.aviso}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
