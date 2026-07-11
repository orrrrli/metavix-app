"use client";

import { Callout } from "../Callout";
import { TablaAlimentos } from "../TablaAlimentos";
import { cn } from "@/shared/utils/index";
import { statusBadgeClasses, type ClinicalLevel } from "@/shared/utils/status-colors";

const rangos: { titulo: string; valor: string; level: ClinicalLevel }[] = [
  { titulo: "Hipoglucemia", valor: "< 70 mg/dL", level: "danger" },
  { titulo: "En Meta", valor: "70 - 130 mg/dL", level: "success" },
  { titulo: "Alta", valor: "131 - 250 mg/dL", level: "warning" },
  { titulo: "Muy Alta", valor: "> 250 mg/dL", level: "danger" },
];

export function Aprender() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-4">
        <h3 className="text-xl font-display font-bold text-foreground">¿Por qué contar Carbohidratos (HC)?</h3>
        <p className="text-muted-foreground leading-relaxed">
          Los carbohidratos son el nutriente que más eleva la glucosa en sangre. Al contar cuántos gramos de HC vas a comer,
          puedes calcular exactamente cuánta insulina necesitas aplicar para mantener tus niveles estables. Este método te da
          flexibilidad para comer lo que desees siempre que apliques la dosis correcta.
        </p>
        <Callout variant="info" title="Concepto Clave">
          El <strong>RIC (Relación Insulina-Carbohidrato)</strong> es la cantidad de gramos de carbohidratos que cubre 1 unidad de tu insulina de acción rápida.
        </Callout>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-bold text-foreground">¿Cómo contar gramos?</h3>
        <p className="text-muted-foreground leading-relaxed">
          Usa tazas medidoras, básculas de alimentos o aprende a estimar visualmente las porciones.
          Aquí tienes una tabla de referencia con alimentos comunes equivalentes a una porción estándar (~15g de HC).
        </p>
        <TablaAlimentos />
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-display font-bold text-foreground">Mide tu glucosa antes de comer</h3>
        <p className="text-muted-foreground leading-relaxed">
          La calculadora tomará en cuenta tu glucosa actual. Si está por encima de tu meta, añadirá
          &ldquo;insulina de corrección&rdquo; a tu dosis.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {rangos.map((r) => (
            <div
              key={r.titulo}
              className={cn("p-4 rounded-lg border", statusBadgeClasses(r.level))}
            >
              <h4 className="font-bold">{r.titulo}</h4>
              <p className={cn(
                "text-sm mt-1",
                r.level === "danger" ? "dark:text-red-300" : r.level === "success" ? "dark:text-emerald-300" : "dark:text-amber-300"
              )}>
                {r.valor}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t">
        <h3 className="text-xl font-display font-bold text-foreground">¿Cuándo llamar al médico?</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>Si tienes hipoglucemias severas o frecuentes (menos de 70 mg/dL).</li>
          <li>Si tu glucosa está consistentemente por encima de 250 mg/dL a pesar de las correcciones.</li>
          <li>Si estás enfermo, tienes fiebre o infección (los requerimientos de insulina aumentan).</li>
          <li>Si experimentas cetonas en orina o sangre.</li>
        </ul>
      </section>
    </div>
  );
}
