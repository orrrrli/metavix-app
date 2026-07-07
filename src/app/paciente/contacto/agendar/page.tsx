import { Calendar, Clock, Sparkles } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-2xl mx-auto text-center px-4">
      <div className="relative">
        <div
          className="absolute -inset-1 rounded-full blur opacity-30"
          style={{ background: 'linear-gradient(to right, var(--accent), rgba(0,201,167,0.5))' }}
        />
        <div
          className="relative p-6 rounded-full shadow-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--card-bd)' }}
        >
          <Calendar className="size-16" style={{ color: 'var(--accent)' }} />
          <div
            className="absolute -bottom-2 -right-2 p-2 rounded-full"
            style={{ background: 'var(--sidebar)', border: '1px solid var(--card-bd)' }}
          >
            <Clock className="size-6" style={{ color: 'var(--mut)' }} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: 'var(--nav-active-bg)', color: 'var(--nav-active)', border: '1px solid transparent' }}
        >
          <Sparkles className="size-3.5 mr-1.5" />
          Próximamente
        </div>
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>
          Agenda tu cita en línea
        </h2>
        <p className="text-lg max-w-md mx-auto" style={{ color: 'var(--mut)' }}>
          Estamos trabajando para brindarte una experiencia más fácil y rápida al agendar tus próximas consultas.
        </p>
      </div>

      <div
        className="rounded-xl p-6 w-full mt-8 shadow-sm text-left sm:text-center"
        style={{ background: 'var(--card)', border: '1px solid var(--card-bd)' }}
      >
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Mientras tanto...</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--mut)' }}>
          Puedes agendar o modificar tus citas enviándonos un mensaje directo.
        </p>
        <a
          href="https://wa.me/523121355297"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold h-10 px-4 py-2 w-full sm:w-auto mx-auto transition-colors"
          style={{ background: 'var(--accent)', color: '#03251d', fontFamily: "'Sora', sans-serif" }}
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
