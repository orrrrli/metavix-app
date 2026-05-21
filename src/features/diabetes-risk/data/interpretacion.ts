export interface InterpretacionRiesgo {
  nivel: string;
  probabilidad: string;
  color: string;
  recomendacion: string;
}

export function calcularNivelRiesgo(puntajeTotal: number): InterpretacionRiesgo {
  if (puntajeTotal <= 7) {
    return {
      nivel: "Bajo",
      probabilidad: "1 de cada 100",
      color: "text-emerald-700 bg-emerald-100",
      recomendacion: "Tu riesgo es bajo. Mantén tus hábitos saludables y realiza chequeos anuales."
    };
  }
  if (puntajeTotal <= 11) {
    return {
      nivel: "Moderado",
      probabilidad: "1 de cada 25",
      color: "text-amber-700 bg-amber-100",
      recomendacion: "Tu riesgo es moderado. Se recomienda medir tu glucosa en ayuno al menos una vez al año."
    };
  }
  if (puntajeTotal <= 14) {
    return {
      nivel: "Alto",
      probabilidad: "1 de cada 6",
      color: "text-orange-700 bg-orange-100",
      recomendacion: "Tu riesgo es alto. Consulta con tu médico para realizarte una glucosa en ayuno y HbA1c."
    };
  }
  
  return {
    nivel: "Muy alto",
    probabilidad: "1 de cada 3",
    color: "text-red-800 bg-red-200",
    recomendacion: "Tu riesgo es muy alto. Es importante que consultes con tu médico a la brevedad para una evaluación completa."
  };
}
