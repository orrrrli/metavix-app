import { Hero } from "@/shared/components/landing/Hero";
import { Features } from "@/shared/components/landing/Features";
import { HowItWorks } from "@/shared/components/landing/HowItWorks";
import { Navbar } from "@/shared/components/landing/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
      </main>

      <footer className="bg-white border-t border-border/50 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Metavix. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors py-1">Términos y condiciones</a>
            <a href="#" className="hover:text-primary transition-colors py-1">Política de privacidad</a>
            <a href="#" className="hover:text-primary transition-colors py-1">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
