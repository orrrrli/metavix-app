import { Hero } from "@/shared/components/landing/Hero";
import { PainPoints } from "@/shared/components/landing/PainPoints";
import { Features } from "@/shared/components/landing/Features";
import { Benefits } from "@/shared/components/landing/Benefits";
import { HowItWorks } from "@/shared/components/landing/HowItWorks";
import { TargetAudience } from "@/shared/components/landing/TargetAudience";
import { FinalCTA } from "@/shared/components/landing/FinalCTA";
import { DoctorCTA } from "@/shared/components/landing/DoctorCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-1">
        <Hero />
        <PainPoints />
        <Features />
        <Benefits />
        <HowItWorks />
        <TargetAudience />
        <FinalCTA />
        <DoctorCTA />
      </main>

      <footer className="bg-white border-t border-border/50 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Metavix. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <a href="/caracteristicas" className="hover:text-primary transition-colors py-1">Características</a>
            <a href="/precios" className="hover:text-primary transition-colors py-1">Precios</a>
            <a href="/recursos" className="hover:text-primary transition-colors py-1">Recursos</a>
            <a href="#" className="hover:text-primary transition-colors py-1">Términos y condiciones</a>
            <a href="#" className="hover:text-primary transition-colors py-1">Política de privacidad</a>
            <a href="#" className="hover:text-primary transition-colors py-1">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
