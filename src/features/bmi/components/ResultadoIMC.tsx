import { cn } from "@/shared/utils/index";

interface ResultadoIMCProps {
  imc: number | null;
  categoria: string | null;
}

export function ResultadoIMC({ imc, categoria }: ResultadoIMCProps) {
  if (!imc || !categoria) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
        <div className="bg-muted p-4 rounded-full mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
        </div>
        <h4 className="font-semibold text-lg text-foreground mb-2">Calcula tu Índice</h4>
        <p className="text-sm">Introduce tu peso y estatura en el formulario para conocer tu estado nutricional.</p>
      </div>
    );
  }

  let colorClass = "";
  let barColor = "";
  
  if (categoria === "Bajo peso") { colorClass = "text-amber-600"; barColor = "bg-amber-500"; }
  else if (categoria === "Normal") { colorClass = "text-emerald-600"; barColor = "bg-emerald-500"; }
  else if (categoria === "Sobrepeso") { colorClass = "text-orange-600"; barColor = "bg-orange-500"; }
  else if (categoria.includes("grado I")) { colorClass = "text-red-500"; barColor = "bg-red-500"; }
  else if (categoria.includes("grado II")) { colorClass = "text-red-600"; barColor = "bg-red-600"; }
  else { colorClass = "text-red-700"; barColor = "bg-red-700"; }

  // Calcular porcentaje para la barra visual (IMC de 15 a 45)
  const minImc = 15;
  const maxImc = 45;
  const range = maxImc - minImc;
  let percent = ((imc - minImc) / range) * 100;
  percent = Math.max(0, Math.min(100, percent));

  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500 h-full">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Tu Resultado</p>
        <h2 className="text-6xl font-display font-bold text-foreground">
          {imc.toFixed(1)}
        </h2>
        <p className={cn("text-xl font-medium pt-2", colorClass)}>
          {categoria}
        </p>
      </div>

      <div className="w-full max-w-sm pt-4">
        <div className="relative h-4 bg-muted rounded-full overflow-hidden flex">
          <div className="w-[11.6%] bg-amber-300" title="Bajo peso (<18.5)"></div>
          <div className="w-[21.3%] bg-emerald-400" title="Normal (18.5-24.9)"></div>
          <div className="w-[16.6%] bg-orange-400" title="Sobrepeso (25-29.9)"></div>
          <div className="w-[16.6%] bg-red-400" title="Obesidad I (30-34.9)"></div>
          <div className="w-[16.6%] bg-red-500" title="Obesidad II (35-39.9)"></div>
          <div className="flex-1 bg-red-700" title="Obesidad III (>=40)"></div>
        </div>
        
        <div className="relative h-6 mt-1 mx-2">
          <div 
            className="absolute top-0 -ml-1.5 flex flex-col items-center transition-all duration-1000 ease-out" 
            style={{ left: `${percent}%` }}
          >
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent border-b-foreground"></div>
            <div className="text-xs font-bold mt-1 bg-foreground text-background px-1.5 py-0.5 rounded shadow-sm">Tú</div>
          </div>
        </div>
      </div>
    </div>
  );
}
