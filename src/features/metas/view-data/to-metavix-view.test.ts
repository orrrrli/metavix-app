import { describe, it, expect } from "vitest";
import {
  buildMetavixParametros,
  buildMetavixNoEvaluados,
  resumenMetas,
} from "./to-metavix-view";
import { buildMetasViewData } from "./build-metas-view-data";
import { makeProfile } from "../__fixtures__/make-profile";
import { makeEvalResponse } from "../__fixtures__/make-eval-response";

const NOW = new Date(2026, 6, 13);

describe("buildMetavixParametros", () => {
  it("antes de evaluar, todos los parámetros quedan en estado 'vacio'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: null,
      now: NOW,
    });
    const parametros = buildMetavixParametros(vd);
    expect(parametros.length).toBeGreaterThan(0);
    expect(parametros.every((p) => p.estado === "vacio")).toBe(true);
  });

  it("mapea InRange a 'ok'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "hba1c", status: "InRange", valueUsed: 6.4 }],
      }),
      now: NOW,
    });
    const p = buildMetavixParametros(vd).find((x) => x.id === "hba1c");
    expect(p?.estado).toBe("ok");
    expect(p?.valor).toBe("6.4");
  });

  it("mapea AtRisk a 'warn' y OutOfRange a 'bad'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [
          { parameterId: "hba1c", status: "AtRisk", valueUsed: 7.5 },
          { parameterId: "fasting_glucose", status: "OutOfRange", valueUsed: 200 },
        ],
      }),
      now: NOW,
    });
    const parametros = buildMetavixParametros(vd);
    expect(parametros.find((p) => p.id === "hba1c")?.estado).toBe("warn");
    expect(parametros.find((p) => p.id === "fasting_glucose")?.estado).toBe("bad");
  });

  it("propaga una alerta crítica como nota con tono 'warn'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "triglycerides", status: "OutOfRange", valueUsed: 600 }],
      }),
      now: NOW,
    });
    const p = buildMetavixParametros(vd).find((x) => x.id === "triglycerides");
    expect(p?.nota?.tono).toBe("warn");
    expect(p?.nota?.texto).toMatch(/pancreatitis/i);
  });

  it("propaga una nota de embarazo con tono 'info'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile({ isPregnant: true }),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "systolic_bp", status: "OutOfRange", valueUsed: 140 }],
      }),
      now: NOW,
    });
    const p = buildMetavixParametros(vd).find((x) => x.id === "systolic_bp");
    expect(p?.nota?.tono).toBe("info");
  });
});

describe("buildMetavixNoEvaluados", () => {
  it("mapea 'requires-specialist-evaluation' a razon 'especialista'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [
          {
            parameterId: "egfr",
            status: "NoData",
            valueUsed: null,
            reason: "requires-specialist-evaluation",
          },
        ],
      }),
      now: NOW,
    });
    const noEvaluados = buildMetavixNoEvaluados(vd);
    expect(noEvaluados).toHaveLength(1);
    expect(noEvaluados[0].razon).toBe("especialista");
  });

  it("mapea 'not-evaluated-in-pregnancy' a razon 'no_embarazo'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile({ isPregnant: true }),
      evalResult: makeEvalResponse({
        items: [
          {
            parameterId: "bmi",
            status: "NoData",
            valueUsed: null,
            reason: "not-evaluated-in-pregnancy",
          },
        ],
      }),
      now: NOW,
    });
    const noEvaluados = buildMetavixNoEvaluados(vd);
    expect(noEvaluados).toHaveLength(1);
    expect(noEvaluados[0].razon).toBe("no_embarazo");
  });

  it("excluye 'no-recent-data': ya se cubre por 'Sin registrar'", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [
          {
            parameterId: "hba1c",
            status: "NoData",
            valueUsed: null,
            reason: "no-recent-data",
          },
        ],
      }),
      now: NOW,
    });
    expect(buildMetavixNoEvaluados(vd)).toHaveLength(0);
  });

  it("sin evaluación previa, devuelve lista vacía", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: null,
      now: NOW,
    });
    expect(buildMetavixNoEvaluados(vd)).toHaveLength(0);
  });
});

describe("resumenMetas", () => {
  it("cuenta cada estado y calcula el porcentaje solo sobre evaluados", () => {
    const resumen = resumenMetas([
      { id: "a", label: "A", estado: "ok", valor: "1", metaTexto: "" },
      { id: "b", label: "B", estado: "ok", valor: "1", metaTexto: "" },
      { id: "c", label: "C", estado: "warn", valor: "1", metaTexto: "" },
      { id: "d", label: "D", estado: "bad", valor: "1", metaTexto: "" },
      { id: "e", label: "E", estado: "vacio", valor: null, metaTexto: "" },
    ]);
    expect(resumen).toEqual({
      total: 5,
      ok: 2,
      warn: 1,
      bad: 1,
      vacio: 1,
      porcentajeEnMeta: 50,
    });
  });

  it("con lista vacía, el porcentaje es 0 (evita división por cero)", () => {
    expect(resumenMetas([]).porcentajeEnMeta).toBe(0);
  });
});
