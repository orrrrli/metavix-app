"use client";

import { toast } from "sonner";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useDoctorProfileForm } from "../../hooks/use-doctor-profile-form";
import { doctorPerfilStrings as S } from "../../strings/es";
import { DoctorProfileScreen } from "../DoctorProfileScreen";

/** Wrapper del perfil del doctor: cablea el hook + toasts + estados de carga. */
export function DoctorProfileControl() {
  const {
    viewData,
    isLoading,
    isError,
    isPending,
    editing,
    form,
    handleEdit,
    handleCancel,
    submit,
  } = useDoctorProfileForm();

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">{S.loading}</p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !viewData) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive text-center">{S.loadError}</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = submit({
    onSuccess: () => toast.success(S.updateSuccess),
    onError: () => toast.error(S.updateError),
  });

  return (
    <DoctorProfileScreen
      viewData={viewData}
      editing={editing}
      isPending={isPending}
      form={form}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
}
