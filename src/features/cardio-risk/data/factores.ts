export interface FactorRiesgo {
  id: string;
  label: string;
  puntos: number;
}

export const FACTORES_RIESGO: FactorRiesgo[] = [
  { id: "diabetes", label: "Tengo diabetes", puntos: 3 },
  { id: "tabaquismo", label: "Fumo actualmente", puntos: 4 },
  { id: "hipertension", label: "Tengo hipertensión", puntos: 2 },
  { id: "obesidad", label: "Tengo sobrepeso u obesidad", puntos: 2 },
  { id: "familiar", label: "Familiar con infarto antes de 60 años", puntos: 3 },
  { id: "sedentarismo", label: "Soy sedentario (poco ejercicio)", puntos: 2 },
  { id: "colesterol_alto", label: "Colesterol alto (LDL > 130)", puntos: 2 },
  { id: "estres", label: "Estrés crónico o frecuente", puntos: 1 }
];

export const TEXTOS_CLINICOS: Record<string, string> = {
  "edad_sexo_h": "Hombre mayor de 45 años: factor de riesgo independiente para enfermedad cardiovascular.",
  "edad_sexo_m": "Mujer mayor de 55 años o posmenopausia: el riesgo cardiovascular aumenta significativamente.",
  "pas_140": "Presión sistólica mayor o igual a 140 mmHg: hipertensión arterial, factor de riesgo mayor. Requiere manejo médico.",
  "pas_130": "Presión sistólica entre 130 y 139 mmHg: presión elevada. Monitoreo y cambios en estilo de vida recomendados.",
  "ldl_160": "LDL mayor o igual a 160 mg/dL: colesterol muy alto. Mayor riesgo de formación de placas en arterias.",
  "ldl_130": "LDL entre 130 y 159 mg/dL: colesterol moderadamente elevado. Se recomienda dieta y posiblemente medicación.",
  "diabetes": "Diabetes mellitus: duplica o triplica el riesgo cardiovascular. Control estricto de glucosa es esencial.",
  "tabaquismo": "Tabaquismo activo: uno de los factores de riesgo más poderosos. Dejar de fumar reduce el riesgo en 50% en 1 año.",
  "hipertension": "Hipertensión arterial: daña silenciosamente las arterias. Control de presión reduce infartos y eventos vasculares.",
  "obesidad": "Sobrepeso u obesidad: aumenta presión arterial, colesterol y riesgo de diabetes. Perder 5 a 10% del peso tiene impacto importante.",
  "familiar": "Historia familiar de infarto temprano: componente genético importante. Requiere vigilancia más estrecha.",
  "sedentarismo": "Sedentarismo: 150 minutos de ejercicio moderado por semana reduce riesgo cardiovascular en 35%.",
  "colesterol_alto": "Colesterol LDL alto: principal factor en formación de ateromas (placas en arterias).",
  "estres": "Estrés crónico: eleva cortisol, presión arterial y promueve inflamación vascular.",
  "ninguno": "No se identificaron factores de riesgo importantes en los datos proporcionados. Continúe con sus hábitos saludables."
};

export function obtenerNivelRiesgo(puntaje: number) {
  if (puntaje <= 3) return { nivel: "Riesgo bajo", color: "text-emerald-700 bg-emerald-100 border-emerald-300" };
  if (puntaje <= 7) return { nivel: "Riesgo moderado", color: "text-amber-700 bg-amber-100 border-amber-300" };
  if (puntaje <= 12) return { nivel: "Riesgo alto", color: "text-orange-700 bg-orange-100 border-orange-300" };
  return { nivel: "Riesgo muy alto", color: "text-red-800 bg-red-200 border-red-400" };
}
