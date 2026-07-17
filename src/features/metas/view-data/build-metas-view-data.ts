import type { DailyRecordResponse } from "@/types/daily-record";
import type { LabRecordResponse } from "@/types/lab-record";
import type { PatientProfileResponse } from "@/types/patient-profile";
import type { CkdStage, GoalEvaluationResponse } from "@/types/goal-evaluation";
import type { EvaluacionMeta } from "../data/parametros";
import { goalEvalToViews, type GoalEvaluationItemView } from "../utils/goal-eval-to-view";
import { buildPreEvaluationValues } from "./build-pre-evaluation-values";
import { buildEvaluacionesMap } from "./build-evaluaciones-map";
import {
  buildResumenResultados,
  buildValoresEvaluados,
  type ResultadoParametro,
} from "./build-resumen-resultados";
import {
  buildPregnancyBanners,
  type PregnancyBanners,
} from "./build-pregnancy-banners";

export interface MetasInput {
  labRecords: LabRecordResponse[];
  dailyRecords: DailyRecordResponse[];
  profile: PatientProfileResponse | null;
  evalResult: GoalEvaluationResponse | null;
  /** Inyectable en tests para determinismo de los banners de embarazo. */
  now?: Date;
}

export interface MetasViewData {
  valores: Record<string, string>;
  evaluaciones: Record<string, EvaluacionMeta>;
  resultados: ResultadoParametro[];
  /** Views pre-formateadas para GoalEvaluationCard. Vacío si no hay evaluación. */
  views: GoalEvaluationItemView[];
  banners: PregnancyBanners;
  /** eGFR con etapa CKD, para montar `CkdStageExplainer`. null si no aplica. */
  ckdStage: { value: number | null; stage: CkdStage } | null;
  /** La respuesta cruda de la evaluación, para NoDataReasonsTable + evaluatedAt. */
  evalResult: GoalEvaluationResponse | null;
  hasEvalResult: boolean;
}

/**
 * View data de la pantalla "Mis metas": objeto ya resuelto que `MetasScreen`
 * consume para renderizar. Recibe los datos ya cargados (el fetch es
 * responsabilidad de `useMetas`). Puro y testeable.
 */
export function buildMetasViewData(input: MetasInput): MetasViewData {
  const now = input.now ?? new Date();

  const { valores, previousCreatinine } = buildPreEvaluationValues({
    labRecords: input.labRecords,
    dailyRecords: input.dailyRecords,
    profile: input.profile,
  });

  const evaluaciones = buildEvaluacionesMap(input.evalResult);
  const valoresEvaluados = buildValoresEvaluados(input.evalResult);
  const resultados = buildResumenResultados({
    valores,
    valoresEvaluados,
    evaluaciones,
  });

  const isPregnant = Boolean(input.profile?.isPregnant);
  const views = input.evalResult
    ? goalEvalToViews(input.evalResult, isPregnant, previousCreatinine)
    : [];

  const egfrView = views.find((v) => v.parameterId === "egfr");
  const ckdStage = egfrView?.ckdStage
    ? { value: egfrView.value, stage: egfrView.ckdStage }
    : null;

  const banners = buildPregnancyBanners(input.profile, now);

  return {
    valores,
    evaluaciones,
    resultados,
    views,
    banners,
    ckdStage,
    evalResult: input.evalResult,
    hasEvalResult: Boolean(input.evalResult),
  };
}
