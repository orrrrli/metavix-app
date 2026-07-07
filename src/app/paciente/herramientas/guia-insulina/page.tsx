import { InsulinaDM1 } from "@/features/insulin-dm1/components/InsulinaDM1";

export default function InsulinGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Guía de Insulina DM1</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>Calculadora de dosis, educación y registro de glucosa postprandial.</p>
      </div>

      <div>
        <InsulinaDM1 />
      </div>
    </div>
  );
}
