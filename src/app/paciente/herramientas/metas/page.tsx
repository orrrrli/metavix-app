import { MetasControl } from "@/features/metas/components/MetasControl";

export default function MetasControlPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Mis Metas de Control</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>Ingresa tus últimos resultados y evalúa si te encuentras dentro de los objetivos médicos recomendados.</p>
      </div>

      <div className="mt-8">
        <MetasControl />
      </div>
    </div>
  );
}
