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
/**
 * Parsea el formato `"dd/MM/yyyy"` con el que la API serializa `DateOnly` a un
 * `Date` local no-nullable. Para fechas de registros/labs que la API garantiza
 * válidas (a diferencia de `parseApiDate`, que acepta null/ISO y puede devolver
 * null). Fecha inválida → lanza, en vez de enmascarar el dato corrupto como
 * epoch (1969-12-31), que envenenaba silenciosamente gráficas, indicadores y
 * comparadores de sort.
 */
export function parseDailyDate(dateStr: string): Date {
  const parsed = parseApiDate(dateStr);
  if (!parsed) {
    throw new Error(`parseDailyDate: fecha inválida recibida de la API: "${dateStr}"`);
  }
  return parsed;
}

export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  // 1) ISO 8601 (createdAt: "2026-07-10T..." o date-only "2026-07-10").
  const iso = parseISO(value);
  if (isValid(iso)) return iso;

  // 2) "dd/MM/yyyy" — el formato con el que la API serializa DateOnly.
  const [day, month, year] = value.split("/").map(Number);
  if (day && month && year) {
    // new Date(y, m, d) desborda silenciosamente componentes fuera de rango
    // (mes 13 → enero del año siguiente) y sigue siendo un Date válido, así
    // que isValid() no lo detecta. Se valida explícitamente que el mes/día
    // pedido coincida con el resultado antes de aceptarlo.
    const d = new Date(year, month - 1, day);
    if (isValid(d) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) {
      return d;
    }
  }

  return null;
}