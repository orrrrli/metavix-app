import { format } from "date-fns";
import { es } from "date-fns/locale";
import { parseApiDate } from "@/features/patient/utils/parse-api-date";

export type DateOrPlaceholder =
  | { type: "date"; value: string }
  | { type: "placeholder"; value: string };

const PLACEHOLDER = "No registrada";

/**
 * Formatea una fecha de la API ("dd/MM/yyyy" | ISO) a "d de MMMM, yyyy", o
 * devuelve un placeholder si falta o no parsea. Puro: la Screen decide cómo
 * renderizar cada variante (texto normal vs `Muted`).
 */
export function formatDateOrPlaceholder(
  value: string | null | undefined,
  placeholder: string = PLACEHOLDER,
): DateOrPlaceholder {
  const d = parseApiDate(value ?? null);
  if (!d) return { type: "placeholder", value: placeholder };
  return { type: "date", value: format(d, "d 'de' MMMM, yyyy", { locale: es }) };
}
