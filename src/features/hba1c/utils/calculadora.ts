export interface InterpretacionHba1c {
  categoria: string;
  color: string;
  mensaje: string;
}

export function convertirHba1cAGlucosa(hba1c: number): number {
  return Math.round((hba1c * 28.7) - 46.7);
}

export function convertirGlucosaAHba1c(glucosa: number): number {
  return Math.round(((glucosa + 46.7) / 28.7) * 10) / 10;
}

export function interpretarHba1c(hba1c: number): InterpretacionHba1c {
  if (hba1c < 5.7) {
    return {
      categoria: "Sin diabetes",
      color: "text-emerald-700 bg-emerald-100",
      mensaje: "Tus niveles están en rango normal."
    };
  }
  if (hba1c >= 5.7 && hba1c <= 6.4) {
    return {
      categoria: "Prediabetes",
      color: "text-amber-700 bg-amber-100",
      mensaje: "Tus niveles indican un mayor riesgo de desarrollar diabetes. Consulta a tu médico sobre prevención."
    };
  }
  if (hba1c >= 6.5 && hba1c < 7.0) {
    return {
      categoria: "Diagnóstico DM",
      color: "text-orange-700 bg-orange-100",
      mensaje: "Criterio diagnóstico de Diabetes. Si no tienes un diagnóstico, acude a tu médico pronto."
    };
  }
  if (hba1c === 7.0 || (hba1c >= 6.9 && hba1c <= 7.0)) {
    return {
      categoria: "Meta en DM",
      color: "text-emerald-700 bg-emerald-100",
      mensaje: "Tu HbA1c está dentro de la meta general recomendada por la ADA para pacientes con diabetes."
    };
  }
  if (hba1c >= 7.1 && hba1c <= 8.0) {
    return {
      categoria: "Por encima de meta",
      color: "text-orange-700 bg-orange-100",
      mensaje: "Tu HbA1c está por encima de la meta. Coméntalo con tu médico en tu próxima cita."
    };
  }
  if (hba1c >= 8.1 && hba1c <= 9.0) {
    return {
      categoria: "Control deficiente",
      color: "text-red-700 bg-red-100",
      mensaje: "Nivel de control glucémico deficiente. Es muy probable que necesites ajustes en tu tratamiento."
    };
  }
  if (hba1c >= 9.1 && hba1c <= 10.0) {
    return {
      categoria: "Control muy malo",
      color: "text-red-800 bg-red-200",
      mensaje: "Control glucémico muy malo. El riesgo de complicaciones está considerablemente elevado."
    };
  }
  
  return {
    categoria: "Control peligroso",
    color: "text-red-900 bg-red-300 font-bold",
    mensaje: "Este nivel requiere atención médica urgente."
  };
}
