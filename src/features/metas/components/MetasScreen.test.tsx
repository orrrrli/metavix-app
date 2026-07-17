import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MetasScreen } from "./MetasScreen";
import { buildMetasViewData } from "../view-data/build-metas-view-data";
import { metasStrings } from "../strings/es";
import { makeProfile } from "../__fixtures__/make-profile";
import { makeEvalResponse } from "../__fixtures__/make-eval-response";
import type { MetasViewData } from "../view-data/build-metas-view-data";

afterEach(cleanup);

const NOW = new Date(2026, 6, 13);

function baseProps(overrides: Partial<MetasViewData> = {}) {
  const viewData = {
    ...buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: null,
      now: NOW,
    }),
    ...overrides,
  };
  return {
    viewData,
    onEvaluate: () => {},
    isEvaluating: false,
    isLoading: false,
  };
}

describe("MetasScreen", () => {
  it("estado de carga muestra el loader y el mensaje", () => {
    render(<MetasScreen {...baseProps()} isLoading />);
    expect(screen.getByText(metasStrings.loadingMessage)).toBeTruthy();
  });

  it("muestra el banner de embarazo cuando showPregnancyMode es true", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile({ isPregnant: true }),
      evalResult: null,
      now: NOW,
    });
    render(<MetasScreen {...baseProps()} viewData={vd} />);
    expect(screen.getByText(metasStrings.pregnancyMode.title)).toBeTruthy();
  });

  it("muestra la nota de embarazo desactivado", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile({ isPregnant: false, pregnancyStartDate: "01/01/2026" }),
      evalResult: null,
      now: NOW,
    });
    render(<MetasScreen {...baseProps()} viewData={vd} />);
    expect(screen.getByText(metasStrings.pregnancyDeactivatedNote)).toBeTruthy();
  });

  it("antes de evaluar, muestra el botón Evaluar y no el bloque de resultados", () => {
    render(<MetasScreen {...baseProps()} />);
    expect(screen.getByRole("button", { name: metasStrings.evaluateButton })).toBeTruthy();
    expect(screen.queryByText(/Necesita tu atención/i)).toBeNull();
  });

  it("el botón Evaluar queda deshabilitado mientras isEvaluating", () => {
    render(<MetasScreen {...baseProps()} isEvaluating />);
    const btn = screen.getByRole("button", { name: metasStrings.evaluateButton });
    expect(btn.hasAttribute("disabled")).toBe(true);
  });

  it("con hasEvalResult renderiza el hero y el detalle del parámetro evaluado", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "hba1c", status: "InRange", valueUsed: 6.4 }],
      }),
      now: NOW,
    });
    render(<MetasScreen {...baseProps()} viewData={vd} />);
    expect(screen.getAllByText(/HbA1c/i).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: metasStrings.evaluateButton })).toBeNull();
  });

  it("con eGFR evaluado renderiza el CkdStageExplainer", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [{ parameterId: "egfr", status: "InRange", valueUsed: 72, ckdStage: "G2" }],
      }),
      now: NOW,
    });
    render(<MetasScreen {...baseProps()} viewData={vd} />);
    expect(screen.getByText(/Etapa de enfermedad renal/i)).toBeTruthy();
  });
});

/**
 * Snapshots del DOM: capa 1 de regresión visual (ver
 * `.claude/engineering/testing.md`). Detectan cambios estructurales y de token
 * de color (las clases Tailwind y los `var(--…)` quedan serializados). NO
 * detectan spacing/pixeles — eso es la capa Playwright.
 *
 * Al cambiar la UI a propósito: `npx vitest -u` regenera el `.snap` y se revisa
 * el diff antes de commitear.
 */
describe("MetasScreen — DOM snapshots", () => {
  it("estado de carga", () => {
    const { container } = render(<MetasScreen {...baseProps()} isLoading />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("paciente normal, sin evaluar", () => {
    const { container } = render(<MetasScreen {...baseProps()} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("paciente embarazada, sin evaluar", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile({ isPregnant: true }),
      evalResult: null,
      now: NOW,
    });
    const { container } = render(<MetasScreen {...baseProps()} viewData={vd} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("post-evaluación con hero, detalle y CkdStageExplainer", () => {
    const vd = buildMetasViewData({
      labRecords: [],
      dailyRecords: [],
      profile: makeProfile(),
      evalResult: makeEvalResponse({
        items: [
          { parameterId: "hba1c", status: "InRange", valueUsed: 6.4 },
          {
            parameterId: "egfr",
            status: "InRange",
            valueUsed: 72,
            ckdStage: "G2",
          },
        ],
      }),
      now: NOW,
    });
    const { container } = render(<MetasScreen {...baseProps()} viewData={vd} />);
    expect(container.innerHTML).toMatchSnapshot();
  });
});
