import { cn } from "@/shared/utils/index";
import { Check } from "lucide-react";

interface CheckboxFactorProps {
  id: string;
  label: string;
  seleccionado: boolean;
  onToggle: (id: string) => void;
}

export function CheckboxFactor({ id, label, seleccionado, onToggle }: CheckboxFactorProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={cn(
        "flex items-center text-left p-4 rounded-xl border-2 transition-all duration-200 select-none",
        seleccionado 
          ? "border-primary bg-primary/5 text-primary" 
          : "border-muted bg-white text-foreground hover:border-primary/40 hover:bg-muted/30"
      )}
    >
      <div className={cn(
        "w-6 h-6 rounded border flex items-center justify-center shrink-0 mr-3 transition-colors",
        seleccionado ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground bg-transparent"
      )}>
        {seleccionado && <Check className="w-4 h-4" strokeWidth={3} />}
      </div>
      <span className="font-medium text-sm sm:text-base leading-tight">{label}</span>
    </button>
  );
}
