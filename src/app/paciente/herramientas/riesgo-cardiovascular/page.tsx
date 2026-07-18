"use client";

import { CardioRisk } from "@/features/cardio-risk/components/CardioRisk";
import { useAuthStore } from "@/features/auth/store";

export default function CardioRiskPage() {
  const { fullName } = useAuthStore();
  const firstName = (fullName ?? "").split(" ")[0] || fullName;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Evaluación de Riesgo Cardiovascular</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>
          {firstName ? `Calcula tu nivel de riesgo, ${firstName}, basado en factores demográficos, clínicos y de estilo de vida.` : "Calcula tu nivel de riesgo basado en factores demográficos, clínicos y de estilo de vida."}
        </p>
      </div>

      <div className="mt-8">
        <CardioRisk />
      </div>
    </div>
  );
}
