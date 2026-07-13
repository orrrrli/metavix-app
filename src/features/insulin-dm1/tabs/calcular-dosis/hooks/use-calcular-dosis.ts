"use client";

import { useState } from "react";
import { useInsulinProfile } from "@/features/patient/hooks/use-insulin-dm1";
import {
  calcularDosis,
  type DosisResultado,
} from "../view-data/calcular-dosis";

export interface CalcularDosisFields {
  hc: string;
  glucosa: string;
  meta: string;
  ric: string;
  fs: string;
}

const EMPTY: CalcularDosisFields = { hc: "", glucosa: "", meta: "", ric: "", fs: "" };

/**
 * Domain hook de "Calcular Dosis": carga el perfil de insulina, mantiene el
 * estado del formulario y delega el cálculo a `calcularDosis` (view-data). La
 * meta/RIC/FS se pre-pueblan desde el perfil con el patrón de ajuste en render
 * (no useEffect), igual que el componente original.
 */
export function useCalcularDosis(patientId: string) {
  const { data: perfil } = useInsulinProfile(patientId);

  const [fields, setFields] = useState<CalcularDosisFields>(EMPTY);
  const [resultado, setResultado] = useState<DosisResultado | null>(null);

  // Pre-poblar meta/RIC/FS al llegar/cambiar el perfil (render-time state sync).
  const [perfilAnterior, setPerfilAnterior] = useState(perfil);
  if (perfil && perfil !== perfilAnterior) {
    setPerfilAnterior(perfil);
    setFields((f) => ({
      ...f,
      meta: perfil.targetGlucose?.toString() ?? "",
      ric: perfil.ric?.toString() ?? "",
      fs: perfil.sensitivityFactor?.toString() ?? "",
    }));
  }

  const setField = (name: keyof CalcularDosisFields, value: string) =>
    setFields((f) => ({ ...f, [name]: value }));

  const calcular = () => {
    setResultado(
      calcularDosis({
        hc: Number(fields.hc),
        glucosa: Number(fields.glucosa),
        meta: Number(fields.meta),
        ric: Number(fields.ric),
        fs: Number(fields.fs),
      }),
    );
  };

  return { fields, setField, resultado, calcular };
}
