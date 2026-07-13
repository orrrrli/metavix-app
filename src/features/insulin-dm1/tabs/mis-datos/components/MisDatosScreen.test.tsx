import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MisDatosScreen } from "./MisDatosScreen";
import { misDatosStrings as S } from "../strings/es";
import type { MisDatosForm } from "../hooks/use-mis-datos";

afterEach(cleanup);

const emptyForm: MisDatosForm = {
  nombre_insulina: "",
  ric: "",
  factor_sensibilidad: "",
  glucosa_meta: "",
  nombre_medico: "",
  telefono_medico: "",
};

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    perfil: null,
    form: emptyForm,
    setField: () => {},
    isPending: false,
    onSubmit: () => {},
    ...overrides,
  };
}

describe("MisDatosScreen", () => {
  it("renderiza el formulario de perfil médico", () => {
    render(<MisDatosScreen {...baseProps()} />);
    expect(screen.getByText(S.title)).toBeTruthy();
    expect(screen.getByText(S.insulina)).toBeTruthy();
    expect(screen.getByText(S.guardar)).toBeTruthy();
  });

  it("submit del form dispara onSubmit", () => {
    const onSubmit = vi.fn();
    const { container } = render(<MisDatosScreen {...baseProps({ onSubmit })} />);
    fireEvent.submit(container.querySelector("form")!);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("isPending muestra 'Guardando...'", () => {
    render(<MisDatosScreen {...baseProps({ isPending: true })} />);
    expect(screen.getByText(S.guardando)).toBeTruthy();
  });
});
