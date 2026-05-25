import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-8 p-8 bg-card rounded-2xl shadow-xl border border-border/50">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
          <Wrench className="size-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-foreground">
          Estamos trabajando en esto
        </h1>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Seguimos preparando lo mejor para ti. La función de recuperación de contraseña estará disponible muy pronto.
        </p>

        <div className="pt-6">
          <Link href="/login" passHref>
            <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto px-8">
              <ArrowLeft className="mr-2 size-4" /> Volver al inicio de sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
