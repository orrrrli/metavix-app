import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { CalcularDosisScreen } from "./CalcularDosisScreen";
import { calcularDosisStrings as S } from "../strings/es";
import type { CalcularDosisFields } from "../hooks/use-calcular-dosis";

afterEach(cleanup);

const emptyFields: CalcularDosisFields = { hc: "", glucosa: "", meta: "", ric: "", fs: "" };

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    fields: emptyFields,
    setField: () => {},
    resultado: null,
    onCalcular: () => {},
    ...overrides,
  };
}

describe("CalcularDosisScreen", () => {
  it("sin resultado muestra el estado vacío", () => {
    render(<CalcularDosisScreen {...baseProps()} />);
    expect(screen.getByText(S.emptyTitle)).toBeTruthy();
  });

  it("submit dispara onCalcular", () => {
    const onCalcular = vi.fn();
    const { container } = render(
      <CalcularDosisScreen {...baseProps({ onCalcular })} />,
    );
    // happy-dom no implementa el submit implícito por click del botón; se
    // dispara el evento submit del form directamente (el botón es type=submit).
    fireEvent.submit(container.querySelector("form")!);
    expect(onCalcular).toHaveBeenCalledOnce();
  });

  it("muestra la dosis total y el desglose cuando hay resultado", () => {
    render(
      <CalcularDosisScreen
        {...baseProps({
          fields: { ...emptyFields, hc: "50", ric: "10" },
          resultado: {
            dosisComida: 5,
            dosisCorreccion: 1.8,
            total: 7,
            alerta: { variant: "warning", msg: "ALTA: ..." },
          },
        })}
      />,
    );
    expect(screen.getByText(S.dosisTotalLabel)).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText(S.desgloseTitle)).toBeTruthy();
  });

  it("hipoglucemia (total 0) muestra la alerta pero no la tarjeta de dosis", () => {
    render(
      <CalcularDosisScreen
        {...baseProps({
          resultado: {
            dosisComida: 0,
            dosisCorreccion: 0,
            total: 0,
            alerta: { variant: "danger", msg: "HIPOGLUCEMIA: ..." },
          },
        })}
      />,
    );
    expect(screen.getByText(/HIPOGLUCEMIA/)).toBeTruthy();
    expect(screen.queryByText(S.dosisTotalLabel)).toBeNull();
  });
});
