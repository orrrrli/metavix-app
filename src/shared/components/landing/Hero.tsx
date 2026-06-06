"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Copy — centered */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-8">
            <Image src="/icon.svg" alt="Metavix Logo" width={32} height={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Tus mediciones.{" "}
            <span className="text-primary">
              Siempre organizadas. Siempre disponibles.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Metavix es tu bitácora de salud personal: registra tu glucosa, presión arterial,
            peso y más — y llévalos siempre contigo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/25" })}
            >
              Registrarse gratis <ArrowRight className="ml-2 size-5" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-lg w-full sm:w-auto" })}
            >
              Acceder desde la web
            </Link>
          </div>
          <p className="mt-6 text-sm text-primary font-medium">
            ★ Completamente gratuito para pacientes ★
          </p>
        </motion.div>

        {/* Dashboard image — below copy, full width */}
        <motion.div
          className="mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-muted">
            <Image
              src="/images/dashboard.png"
              alt="Metavix Dashboard Preview"
              fill
              className="object-cover object-left-top"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
