import { RiesgoDiabetes } from "@/features/diabetes-risk/components/RiesgoDiabetes";

export default function RiesgoDiabetesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Riesgo de Diabetes (FINDRISC)</h2>
        <p className="text-muted-foreground mt-1">Descubre tu nivel de riesgo de desarrollar diabetes tipo 2 en los próximos 10 años.</p>
      </div>

      <div className="mt-8">
        <RiesgoDiabetes />
      </div>
    </div>
  );
}
