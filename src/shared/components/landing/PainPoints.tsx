"use client";

import { motion } from "framer-motion";

const painPoints = [
  "Llegar a la consulta y no recordar cuánto te marcó la glucosa la semana pasada.",
  "Tener los registros regados en papelitos, cuadernos o fotos del celular.",
  "Visitar a un nuevo médico y no poder mostrarle tu historial completo.",
  "No saber si tu presión de hoy está bien o si deberías preocuparte.",
];

export function PainPoints() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            ¿Te ha pasado alguna vez...?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-muted rounded-2xl p-8 mb-6 border border-border/50"
        >
          <ul className="space-y-4">
            {painPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 size-2 rounded-full bg-primary/60 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-primary mb-3">Para eso existe Metavix.</h3>
          <p className="text-muted-foreground">
            Un lugar seguro donde tus mediciones viven ordenadas, con gráficas claras y alertas
            que te avisan cuando algo merece atención.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
