"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMyDoctorProfile,
  useUpdateDoctorProfile,
} from "@/features/doctor/hooks/use-doctor";
import {
  doctorProfileSchema,
  type DoctorProfileFormData,
  buildDoctorProfileViewData,
  type DoctorProfileViewData,
} from "../view-data/build-doctor-profile-view-data";

export interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * Domain hook del perfil del doctor: fetch (read) + mutación (write) + form
 * RHF+Zod + handlers. Espejo de `usePatientProfileForm`. `submit` recibe
 * callbacks para que los toasts vivan en el Control.
 */
export function useDoctorProfileForm() {
  const [editing, setEditing] = useState(false);

  const { data: profile, isLoading, isError } = useMyDoctorProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateDoctorProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorProfileFormData>({ resolver: zodResolver(doctorProfileSchema) });

  const viewData: DoctorProfileViewData | null = profile
    ? buildDoctorProfileViewData(profile)
    : null;

  const handleEdit = (): void => {
    reset({
      licenseNumber: profile?.licenseNumber ?? "",
      speciality: profile?.speciality ?? "",
    });
    setEditing(true);
  };

  const handleCancel = (): void => {
    setEditing(false);
    reset();
  };

  const submit = (cb: MutationCallbacks = {}) =>
    handleSubmit(async (data: DoctorProfileFormData) => {
      try {
        await updateProfile(data);
        setEditing(false);
        cb.onSuccess?.();
      } catch {
        cb.onError?.();
      }
    });

  return {
    profile: profile ?? null,
    viewData,
    isLoading,
    isError,
    isPending,
    editing,
    form: { register, errors },
    handleEdit,
    handleCancel,
    submit,
  };
}
