import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { DashboardScreen } from "./DashboardScreen";
import { dashboardStrings } from "./strings/es";
import { buildGlucosaResumenViewData } from "@/features/patient/view-data/build-glucosa-resumen-view-data";
import { buildOtrosIndicadoresViewData } from "@/features/patient/view-data/build-otros-indicadores-view-data";
import {
  makeDailyRecord,
  makeGlucoseReading,
  makeProfile,
} from "@/features/patient/__fixtures__";
import type { GlucosaResumen } from "@/features/patient/hooks/use-glucosa-resumen";

afterEach(cleanup);

const NOW = new Date(2026, 6, 13, 12, 0, 0);

function makeResumen(overrides: Partial<GlucosaResumen> = {}): GlucosaResumen {
  return {
    ...buildGlucosaResumenViewData({
      dailyRecords: [],
      profile: makeProfile(),
      rango: "7d",
      now: NOW,
    }),
    loading: false,
    error: false,
    ...overrides,
  };
}

const noop = () => {};

function baseProps(resumen: GlucosaResumen) {
  return {
    firstName: "María",
    resumen,
    indicadores: buildOtrosIndicadoresViewData({
      dailyRecords: [],
      labRecords: [],
      profile: makeProfile(),
      now: NOW,
    }).indicadores,
    rango: "7d" as const,
    onRangoChange: noop,
    onRegistrar: noop,
    onHistorial: noop,
    onRetry: noop,
    onIndicadorClick: noop,
  };
}

describe("DashboardScreen", () => {
  it("muestra el loader mientras carga", () => {
    render(<DashboardScreen {...baseProps(makeResumen({ loading: true }))} />);
    // El estado de datos no debe renderizarse.
    expect(screen.queryByText(dashboardStrings.errorTitle)).toBeNull();
  });

  it("muestra el estado de error con botón de reintentar (issue #7)", () => {
    const onRetry = vi.fn();
    render(
      <DashboardScreen
        {...baseProps(makeResumen({ error: true }))}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText(dashboardStrings.errorTitle)).toBeTruthy();
    fireEvent.click(screen.getByText(dashboardStrings.retryButton));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("muestra el estado vacío cuando no hay registros", () => {
    const onRegistrar = vi.fn();
    render(
      <DashboardScreen
        {...baseProps(makeResumen({ tieneRegistros: false }))}
        onRegistrar={onRegistrar}
      />,
    );
    expect(screen.queryByText(dashboardStrings.errorTitle)).toBeNull();
  });

  it("renderiza el hero y los indicadores con datos", () => {
    const resumen = makeResumen({
      ...buildGlucosaResumenViewData({
        dailyRecords: [
          makeDailyRecord({
            recordDate: "13/07/2026",
            glucoseReadings: [
              makeGlucoseReading({ valueMgDl: 95, time: "07:00" }),
            ],
          }),
        ],
        profile: makeProfile({ diabetesType: "Type2" }),
        rango: "7d",
        now: NOW,
      }),
    });
    render(<DashboardScreen {...baseProps(resumen)} />);
    expect(screen.getByText("Presión arterial")).toBeTruthy();
    expect(screen.getByText("HbA1c")).toBeTruthy();
  });

  it("muestra el placeholder de tendencia con menos de 2 puntos", () => {
    const resumen = makeResumen({
      tieneRegistros: true,
      serieVentana: [{ fecha: "12/7", promedio: 100, min: 90, max: 110, lecturas: 2, ts: 0 }],
    });
    render(<DashboardScreen {...baseProps(resumen)} />);
    expect(screen.getByText(dashboardStrings.sinTendencia)).toBeTruthy();
  });
});
