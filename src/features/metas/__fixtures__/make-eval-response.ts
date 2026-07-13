import type {
  GoalEvaluationItemResponse,
  GoalEvaluationResponse,
} from "@/types/goal-evaluation";

export function makeEvalItem(
  overrides: Partial<GoalEvaluationItemResponse> = {},
): GoalEvaluationItemResponse {
  return {
    parameterId: "hba1c",
    valueUsed: 6.5,
    goalUsed: 7,
    status: "InRange",
    reason: null,
    ckdStage: null,
    isCustomGoal: false,
    ...overrides,
  };
}

export function makeEvalResponse(
  overrides: Partial<Omit<GoalEvaluationResponse, "items">> & {
    items?: Partial<GoalEvaluationItemResponse>[];
  } = {},
): GoalEvaluationResponse {
  const { items, ...rest } = overrides;
  return {
    evaluationId: "eval-1",
    evaluatedAt: "2026-07-13T00:00:00Z",
    items: (items ?? [{ parameterId: "hba1c" }]).map(makeEvalItem),
    ...rest,
  };
}
