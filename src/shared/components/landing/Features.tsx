"use client";

import { motion } from "framer-motion";
import { Activity, Heart, Scale, Droplets, Microscope, ClipboardList } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Glucosa",
    description:
      "Registra tus niveles de azúcar en sangre: en ayuno, antes y después de cada comida. Metavix te muestra si estás dentro de tu rango.",
  },
  {
    icon: Heart,
    title: "Presión arterial",
    description:
      "Anota tu presión sistólica y diastólica junto con tu frecuencia cardíaca. Detecta tendencias antes de que se vuelvan un problema.",
  },
  {
    icon: Scale,
    title: "Peso y talla",
    description:
      "Lleva el seguimiento de tu peso día a día y visualiza tu IMC actualizado automáticamente.",
  },
  {
    icon: Droplets,
    title: "Colesterol y triglicéridos",
    description:
      "Guarda tus resultados de laboratorio y observa cómo responden a tu tratamiento o dieta.",
  },
  {
    icon: Microscope,
    title: "Hemoglobina glucosilada",
    description:
      "Registra tu HbA1c cada vez que te la midan. Metavix la grafica junto a tus glucosas diarias para ver el panorama completo.",
  },
  {
    icon: ClipboardList,
    title: "Historial siempre disponible",
    description:
      "Todos tus registros están en la nube, organizados por fecha. Accede desde tu celular o desde cualquier computadora.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            ¿Qué puedes registrar en Metavix?
          </h2>
          <p className="text-lg text-muted-foreground">
            Todo lo que tu médico necesita saber — en un solo lugar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary mb-6">
                <feature.icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
