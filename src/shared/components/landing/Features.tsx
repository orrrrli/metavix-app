"use client";

import { motion } from "framer-motion";
import { Activity, Bell, ShieldCheck, Stethoscope } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Monitoreo en Tiempo Real",
    description: "Sigue los signos vitales, glucosa y presión arterial de tus pacientes al instante."
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Recibe notificaciones automáticas ante métricas fuera del rango de seguridad."
  },
  {
    icon: Stethoscope,
    title: "Historial Clínico Unificado",
    description: "Accede al perfil completo del paciente, diagnósticos y tratamientos en un solo lugar."
  },
  {
    icon: ShieldCheck,
    title: "Máxima Seguridad",
    description: "Tus datos y los de tus pacientes protegidos bajo los más altos estándares de privacidad."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Todo lo que necesitas para una atención de excelencia
          </h2>
          <p className="text-lg text-muted-foreground">
            Diseñado específicamente para cardiólogos, endocrinólogos y médicos generales que buscan optimizar el seguimiento de patologías crónicas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
