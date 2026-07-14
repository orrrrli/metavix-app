import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { DoctorProfileScreen } from "./DoctorProfileScreen";
import { buildDoctorProfileViewData } from "../view-data/build-doctor-profile-view-data";
import { doctorPerfilStrings as S } from "../strings/es";
import { makeDoctorProfile } from "@/features/doctor/__fixtures__/make-doctor-profile";

afterEach(cleanup);

const noopForm = { register: (() => ({})) as never, errors: {} };

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    viewData: buildDoctorProfileViewData(makeDoctorProfile()),
    editing: false,
    isPending: false,
    form: noopForm,
    onEdit: () => {},
    onCancel: () => {},
    onSubmit: () => {},
    ...overrides,
  };
}

describe("DoctorProfileScreen", () => {
  it("modo lectura: iniciales, nombre y badge de verificación", () => {
    render(
      <DoctorProfileScreen
        {...baseProps({
          viewData: buildDoctorProfileViewData(
            makeDoctorProfile({ firstName: "Carlos", lastName: "Ramírez", isVerified: true }),
          ),
        })}
      />,
    );
    expect(screen.getByText("CR")).toBeTruthy();
    expect(screen.getByText("Carlos Ramírez")).toBeTruthy();
    expect(screen.getByText(S.verified)).toBeTruthy();
  });

  it("no verificado muestra 'Pendiente SEP'", () => {
    render(
      <DoctorProfileScreen
        {...baseProps({
          viewData: buildDoctorProfileViewData(makeDoctorProfile({ isVerified: false })),
        })}
      />,
    );
    expect(screen.getByText(S.pendingSep)).toBeTruthy();
  });

  it("botón Editar dispara onEdit", () => {
    const onEdit = vi.fn();
    render(<DoctorProfileScreen {...baseProps({ onEdit })} />);
    fireEvent.click(screen.getByText(S.edit));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("modo edición muestra el form con Guardar", () => {
    render(<DoctorProfileScreen {...baseProps({ editing: true })} />);
    expect(screen.getByText(S.save)).toBeTruthy();
    expect(screen.getByText(S.cancel)).toBeTruthy();
  });

  it("cédula vacía muestra el placeholder 'No registrada'", () => {
    render(
      <DoctorProfileScreen
        {...baseProps({
          viewData: buildDoctorProfileViewData(makeDoctorProfile({ licenseNumber: "" })),
        })}
      />,
    );
    expect(screen.getAllByText(S.notRegistered).length).toBeGreaterThan(0);
  });
});
