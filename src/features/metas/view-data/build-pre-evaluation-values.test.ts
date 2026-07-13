import { describe, it, expect } from "vitest";
import { GlucoseReadingType } from "@/types/daily-record";
import { buildPreEvaluationValues } from "./build-pre-evaluation-values";
import { makeLabRecord } from "../__fixtures__/make-lab-record";
import {
  makeDailyRecord,
  makeGlucoseReading,
} from "../__fixtures__/make-daily-record";
import { makeProfile } from "../__fixtures__/make-profile";

describe("buildPreEvaluationValues", () => {
  it("sin registros → todas las keys presentes en string vacío", () => {
    const { valores, previousCreatinine } = buildPreEvaluationValues({
      labRecords: [],
      dailyRecords: [],
      profile: null,
    });
    expect(valores.hba1c).toBe("");
    expect(valores.bmi).toBe("");
    expect(valores.fasting_glucose).toBe("");
    expect(previousCreatinine).toBeNull();
  });

  it("toma hba1c del lab", () => {
    const { valores } = buildPreEvaluationValues({
      labRecords: [makeLabRecord({ hba1c: 7.2 })],
      dailyRecords: [],
      profile: null,
    });
    expect(valores.hba1c).toBe("7.2");
  });

  it("deriva ayunas de la lectura Fasting del registro más reciente", () => {
    const older = makeDailyRecord({
      recordDate: "01/01/2026",
      glucoseReadings: [
        makeGlucoseReading({ readingType: GlucoseReadingType.Fasting, valueMgDl: 90 }),
      ],
    });
    const newer = makeDailyRecord({
      recordDate: "01/06/2026",
      glucoseReadings: [
        makeGlucoseReading({ readingType: GlucoseReadingType.Fasting, valueMgDl: 110 }),
      ],
    });
    const { valores } = buildPreEvaluationValues({
      labRecords: [],
      dailyRecords: [older, newer],
      profile: null,
    });
    expect(valores.fasting_glucose).toBe("110");
  });

  it("ignora lecturas no-Fasting al derivar ayunas", () => {
    const { valores } = buildPreEvaluationValues({
      labRecords: [],
      dailyRecords: [
        makeDailyRecord({
          glucoseReadings: [
            makeGlucoseReading({ readingType: GlucoseReadingType.PostLunch, valueMgDl: 150 }),
          ],
        }),
      ],
      profile: null,
    });
    expect(valores.fasting_glucose).toBe("");
  });

  it("calcula IMC con peso reciente + altura del perfil", () => {
    const { valores } = buildPreEvaluationValues({
      labRecords: [],
      dailyRecords: [makeDailyRecord({ weightKg: 70 })],
      profile: makeProfile({ heightCm: 170 }),
    });
    // 70 / (1.70^2) = 24.22 → "24.2"
    expect(valores.bmi).toBe("24.2");
  });

  it("lab más reciente gana en el sort", () => {
    const { valores } = buildPreEvaluationValues({
      labRecords: [
        makeLabRecord({ sampleDate: "01/01/2026", ldl: 80 }),
        makeLabRecord({ sampleDate: "01/06/2026", ldl: 130 }),
      ],
      dailyRecords: [],
      profile: null,
    });
    expect(valores.ldl_primary).toBe("130");
  });

  it("previousCreatinine es la del segundo lab más reciente con creatinina", () => {
    const { previousCreatinine } = buildPreEvaluationValues({
      labRecords: [
        makeLabRecord({ sampleDate: "01/06/2026", creatinine: 1.1 }),
        makeLabRecord({ sampleDate: "01/01/2026", creatinine: 0.8 }),
      ],
      dailyRecords: [],
      profile: null,
    });
    expect(previousCreatinine).toBe(0.8);
  });
});
