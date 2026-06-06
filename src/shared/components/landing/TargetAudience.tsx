"use client";

import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, Activity } from "lucide-react";

const conditions = [
  {
    icon: Stethoscope,
    title: "Diabetes",
    subtitle: "Tipo 1, Tipo 2 o Prediabetes",
  },
  {
    icon: HeartPulse,
    title: "Hipertensión",
    subtitle: "Presión alta o en control",
  },
  {
    icon: Activity,
    title: "Riesgo cardiovascular",
    subtitle: "Colesterol, triglicéridos altos",
  },
];

export function TargetAudience() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Metavix es para ti si tienes...
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {conditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm text-center"
            >
              <div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary mb-4">
                <condition.icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{condition.title}</h3>
              <p className="text-sm text-muted-foreground">{condition.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-muted-foreground max-w-2xl mx-auto"
        >
          También si cuidas a un familiar con enfermedad crónica y quieres llevar un registro
          organizado para sus citas médicas.
        </motion.p>
      </div>
    </section>
  );
}
