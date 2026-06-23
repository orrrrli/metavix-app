import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2 } from "lucide-react";

interface FormularioIMCProps {
  onCalcular: (peso: number, estatura: number, cintura: number | null) => Promise<void>;
  loading: boolean;
  initialPeso?: number;
  initialEstatura?: number;
  latestCintura?: number;
}

export function FormularioIMC({ onCalcular, loading, initialPeso, initialEstatura, latestCintura }: FormularioIMCProps) {
  const [peso, setPeso] = useState(initialPeso?.toString() ?? "");
  const [estatura, setEstatura] = useState(initialEstatura?.toString() ?? "");
  const [cintura, setCintura] = useState(latestCintura?.toString() ?? "");

  useEffect(() => {
    if (initialPeso !== undefined) setPeso(initialPeso.toString());
  }, [initialPeso]);

  useEffect(() => {
    if (initialEstatura !== undefined) setEstatura(initialEstatura.toString());
  }, [initialEstatura]);

  useEffect(() => {
    if (latestCintura !== undefined) setCintura(latestCintura.toString());
  }, [latestCintura]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cinturaVal = cintura !== "" ? Number(cintura) : null;
    onCalcular(Number(peso), Number(estatura), cinturaVal);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold mb-1">Tus datos</h3>
        <p className="text-sm text-muted-foreground">Ingresa tus valores actuales para calcular tu índice.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            step="0.1"
            min="20"
            max="300"
            required
            placeholder="Ej. 72.5"
            value={peso}
            onChange={e => setPeso(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estatura">Estatura (cm)</Label>
          <Input
            id="estatura"
            type="number"
            step="0.1"
            min="100"
            max="250"
            required
            placeholder="Ej. 170"
            value={estatura}
            onChange={e => setEstatura(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cintura">Cintura (cm) <span className="text-muted-foreground font-normal">— opcional</span></Label>
        <Input
          id="cintura"
          type="number"
          step="0.1"
          min="40"
          max="200"
          placeholder="Ej. 88"
          value={cintura}
          onChange={e => setCintura(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
        {loading ? "Calculando..." : "Calcular IMC"}
      </Button>
    </form>
  );
}
