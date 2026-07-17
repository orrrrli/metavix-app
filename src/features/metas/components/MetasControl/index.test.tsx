import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "@/test-utils/render-with-query";
import { server } from "@/test-utils/msw-server";
import { useAuthStore } from "@/features/auth/store";
import { MetasControl } from "./index";
import { metasStrings } from "../../strings/es";
import {
  makeEvalResponse,
  metasHandlers,
  patientId,
} from "../../__fixtures__";
import { http, HttpResponse } from "msw";

// El toast vive en el wrapper (catch de handleEvaluar); lo espiamos.
const toastError = vi.fn();
vi.mock("sonner", () => ({
  toast: { error: (...args: unknown[]) => toastError(...args) },
}));

// happy-dom no implementa scrollIntoView; el wrapper lo llama tras evaluar.
const scrollIntoView = vi.fn();

beforeEach(() => {
  useAuthStore.setState({ patientId });
  Element.prototype.scrollIntoView = scrollIntoView;
});

afterEach(() => {
  cleanup();
  useAuthStore.setState({ patientId: null });
  toastError.mockClear();
  scrollIntoView.mockClear();
});

describe("MetasControl (integración del wrapper)", () => {
  it("el resumen no está visible hasta que se evalúa", async () => {
    server.use(...metasHandlers());
    renderWithQuery(<MetasControl />);

    await screen.findByRole("button", { name: metasStrings.evaluateButton });
    expect(screen.queryByText(/en meta · /i)).toBeNull();
  });

  it("click en Evaluar muestra la pantalla de progreso y luego el resumen", async () => {
    server.use(
      ...metasHandlers({
        evalResponse: makeEvalResponse({
          items: [{ parameterId: "hba1c", status: "InRange", valueUsed: 6.3 }],
        }),
      }),
    );
    renderWithQuery(<MetasControl />);

    const btn = await screen.findByRole("button", {
      name: metasStrings.evaluateButton,
    });
    await userEvent.click(btn);

    expect(screen.getByText(metasStrings.evaluatingMetas.title)).toBeTruthy();

    await waitFor(
      () => expect(screen.getByText(/en meta · /i)).toBeTruthy(),
      { timeout: 7000 },
    );
    // El nombre del parámetro aparece en el detalle de evaluación.
    expect(screen.getAllByText(/HbA1c/i).length).toBeGreaterThan(0);
  }, 10000);

  it("hace scroll al bloque de resumen tras evaluar", async () => {
    server.use(...metasHandlers());
    renderWithQuery(<MetasControl />);

    const btn = await screen.findByRole("button", {
      name: metasStrings.evaluateButton,
    });
    await userEvent.click(btn);

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled(), {
      timeout: 7000,
    });
  }, 10000);

  it("un error en la evaluación dispara el toast y no muestra resumen", async () => {
    // El override del POST va primero: MSW usa el primer handler que matchea.
    server.use(
      http.post(
        `http://localhost/api/v1/patient/${patientId}/goal-evaluations`,
        () => new HttpResponse(null, { status: 500 }),
      ),
      ...metasHandlers(),
    );
    renderWithQuery(<MetasControl />);

    const btn = await screen.findByRole("button", {
      name: metasStrings.evaluateButton,
    });
    await userEvent.click(btn);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(metasStrings.evaluateError),
    );
    expect(screen.queryByText(/en meta · /i)).toBeNull();
  });
});
