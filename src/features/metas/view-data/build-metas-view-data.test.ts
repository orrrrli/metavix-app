import { describe, it, expect } from "vitest";
import { buildMetasViewData } from "./build-metas-view-data";
import { makeLabRecord } from "../__fixtures__/make-lab-record";
import { makeDailyRecord, makeGlucoseReading } from "../__fixtures__/make-daily-record";
import { makeProfile } from "../__fixtures__/make-profile";
import { makeEvalResponse } from "../__fixtures__/make-eval-response";
import { GlucoseReadingType } from "@/types/daily-record";

const NOW = new Date(2026, 6, 13);

describe("buildMetasViewData", () => {
  it("sin evalResult → views vacío, hasEvalResult false, evaluaciones todas sin_dato", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: null,
      evalResult: null,
      now: NOW,
    });
    expect(vd.views).toEqual([]);
    expect(vd.hasEvalResult).toBe(false);
    expect(vd.ckdStage).toBeNull();
    expect(vd.evaluaciones.hba1c.estado).toBe("sin_dato");
  });

  it("pre-popula valores desde labs/dailys/profile", () => {
    const vd = buildMetasViewData({
      labRecords: [makeLabRecord({ hba1c: 8.1 })],
      dailyRecords: [
        makeDailyRecord({
          weightKg: 68,
          glucoseReadings: [
            makeGlucoseReading({ readingType: GlucoseReadingType.Fasting, valueMgDl: 105 }),
          ],
        }),
      ],
      profile: makeProfile({ heightCm: 160 }),
      evalResult: null,
      now: NOW,
    });
    expect(vd.valores.hba1c).toBe("8.1");
    expect(vd.valores.fasting_glucose).toBe("105");
    expect(vd.valores.bmi).toBe("26.6"); // 68/(1.6^2)
  });

  it("embarazada con dueDate vencida → banners correctos", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile({ isPregnant: true, pregnancyDueDate: "01/07/2026" }),
      evalResult: null,
      now: NOW,
    });
    expect(vd.banners.showPregnancyMode).toBe(true);
    expect(vd.banners.dueDateReached).toBe(true);
  });

  it("con evalResult → views poblado, hasEvalResult true, resultados consistentes", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "hba1c", status: "InRange", valueUsed: 6.4 }],
      }),
      now: NOW,
    });
    expect(vd.hasEvalResult).toBe(true);
    expect(vd.views).toHaveLength(1);
    expect(vd.views[0].parameterId).toBe("hba1c");
    expect(vd.resultados.find((r) => r.param.id === "hba1c")?.valor).toBe("6.4");
    expect(vd.resultados.find((r) => r.param.id === "hba1c")?.evaluacion.estado).toBe(
      "en_meta",
    );
  });

  it("deriva ckdStage desde el item egfr", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [
          { parameterId: "egfr", status: "InRange", valueUsed: 72, ckdStage: "G2" },
        ],
      }),
      now: NOW,
    });
    expect(vd.ckdStage).toEqual({ value: 72, stage: "G2" });
  });

  it("sin etapa CKD en egfr → ckdStage null", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "egfr", status: "NoData", valueUsed: null, ckdStage: null }],
      }),
      now: NOW,
    });
    expect(vd.ckdStage).toBeNull();
  });
});
