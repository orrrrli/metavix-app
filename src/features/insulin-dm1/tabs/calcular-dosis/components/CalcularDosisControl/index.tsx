"use client";

import { useCalcularDosis } from "../../hooks/use-calcular-dosis";
import { CalcularDosisScreen } from "../CalcularDosisScreen";

/** Wrapper de "Calcular Dosis": cablea el domain hook a la Screen pura. */
export function CalcularDosisControl({ patientId }: { patientId: string }) {
  const { fields, setField, resultado, calcular } = useCalcularDosis(patientId);
  return (
    <CalcularDosisScreen
      fields={fields}
      setField={setField}
      resultado={resultado}
      onCalcular={calcular}
    />
  );
}
