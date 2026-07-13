/**
 * Parsea una fecha de la API en formato "dd/MM/yyyy" a un `Date` local.
 * Extraído de `MetasControl` (era una función inline). Ver también el
 * homónimo en `features/patient/utils` — se mantienen separados por feature.
 */
export function parseApiDate(dateStr: string): Date {
  const [d, m, y] = dateStr.split("/").map(Number);
  return new Date(y, m - 1, d);
}
