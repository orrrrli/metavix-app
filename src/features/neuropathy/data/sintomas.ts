export interface SintomaNeuropatia {
  id: string;
  titulo: string;
  descripcion: string;
  puntos: number;
}

export const SINTOMAS_NEUROPATIA: SintomaNeuropatia[] = [
  { id: "ardor", titulo: "Ardor o quemadura en pies o piernas", descripcion: "Sensación de calor intenso, especialmente de noche", puntos: 3 },
  { id: "dolor", titulo: "Dolor punzante o tipo descarga eléctrica", descripcion: "Dolores agudos y repentinos en pies o piernas", puntos: 3 },
  { id: "hormigueo", titulo: "Hormigueo o adormecimiento", descripcion: "Como si tuviera hormigas o la piel dormida", puntos: 2 },
  { id: "sensibilidad", titulo: "Pérdida de sensibilidad al tocar o temperatura", descripcion: "No siente bien cuando toca el piso o el agua", puntos: 2 },
  { id: "empeora_reposo", titulo: "Peor de noche o en reposo", descripcion: "Los síntomas empeoran cuando está acostado o quieto", puntos: 3 },
  { id: "equilibrio", titulo: "Dificultad para caminar o equilibrio inestable", descripcion: "Sensación de caminar sobre algodón o piso inestable", puntos: 2 },
  { id: "calambres", titulo: "Calambres frecuentes en piernas", descripcion: "Contracciones musculares involuntarias", puntos: 1 },
  { id: "mareos", titulo: "Problemas de visión o mareos al levantarse", descripcion: "Puede indicar neuropatía autonómica", puntos: 2 },
  { id: "digestion", titulo: "Náuseas, digestión lenta o estreñimiento frecuente", descripcion: "El sistema nervioso también controla el aparato digestivo", puntos: 1 }
];

export interface InterpretacionNeuropatia {
  nivel: string;
  titulo: string;
  subtitulo: string;
  aviso: string;
  colorNivel: string;
  colorAviso: string;
}

export function interpretarNeuropatia(puntajeTotal: number): InterpretacionNeuropatia {
  if (puntajeTotal === 0) {
    return {
      nivel: "Sin síntomas",
      titulo: "No identificamos síntomas significativos",
      subtitulo: "No marcó síntomas sugestivos de neuropatía en este momento. Continúe con revisiones periódicas de sus pies.",
      aviso: "Aunque no tenga síntomas, revísese los pies diariamente y acuda a sus consultas de seguimiento. La neuropatía puede estar presente sin síntomas en sus etapas iniciales.",
      colorNivel: "text-emerald-700 bg-emerald-100",
      colorAviso: "bg-emerald-50 border-emerald-500 text-emerald-800"
    };
  }
  
  if (puntajeTotal >= 1 && puntajeTotal <= 3) {
    return {
      nivel: "Leve",
      titulo: "Síntomas leves — Vale la pena mencionarlos",
      subtitulo: "Tiene algunos síntomas que podrían relacionarse con neuropatía incipiente. Se recomienda comentarlos en su próxima consulta.",
      aviso: "No entre en pánico, pero tampoco ignore estos síntomas. Mencionarlos a su médico en la próxima consulta permitirá una evaluación oportuna.",
      colorNivel: "text-amber-700 bg-amber-100",
      colorAviso: "bg-amber-50 border-amber-500 text-amber-800"
    };
  }
  
  if (puntajeTotal >= 4 && puntajeTotal <= 7) {
    return {
      nivel: "Moderado",
      titulo: "Síntomas moderados — Consulte a su médico",
      subtitulo: "Los síntomas que reporta son compatibles con neuropatía diabética periférica. Se recomienda valoración médica próxima.",
      aviso: "Es importante que consulte a su médico en las próximas semanas. Existen tratamientos que pueden aliviar los síntomas y prevenir que progrese el daño.",
      colorNivel: "text-orange-700 bg-orange-100",
      colorAviso: "bg-red-50 border-red-500 text-red-800" // Fondo rojo claro según spec
    };
  }
  
  // >= 8
  return {
    nivel: "Significativo",
    titulo: "Síntomas significativos — Consulta urgente recomendada",
    subtitulo: "Presenta múltiples síntomas sugestivos de neuropatía. Requiere valoración médica a la brevedad.",
    aviso: "Los síntomas que describe son sugestivos de neuropatía moderada a severa. Consulte a su médico lo antes posible. El tratamiento oportuno puede prevenir complicaciones graves como úlceras o amputaciones.",
    colorNivel: "text-red-800 bg-red-200",
    colorAviso: "bg-red-100 border-red-600 text-red-900" // Fondo rojo claro según spec
  };
}
