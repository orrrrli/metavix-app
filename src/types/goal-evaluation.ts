export type GoalStatus = "InRange" | "AtRisk" | "OutOfRange" | "NoData";

/**
 * Códigos de razón que el backend emite en `GoalEvaluationItem.Reason` cuando
 * el estado es `NoData`. Alineados con `AdaGoalConstants.NoDataReason*` en
 * metavix-api/src/Application/Common/Constants/AdaGoalConstants.cs. La
 * traducción a texto en español la hace `formatNoDataReason` en
 * src/features/metas/utils/goal-eval-to-view.ts.
 */
export type NoDataReason =
  | "not-evaluated-in-pregnancy"
  | "requires-specialist-evaluation"
  | "no-recent-data";

/**
 * Etapas KDIGO 2024 de enfermedad renal crónica (ERC) que el backend emite en
 * `GoalEvaluationItem.CkdStage` cuando el parámetro es eGFR y hay un valor
 * numérico disponible. Alineado con `AdaGoalConstants.CkdStageG*` en
 * metavix-api/src/Application/Common/Constants/AdaGoalConstants.cs. La
 * traducción a nombre + rango + acción clínica en español la hace
 * `ckd-stages.ts` (catálogo local, fuente KDIGO 2024 + ADA 2026 Sec. 11).
 */
export type CkdStage = "G1" | "G2" | "G3a" | "G3b" | "G4" | "G5";

export interface GoalEvaluationItemResponse {
  parameterId: string;
  valueUsed: number | null;
  goalUsed: number;
  status: GoalStatus;
  /** Solo presente cuando `status === "NoData"`. Explica por qué el parámetro
   *  no se evaluó. */
  reason?: NoDataReason | null;
  /** Etapa KDIGO 2024 de ERC, presente solo cuando `parameterId === "egfr"`
   *  y `valueUsed` es numérico. Ver `CkdStage`. */
  ckdStage?: CkdStage | null;
}

export interface GoalEvaluationResponse {
  evaluationId: string;
  evaluatedAt: string;
  items: GoalEvaluationItemResponse[];
}
