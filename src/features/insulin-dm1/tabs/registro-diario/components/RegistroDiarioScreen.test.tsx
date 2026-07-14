import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { RegistroDiarioScreen } from "./RegistroDiarioScreen";
import { registroDiarioStrings as S } from "../strings/es";
import { buildRegistroViewData } from "../view-data/build-registro-view-data";
import { makeInsulinRecord } from "@/features/insulin-dm1/__fixtures__/make-insulin-record";
import type { RegistroForm } from "../hooks/use-registro-diario";

afterEach(cleanup);

const emptyForm: RegistroForm = {
  fecha: "2026-07-13",
  glucosa_antes: "",
  glucosa_despues: "",
  hc_totales: "",
  dosis_aplicada: "",
  que_comi: "",
  como_me_senti: "",
};

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    viewData: buildRegistroViewData({ registros: [], desde: "", hasta: "" }),
    form: emptyForm,
    setFormField: () => {},
    fechaDesde: "",
    setFechaDesde: () => {},
    fechaHasta: "",
    setFechaHasta: () => {},
    isCreating: false,
    onSubmit: () => {},
    onDelete: () => {},
    ...overrides,
  };
}

describe("RegistroDiarioScreen", () => {
  it("muestra el mensaje vacío sin registros", () => {
    render(<RegistroDiarioScreen {...baseProps()} />);
    expect(screen.getByText(S.emptyPeriodo)).toBeTruthy();
  });

  it("lista los registros filtrados", () => {
    render(
      <RegistroDiarioScreen
        {...baseProps({
          viewData: buildRegistroViewData({
            registros: [makeInsulinRecord({ recordDate: "10/07/2026", doseApplied: 6 })],
            desde: "",
            hasta: "",
          }),
        })}
      />,
    );
    expect(screen.getByText("6")).toBeTruthy();
    expect(screen.queryByText(S.emptyPeriodo)).toBeNull();
  });

  it("submit del form dispara onSubmit", () => {
    const onSubmit = vi.fn();
    const { container } = render(<RegistroDiarioScreen {...baseProps({ onSubmit })} />);
    fireEvent.submit(container.querySelector("form")!);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("isCreating muestra 'Guardando...'", () => {
    render(<RegistroDiarioScreen {...baseProps({ isCreating: true })} />);
    expect(screen.getByText(S.guardando)).toBeTruthy();
  });
});
