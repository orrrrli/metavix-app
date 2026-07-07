import { NeuropathyRisk } from "@/features/neuropathy/components/NeuropathyRisk";

export default function NeuropathyPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Cuestionario de Neuropatía Diabética</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>Identifique posibles síntomas relacionados al daño nervioso temprano en los últimos 3 meses.</p>
      </div>

      <div className="mt-8">
        <NeuropathyRisk />
      </div>
    </div>
  );
}
