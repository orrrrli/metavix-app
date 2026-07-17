"use client";

import { InsulinaDM1 } from "@/features/insulin-dm1/components/InsulinaDM1";
import { useAuthStore } from "@/features/auth/store";

export default function InsulinGuidePage() {
  const { fullName } = useAuthStore();
  const firstName = (fullName ?? "").split(" ")[0] || fullName;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Guía de Insulina DM1</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>
          {firstName ? `Aquí tienes tu calculadora de dosis, educación y registro de glucosa postprandial, ${firstName}.` : "Calculadora de dosis, educación y registro de glucosa postprandial."}
        </p>
      </div>

      <div>
        <InsulinaDM1 />
      </div>
    </div>
  );
}
