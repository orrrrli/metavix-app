"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/shared/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Ver el historial de glucosa, presión, peso y laboratorios de tus pacientes en tiempo real.",
  "Recibir alertas cuando un paciente registra valores fuera de rango.",
  "Tomar decisiones clínicas basadas en datos reales, no en el recuerdo del paciente.",
  "Optimizar el tiempo de consulta con un historial ya organizado y graficado.",
];

export function DoctorCTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-10 border border-border/50 shadow-sm"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 text-center">
            ¿Eres profesional de la salud?
          </h2>
          <p className="text-muted-foreground mb-8 text-center">
            Regístrate como médico o especialista y accede al historial completo de tus pacientes
            directamente en tu panel clínico — sin esperar a que te muestren papeles en consulta.
          </p>
          <p className="font-semibold text-foreground mb-4">Con Metavix puedes:</p>
          <ul className="space-y-3 mb-8">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-5 text-primary shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="text-center">
            <Link
              href="/register"
              className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg" })}
            >
              Regístrarte como profesional de la salud <ArrowRight className="ml-2 size-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
