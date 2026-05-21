import { DefParametro, EvaluacionMeta } from "../data/parametros";
import { cn } from "@/shared/utils/index";
import { CheckCircle2, AlertCircle, XCircle, MinusCircle } from "lucide-react";

interface ResultadoParametro {
  param: DefParametro;
  valor: string;
  evaluacion: EvaluacionMeta;
}

interface ResumenControlProps {
  resultados: ResultadoParametro[];
}

export function ResumenControl({ resultados }: ResumenControlProps) {
  const conteos = {
    enMeta: 0,
    cuidado: 0,
    fuera: 0,
    sinDato: 0
  };

  resultados.forEach(r => {
    if (r.evaluacion.estado === "en_meta") conteos.enMeta++;
    else if (r.evaluacion.estado === "cuidado") conteos.cuidado++;
    else if (r.evaluacion.estado === "fuera_meta") conteos.fuera++;
    else conteos.sinDato++;
  });

  const getTileStyle = (estado: string) => {
    switch(estado) {
      case "en_meta": return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case "cuidado": return "bg-amber-50 border-amber-200 text-amber-900";
      case "fuera_meta": return "bg-red-50 border-red-200 text-red-900";
      default: return "bg-muted/40 border-muted text-muted-foreground";
    }
  };

  return (
    <div id="resumen-metas" className="animate-in slide-in-from-bottom-8 duration-700 mt-12 space-y-8">
      
      <div className="bg-card border rounded-xl p-6 sm:p-10 shadow-md">
        <h3 className="text-xl font-display font-semibold mb-6">Tu Estado Actual</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resultados.map((r, idx) => (
            <div key={idx} className={cn("p-4 rounded-lg border-2 flex flex-col justify-center items-center text-center", getTileStyle(r.evaluacion.estado))}>
              <span className="text-2xl font-bold font-mono">
                {r.valor || "—"}
              </span>
              <span className="text-sm font-medium opacity-80 mt-1">
                {r.param.nombre}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          {conteos.enMeta > 0 && (
            <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-emerald-900"><strong className="font-bold">{conteos.enMeta} parámetro(s) en meta</strong> — Excelente trabajo, continúe así.</p>
            </div>
          )}
          {conteos.cuidado > 0 && (
            <div className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-900"><strong className="font-bold">{conteos.cuidado} parámetro(s) por mejorar</strong> — Están cerca de la meta pero requieren atención.</p>
            </div>
          )}
          {conteos.fuera > 0 && (
            <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-900"><strong className="font-bold">{conteos.fuera} parámetro(s) fuera de meta</strong> — Se recomienda consulta médica para ajustar el tratamiento.</p>
            </div>
          )}
          {conteos.sinDato > 0 && (
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <MinusCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground"><strong className="font-bold">{conteos.sinDato} dato(s) sin ingresar</strong> — Solicite estos estudios en su próxima consulta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
