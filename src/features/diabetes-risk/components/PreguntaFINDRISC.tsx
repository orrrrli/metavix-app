import { Button } from "@/shared/components/ui/button";
import { PreguntaFINDRISC as PreguntaType } from "../data/preguntas";
import { cn } from "@/shared/utils/index";

interface PreguntaFINDRISCProps {
  pregunta: PreguntaType;
  respuestaSeleccionada: number | null;
  onSelect: (puntos: number) => void;
  onNext: () => void;
  onPrev: () => void;
  esPrimera: boolean;
  esUltima: boolean;
}

export function PreguntaFINDRISC({ 
  pregunta, 
  respuestaSeleccionada, 
  onSelect, 
  onNext, 
  onPrev, 
  esPrimera, 
  esUltima 
}: PreguntaFINDRISCProps) {
  
  return (
    <div className="bg-card border rounded-xl p-6 sm:p-8 shadow-sm flex flex-col h-full animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-8">
          {pregunta.titulo}
        </h3>
        
        <div className="space-y-3">
          {pregunta.opciones.map((opcion, idx) => {
            const isSelected = respuestaSeleccionada === opcion.puntos;
            return (
              <button
                key={idx}
                onClick={() => onSelect(opcion.puntos)}
                className={cn(
                  "w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 font-medium",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-muted bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    isSelected ? "border-primary" : "border-muted-foreground"
                  )}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                  <span>{opcion.texto}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={onPrev} 
          disabled={esPrimera}
          className="w-28"
        >
          Anterior
        </Button>
        <Button 
          onClick={onNext} 
          disabled={respuestaSeleccionada === null}
          className="w-36"
        >
          {esUltima ? "Ver resultado" : "Siguiente"}
        </Button>
      </div>
    </div>
  );
}
