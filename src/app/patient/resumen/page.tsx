import { ResumenSalud } from "@/features/resumen/components/ResumenSalud";

export default function ResumenPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="print:hidden">
        <h2 className="text-3xl font-display font-bold text-foreground">Mi Resumen de Salud</h2>
        <p className="text-muted-foreground mt-1">Tu perfil clínico actualizado y su interpretación frente a guías médicas internacionales.</p>
      </div>

      <ResumenSalud />
    </div>
  );
}
