import { Calendar, Clock, Sparkles } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-2xl mx-auto text-center px-4">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/50 blur opacity-30"></div>
        <div className="relative bg-card p-6 rounded-full border border-border shadow-sm">
          <Calendar className="size-16 text-primary" />
          <div className="absolute -bottom-2 -right-2 bg-background p-2 rounded-full border border-border">
            <Clock className="size-6 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
          <Sparkles className="size-3.5 mr-1.5" />
          Próximamente
        </div>
        <h2 className="text-3xl font-display font-bold text-foreground">Agenda tu cita en línea</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Estamos trabajando para brindarte una experiencia más fácil y rápida al agendar tus próximas consultas.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 w-full mt-8 shadow-sm text-left sm:text-center">
        <h3 className="font-semibold text-foreground mb-2">Mientras tanto...</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Puedes agendar o modificar tus citas enviándonos un mensaje directo.
        </p>
        <a 
          href="https://wa.me/523121355297" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto mx-auto"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
