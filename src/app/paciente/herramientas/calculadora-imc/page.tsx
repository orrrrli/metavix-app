import { BmiCalculator } from "@/features/bmi/components/BmiCalculator";

export default function BmiCalculatorPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Calculadora de IMC</h2>
        <p className="text-muted-foreground mt-1">Calcula tu Índice de Masa Corporal y mantén un registro de tu progreso.</p>
      </div>

      <BmiCalculator />
    </div>
  );
}
