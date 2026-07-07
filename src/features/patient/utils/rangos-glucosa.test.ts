import { describe, it, expect } from "vitest";
import { GlucoseReadingType } from "@/types/daily-record";
import { rangoPara, rangoParaDefault, evaluar, RANGO_AYUNO_POR_DEFECTO } from "./rangos-glucosa";

describe("rangoPara (rango clínico por tipo de comida + diabetes)", () => {
  it("ayuno con diabetes: 80–130", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true);
    expect(r).toEqual({ inf: 80, sup: 130 });
  });

  it("ayuno sin diabetes: 70–100", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, false);
    expect(r).toEqual({ inf: 70, sup: 100 });
  });

  it("post-comida con diabetes: ≤180", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, true);
    expect(r.sup).toBe(180);
  });

  it("post-comida sin diabetes: ≤140", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, false);
    expect(r.sup).toBe(140);
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
  const rCon = { inf: 80, sup: 130 };

  it("por debajo de inf → bad/Baja", () => {
    expect(evaluar(60, rCon)).toEqual({ estado: "bad", label: "Baja" });
  });

  it("por encima de sup → bad/Alta", () => {
    expect(evaluar(200, rCon)).toEqual({ estado: "bad", label: "Alta" });
  });

  it("120 en ayuno diabético (80–130) cae en zona warn/Revisar (regression #4)", () => {
    // Antes: el wizard pintaba "En rango" (banda fija 70-180), el dashboard
    // "Revisar" (banda por tipo 80-130, 120 > 90% sup). La unificación
    // significa que ambos pintan "Revisar".
    expect(evaluar(120, rCon)).toEqual({ estado: "warn", label: "Revisar" });
  });

  it("95 ayuno diabético (80-130) → ok/En rango (en el centro del rango)", () => {
    expect(evaluar(95, rCon)).toEqual({ estado: "ok", label: "En rango" });
  });

  it("en el 10% inferior del rango → warn/Revisar", () => {
    // inf = 80, 110% = 88. 85 está en el 10% inferior.
    expect(evaluar(85, rCon).estado).toBe("warn");
  });

  it("fronteras exactas caen en warn (>= 90% sup o <= 110% inf)", () => {
    // Por diseño: 80 == inf*1.1, 130 == sup*0.9 → warn, no "ok" estricto.
    expect(evaluar(80, rCon)).toEqual({ estado: "warn", label: "Revisar" });
    expect(evaluar(130, rCon)).toEqual({ estado: "warn", label: "Revisar" });
  });

  it("valor central → ok/En rango", () => {
    // 100 está lejos de las zonas warn: > 88 (inf*1.1) y < 117 (sup*0.9).
    expect(evaluar(100, rCon)).toEqual({ estado: "ok", label: "En rango" });
  });
});
