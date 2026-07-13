"use client";

import { toast } from "sonner";
import { useMisDatos } from "../../hooks/use-mis-datos";
import { misDatosStrings as S } from "../../strings/es";
import { MisDatosScreen } from "../MisDatosScreen";

/** Wrapper de "Mis Datos": cablea el hook y añade los toasts del upsert. */
export function MisDatosControl({ patientId }: { patientId: string }) {
  const { perfil, form, setField, isPending, submit } = useMisDatos(patientId);

  const handleSubmit = () =>
    submit({
      onSuccess: () => toast.success(S.guardadoOk),
      onError: () => toast.error(S.guardadoError),
    });

  return (
    <MisDatosScreen
      perfil={perfil}
      form={form}
      setField={setField}
      isPending={isPending}
      onSubmit={handleSubmit}
    />
  );
}
