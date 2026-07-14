"use client";

import { useMemo } from "react";
import { useDailyRecords } from "./use-daily-records";
import { usePatientProfile } from "./use-patient-profile";
import {
  buildGlucosaResumenViewData,
  type GlucosaResumenData,
  type RangoVentana,
  type EstadoClinico,
  type PuntoSerie,
} from "../view-data/build-glucosa-resumen-view-data";

// Re-exportados para no romper a los consumidores que importaban estos tipos
// desde el hook (SubSaludoPaciente, page.tsx). La lógica vive en view-data/.
export type { RangoVentana, EstadoClinico, PuntoSerie };

/** Datos del resumen + banderas de carga/error propias del fetch. */
export interface GlucosaResumen extends GlucosaResumenData {
  /** Cargando datos */
  loading: boolean;
  /** Error de fetch (issue #7): distinto de "sin registros". */
  error: boolean;
}

/**
 * Orquesta las queries del resumen de glucosa y delega toda la transformación
 * a `buildGlucosaResumenViewData`. Delgado por diseño: sin cálculos inline
 * (ver view-data/). `loading` y `error` sí se resuelven aquí porque son estado
 * del fetch, no del dato.
 */
export function useGlucosaResumen(
  patientId: string | null,
  rango: RangoVentana = "7d",
): GlucosaResumen {
  const { data: profile } = usePatientProfile(patientId ?? "");
  const { data: records, isLoading, error: queryError } = useDailyRecords(patientId ?? "");
  const hasQueryError = !!queryError;

  return useMemo<GlucosaResumen>(() => {
    const data = buildGlucosaResumenViewData({
      dailyRecords: hasQueryError ? [] : records ?? [],
      profile: profile ?? null,
      rango,
    });
    return { ...data, loading: isLoading, error: hasQueryError };
  }, [records, profile, isLoading, hasQueryError, rango]);
}
