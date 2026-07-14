import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { renderHookWithQuery } from "@/test-utils/render-hook-with-query";
import { server } from "@/test-utils/msw-server";
import { useAuthStore } from "@/features/auth/store";
import { makeProfile } from "@/features/patient/__fixtures__";
import { usePatientProfileForm } from "./use-patient-profile-form";

const patientId = "patient-1";
const base = `http://localhost/api/v1/patient/${patientId}/profile`;

beforeEach(() => useAuthStore.setState({ patientId }));
afterEach(() => useAuthStore.setState({ patientId: null }));

describe("usePatientProfileForm", () => {
  it("carga el perfil y compone el viewData", async () => {
    server.use(
      http.get(base, () =>
        HttpResponse.json({ data: makeProfile({ firstName: "Ana", lastName: "López" }) }),
      ),
    );
    const { result } = renderHookWithQuery(() => usePatientProfileForm());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.viewData?.fullName).toBe("Ana López");
    expect(result.current.viewData?.initials).toBe("AL");
    expect(result.current.editing).toBe(false);
  });

  it("submit envía el payload correcto (omite vacíos) y sale de edición", async () => {
    const patchBody = vi.fn();
    server.use(
      http.get(base, () => HttpResponse.json({ data: makeProfile({ heightCm: 160 }) })),
      http.patch(base, async ({ request }) => {
        patchBody(await request.json());
        return HttpResponse.json({ data: makeProfile({ heightCm: 170 }) });
      }),
    );
    const { result } = renderHookWithQuery(() => usePatientProfileForm());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Entrar en edición pre-puebla el form desde el perfil (heightCm "160").
    act(() => result.current.handleEdit());
    expect(result.current.editing).toBe(true);

    // Modificar la estatura y enviar.
    act(() => result.current.form.setValue("heightCm", "170"));
    await act(async () => {
      await result.current.submit()();
    });

    await waitFor(() => expect(patchBody).toHaveBeenCalled());
    expect(patchBody).toHaveBeenCalledWith({ heightCm: 170, isPregnant: false });
    await waitFor(() => expect(result.current.editing).toBe(false));
  });

  it("submit invoca onError callback cuando la mutación falla", async () => {
    const onError = vi.fn();
    server.use(
      http.get(base, () => HttpResponse.json({ data: makeProfile() })),
      http.patch(base, () => new HttpResponse(null, { status: 500 })),
    );
    const { result } = renderHookWithQuery(() => usePatientProfileForm());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.handleEdit());
    await act(async () => {
      await result.current.submit({ onError })();
    });

    await waitFor(() => expect(onError).toHaveBeenCalledOnce());
  });

  it("deactivatePregnancy envía isPregnant:false", async () => {
    const patchBody = vi.fn();
    server.use(
      http.get(base, () => HttpResponse.json({ data: makeProfile({ isPregnant: true }) })),
      http.patch(base, async ({ request }) => {
        patchBody(await request.json());
        return HttpResponse.json({ data: makeProfile({ isPregnant: false }) });
      }),
    );
    const { result } = renderHookWithQuery(() => usePatientProfileForm());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const onSuccess = vi.fn();
    await act(async () => {
      result.current.deactivatePregnancy({ onSuccess });
    });

    await waitFor(() => expect(patchBody).toHaveBeenCalledWith({ isPregnant: false }));
    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });
});
