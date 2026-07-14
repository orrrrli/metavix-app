export type GenderLabel =
  | { label: "Femenino"; known: true }
  | { label: "Masculino"; known: true }
  | { label: "No especificado"; known: false };

/**
 * Traduce el género crudo de la API ("Female"/"Male"/null) a su etiqueta en
 * español. `known: false` señala a la Screen que use el estilo atenuado
 * (`Muted`) en lugar del texto normal.
 */
export function formatGenderLabel(gender: string | null | undefined): GenderLabel {
  if (gender === "Female") return { label: "Femenino", known: true };
  if (gender === "Male") return { label: "Masculino", known: true };
  return { label: "No especificado", known: false };
}
