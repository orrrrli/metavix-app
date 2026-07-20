import { describe, it, expect } from "vitest";
import { GlucoseReadingType } from "@/types/daily-record";
import {
  makeDailyRecord,
  makeGlucoseReading,
  makeProfile,
} from "@/features/patient/__fixtures__";
import { buildGlucosaResumenViewData } from "./build-glucosa-resumen-view-data";

const NOW = new Date(2026, 6, 13, 12, 0, 0); // 13/07/2026 (mes 6 = julio)

describe("buildGlucosaResumenViewData", () => {
  it("devuelve el estado vacío cuando no hay registros", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [],
      profile: makeProfile(),
      rango: "7d",
      now: NOW,
    });
    expect(vd.tieneRegistros).toBe(false);
    expect(vd.valor).toBeNull();
    expect(vd.serieGrafica).toEqual([]);
    expect(vd.rachaDias).toBe(0);
  });

  it("marca tieneRegistros=false si hay registros pero sin lecturas de glucosa", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [makeDailyRecord({ glucoseReadings: [] })],
      profile: makeProfile(),
      rango: "7d",
      now: NOW,
    });
    expect(vd.tieneRegistros).toBe(false);
  });

  it("toma la lectura más reciente como valor del hero y la evalúa contra su rango", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [
        makeDailyRecord({
          recordDate: "13/07/2026",
          glucoseReadings: [
            makeGlucoseReading({
              readingType: GlucoseReadingType.Fasting,
              valueMgDl: 95,
              time: "07:00",
            }),
          ],
        }),
      ],
      profile: makeProfile({ diabetesType: "Type2" }),
      rango: "7d",
      now: NOW,
    });
    expect(vd.valor).toBe(95);
    // Con diabetes, ayuno = [80,130]; 95 está en rango.
    expect(vd.rangoObjetivo).toEqual([80, 130]);
    expect(vd.estado).toBe("ok");
    expect(vd.contexto).toContain("hoy a las");
  });

  it("ajusta el rango objetivo al tipo de la última lectura (post-comida)", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [
        makeDailyRecord({
          recordDate: "13/07/2026",
          glucoseReadings: [
            makeGlucoseReading({
              readingType: GlucoseReadingType.PostLunch,
              valueMgDl: 160,
              time: "14:00",
            }),
          ],
        }),
      ],
      profile: makeProfile({ diabetesType: "Type2" }),
      rango: "7d",
      now: NOW,
    });
    // Post-comida con diabetes, banda "en meta" = [70,179]; 160 en rango.
    expect(vd.rangoObjetivo).toEqual([70, 179]);
    expect(vd.estado).toBe("ok");
  });

  it("calcula % en rango y promedio de la ventana seleccionada", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [
        makeDailyRecord({
          recordDate: "12/07/2026",
          glucoseReadings: [
            makeGlucoseReading({ id: "a", valueMgDl: 90, time: "07:00" }),
            makeGlucoseReading({ id: "b", valueMgDl: 200, time: "08:00" }), // fuera
          ],
        }),
      ],
      profile: makeProfile({ diabetesType: "None" }),
      rango: "7d",
      now: NOW,
    });
    // sin diabetes ayuno [70,100]: 90 en rango, 200 fuera → 50%
    expect(vd.porcentajeEnRango).toBe(50);
    expect(vd.promedioVentana).toBe(145);
  });

  it("filtra serieVentana por ventana calendario (issue #6)", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [
        makeDailyRecord({
          recordDate: "01/07/2026", // fuera de la ventana de 7d desde el 13
          glucoseReadings: [makeGlucoseReading({ id: "old", valueMgDl: 100 })],
        }),
        makeDailyRecord({
          recordDate: "12/07/2026", // dentro
          glucoseReadings: [makeGlucoseReading({ id: "new", valueMgDl: 110 })],
        }),
      ],
      profile: makeProfile(),
      rango: "7d",
      now: NOW,
    });
    expect(vd.serieGrafica).toHaveLength(2);
    expect(vd.serieVentana).toHaveLength(1);
    expect(vd.serieVentana[0].fecha).toBe("12/7");
  });

  it("cuenta la racha de días consecutivos con lectura desde hoy", () => {
    const vd = buildGlucosaResumenViewData({
      dailyRecords: [
        makeDailyRecord({
          recordDate: "13/07/2026",
          glucoseReadings: [makeGlucoseReading({ id: "1", valueMgDl: 100 })],
        }),
        makeDailyRecord({
          recordDate: "12/07/2026",
          glucoseReadings: [makeGlucoseReading({ id: "2", valueMgDl: 100 })],
        }),
        makeDailyRecord({
          recordDate: "10/07/2026", // hueco el día 11 → rompe la racha
          glucoseReadings: [makeGlucoseReading({ id: "3", valueMgDl: 100 })],
        }),
      ],
      profile: makeProfile(),
      rango: "7d",
      now: NOW,
    });
    expect(vd.rachaDias).toBe(2);
  });
});
