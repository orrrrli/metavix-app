"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useAuthStore } from "@/features/auth/store";
import {
  usePatientProfile,
  useUpdatePatientProfile,
} from "@/features/patient/hooks/use-patient-profile";
import { parseApiDate } from "@/features/patient/utils/parse-api-date";
import type { PatientProfileResponse } from "@/types/patient-profile";
import {
  profileSchema,
  type ProfileFormData,
} from "../view-data/profile-form-schema";
import {
  buildProfileViewData,
  type ProfileViewData,
} from "../view-data/build-profile-view-data";
import { parseFormDataToPayload } from "../view-data/parse-form-data-to-payload";

/** Callbacks de resultado; el Control los usa para disparar toasts. */
export interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * "dd/MM/yyyy" | ISO → "yyyy-MM-dd" para un input type="date". '' si no parsea,
 * para que el input quede vacío en vez de mostrar un valor roto.
 */
function toInputDate(value: string | null | undefined): string {
  const d = parseApiDate(value ?? null);
  return d ? format(d, "yyyy-MM-dd") : "";
}

/**
 * Domain hook del perfil del paciente: encapsula el fetch (read), la mutación
 * (write), el formulario RHF+Zod y todos los handlers. El Control sólo consume
 * esto y añade los side-effects de UI (toasts, dismiss del banner).
 */
export function usePatientProfileForm() {
  const { patientId } = useAuthStore();
  const [editing, setEditing] = useState(false);

  const { data: profile, isLoading, isError } = usePatientProfile(patientId ?? "");
  const { mutate: updateProfile, isPending } = useUpdatePatientProfile(
    patientId ?? "",
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  const isPregnantValue = useWatch({ control, name: "isPregnant" }) ?? false;

  const viewData: ProfileViewData | null = profile
    ? buildProfileViewData(profile)
    : null;

  const handleEdit = (): void => {
    reset({
      heightCm: profile?.heightCm?.toString() ?? "",
      phone: profile?.phone ?? "",
      isPregnant: profile?.isPregnant ?? false,
      pregnancyStartDate: toInputDate(profile?.pregnancyStartDate),
      pregnancyDueDate: toInputDate(profile?.pregnancyDueDate),
    });
    setEditing(true);
  };

  const handleCancel = (): void => {
    setEditing(false);
    reset();
  };

  /** Envía el formulario. `cb` lo provee el Control para los toasts. */
  const submit = (cb: MutationCallbacks = {}) =>
    handleSubmit((data: ProfileFormData) => {
      updateProfile(parseFormDataToPayload(data), {
        onSuccess: () => {
          setEditing(false);
          cb.onSuccess?.();
        },
        onError: () => cb.onError?.(),
      });
    });

  /** Desactiva el embarazo desde el banner. `cb` para los toasts del Control. */
  const deactivatePregnancy = (cb: MutationCallbacks = {}) =>
    updateProfile(
      { isPregnant: false },
      { onSuccess: () => cb.onSuccess?.(), onError: () => cb.onError?.() },
    );

  return {
    profile: profile ?? null,
    viewData,
    isLoading,
    isError,
    isPending,
    editing,
    isPregnantValue,
    form: { register, setValue, errors },
    handleEdit,
    handleCancel,
    submit,
    deactivatePregnancy,
  };
}

export type UsePatientProfileFormResult = ReturnType<typeof usePatientProfileForm>;
