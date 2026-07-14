"use client";

import { useState } from "react";
import {
  useInsulinProfile,
  useUpsertInsulinProfile,
} from "@/features/patient/hooks/use-insulin-dm1";

export interface MisDatosForm {
  nombre_insulina: string;
  ric: string;
  factor_sensibilidad: string;
  glucosa_meta: string;
  nombre_medico: string;
  telefono_medico: string;
}

const EMPTY: MisDatosForm = {
  nombre_insulina: "",
  ric: "",
  factor_sensibilidad: "",
  glucosa_meta: "",
  nombre_medico: "",
  telefono_medico: "",
};

export interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * Domain hook de "Mis Datos": carga el perfil de insulina, mantiene el
 * formulario (pre-poblado en render desde el perfil) y expone el upsert con
 * callbacks para los toasts del Control.
 */
export function useMisDatos(patientId: string) {
  const { data: perfil } = useInsulinProfile(patientId);
  const { mutate: upsertPerfil, isPending } = useUpsertInsulinProfile(patientId);

  const [form, setForm] = useState<MisDatosForm>(EMPTY);

  // Pre-poblar al llegar/cambiar el perfil (render-time state sync, sin effect).
  const [perfilAnterior, setPerfilAnterior] = useState(perfil);
  if (perfil && perfil !== perfilAnterior) {
    setPerfilAnterior(perfil);
    setForm({
      nombre_insulina: perfil.insulinName ?? "",
      ric: perfil.ric?.toString() ?? "",
      factor_sensibilidad: perfil.sensitivityFactor?.toString() ?? "",
      glucosa_meta: perfil.targetGlucose?.toString() ?? "",
      nombre_medico: perfil.doctorName ?? "",
      telefono_medico: perfil.doctorPhone ?? "",
    });
  }

  const setField = (name: keyof MisDatosForm, value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const submit = (cb: MutationCallbacks = {}) =>
    upsertPerfil(
      {
        insulinName: form.nombre_insulina || null,
        ric: Number(form.ric) || null,
        sensitivityFactor: Number(form.factor_sensibilidad) || null,
        targetGlucose: Number(form.glucosa_meta) || null,
        doctorName: form.nombre_medico || null,
        doctorPhone: form.telefono_medico || null,
      },
      {
        onSuccess: () => cb.onSuccess?.(),
        onError: () => cb.onError?.(),
      },
    );

  return { perfil: perfil ?? null, form, setField, isPending, submit };
}
