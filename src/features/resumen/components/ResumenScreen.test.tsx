import { describe, it, expect, afterEach, vi } from "vitest";
import { createRef } from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ResumenScreen } from "./ResumenScreen";
import { resumenStrings as S } from "../strings/es";
import { buildResumenViewData } from "../view-data/build-resumen-view-data";
import { makeResumen } from "@/features/resumen/__fixtures__/make-resumen";

afterEach(cleanup);

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    viewData: buildResumenViewData(
      makeResumen({ metricas: { hba1c: { valor: 6.5, fecha: "01/07/2026" } } }),
    ),
    pdfRef: createRef<HTMLDivElement>(),
    isExporting: false,
    onExport: () => {},
    ...overrides,
  };
}

describe("ResumenScreen", () => {
  it("muestra el estado vacío cuando todasNulas", () => {
    render(
      <ResumenScreen {...baseProps({ viewData: buildResumenViewData(makeResumen()) })} />,
    );
    expect(screen.getByText(S.emptyTitle)).toBeTruthy();
  });

  it("renderiza las secciones y sus métricas", () => {
    render(<ResumenScreen {...baseProps()} />);
    expect(screen.getByText("Control Glucémico")).toBeTruthy();
    expect(screen.getByText("Función Renal")).toBeTruthy();
    expect(screen.getByText("Hemoglobina Glicosilada (HbA1c)")).toBeTruthy();
  });

  it("el botón de exportar dispara onExport", () => {
    const onExport = vi.fn();
    render(<ResumenScreen {...baseProps({ onExport })} />);
    fireEvent.click(screen.getByText(S.exportPdf));
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("isExporting muestra 'Generando PDF...'", () => {
    render(<ResumenScreen {...baseProps({ isExporting: true })} />);
    expect(screen.getByText(S.exporting)).toBeTruthy();
  });
});
