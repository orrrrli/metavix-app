"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Registra tu clínica",
    description: "Crea tu cuenta como profesional de la salud o centro médico en minutos y configura tu perfil."
  },
  {
    number: "02",
    title: "Invita a tus pacientes",
    description: "Añade a tus pacientes a la plataforma para que puedan registrar sus signos vitales diarios."
  },
  {
    number: "03",
    title: "Monitorea y previene",
    description: "Recibe alertas preventivas, visualiza gráficos de evolución y ajusta tratamientos con datos reales."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            ¿Cómo funciona Metavix?
          </h2>
          <p className="text-lg text-muted-foreground">
            Una plataforma intuitiva pensada para simplificar tu flujo de trabajo sin sumar fricción a la consulta médica.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative bg-background md:bg-transparent"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="size-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shadow-primary/20 ring-8 ring-background">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dashboard UI Image */}
        <motion.div 
          className="mt-20 max-w-4xl mx-auto relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Image 
            src="/images/laptop.jpg" 
            alt="Metavix Dashboard Interface" 
            fill
            className="object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
