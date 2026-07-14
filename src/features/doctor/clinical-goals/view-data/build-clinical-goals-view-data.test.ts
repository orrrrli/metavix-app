import { describe, it, expect } from "vitest";
import { PARAMETROS_META } from "@/features/metas/data/parametros";
import { makeClinicalGoal } from "@/features/doctor/__fixtures__/make-clinical-goal";
import {
  buildClinicalGoalsViewData,
  buildCustomSummaryItems,
} from "./build-clinical-goals-view-data";

describe("buildCustomSummaryItems", () => {
  it("lista sólo los umbrales no nulos, con unidad", () => {
    const items = buildCustomSummaryItems(
      makeClinicalGoal({
        customOutOfRangeLow: 4,
        customAtRiskLow: 5,
        customAtRiskHigh: 8,
        customOutOfRangeHigh: 9,
      }),
      "%",
    );
    expect(items).toEqual([
      "Fuera < 4 %",
      "Revisar ≥ 5 %",
      "Revisar > 8 %",
      "Fuera ≥ 9 %",
    ]);
  });

  it("omite umbrales nulos y funciona sin unidad", () => {
    const items = buildCustomSummaryItems(
      makeClinicalGoal({
        customOutOfRangeLow: null,
        customAtRiskLow: null,
        customAtRiskHigh: null,
        customOutOfRangeHigh: 7,
      }),
      "",
    );
    expect(items).toEqual(["Fuera ≥ 7"]);
  });
});

describe("buildClinicalGoalsViewData", () => {
  it("devuelve una entrada por cada parámetro del catálogo", () => {
    const vd = buildClinicalGoalsViewData([]);
    expect(vd.parametros).toHaveLength(PARAMETROS_META.length);
    expect(vd.hasCustomGoals).toBe(false);
  });

  it("asocia la meta personalizada a su parámetro por parameterId", () => {
    const goal = makeClinicalGoal({ parameterId: "hba1c", customOutOfRangeHigh: 6.5 });
    const vd = buildClinicalGoalsViewData([goal]);
    const hba1c = vd.parametros.find((p) => p.param.id === "hba1c");
    expect(hba1c?.existing).toBe(goal);
    expect(hba1c?.customSummaryItems).toEqual(["Fuera ≥ 6.5 %"]);
    expect(vd.hasCustomGoals).toBe(true);
  });

  it("parámetros sin meta tienen existing null y resumen vacío", () => {
    const vd = buildClinicalGoalsViewData([
      makeClinicalGoal({ parameterId: "hba1c" }),
    ]);
    const otro = vd.parametros.find((p) => p.param.id !== "hba1c");
    expect(otro?.existing).toBeNull();
    expect(otro?.customSummaryItems).toEqual([]);
  });
});
