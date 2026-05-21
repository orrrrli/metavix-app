import { cn } from "@/shared/utils/index";
import { InterpretacionHba1c } from "../utils/calculadora";
import { Calculator } from "lucide-react";

interface ResultadoHbA1cProps {
  valor: number | null;
  unidad: string;
  interpretacion: InterpretacionHba1c | null;
}

export function ResultadoHbA1c({ valor, unidad, interpretacion }: ResultadoHbA1cProps) {
  if (valor === null || !interpretacion) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10 min-h-[300px]">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Calculator className="h-6 w-6" />
        </div>
        <h4 className="font-semibold text-lg text-foreground mb-2">Esperando valor</h4>
        <p className="text-sm max-w-[250px]">
          Ingresa tus datos en el formulario para conocer la equivalencia estimada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-in zoom-in-95 duration-500">
      <div className="space-y-4 w-full">
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
          Resultado Estimado
        </p>
        
        <div className="flex items-baseline justify-center gap-2">
          <h2 className="text-7xl font-display font-bold text-foreground">
            {valor}
          </h2>
          <span className="text-2xl font-medium text-muted-foreground">
            {unidad}
          </span>
        </div>

        <div className="pt-4 pb-2">
          <span className={cn("px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm inline-block", interpretacion.color)}>
            {interpretacion.categoria}
          </span>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg mt-4 text-sm text-muted-foreground font-medium border">
          {interpretacion.mensaje}
        </div>
      </div>
    </div>
  );
}
