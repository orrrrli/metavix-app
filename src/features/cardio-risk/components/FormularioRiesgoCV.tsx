import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { CheckboxFactor } from "./CheckboxFactor";
import { FACTORES_RIESGO } from "../data/factores";

interface FormularioRiesgoCVProps {
  edad: string;
  setEdad: (val: string) => void;
  sexo: string;
  setSexo: (val: string | null) => void;
  pas: string;
  setPas: (val: string) => void;
  ldl: string;
  setLdl: (val: string) => void;
  factoresActivos: string[];
  toggleFactor: (id: string) => void;
  onCalcular: () => void;
  error?: string | null;
}

export function FormularioRiesgoCV({
  edad, setEdad, sexo, setSexo, pas, setPas, ldl, setLdl, factoresActivos, toggleFactor, onCalcular, error
}: FormularioRiesgoCVProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalcular();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 sm:p-10 shadow-sm space-y-10">
      
      {/* Sección 1 */}
      <section>
        <h3 className="text-xl font-display font-semibold mb-4 border-b pb-2">Datos generales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="edad">Edad (años) <span className="text-red-500 dark:text-red-400">*</span></Label>
            <Input 
              id="edad" type="number" min="18" max="100" 
              value={edad} onChange={e => setEdad(e.target.value)} 
              placeholder="Ej. 45" required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo biológico <span className="text-red-500 dark:text-red-400">*</span></Label>
            <Select value={sexo} onValueChange={setSexo} required>
              <SelectTrigger id="sexo">
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Sección 2 */}
      <section>
        <h3 className="text-xl font-display font-semibold mb-4 border-b pb-2">Medidas (opcionales)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pas">Presión sistólica (mmHg)</Label>
            <Input 
              id="pas" type="number" min="80" max="220" 
              value={pas} onChange={e => setPas(e.target.value)} 
              placeholder="Ej. 130"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ldl">Colesterol LDL (mg/dL)</Label>
            <Input 
              id="ldl" type="number" min="50" max="400" 
              value={ldl} onChange={e => setLdl(e.target.value)} 
              placeholder="Ej. 130"
            />
          </div>
        </div>
      </section>

      {/* Sección 3 */}
      <section>
        <h3 className="text-xl font-display font-semibold mb-4 border-b pb-2">Factores de riesgo</h3>
        <p className="text-sm text-muted-foreground mb-4">Marque todos los que aplican actualmente a su estado de salud.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FACTORES_RIESGO.map(factor => (
            <CheckboxFactor 
              key={factor.id} 
              id={factor.id} 
              label={factor.label} 
              seleccionado={factoresActivos.includes(factor.id)}
              onToggle={toggleFactor}
            />
          ))}
        </div>
      </section>

      {error && (
        <div className="text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 p-4 rounded-md font-medium border border-red-100 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div className="pt-4">
        <Button type="submit" className="w-full sm:w-auto h-12 px-8 text-lg">
          Evaluar mi riesgo cardiovascular
        </Button>
      </div>

    </form>
  );
}
