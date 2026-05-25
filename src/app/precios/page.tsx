import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui/button";
import { Hammer } from "lucide-react";
import { Navbar } from "@/shared/components/landing/Navbar";

export default function PlaceholderPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center mt-16">
        <div className="p-4 bg-primary/10 text-primary rounded-2xl mb-6">
          <Hammer className="size-12" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
          Estamos trabajando en esta sección...
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
          Muy pronto publicaremos nuestros planes y precios.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
