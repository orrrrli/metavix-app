"use client";

import { toast } from "sonner";
import {
  useAcceptLinkRequest,
  useMrnSuggestion,
} from "@/features/doctor/hooks/use-doctor";
import { AcceptLinkRequestDialog } from "../../../components/AcceptLinkRequestDialog";

export interface PendingAccept {
  requestId: string;
  patientName: string;
}

export interface AcceptLinkRequestControlProps {
  doctorId: string;
  /** Solicitud en proceso de aceptación, o `null` con el diálogo cerrado. */
  pendingAccept: PendingAccept | null;
  /** Cierra el diálogo (el padre pone `pendingAccept` en null). */
  onClose: () => void;
}

/**
 * Wrapper del diálogo de aceptar solicitud: orquesta la mutación de accept, la
 * sugerencia de MRN (lazy, sólo con el diálogo abierto) y los toasts. El
 * diálogo (`AcceptLinkRequestDialog`) ya es UI pura y recibe todo por props.
 * El padre sólo decide *cuándo* abrir (setPendingAccept) porque el disparador
 * vive en la lista de solicitudes.
 */
export function AcceptLinkRequestControl({
  doctorId,
  pendingAccept,
  onClose,
}: AcceptLinkRequestControlProps) {
  const { mutate: accept, isPending: accepting } = useAcceptLinkRequest(doctorId);

  // Sólo pedir la sugerencia de MRN mientras el diálogo está abierto.
  const { data: suggestedMrn = "", refetch: refetchMrnSuggestion } = useMrnSuggestion(
    pendingAccept ? new Date().getFullYear() : undefined,
  );

  const handleConfirm = (mrn: string): void => {
    if (!pendingAccept) return;
    const { requestId, patientName } = pendingAccept;
    accept(
      { requestId, medicalRecordNumber: mrn },
      {
        onSuccess: () => {
          toast.success(`Solicitud de ${patientName} aceptada`);
          onClose();
        },
        onError: () => {
          toast.error(
            "No se pudo aceptar la solicitud. Verifica el MRN e inténtalo de nuevo.",
          );
        },
      },
    );
  };

  return (
    <AcceptLinkRequestDialog
      open={pendingAccept !== null}
      patientName={pendingAccept?.patientName ?? ""}
      suggestedMrn={suggestedMrn}
      isSubmitting={accepting}
      onConfirm={handleConfirm}
      onClose={onClose}
      onRegenerateMrn={() => refetchMrnSuggestion()}
    />
  );
}
