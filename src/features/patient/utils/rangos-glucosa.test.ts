import { describe, it, expect } from "vitest";
import { GlucoseReadingType } from "@/types/daily-record";
import { rangoPara, rangoParaDefault, evaluar, bandaEnMeta, RANGO_AYUNO_POR_DEFECTO } from "./rangos-glucosa";

describe("rangoPara (bandas clínicas por Ayuno vs Postprandial + diabetes + embarazo)", () => {
  it("ayuno con diabetes: Hipo <70, fuera-meta-baja 70-79, en meta 80-130, revisar 131-179, fuera-meta-alta >179", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true);
    expect(evaluar(69, r).label).toBe("Hipoglucemia");
    expect(evaluar(75, r).label).toBe("Fuera de meta (baja)");
    expect(evaluar(80, r).label).toBe("En meta");
    expect(evaluar(130, r).label).toBe("En meta");
    expect(evaluar(150, r).label).toBe("Revisar");
    expect(evaluar(180, r).label).toBe("Fuera de meta (alta)");
  });

  it("ayuno sin diabetes: en meta 80-99, revisar (prediabetes) 100-125, fuera-meta-alta >125", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, false);
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

  it("ayuno embarazada con DM/DMG: sin banda fuera-meta-baja — Hipo <70, en meta 70-95, revisar 96-109, fuera-meta-alta >109", () => {
    const r = rangoPara(GlucoseReadingType.Fasting, true, true);
    expect(evaluar(69, r).label).toBe("Hipoglucemia");
    expect(evaluar(70, r).label).toBe("En meta");
    expect(evaluar(95, r).label).toBe("En meta");
    expect(evaluar(100, r).label).toBe("Revisar");
    expect(evaluar(110, r).label).toBe("Fuera de meta (alta)");
  });

  it("postprandial embarazada con DM/DMG: fuera-meta-baja 70-99, en meta 100-120, revisar 121-139, fuera-meta-alta >=140", () => {
    const r = rangoPara(GlucoseReadingType.PostLunch, true, true);
    expect(evaluar(69, r).label).toBe("Hipoglucemia");
    expect(evaluar(85, r).label).toBe("Fuera de meta (baja)");
    expect(evaluar(110, r).label).toBe("En meta");
    expect(evaluar(130, r).label).toBe("Revisar");
    expect(evaluar(140, r).label).toBe("Fuera de meta (alta)");
  });

  it("hipoglucemia (<70) es universal en todos los casos", () => {
    expect(evaluar(69, rangoPara(GlucoseReadingType.Fasting, true)).label).toBe("Hipoglucemia");
    expect(evaluar(69, rangoPara(GlucoseReadingType.Fasting, false)).label).toBe("Hipoglucemia");
    expect(evaluar(69, rangoPara(GlucoseReadingType.PostLunch, true)).label).toBe("Hipoglucemia");
    expect(evaluar(69, rangoPara(GlucoseReadingType.PostLunch, false)).label).toBe("Hipoglucemia");
    expect(evaluar(69, rangoPara(GlucoseReadingType.Fasting, true, true)).label).toBe("Hipoglucemia");
    expect(evaluar(69, rangoPara(GlucoseReadingType.PostLunch, true, true)).label).toBe("Hipoglucemia");
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

  it("estado bad para Hipoglucemia y Fuera de meta", () => {
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
