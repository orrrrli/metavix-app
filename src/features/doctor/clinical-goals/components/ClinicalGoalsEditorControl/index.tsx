"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useClinicalGoalsEditor } from "../../hooks/use-clinical-goals-editor";
import { clinicalGoalsStrings as S } from "../../strings/es";
import { ClinicalGoalsEditorScreen } from "../ClinicalGoalsEditorScreen";

export interface ClinicalGoalsEditorControlProps {
  doctorId: string;
  patientId: string;
  /** Sólo afecta el copy del banner de embarazo; la edición funciona igual. */
  isPregnant?: boolean;
}

/** Wrapper del editor de metas clínicas: cablea el hook + toasts de save. */
export function ClinicalGoalsEditorControl({
  doctorId,
  patientId,
  isPregnant = false,
}: ClinicalGoalsEditorControlProps) {
  const { viewData, isLoading, isSaving, save } = useClinicalGoalsEditor(
    doctorId,
    patientId,
  );

  // Estado presentacional: qué parámetro está expandido. Vive en el Control.
  const [openParamId, setOpenParamId] = useState<string | null>(null);
  const toggleParam = (paramId: string) =>
    setOpenParamId((cur) => (cur === paramId ? null : paramId));
  const closeParam = () => setOpenParamId(null);

  return (
    <ClinicalGoalsEditorScreen
      viewData={viewData}
      isLoading={isLoading}
      isSaving={isSaving}
      isPregnant={isPregnant}
      openParamId={openParamId}
      onToggleParam={toggleParam}
      onCancel={closeParam}
      onSave={(parameterId, existing, payload) =>
        save(parameterId, existing, payload, {
          onSuccess: (wasUpdate) => {
            toast.success(wasUpdate ? S.saveSuccessUpdate : S.saveSuccessCreate);
            closeParam();
          },
          onError: () => toast.error(S.saveError),
        })
      }
    />
  );
}
