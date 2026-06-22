export type GoalStatus = "InRange" | "AtRisk" | "OutOfRange" | "NoData";

export interface GoalEvaluationItemResponse {
  parameterId: string;
  valueUsed: number | null;
  goalUsed: number;
  status: GoalStatus;
}

export interface GoalEvaluationResponse {
  evaluationId: string;
  evaluatedAt: string;
  items: GoalEvaluationItemResponse[];
}
