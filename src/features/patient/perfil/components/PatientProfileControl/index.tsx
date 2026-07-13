"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/shared/components/ui/metavix";
import { PregnancyBanner } from "@/features/patient/components/PregnancyBanner";
import { usePatientProfileForm } from "../../hooks/use-patient-profile-form";
import { perfilStrings as S } from "../../strings/es";
import { PatientProfileScreen } from "../PatientProfileScreen";

/**
 * Wrapper del perfil del paciente: cablea el domain hook y añade los
 * side-effects de UI (toasts, dismiss del banner de embarazo). Los estados de
 * carga/error también se resuelven aquí porque son UI, no dato.
 */
export function PatientProfileControl() {
  const {
    profile,
    viewData,
    isLoading,
    isError,
    isPending,
    editing,
    isPregnantValue,
    form,
    handleEdit,
    handleCancel,
    submit,
    deactivatePregnancy,
  } = usePatientProfileForm();

  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent>
          <p className="text-sm text-center" style={{ color: "var(--mut)" }}>
            {S.loading}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile || !viewData) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent>
          <p className="text-sm text-center" style={{ color: "var(--bad)" }}>
            {S.loadError}
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = submit({
    onSuccess: () => toast.success(S.updateSuccess),
    onError: () => toast.error(S.updateError),
  });

  const banner = !bannerDismissed ? (
    <PregnancyBanner
      isPregnant={profile.isPregnant}
      pregnancyDueDate={profile.pregnancyDueDate}
      isConfirming={isPending}
      onConfirmDeactivation={() =>
        deactivatePregnancy({
          onSuccess: () => toast.success(S.pregnancyDeactivated),
          onError: () => toast.error(S.pregnancyDeactivateError),
        })
      }
      onDismiss={() => setBannerDismissed(true)}
    />
  ) : null;

  return (
    <PatientProfileScreen
      viewData={viewData}
      editing={editing}
      isPregnantValue={isPregnantValue}
      isPending={isPending}
      form={form}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      banner={banner}
    />
  );
}
