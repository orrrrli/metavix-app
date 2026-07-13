"use client";

import { Loader2, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ParametroMeta } from "./ParametroMeta";
import { ResumenControl } from "./ResumenControl";
import { GoalEvaluationCard } from "./GoalEvaluationCard";
import { ClinicalNote } from "./ClinicalNote";
import { CkdStageExplainer } from "./CkdStageExplainer";
import { NoDataReasonsTable } from "./NoDataReasonsTable";
import { metasStrings } from "../strings/es";
import type { MetasViewData } from "../view-data/build-metas-view-data";

export interface MetasScreenProps {
  viewData: MetasViewData;
  onEvaluate: () => void;
  isEvaluating: boolean;
  isLoading: boolean;
  /** Visibilidad del bloque de resumen (estado de UI, no dato). Ver MetasControl. */
  showResumen: boolean;
}

/**
 * UI pura de la pantalla "Mis metas". Recibe un `MetasViewData` ya resuelto —
 * sin queries, sin sort, sin derivaciones. Toda esa lógica vive en
 * `view-data/` y `hooks/use-metas.ts`.
 */
export function MetasScreen({
  viewData,
  onEvaluate,
  isEvaluating,
  isLoading,
  showResumen,
}: MetasScreenProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20"
        style={{ color: "var(--mut)" }}
      >
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{metasStrings.loadingMessage}</p>
      </div>
    );
  }

  const { banners, resultados, hasEvalResult, evalResult, views, ckdStage } =
    viewData;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      {banners.showPregnancyMode && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 p-4 rounded-lg border-2"
          style={{ background: "var(--info-bg)", borderColor: "var(--info)" }}
        >
          <div
            className="flex items-center justify-center size-9 rounded-full shrink-0"
            style={{ background: "var(--info)" }}
          >
            <Info className="size-5" style={{ color: "#fff" }} aria-hidden="true" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
              {metasStrings.pregnancyMode.title}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text)" }}>
              {metasStrings.pregnancyMode.body}
            </p>
          </div>
        </div>
      )}

      {banners.pregnancyDeactivated && (
        <div className="mb-6">
          <ClinicalNote message={metasStrings.pregnancyDeactivatedNote} />
        </div>
      )}

      {banners.dueDateReached && (
        <div className="mb-6">
          <ClinicalNote message={metasStrings.dueDateReachedNote} />
        </div>
      )}

      <p className="text-lg mb-8" style={{ color: "var(--mut)" }}>
        {metasStrings.preEvaluationBanner}
      </p>

      <div className="space-y-4">
        {resultados.map(({ param, valor, evaluacion }) => (
          <ParametroMeta
            key={param.id}
            param={param}
            valor={valor}
            colorActual={evaluacion.color}
            isCustomGoal={evaluacion.isCustomGoal}
            readOnly
            evaluado={hasEvalResult}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          onClick={onEvaluate}
          disabled={isEvaluating}
          className="w-full sm:w-auto h-14 px-10 text-lg shadow-md"
        >
          {isEvaluating && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
          {metasStrings.evaluateButton}
        </Button>
      </div>

      {showResumen && <ResumenControl resultados={resultados} />}

      {hasEvalResult && evalResult && <NoDataReasonsTable items={evalResult.items} />}

      {hasEvalResult && evalResult && (
        <div className="mt-8 space-y-6">
          <GoalEvaluationCard items={views} evaluatedAt={evalResult.evaluatedAt} />
          {ckdStage && (
            <CkdStageExplainer
              currentStage={ckdStage.stage}
              egfrValue={ckdStage.value}
            />
          )}
        </div>
      )}

      <div
        className="mt-12 pt-6 border-t text-center text-sm"
        style={{ borderColor: "var(--bd)", color: "var(--mut)" }}
      >
        <p>{metasStrings.adaDisclaimer}</p>
      </div>
    </div>
  );
}
