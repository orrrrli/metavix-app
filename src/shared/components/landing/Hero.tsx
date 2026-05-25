"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/shared/components/ui/button";
import { ArrowRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
      {/* Abstract Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-8">
              <Image src="/icon.svg" alt="Metavix Logo" width={32} height={32} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Revoluciona el cuidado de tus <span className="text-primary">pacientes</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
              Plataforma de monitoreo cardiovascular y de diabetes. 
              Toma decisiones clínicas más rápidas y precisas con datos en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/register" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/25" })}>
                Comenzar ahora <ArrowRight className="ml-2 size-5" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-lg w-full sm:w-auto" })}>
                Iniciar sesión
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="flex-1 w-full max-w-xl lg:max-w-none"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Dashboard Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-muted flex items-center justify-center">
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
      </div>
    </section>
  );
}
