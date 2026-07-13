import { describe, it, expect } from "vitest";
import {
  buildResumenResultados,
  buildValoresEvaluados,
} from "./build-resumen-resultados";
import { buildEvaluacionesMap } from "./build-evaluaciones-map";
import { PARAMETROS_META } from "../data/parametros";
import { makeEvalResponse } from "../__fixtures__/make-eval-response";

const evaluaciones = buildEvaluacionesMap(null);

describe("buildValoresEvaluados", () => {
  it("null → mapa vacío", () => {
    expect(buildValoresEvaluados(null)).toEqual({});
  });

  it("mapea valueUsed a string; null → ''", () => {
    const map = buildValoresEvaluados(
      makeEvalResponse({
        items: [
          { parameterId: "hba1c", valueUsed: 6.5 },
          { parameterId: "ldl_primary", valueUsed: null },
        ],
      }),
    );
    expect(map.hba1c).toBe("6.5");
    expect(map.ldl_primary).toBe("");
  });
});

describe("buildResumenResultados", () => {
  it("devuelve una entrada por parámetro del catálogo", () => {
    const r = buildResumenResultados({
      valores: {},
      valoresEvaluados: {},
      evaluaciones,
    });
    expect(r).toHaveLength(PARAMETROS_META.length);
  });

  it("|| : valueUsed vacío del backend cae al valor pre-poblado", () => {
    const r = buildResumenResultados({
      valores: { hba1c: "7.0" },
      valoresEvaluados: { hba1c: "" },
      evaluaciones,
    });
    expect(r.find((x) => x.param.id === "hba1c")?.valor).toBe("7.0");
  });

  it("valueUsed presente pisa el pre-poblado", () => {
    const r = buildResumenResultados({
      valores: { hba1c: "7.0" },
      valoresEvaluados: { hba1c: "6.5" },
      evaluaciones,
    });
    expect(r.find((x) => x.param.id === "hba1c")?.valor).toBe("6.5");
  });

  it("ambos vacíos → ''", () => {
    const r = buildResumenResultados({
      valores: {},
      valoresEvaluados: {},
      evaluaciones,
    });
    expect(r.find((x) => x.param.id === "hba1c")?.valor).toBe("");
  });
});
