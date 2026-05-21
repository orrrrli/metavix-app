interface BarraProgresoProps {
  preguntaActual: number;
  totalPreguntas: number;
}

export function BarraProgreso({ preguntaActual, totalPreguntas }: BarraProgresoProps) {
  const percent = ((preguntaActual + 1) / totalPreguntas) * 100;

  return (
    <div className="w-full space-y-2 mb-8">
      <div className="flex justify-between text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <span>Cuestionario FINDRISC</span>
        <span>Pregunta {preguntaActual + 1} de {totalPreguntas}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
