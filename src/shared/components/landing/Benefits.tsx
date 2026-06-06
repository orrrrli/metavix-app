"use client";

import { motion } from "framer-motion";
import { TrendingUp, Bell } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Gráficas amigables",
    description:
      "Cada medición genera una gráfica sencilla que muestra tu evolución. Sin tablas complicadas. Solo la información que necesitas ver.",
  },
  {
    icon: Bell,
    title: "Alertas inteligentes",
    description:
      "Cuando un valor está fuera de tu rango, Metavix te avisa al instante y te indica si debes buscar atención médica.",
  },
];

export function Benefits() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Tus números, en lenguaje que entiendes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="inline-flex items-center justify-center size-14 rounded-xl bg-primary/10 text-primary mb-6">
                <benefit.icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
