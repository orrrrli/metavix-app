import { CardioRisk } from "@/features/cardio-risk/components/CardioRisk";

export default function CardioRiskPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Evaluación de Riesgo Cardiovascular</h2>
        <p className="text-muted-foreground mt-1">Calcula tu nivel de riesgo basado en factores demográficos, clínicos y de estilo de vida.</p>
      </div>

      <div className="mt-8">
        <CardioRisk />
      </div>
    </div>
  );
}
