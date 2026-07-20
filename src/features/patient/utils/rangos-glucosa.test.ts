import { describe, it, expect } from "vitest";
import { GlucoseReadingType } from "@/types/daily-record";
import { rangoPara, rangoParaDefault, evaluar, bandaEnMeta, RANGO_AYUNO_POR_DEFECTO } from "./rangos-glucosa";

describe("rangoPara (bandas clínicas por Ayuno vs Postprandial + diabetes + embarazo)", () => {
  it("ayuno con diabetes: fuera-meta-baja <80, en meta 80-130, revisar 131-180, fuera-meta-alta >180", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true);
    expect(evaluar(75, r).label).toBe("Fuera de meta (baja)");
    expect(evaluar(80, r).label).toBe("En meta");
    expect(evaluar(130, r).label).toBe("En meta");
    expect(evaluar(150, r).label).toBe("Revisar");
    expect(evaluar(180, r).label).toBe("Revisar");
    expect(evaluar(181, r).label).toBe("Fuera de meta (alta)");
  });

  it("ayuno sin diabetes: en meta 70-99, revisar (prediabetes) 100-125, fuera-meta-alta >125", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, false);
    expect(evaluar(70, r).label).toBe("En meta");
    expect(evaluar(90, r).label).toBe("En meta");
    expect(evaluar(110, r).label).toBe("Revisar");
    expect(evaluar(126, r).label).toBe("Fuera de meta (alta)");
  });

  it("postprandial con diabetes: en meta 80-179, revisar 180-250, fuera-meta-alta >250", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, true);
    expect(evaluar(150, r).label).toBe("En meta");
    expect(evaluar(200, r).label).toBe("Revisar");
    expect(evaluar(251, r).label).toBe("Fuera de meta (alta)");
  });

  it("postprandial sin diabetes: en meta 80-139, revisar (prediabetes) 140-199, fuera-meta-alta >=200", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, false);
    expect(evaluar(100, r).label).toBe("En meta");
    expect(evaluar(160, r).label).toBe("Revisar");
    expect(evaluar(200, r).label).toBe("Fuera de meta (alta)");
  });

  it("ayuno embarazada con DM/DMG: fuera-meta-baja <70, en meta 70-95, revisar 96-125, fuera-meta-alta >125", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true, true);
    expect(evaluar(60, r).label).toBe("Fuera de meta (baja)");
    expect(evaluar(70, r).label).toBe("En meta");
    expect(evaluar(95, r).label).toBe("En meta");
    expect(evaluar(100, r).label).toBe("Revisar");
    expect(evaluar(125, r).label).toBe("Revisar");
    expect(evaluar(126, r).label).toBe("Fuera de meta (alta)");
  });

  it("postprandial embarazada con DM/DMG: fuera-meta-baja <100, en meta 100-120, revisar 121-139, fuera-meta-alta >=140", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, true, true);
    expect(evaluar(85, r).label).toBe("Fuera de meta (baja)");
    expect(evaluar(110, r).label).toBe("En meta");
    expect(evaluar(130, r).label).toBe("Revisar");
    expect(evaluar(140, r).label).toBe("Fuera de meta (alta)");
  });

  it("readingType null cae al default (ayuno)", () => {
    const r = rangoPara(null, true);
    expect(r).toEqual(rangoParaDefault(true));
  });

  it("RANGO_AYUNO_POR_DEFECTO es Fasting", () => {
    expect(RANGO_AYUNO_POR_DEFECTO).toBe(GlucoseReadingType.Fasting);
  });
});

describe("evaluar (clasificación de valor vs bandas)", () => {
  const rAyunoDiabetes = rangoPara(GlucoseReadingType.Fasting, true);

  it("estado bad para Fuera de meta (baja y alta)", () => {
    expect(evaluar(60, rAyunoDiabetes).estado).toBe("bad");
    expect(evaluar(75, rAyunoDiabetes).estado).toBe("bad");
    expect(evaluar(200, rAyunoDiabetes).estado).toBe("bad");
  });

  it("estado ok para En meta", () => {
    expect(evaluar(100, rAyunoDiabetes).estado).toBe("ok");
  });

  it("estado warn para Revisar", () => {
    expect(evaluar(150, rAyunoDiabetes).estado).toBe("warn");
  });

  it("valor exactamente en el borde de una banda cae en esa banda (inclusive)", () => {
    expect(evaluar(80, rAyunoDiabetes).label).toBe("En meta");
    expect(evaluar(131, rAyunoDiabetes).label).toBe("Revisar");
  });
});

describe("bandaEnMeta", () => {
  it("retorna [desde, hasta] de la banda 'En meta'", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true);
    expect(bandaEnMeta(r)).toEqual({ desde: 80, hasta: 130 });
  });

  it("hasta = Infinity si 'En meta' es la última banda", () => {
    const r: ReturnType<typeof rangoPara> = [{ desde: 80, estado: "ok", label: "En meta" }];
    expect(bandaEnMeta(r)).toEqual({ desde: 80, hasta: Infinity });
  });
});
