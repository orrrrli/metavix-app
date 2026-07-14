import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { ClinicalGoalsEditorScreen } from "./ClinicalGoalsEditorScreen";
import { buildClinicalGoalsViewData } from "../view-data/build-clinical-goals-view-data";
import { clinicalGoalsStrings as S } from "../strings/es";
import { makeClinicalGoal } from "@/features/doctor/__fixtures__/make-clinical-goal";

afterEach(cleanup);

function baseProps(overrides: Record<string, unknown> = {}) {
  return {
    viewData: buildClinicalGoalsViewData([]),
    isLoading: false,
    isSaving: false,
    isPregnant: false,
    openParamId: null,
    onToggleParam: () => {},
    onCancel: () => {},
    onSave: () => {},
    ...overrides,
  };
}

describe("ClinicalGoalsEditorScreen", () => {
  it("muestra el loader mientras carga", () => {
    render(<ClinicalGoalsEditorScreen {...baseProps({ isLoading: true })} />);
    expect(screen.getByText(S.loading)).toBeTruthy();
  });

  it("renderiza un card por parámetro con el default del catálogo", () => {
    render(<ClinicalGoalsEditorScreen {...baseProps()} />);
    expect(screen.getByText("HbA1c")).toBeTruthy();
    expect(screen.getAllByText(S.personalizar).length).toBeGreaterThan(0);
  });

  it("muestra badge 'Personalizada' y resumen para metas custom", () => {
    render(
      <ClinicalGoalsEditorScreen
        {...baseProps({
          viewData: buildClinicalGoalsViewData([
            makeClinicalGoal({ parameterId: "hba1c", customOutOfRangeHigh: 6.5 }),
          ]),
        })}
      />,
    );
    expect(screen.getByText(S.personalizadaBadge)).toBeTruthy();
    expect(screen.getByText(/Fuera ≥ 6.5 %/)).toBeTruthy();
  });

  it("toggle de un parámetro dispara onToggleParam", () => {
    const onToggleParam = vi.fn();
    render(<ClinicalGoalsEditorScreen {...baseProps({ onToggleParam })} />);
    fireEvent.click(screen.getAllByText(S.personalizar)[0]);
    expect(onToggleParam).toHaveBeenCalled();
  });

  it("banner de embarazo sólo cuando isPregnant", () => {
    const { rerender } = render(<ClinicalGoalsEditorScreen {...baseProps()} />);
    expect(screen.queryByText(S.pregnancyTitle)).toBeNull();
    rerender(<ClinicalGoalsEditorScreen {...baseProps({ isPregnant: true })} />);
    expect(screen.getByText(S.pregnancyTitle)).toBeTruthy();
  });
});
