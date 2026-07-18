"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { BmiCalculator } from "@/features/bmi/components/BmiCalculator";
import { useAuthStore } from "@/features/auth/store";

export default function BmiCalculatorPage() {
  const { fullName } = useAuthStore();
  const firstName = (fullName ?? "").split(" ")[0] || fullName;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Calculadora de IMC</h2>
          <p className="mt-1 text-muted-foreground">
            {firstName ? `Calcula tu Índice de Masa Corporal, ${firstName}, y mantén un registro de tu progreso.` : "Calcula tu Índice de Masa Corporal y mantén un registro de tu progreso."}
          </p>
        </div>
        <Link
          href="/paciente/herramientas/imc"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--accent)" }}
        >
          <TrendingUp className="size-4" />
          Ver tendencia
        </Link>
      </div>

      <BmiCalculator />
    </div>
  );
}
