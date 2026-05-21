import { cn } from "@/shared/utils/index";
import { Check } from "lucide-react";

interface SintomaCheckProps {
  id: string;
  titulo: string;
  descripcion: string;
  seleccionado: boolean;
  onToggle: (id: string) => void;
}

export function SintomaCheck({ id, titulo, descripcion, seleccionado, onToggle }: SintomaCheckProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={cn(
        "w-full flex items-center justify-between text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 select-none",
        seleccionado 
          ? "border-primary bg-primary/5" 
          : "border-muted bg-white hover:border-primary/40 hover:bg-muted/30"
      )}
    >
      <div className="pr-4">
        <h4 className={cn(
          "font-semibold text-base sm:text-lg mb-1",
          seleccionado ? "text-primary" : "text-foreground"
        )}>
          {titulo}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {descripcion}
        </p>
      </div>

      <div className={cn(
        "w-7 h-7 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
        seleccionado 
          ? "bg-primary border-primary text-primary-foreground" 
          : "border-muted-foreground bg-transparent"
      )}>
        {seleccionado && <Check className="w-5 h-5" strokeWidth={3} />}
      </div>
    </button>
  );
}
