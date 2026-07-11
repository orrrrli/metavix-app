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

export interface GoalEvaluationItemResponse {
  parameterId: string;
  valueUsed: number | null;
  goalUsed: number;
  status: GoalStatus;
  /** Solo presente cuando `status === "NoData"`. Explica por qué el parámetro
   *  no se evaluó. */
  reason?: NoDataReason | null;
}

export interface GoalEvaluationResponse {
  evaluationId: string;
  evaluatedAt: string;
  items: GoalEvaluationItemResponse[];
}
