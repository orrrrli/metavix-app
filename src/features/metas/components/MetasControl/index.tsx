"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMetas } from "../../hooks/use-metas";
import { MetasScreen } from "../MetasScreen";
import { metasStrings } from "../../strings/es";

export function MetasControl() {
  const { viewData, isLoading, evaluate, isEvaluating } = useMetas();

  // Visibilidad del bloque de resumen: estado de UI local, no dato. Se activa
  // tras la primera evaluación (comportamiento original). `viewData.hasEvalResult`
  // da la misma info, pero lo mantenemos explícito para no cambiar el flujo.
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const handleEvaluar = async () => {
    try {
      await evaluate();
      setMostrarResumen(true);
      setTimeout(() => {
        document
          .getElementById("resumen-metas")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      toast.error(metasStrings.evaluateError);
    }
  };

  return (
    <MetasScreen
      viewData={viewData}
      onEvaluate={handleEvaluar}
      isEvaluating={isEvaluating}
      isLoading={isLoading}
      showResumen={mostrarResumen}
    />
  );
}
