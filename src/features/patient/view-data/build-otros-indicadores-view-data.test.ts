import { describe, it, expect } from "vitest";
import {
  makeDailyRecord,
  makeLabRecord,
  makeProfile,
} from "@/features/patient/__fixtures__";
import { buildOtrosIndicadoresViewData } from "./build-otros-indicadores-view-data";

const NOW = new Date(2026, 6, 13, 12, 0, 0);

describe("buildOtrosIndicadoresViewData", () => {
  it("siempre devuelve los 5 indicadores en orden", () => {
    const { indicadores } = buildOtrosIndicadoresViewData({
      dailyRecords: [],
      labRecords: [],
      profile: makeProfile(),
      now: NOW,
    });
    expect(indicadores.map((i) => i.label)).toEqual([
      "Presión arterial",
      "Frecuencia cardíaca",
      "Índice de masa corporal",
      "HbA1c",
      "Colesterol",
    ]);
  });

  it("marca estado vacío y href correcto cuando no hay datos", () => {
    const { indicadores } = buildOtrosIndicadoresViewData({
      dailyRecords: [],
      labRecords: [],
      profile: makeProfile({ heightCm: null }),
      now: NOW,
    });
    expect(indicadores.every((i) => i.estado === "vacio")).toBe(true);
    // Sin estatura, el IMC dirige a completar el perfil.
    const imc = indicadores.find((i) => i.label === "Índice de masa corporal");
    expect(imc?.meta).toContain("estatura");
    expect(imc?.href).toBe("/paciente/perfil");
  });

  it("clasifica presión alta y expone valor principal/secundario sin JSX", () => {
    const { indicadores } = buildOtrosIndicadoresViewData({
      dailyRecords: [
        makeDailyRecord({
          recordDate: "13/07/2026",
          systolicPressure: 150,
          diastolicPressure: 95,
        }),
      ],
      labRecords: [],
      profile: makeProfile(),
      now: NOW,
    });
    const presion = indicadores.find((i) => i.label === "Presión arterial");
    expect(presion?.estado).toBe("bad");
    expect(presion?.estadoLabel).toBe("Alta");
    expect(presion?.valorPrincipal).toBe(150);
    expect(presion?.valorSecundario).toBe("/95");
    expect(presion?.iconKey).toBe("presion");
  });

  it("calcula IMC saludable a partir de peso + estatura del perfil", () => {
    const { indicadores } = buildOtrosIndicadoresViewData({
      dailyRecords: [makeDailyRecord({ recordDate: "13/07/2026", weightKg: 60 })],
      labRecords: [],
      profile: makeProfile({ heightCm: 165 }),
      now: NOW,
    });
    const imc = indicadores.find((i) => i.label === "Índice de masa corporal");
    // 60 / 1.65^2 = 22.0
    expect(imc?.valorPrincipal).toBe("22.0");
    expect(imc?.estadoLabel).toBe("Saludable");
    expect(imc?.estado).toBe("ok");
  });

  it("clasifica HbA1c según diabetes del perfil", () => {
    const conDiabetes = buildOtrosIndicadoresViewData({
      dailyRecords: [],
      labRecords: [makeLabRecord({ sampleDate: "13/07/2026", hba1c: 7.5 })],
      profile: makeProfile({ diabetesType: "Type2" }),
      now: NOW,
    });
    const a1c = conDiabetes.indicadores.find((i) => i.label === "HbA1c");
    expect(a1c?.estado).toBe("bad");
    expect(a1c?.estadoLabel).toBe("Alta");
    expect(a1c?.valorPrincipal).toBe(7.5);
  });

  it("clasifica colesterol total alto", () => {
    const { indicadores } = buildOtrosIndicadoresViewData({
      dailyRecords: [],
      labRecords: [makeLabRecord({ sampleDate: "13/07/2026", totalCholesterol: 260 })],
      profile: makeProfile(),
      now: NOW,
    });
    const col = indicadores.find((i) => i.label === "Colesterol");
    expect(col?.estado).toBe("bad");
    expect(col?.valorPrincipal).toBe(260);
    expect(col?.valorUnidad).toBe(" mg/dL");
  });
});
