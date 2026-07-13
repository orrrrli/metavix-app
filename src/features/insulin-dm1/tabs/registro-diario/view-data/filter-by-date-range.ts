import { parse, isBefore, isAfter, parseISO } from "date-fns";
import type { InsulinRecordResponse } from "@/types/insulin-dm1";

/**
 * Filtra registros de insulina por rango de fechas [desde, hasta] inclusivo.
 * `desde`/`hasta` llegan como "yyyy-MM-dd" (input type="date"); los registros
 * traen `recordDate` como "dd/MM/yyyy". Sin filtros devuelve todo tal cual.
 * Puro y testeable — extraído del `useMemo` inline de RegistroDiario.
 */
export function filterByDateRange(
  registros: InsulinRecordResponse[],
  desde: string,
  hasta: string,
): InsulinRecordResponse[] {
  if (!desde && !hasta) return registros;
  return registros.filter((r) => {
    const fecha = parse(r.recordDate, "dd/MM/yyyy", new Date());
    if (desde && isBefore(fecha, parseISO(desde))) return false;
    if (hasta && isAfter(fecha, parseISO(hasta + "T23:59:59"))) return false;
    return true;
  });
}
