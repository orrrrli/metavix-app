import { parseISO, isValid } from "date-fns";

/**
 * La API serializa `DateOnly` como `"dd/MM/yyyy"` (ver
 * metavix-api `DateOnlyJsonConverter.Write`), pero algunos campos históricamente
 * llegan como `"yyyy-MM-dd"` y otros (createdAt) como ISO 8601 completo.
 *
 * `parseISO` de date-fns NO parsea `"dd/MM/yyyy"` (devuelve Invalid Date), lo que
 * hacía que `differenceInCalendarDays` devolviera `NaN` y el banner de embarazo
 * se mostrara sin importar la fecha real. Este helper acepta los formatos que
 * realmente envía la API y devuelve `null` cuando no puede resolver la fecha,
 * para que los callers puedan guardar contra NaN en vez de renderizar de más.
 */
export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  // 1) ISO 8601 (createdAt: "2026-07-10T..." o date-only "2026-07-10").
  const iso = parseISO(value);
  if (isValid(iso)) return iso;

  // 2) "dd/MM/yyyy" — el formato con el que la API serializa DateOnly.
  const [day, month, year] = value.split("/");
  if (day && month && year) {
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (isValid(d)) return d;
  }

  return null;
}