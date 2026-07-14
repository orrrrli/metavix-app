import type { ClinicalGoal } from "@/types/clinical-goal";

export function makeClinicalGoal(
  overrides: Partial<ClinicalGoal> = {},
): ClinicalGoal {
  return {
    id: "goal-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    parameterId: "hba1c",
    customOutOfRangeLow: null,
    customAtRiskLow: null,
    customAtRiskHigh: null,
    customOutOfRangeHigh: 7,
    createdAt: "2026-07-01T00:00:00Z",
    ...overrides,
  };
}
