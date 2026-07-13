"use client";

import { useState } from "react";
import {
  useInsulinRecords,
  useCreateInsulinRecord,
  useDeleteInsulinRecord,
} from "@/features/patient/hooks/use-insulin-dm1";
import {
  buildRegistroViewData,
  type RegistroViewData,
} from "../view-data/build-registro-view-data";

export interface RegistroForm {
  fecha: string;
  glucosa_antes: string;
  glucosa_despues: string;
  hc_totales: string;
  dosis_aplicada: string;
  que_comi: string;
  como_me_senti: string;
}

const EMPTY_FORM = (): RegistroForm => ({
  fecha: new Date().toISOString().split("T")[0],
  glucosa_antes: "",
  glucosa_despues: "",
  hc_totales: "",
  dosis_aplicada: "",
  que_comi: "",
  como_me_senti: "",
});

/** Callbacks de resultado; el Control los usa para los toasts. */
export interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * Domain hook de "Registro Diario": carga los registros, mantiene el formulario
 * y los filtros de fecha, y delega el filtrado a `buildRegistroViewData`. Las
 * mutaciones exponen callbacks para que los toasts vivan en el Control.
 */
export function useRegistroDiario(patientId: string) {
  const { data: registros = [] } = useInsulinRecords(patientId);
  const { mutate: createRecord, isPending: isCreating } =
    useCreateInsulinRecord(patientId);
  const { mutate: deleteRecord } = useDeleteInsulinRecord(patientId);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [form, setForm] = useState<RegistroForm>(EMPTY_FORM);

  const viewData: RegistroViewData = buildRegistroViewData({
    registros,
    desde: fechaDesde,
    hasta: fechaHasta,
  });

  const setFormField = (name: keyof RegistroForm, value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const submit = (cb: MutationCallbacks = {}) =>
    createRecord(
      {
        recordDate: form.fecha,
        glucoseBefore: Number(form.glucosa_antes) || null,
        glucoseAfter: Number(form.glucosa_despues) || null,
        totalCarbs: Number(form.hc_totales) || null,
        doseApplied: Number(form.dosis_aplicada) || null,
        mealDescription: form.que_comi || null,
        howIFelt: form.como_me_senti || null,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM());
          cb.onSuccess?.();
        },
        onError: () => cb.onError?.(),
      },
    );

  const remove = (id: string, cb: MutationCallbacks = {}) =>
    deleteRecord(id, {
      onSuccess: () => cb.onSuccess?.(),
      onError: () => cb.onError?.(),
    });

  return {
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
  };
}
