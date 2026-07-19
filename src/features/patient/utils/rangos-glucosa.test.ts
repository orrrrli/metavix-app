import { describe, it, expect } from "vitest";
import { GlucoseReadingType } from "@/types/daily-record";
import { rangoPara, rangoParaDefault, evaluar, RANGO_AYUNO_POR_DEFECTO } from "./rangos-glucosa";

describe("rangoPara (rango clínico por Ayuno vs Postprandial + diabetes + embarazo)", () => {
  it("ayuno con diabetes: 80–179, en meta 80–130", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true);
    expect(r).toEqual({ inf: 80, sup: 179, enMetaInf: 80, enMetaSup: 130 });
  });

  it("ayuno sin diabetes: 80–125, en meta 80–99", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, false);
    expect(r).toEqual({ inf: 80, sup: 125, enMetaInf: 80, enMetaSup: 99 });
  });

  it("postprandial con diabetes: 80–250, en meta 80–179", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, true);
    expect(r).toEqual({ inf: 80, sup: 250, enMetaInf: 80, enMetaSup: 179 });
  });

  it("postprandial sin diabetes: 80–140, sin banda en meta explícita", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, false);
    expect(r).toEqual({ inf: 80, sup: 140 });
  });

  it("ayuno embarazada con diabetes: 80–109, en meta 80–95", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true, true);
    expect(r).toEqual({ inf: 80, sup: 109, enMetaInf: 80, enMetaSup: 95 });
  });

  it("postprandial embarazada con diabetes: 80–139, en meta 100–120", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, true, true);
    expect(r).toEqual({ inf: 80, sup: 139, enMetaInf: 100, enMetaSup: 120 });
  });

  it("todos los rangos comparten el piso de hipoglucemia en 80", () => {
    expect(rangoPara(GlucoseReadingType.Fasting, true).inf).toBe(80);
    expect(rangoPara(GlucoseReadingType.Fasting, false).inf).toBe(80);
    expect(rangoPara(GlucoseReadingType.PostLunch, true).inf).toBe(80);
    expect(rangoPara(GlucoseReadingType.PostLunch, false).inf).toBe(80);
    expect(rangoPara(GlucoseReadingType.Fasting, true, true).inf).toBe(80);
    expect(rangoPara(GlucoseReadingType.PostLunch, true, true).inf).toBe(80);
  });

  it("readingType null cae al default (ayuno)", () => {
    const r = rangoPara(null, true);
    expect(r).toEqual(rangoParaDefault(true));
  });

  it("RANGO_AYUNO_POR_DEFECTO es Fasting", () => {
    expect(RANGO_AYUNO_POR_DEFECTO).toBe(GlucoseReadingType.Fasting);
  });
});

describe("evaluar (clasificación de valor vs rango)", () => {
  const rCon = { inf: 80, sup: 179, enMetaInf: 80, enMetaSup: 130 };

  it("por debajo de inf (80) → bad/Baja", () => {
    expect(evaluar(79, rCon)).toEqual({ estado: "bad", label: "Baja" });
  });

  it("exactamente en inf (80) → no es Baja", () => {
    expect(evaluar(80, rCon).label).not.toBe("Baja");
  });

  it("por encima de sup → bad/Alta", () => {
    expect(evaluar(200, rCon)).toEqual({ estado: "bad", label: "Alta" });
  });

  it("dentro de [inf, sup] pero fuera de [enMetaInf, enMetaSup] → warn/Revisar", () => {
    expect(evaluar(150, rCon)).toEqual({ estado: "warn", label: "Revisar" });
  });

  it("dentro de [enMetaInf, enMetaSup] → ok/En rango", () => {
    expect(evaluar(100, rCon)).toEqual({ estado: "ok", label: "En rango" });
  });

  describe("sin banda enMeta explícita (regla genérica ±10%)", () => {
    const rGenerico = { inf: 80, sup: 140 };

    it("valor central → ok/En rango", () => {
      expect(evaluar(110, rGenerico)).toEqual({ estado: "ok", label: "En rango" });
    });

    it("dentro del 10% superior → warn/Revisar", () => {
      // sup*0.9 = 126, 130 > 126
      expect(evaluar(130, rGenerico).estado).toBe("warn");
    });

    it("dentro del 10% inferior (sobre inf) → warn/Revisar", () => {
      // inf*1.1 = 88, 85 < 88
      expect(evaluar(85, rGenerico).estado).toBe("warn");
    });
  });
});
