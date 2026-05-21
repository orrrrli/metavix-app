import { MetasControl } from "@/features/metas/components/MetasControl";

export default function MetasControlPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Mis Metas de Control</h2>
        <p className="text-muted-foreground mt-1">Ingresa tus últimos resultados y evalúa si te encuentras dentro de los objetivos médicos recomendados.</p>
      </div>

      <div className="mt-8">
        <MetasControl />
      </div>
    </div>
  );
}
