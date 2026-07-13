import type { InsulinRecordResponse } from "@/types/insulin-dm1";
import { filterByDateRange } from "./filter-by-date-range";

export interface RegistroViewData {
  registrosFiltrados: InsulinRecordResponse[];
  totalCount: number;
  hayRegistros: boolean;
}

export interface RegistroInput {
  registros: InsulinRecordResponse[];
  desde: string;
  hasta: string;
}

/**
 * View data de "Registro Diario": aplica el filtro de fechas y expone las
 * banderas que la Screen necesita. Puro; el fetch vive en el hook.
 */
export function buildRegistroViewData(input: RegistroInput): RegistroViewData {
  const registrosFiltrados = filterByDateRange(
    input.registros,
    input.desde,
    input.hasta,
  );
  return {
    registrosFiltrados,
    totalCount: registrosFiltrados.length,
    hayRegistros: registrosFiltrados.length > 0,
  };
}
