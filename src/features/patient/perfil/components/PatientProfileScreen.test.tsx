import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { PatientProfileScreen } from "./PatientProfileScreen";
import { buildProfileViewData } from "../view-data/build-profile-view-data";
import { perfilStrings as S } from "../strings/es";
import { makeProfile } from "@/features/patient/__fixtures__";

afterEach(cleanup);

const noopForm = {
  register: (() => ({})) as never,
  setValue: () => {},
  errors: {},
};

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    viewData: buildProfileViewData(makeProfile()),
    editing: false,
    isPregnantValue: false,
    isPending: false,
    form: noopForm,
    onEdit: () => {},
    onCancel: () => {},
    onSubmit: () => {},
    ...overrides,
  };
}

describe("PatientProfileScreen", () => {
  it("modo lectura: muestra iniciales, nombre, dob y badge de diabetes", () => {
    render(
      <PatientProfileScreen
        {...baseProps({
          viewData: buildProfileViewData(
            makeProfile({
              firstName: "Ana",
              lastName: "López",
              dateOfBirth: "01/01/1990",
              diabetesType: "Type2",
            }),
          ),
        })}
      />,
    );
    expect(screen.getByText("AL")).toBeTruthy();
    expect(screen.getByText("Ana López")).toBeTruthy();
    expect(screen.getByText("1 de enero, 1990")).toBeTruthy();
    expect(screen.getAllByText("Diabetes tipo 2").length).toBeGreaterThan(0);
  });

  it("botón Editar dispara onEdit", () => {
    const onEdit = vi.fn();
    render(<PatientProfileScreen {...baseProps({ onEdit })} />);
    fireEvent.click(screen.getByText(S.edit));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("modo edición: muestra el form con botón Guardar", () => {
    render(<PatientProfileScreen {...baseProps({ editing: true })} />);
    expect(screen.getByText(S.save)).toBeTruthy();
    expect(screen.getByText(S.cancel)).toBeTruthy();
  });

  it("modo edición con isPending: el botón muestra 'Guardando...'", () => {
    render(
      <PatientProfileScreen {...baseProps({ editing: true, isPending: true })} />,
    );
    expect(screen.getByText(S.saving)).toBeTruthy();
  });

  it("embarazada: muestra fechas de embarazo en modo lectura", () => {
    render(
      <PatientProfileScreen
        {...baseProps({
          viewData: buildProfileViewData(
            makeProfile({
              isPregnant: true,
              pregnancyStartDate: "01/02/2026",
              pregnancyDueDate: "01/11/2026",
            }),
          ),
        })}
      />,
    );
    expect(screen.getByText(S.pregnancyStart)).toBeTruthy();
    expect(screen.getByText("1 de febrero, 2026")).toBeTruthy();
  });

  it("renderiza el banner cuando se le pasa", () => {
    render(
      <PatientProfileScreen
        {...baseProps({ banner: <div>banner-de-prueba</div> })}
      />,
    );
    expect(screen.getByText("banner-de-prueba")).toBeTruthy();
  });
});
