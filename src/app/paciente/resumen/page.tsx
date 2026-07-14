import { ResumenControl } from "@/features/resumen/components/ResumenControl";

export default function ResumenPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="print:hidden">
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Mi Resumen de Salud</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>Tu perfil clínico actualizado y su interpretación frente a guías médicas internacionales.</p>
      </div>

      <ResumenControl />
    </div>
  );
}
