import { Input } from "@/shared/components/ui/input";
import { SemaforoIndicador } from "./SemaforoIndicador";
import { DefParametro } from "../data/parametros";
import { ArrowRight } from "lucide-react";

interface ParametroMetaProps {
  param: DefParametro;
  valor: string;
  colorActual: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

export function ParametroMeta({ param, valor, colorActual, onChange, readOnly }: ParametroMetaProps) {
  return (
    <div className="bg-card border rounded-xl p-5 sm:p-6 shadow-sm hover:border-primary/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        
        {/* Info y Meta Esperada */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-display font-semibold text-lg text-foreground">{param.nombre}</h4>
            <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
              {param.fuente}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Meta:
            </span>
            <span className="font-mono font-bold text-foreground bg-primary/10 text-primary px-2 py-0.5 rounded">
              {param.metaMostrada}
            </span>
          </div>
        </div>

        <ArrowRight className="hidden md:block w-5 h-5 text-muted-foreground/40 shrink-0" />

        {/* Value display or input + Semáforo */}
        <div className="flex items-center gap-4 md:w-64 shrink-0">
          {readOnly ? (
            <div className="relative flex-1 h-10 flex items-center px-3 bg-muted/40 rounded-md border">
              {valor ? (
                <>
                  <span className="text-lg font-medium">{valor}</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                    {param.unidad}
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground italic">Sin datos</span>
              )}
            </div>
          ) : (
            <div className="relative flex-1">
              <Input
                type="number"
                step={param.step}
                min={param.min}
                max={param.max}
                value={valor}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder="Ej. 110"
                className="pr-16 text-lg font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                {param.unidad}
              </span>
            </div>
          )}
          <SemaforoIndicador color={colorActual} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-muted-foreground leading-relaxed">
        {param.explicacion}
      </div>
    </div>
  );
}
