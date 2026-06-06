"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/shared/components/ui/button";
import { Monitor } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Empieza hoy. Sin costo.
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Accede a Metavix gratis y lleva el control de tu salud desde cualquier dispositivo.
          </p>
          <Link
            href="/register"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "h-14 px-8 text-lg",
            })}
          >
            <Monitor className="mr-2 size-5" />
            Acceder desde la web
          </Link>
          <p className="mt-8 text-primary-foreground/50 italic text-sm">
            Transforma tu salud, un día a la vez.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
