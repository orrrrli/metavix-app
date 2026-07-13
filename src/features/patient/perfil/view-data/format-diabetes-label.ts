const DIABETES_LABELS: Record<string, string> = {
  None: "Sin diabetes",
  Type1: "Diabetes tipo 1",
  Type2: "Diabetes tipo 2",
  Prediabetes: "Prediabetes",
};

/**
 * Etiqueta legible del tipo de diabetes. Si el backend emite un valor que el
 * catálogo no conoce, devuelve el `type` crudo (nunca cadena vacía).
 */
export function formatDiabetesLabel(type: string): string {
  return DIABETES_LABELS[type] ?? type;
}
