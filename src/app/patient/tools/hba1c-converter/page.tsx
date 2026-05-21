import { Hba1cConverter } from "@/features/hba1c/components/Hba1cConverter";

export default function Hba1cConverterPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Conversor HbA1c a Glucosa</h2>
        <p className="text-muted-foreground mt-1">Estima tu glucosa promedio a partir de tu hemoglobina glicosilada, o viceversa, usando la fórmula clínica ADAG (Nathan et al., 2008).</p>
      </div>

      <Hba1cConverter />
    </div>
  );
}
