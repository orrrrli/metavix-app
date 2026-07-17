"use client";

import { Hba1cConverter } from "@/features/hba1c/components/Hba1cConverter";
import { useAuthStore } from "@/features/auth/store";

export default function Hba1cConverterPage() {
  const { fullName } = useAuthStore();
  const firstName = (fullName ?? "").split(" ")[0] || fullName;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Conversor HbA1c a Glucosa</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>
          {firstName
            ? `Estima tu glucosa promedio, ${firstName}, a partir de tu hemoglobina glicosilada, o viceversa, usando la fórmula clínica ADAG (Nathan et al., 2008).`
            : "Estima tu glucosa promedio a partir de tu hemoglobina glicosilada, o viceversa, usando la fórmula clínica ADAG (Nathan et al., 2008)."}
        </p>
      </div>

      <Hba1cConverter />
    </div>
  );
}
