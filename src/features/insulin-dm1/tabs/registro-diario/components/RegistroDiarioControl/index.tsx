"use client";

import { toast } from "sonner";
import { useRegistroDiario } from "../../hooks/use-registro-diario";
import { registroDiarioStrings as S } from "../../strings/es";
import { RegistroDiarioScreen } from "../RegistroDiarioScreen";

/** Wrapper de "Registro Diario": cablea el hook y añade toasts + confirm. */
export function RegistroDiarioControl({ patientId }: { patientId: string }) {
  const {
    viewData,
    form,
    setFormField,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    isCreating,
    submit,
    remove,
  } = useRegistroDiario(patientId);

  const handleSubmit = () =>
    submit({
      onSuccess: () => toast.success(S.guardadoOk),
      onError: () => toast.error(S.guardadoError),
    });

  const handleDelete = (id: string) => {
    if (!confirm(S.confirmDelete)) return;
    remove(id, {
      onSuccess: () => toast.success(S.eliminadoOk),
      onError: () => toast.error(S.eliminadoError),
    });
  };

  return (
    <RegistroDiarioScreen
      viewData={viewData}
      form={form}
      setFormField={setFormField}
      fechaDesde={fechaDesde}
      setFechaDesde={setFechaDesde}
      fechaHasta={fechaHasta}
      setFechaHasta={setFechaHasta}
      isCreating={isCreating}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
