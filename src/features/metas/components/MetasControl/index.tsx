"use client";

import { toast } from "sonner";
import { useMetas } from "../../hooks/use-metas";
import { MetasScreen } from "../MetasScreen";
import { metasStrings } from "../../strings/es";

export function MetasControl() {
  const { viewData, isLoading, evaluate, isEvaluating } = useMetas();

  const handleEvaluar = async () => {
    try {
      await evaluate();
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
    />
  );
}
