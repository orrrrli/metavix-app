import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConversorHbA1cProps {
  modo: "hba1c_to_glucosa" | "glucosa_to_hba1c";
  onCalcular: (valor: number) => void;
}

export function ConversorHbA1c({ modo, onCalcular }: ConversorHbA1cProps) {
  const [valorInput, setValorInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Limpiar input al cambiar de modo: patrón "ajustar estado en render" de React
  // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes),
  // en vez de un useEffect con setState (que dispara render en cascada).
  const [modoAnterior, setModoAnterior] = useState(modo);
  if (modo !== modoAnterior) {
    setModoAnterior(modo);
    setValorInput("");
    setError(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = Number(valorInput);

    if (modo === "hba1c_to_glucosa") {
      if (!valorInput || val < 4.0 || val > 20.0) {
        setError("La HbA1c debe estar entre 4.0% y 20.0%");
        return;
      }
    } else {
      if (!valorInput || val < 70 || val > 600) {
        setError("La glucosa debe estar entre 70 y 600 mg/dL");
        return;
      }
    }

    onCalcular(val);
  };

  const config = modo === "hba1c_to_glucosa" 
    ? {
        titulo: "Convertir de HbA1c",
        desc: "Ingresa tu porcentaje de hemoglobina glicosilada.",
        label: "HbA1c (%)",
        placeholder: "Ej. 7.0",
        step: "0.1",
        min: 4,
        max: 20,
        btn: "Convertir a glucosa promedio"
      }
    : {
        titulo: "Convertir de Glucosa",
        desc: "Ingresa tu nivel de glucosa promedio estimado.",
        label: "Glucosa promedio (mg/dL)",
        placeholder: "Ej. 154",
        step: "1",
        min: 70,
        max: 600,
        btn: "Convertir a HbA1c estimada"
      };

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-6 h-full flex flex-col justify-between min-h-[300px]">
      <div>
        <h3 className="text-lg font-display font-semibold mb-1">{config.titulo}</h3>
        <p className="text-sm text-muted-foreground">{config.desc}</p>
        
        <div className="space-y-2 mt-6">
          <Label htmlFor="valorConvertir">{config.label}</Label>
          <Input 
            id="valorConvertir" 
            type="number" 
            step={config.step} 
            min={config.min} 
            max={config.max}
            required 
            placeholder={config.placeholder}
            value={valorInput} 
            onChange={e => {
              setValorInput(e.target.value);
              setError(null);
            }} 
            className="text-lg py-6"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-3 text-red-600 dark:text-red-300 text-sm bg-red-50 dark:bg-red-950/40 p-2 rounded-md border border-red-100 dark:border-red-900/50">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full h-12 text-lg mt-8">
        {config.btn}
      </Button>
    </form>
  );
}
