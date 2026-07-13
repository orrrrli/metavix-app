import { describe, it, expect } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHookWithQuery } from "@/test-utils/render-hook-with-query";
import { server } from "@/test-utils/msw-server";
import { metasHandlers, patientId } from "@/features/metas/__fixtures__";
import {
  makeDailyRecord,
  makeGlucoseReading,
  makeProfile,
} from "@/features/patient/__fixtures__";
import { GlucoseReadingType } from "@/types/daily-record";
import { useGlucosaResumen } from "./use-glucosa-resumen";

describe("useGlucosaResumen", () => {
  it("carga sin registros → loading false, sin registros", async () => {
    server.use(...metasHandlers({ dailyRecords: [] }));
    const { result } = renderHookWithQuery(() => useGlucosaResumen(patientId, "7d"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tieneRegistros).toBe(false);
    expect(result.current.valor).toBeNull();
    expect(result.current.error).toBe(false);
  });

  it("carga con lecturas → resuelve el hero desde la última lectura", async () => {
    server.use(
      ...metasHandlers({
        dailyRecords: [
          makeDailyRecord({
            recordDate: "12/07/2026",
            glucoseReadings: [
              makeGlucoseReading({
                readingType: GlucoseReadingType.Fasting,
                valueMgDl: 96,
                time: "07:00",
              }),
            ],
          }),
        ],
        profile: makeProfile({ diabetesType: "Type2" }),
      }),
    );
    const { result } = renderHookWithQuery(() => useGlucosaResumen(patientId, "7d"));

    await waitFor(() => expect(result.current.tieneRegistros).toBe(true));
    expect(result.current.valor).toBe(96);
    expect(result.current.rangoObjetivo).toEqual([80, 130]);
  });

  it("patientId null → query no se dispara, loading false", async () => {
    const { result } = renderHookWithQuery(() => useGlucosaResumen(null, "7d"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tieneRegistros).toBe(false);
  });
});
