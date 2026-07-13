import { describe, it, expect } from "vitest";
import { buildEvaluacionesMap } from "./build-evaluaciones-map";
import { PARAMETROS_META } from "../data/parametros";
import { makeEvalResponse } from "../__fixtures__/make-eval-response";

describe("buildEvaluacionesMap", () => {
  it("evalResult null → todos sin_dato", () => {
    const map = buildEvaluacionesMap(null);
    expect(Object.keys(map)).toHaveLength(PARAMETROS_META.length);
    for (const param of PARAMETROS_META) {
      expect(map[param.id].estado).toBe("sin_dato");
    }
  });

  it("parámetros ausentes en items caen a sin_dato", () => {
    const map = buildEvaluacionesMap(
      makeEvalResponse({ items: [{ parameterId: "hba1c", status: "InRange" }] }),
    );
    expect(map.hba1c.estado).toBe("en_meta");
    expect(map.ldl_primary.estado).toBe("sin_dato");
  });

  it("propaga isCustomGoal", () => {
    const map = buildEvaluacionesMap(
      makeEvalResponse({
        items: [{ parameterId: "hba1c", status: "InRange", isCustomGoal: true }],
      }),
    );
    expect(map.hba1c.isCustomGoal).toBe(true);
  });

  it("propaga reason en items NoData", () => {
    const map = buildEvaluacionesMap(
      makeEvalResponse({
        items: [
          {
            parameterId: "hba1c",
            status: "NoData",
            reason: "no-recent-data",
            valueUsed: null,
          },
        ],
      }),
    );
    expect(map.hba1c.estado).toBe("sin_dato");
    expect(map.hba1c.reason).toBe("no-recent-data");
  });
});
