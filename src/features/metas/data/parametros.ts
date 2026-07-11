export type EstadoMeta = "en_meta" | "cuidado" | "fuera_meta" | "sin_dato";

export interface EvaluacionMeta {
  estado: EstadoMeta;
  color: string;
}

export interface DefParametro {
  id: string;
  nombre: string;
  metaMostrada: string;
  fuente: string;
  explicacion: string;
  step: string;
  min: number;
  max: number;
  unidad: string;
}

/**
 * Catálogo de parámetros clínicos para la pantalla de Metas.
 *
 * Los `id` deben coincidir EXACTAMENTE con los `parameterId` que emite el backend
 * en el endpoint POST /api/v1/patient/{id}/goal-evaluations. La fuente canónica
 * backend es `AdaGoalConstants.EvaluatedParameterIds` en
 * metavix-api/src/Application/Common/Constants/AdaGoalConstants.cs.
 *
 * Mantener sincronizado: agregar/renombrar un parámetro en el catálogo del
 * backend sin reflejarlo aquí provoca que el chip caiga al fallback de
 * `goal-eval-to-view.ts` y muestre el id crudo en inglés.
 *
 * Los `nombre` están en español (idioma de la UI); el `id` está en inglés
 * (idioma del código y del contrato API) — convención del proyecto.
 */
export const PARAMETROS_META: DefParametro[] = [
  {
    id: "hba1c",
    nombre: "HbA1c",
    metaMostrada: "< 7.0%",
    fuente: "ADA 2026 — diabetes",
    explicacion: "El principal indicador de control en diabetes. Una HbA1c menor a 7% se asocia con menor riesgo de complicaciones. La meta puede individualizarse según edad y condiciones.",
    step: "0.1",
    min: 4,
    max: 20,
    unidad: "%",
  },
  {
    id: "fasting_glucose",
    nombre: "Glucosa en ayuno",
    metaMostrada: "80–130 mg/dL",
    fuente: "ADA 2026 — preprandial",
    explicacion: "La glucosa en ayuno ideal para diabéticos es entre 80 y 130 mg/dL. Por encima de 130 sugiere ajuste de tratamiento.",
    step: "1",
    min: 50,
    max: 500,
    unidad: "mg/dL",
  },
  {
    id: "postprandial_1h",
    nombre: "Glucosa postprandial (1 h)",
    metaMostrada: "< 180 mg/dL",
    fuente: "ADA 2026 — postprandial",
    explicacion: "Medición de glucosa una hora después de comer. Meta en diabéticos: menor a 180 mg/dL.",
    step: "1",
    min: 50,
    max: 500,
    unidad: "mg/dL",
  },
  {
    id: "postprandial_2h",
    nombre: "Glucosa postprandial (2 h)",
    metaMostrada: "< 180 mg/dL",
    fuente: "ADA 2026 — postprandial",
    explicacion: "Medición de glucosa dos horas después de comer. Meta en diabéticos: menor a 180 mg/dL.",
    step: "1",
    min: 50,
    max: 500,
    unidad: "mg/dL",
  },
  {
    id: "systolic_bp",
    nombre: "Presión arterial sistólica",
    metaMostrada: "< 130 mmHg",
    fuente: "ADA 2026 — diabetes",
    explicacion: "En personas con diabetes, mantener la presión sistólica menor a 130 mmHg reduce el riesgo de infarto, accidente vascular y nefropatía.",
    step: "1",
    min: 80,
    max: 220,
    unidad: "mmHg",
  },
  {
    id: "diastolic_bp",
    nombre: "Presión arterial diastólica",
    metaMostrada: "< 80 mmHg",
    fuente: "ADA 2026 — diabetes",
    explicacion: "En personas con diabetes, mantener la presión diastólica menor a 80 mmHg reduce el riesgo cardiovascular y renal.",
    step: "1",
    min: 40,
    max: 130,
    unidad: "mmHg",
  },
  {
    id: "heart_rate",
    nombre: "Frecuencia cardíaca",
    metaMostrada: "60–100 lat/min",
    fuente: "Rango normal",
    explicacion: "Frecuencia cardíaca en reposo. Valores fuera de 60–100 lat/min requieren evaluación clínica.",
    step: "1",
    min: 30,
    max: 220,
    unidad: "lat/min",
  },
  {
    id: "bmi",
    nombre: "Índice de Masa Corporal (IMC)",
    metaMostrada: "18.5–24.9",
    fuente: "Rango saludable",
    explicacion: "El IMC se calcula con peso y estatura. Un peso saludable mejora el control glucémico y reduce la dosis de medicamentos necesaria.",
    step: "0.1",
    min: 14,
    max: 60,
    unidad: "kg/m²",
  },
  {
    id: "ldl_primary",
    nombre: "Colesterol LDL",
    metaMostrada: "< 100 mg/dL",
    fuente: "ADA 2026 — diabetes",
    explicacion: "El LDL menor a 100 mg/dL es la meta para diabéticos sin enfermedad cardiovascular. Si tiene enfermedad cardiovascular, la meta es menor a 70 mg/dL. La mayoría de diabéticos requiere estatinas.",
    step: "1",
    min: 30,
    max: 400,
    unidad: "mg/dL",
  },
  {
    id: "hdl",
    nombre: "Colesterol HDL",
    metaMostrada: "> 40 mg/dL (hombres) / > 50 mg/dL (mujeres)",
    fuente: "Rango deseable",
    explicacion: "El colesterol HDL es el 'colesterol bueno'. Valores bajos se asocian a mayor riesgo cardiovascular.",
    step: "1",
    min: 10,
    max: 150,
    unidad: "mg/dL",
  },
  {
    id: "total_cholesterol",
    nombre: "Colesterol total",
    metaMostrada: "< 200 mg/dL",
    fuente: "Rango deseable",
    explicacion: "Suma de LDL, HDL y otros componentes. Por debajo de 200 mg/dL se considera deseable.",
    step: "1",
    min: 50,
    max: 500,
    unidad: "mg/dL",
  },
  {
    id: "triglycerides",
    nombre: "Triglicéridos",
    metaMostrada: "< 150 mg/dL",
    fuente: "Rango deseable",
    explicacion: "Los triglicéridos elevados se asocian a riesgo cardiovascular y pancreatitis. Muy altos (≥ 500 mg/dL) requieren atención urgente.",
    step: "1",
    min: 30,
    max: 1500,
    unidad: "mg/dL",
  },
  {
    id: "creatinine",
    nombre: "Creatinina sérica",
    metaMostrada: "0.7–1.3 mg/dL (hombres) / 0.5–1.2 mg/dL (mujeres)",
    fuente: "Rango de referencia",
    explicacion: "Marcador de función renal. Valores elevados sugieren deterioro del riñón.",
    step: "0.1",
    min: 0.1,
    max: 15,
    unidad: "mg/dL",
  },
  {
    id: "egfr",
    nombre: "Tasa de filtración glomerular estimada (eGFR)",
    metaMostrada: "≥ 60 ml/min/1.73m²",
    fuente: "Función renal",
    explicacion: "Estima la capacidad del riñón para filtrar sangre. Por debajo de 60 indica función renal reducida; por debajo de 30 requiere atención especializada.",
    step: "1",
    min: 0,
    max: 200,
    unidad: "ml/min/1.73m²",
  },
  {
    id: "bun",
    nombre: "Nitrógeno ureico en sangre (BUN)",
    metaMostrada: "7–21 mg/dL",
    fuente: "Rango de referencia",
    explicacion: "Marcador de función renal y metabolismo proteico. Valores fuera de rango pueden indicar problemas renales o de hidratación.",
    step: "1",
    min: 1,
    max: 200,
    unidad: "mg/dL",
  },
  {
    id: "waist_circumference",
    nombre: "Perímetro de cintura",
    metaMostrada: "< 94 cm (hombres) / < 80 cm (mujeres)",
    fuente: "Riesgo cardiometabólico",
    explicacion: "El perímetro de cintura elevado se asocia a mayor riesgo de diabetes y enfermedad cardiovascular.",
    step: "0.5",
    min: 40,
    max: 250,
    unidad: "cm",
  },
];

/**
 * @deprecated Esta función es legacy. La evaluación real ahora viene del
 * backend vía POST /api/v1/patient/{id}/goal-evaluations. Se conserva
 * solamente como referencia para los 5 parámetros que ya tenía
 * pre-poblados; para los nuevos ids retorna `sin_dato` (default).
 *
 * El caller activo (`MetasControl`) ya no usa esta función para evaluar:
 * consume el resultado de la API y mapea `GoalStatus` → `EvaluacionMeta`
 * directamente. Mantener aquí para no romper imports legacy y para
 * preservar los thresholds documentados.
 */
export function evaluarParametro(id: string, valorStr: string): EvaluacionMeta {
  if (!valorStr || valorStr.trim() === "") {
    return { estado: "sin_dato", color: "bg-muted-foreground/30" };
  }

  const val = Number(valorStr);

  switch (id) {
    case "hba1c":
      if (val < 7.0) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 7.0 && val <= 7.9) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };

    case "fasting_glucose":
      if (val >= 80 && val <= 130) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 131 && val <= 160) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };

    case "systolic_bp":
      if (val < 130) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 130 && val <= 139) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };

    case "ldl_primary":
      if (val < 100) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 100 && val <= 129) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };

    case "bmi":
      if (val >= 18.5 && val <= 24.9) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 25.0 && val <= 29.9) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };

    default:
      return { estado: "sin_dato", color: "bg-muted-foreground/30" };
  }
}
