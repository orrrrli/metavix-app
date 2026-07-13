import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import { renderHookWithQuery } from "@/test-utils/render-hook-with-query";
import { server } from "@/test-utils/msw-server";
import { useAuthStore } from "@/features/auth/store";
import { useMetas } from "./use-metas";
import {
  makeLabRecord,
  makeDailyRecord,
  makeGlucoseReading,
  makeProfile,
  makeEvalResponse,
  metasHandlers,
  patientId,
} from "../__fixtures__";
import { GlucoseReadingType } from "@/types/daily-record";

beforeEach(() => {
  useAuthStore.setState({ patientId });
});

afterEach(() => {
  useAuthStore.setState({ patientId: null });
});

describe("useMetas", () => {
  it("carga inicial con datos vacíos → valores vacíos, sin views, isLoading false", async () => {
    server.use(...metasHandlers());
    const { result } = renderHookWithQuery(() => useMetas());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.viewData.valores.hba1c).toBe("");
    expect(result.current.viewData.views).toEqual([]);
    expect(result.current.viewData.hasEvalResult).toBe(false);
  });

  it("carga con labs + dailys + profile → valores pre-poblados y banner de embarazo", async () => {
    server.use(
      ...metasHandlers({
        labRecords: [makeLabRecord({ hba1c: 7.3 })],
        dailyRecords: [
          makeDailyRecord({
            weightKg: 70,
            glucoseReadings: [
              makeGlucoseReading({
                readingType: GlucoseReadingType.Fasting,
                valueMgDl: 108,
              }),
            ],
          }),
        ],
        profile: makeProfile({ isPregnant: true, heightCm: 165 }),
      }),
    );
    const { result } = renderHookWithQuery(() => useMetas());

    await waitFor(() =>
      expect(result.current.viewData.valores.hba1c).toBe("7.3"),
    );
    expect(result.current.viewData.valores.fasting_glucose).toBe("108");
    expect(result.current.viewData.banners.showPregnancyMode).toBe(true);
    expect(result.current.viewData.valores.bmi).not.toBe("");
  });

  it("evaluate() → hasEvalResult true y views poblado", async () => {
    server.use(
      ...metasHandlers({
        evalResponse: makeEvalResponse({
          items: [{ parameterId: "hba1c", status: "InRange", valueUsed: 6.2 }],
        }),
      }),
    );
    const { result } = renderHookWithQuery(() => useMetas());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.evaluate();
    });

    expect(result.current.viewData.hasEvalResult).toBe(true);
    expect(result.current.viewData.views[0]?.parameterId).toBe("hba1c");
    expect(
      result.current.viewData.resultados.find((r) => r.param.id === "hba1c")
        ?.valor,
    ).toBe("6.2");
  });

  it("patientId null → queries no se disparan (isLoading queda en false)", async () => {
    useAuthStore.setState({ patientId: null });
    const { result } = renderHookWithQuery(() => useMetas());
    // enabled:!!patientId ⇒ las queries no corren; no hay fetch que MSW rechace.
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.viewData.views).toEqual([]);
  });
});
