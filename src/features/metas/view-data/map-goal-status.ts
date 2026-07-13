import type { GoalStatus, NoDataReason } from "@/types/goal-evaluation";
import type { EvaluacionMeta } from "../data/parametros";

/**
 * Mapea un `GoalStatus` del backend + su `reason`/`isCustomGoal` a la
 * `EvaluacionMeta` que consume la UI (estado + color token). Extraído de
 * `MetasControl`. Es exhaustivo sobre los 4 valores de `GoalStatus`.
 */
export function mapGoalStatus(
  status: GoalStatus,
  reason: NoDataReason | null | undefined,
  isCustomGoal: boolean,
): EvaluacionMeta {
  switch (status) {
    case "InRange":
      return { estado: "en_meta", color: "var(--ok)", isCustomGoal, reason: null };
    case "AtRisk":
      return { estado: "cuidado", color: "var(--warn)", isCustomGoal, reason: null };
    case "OutOfRange":
      return { estado: "fuera_meta", color: "var(--bad)", isCustomGoal, reason: null };
    case "NoData":
      return { estado: "sin_dato", color: "var(--ph)", isCustomGoal, reason: reason ?? null };
  }
}
