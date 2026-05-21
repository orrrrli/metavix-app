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

export const PARAMETROS_META: DefParametro[] = [
  {
    id: "hba1c",
    nombre: "HbA1c",
    metaMostrada: "< 7.0%",
    fuente: "ADA 2026",
    explicacion: "El principal indicador de control en diabetes. Una HbA1c menor a 7% se asocia con menor riesgo de complicaciones. La meta puede individualizarse según edad y condiciones.",
    step: "0.1",
    min: 4,
    max: 20,
    unidad: "%"
  },
  {
    id: "glucosa",
    nombre: "Glucosa en ayuno",
    metaMostrada: "80–130 mg/dL",
    fuente: "Meta preprandial",
    explicacion: "La glucosa en ayuno ideal para diabéticos es entre 80 y 130 mg/dL. Por encima de 130 sugiere ajuste de tratamiento.",
    step: "1",
    min: 50,
    max: 500,
    unidad: "mg/dL"
  },
  {
    id: "pas",
    nombre: "Presión arterial sistólica",
    metaMostrada: "< 130 mmHg",
    fuente: "Meta en diabetes",
    explicacion: "En personas con diabetes, mantener la presión menor a 130/80 mmHg reduce el riesgo de infarto, accidente vascular y nefropatía.",
    step: "1",
    min: 80,
    max: 220,
    unidad: "mmHg"
  },
  {
    id: "ldl",
    nombre: "Colesterol LDL",
    metaMostrada: "< 100 mg/dL",
    fuente: "Meta en diabetes",
    explicacion: "El LDL menor a 100 mg/dL es la meta para diabéticos. Si tiene enfermedad cardiovascular, la meta es menor a 70 mg/dL. La mayoría de diabéticos requiere estatinas.",
    step: "1",
    min: 30,
    max: 400,
    unidad: "mg/dL"
  },
  {
    id: "imc",
    nombre: "IMC",
    metaMostrada: "18.5–24.9",
    fuente: "Rango saludable",
    explicacion: "Calcule su IMC en la herramienta dedicada. Un peso saludable mejora el control glucémico y reduce la dosis de medicamentos necesaria.",
    step: "0.1",
    min: 14,
    max: 60,
    unidad: "kg/m²"
  }
];

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
      
    case "glucosa":
      if (val >= 80 && val <= 130) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 131 && val <= 160) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };
      
    case "pas":
      if (val < 130) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 130 && val <= 139) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };
      
    case "ldl":
      if (val < 100) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 100 && val <= 129) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };
      
    case "imc":
      if (val >= 18.5 && val <= 24.9) return { estado: "en_meta", color: "bg-emerald-500" };
      if (val >= 25.0 && val <= 29.9) return { estado: "cuidado", color: "bg-amber-500" };
      return { estado: "fuera_meta", color: "bg-red-500" };
      
    default:
      return { estado: "sin_dato", color: "bg-muted-foreground/30" };
  }
}
