"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { GlucoseReadingType } from "@/types/daily-record";
import {
  MealKey, MEAL_TO_TYPE,
  GlucosaLectura, NuevaLectura,
  estadoRango, resumenDia, horaInputToApi, horaActual, sugerirMomento,
  GLUCOSA_MIN, GLUCOSA_MAX, esGlucosaValida,
  type EstadoRango,
  type ResumenDia,
} from "../utils/glucosa";

/**
 * Estado y acciones compartidas por los wizards de registro de glucosa
 * (versión web y móvil). Centraliza el state local, el setHora inicial,
 * la validación clínica y la llamada a onGuardar para que los dos
 * componentes sólo difieran en presentación.
 *
 * Issue #13: antes `RegistroGlucosaWeb.tsx` y `RegistroGlucosaMovil.tsx`
 * duplicaban esta lógica (~80 líneas cada uno). Cualquier bug nuevo (p.ej.
 * el rango 20–800 mg/dL del issue #3) tenía que aplicarse en los dos
 * lugares; ahora vive aquí una sola vez.
 */
export interface UseGlucosaWizardOpts {
  /** Lecturas de hoy — la bitácora del wizard. */
  lecturas: GlucosaLectura[];
  /** Acción al guardar una lectura. */
  onGuardar: (lectura: NuevaLectura) => void | Promise<void>;
  /** Deshabilita el botón mientras se persiste. */
  guardando?: boolean;
  /** Si el paciente tiene diagnóstico de diabetes. */
  hasDiabetes?: boolean;
  /** Si la paciente está embarazada (ajusta metas de ayuno cuando hasDiabetes). */
  isPregnant?: boolean;
}

export interface GlucosaWizard {
  step: number;
  /** Acepta un número o una función updater (`(prev) => next`) para `setStep`. */
  setStep: Dispatch<SetStateAction<number>>;
  valor: string;
  setValor: (s: string) => void;
  meal: MealKey | null;
  setMeal: (m: MealKey | null) => void;
  /** true si el usuario eligió el momento manualmente (vs. autosugerido). */
  mealManual: boolean;
  /** Elige el momento y lo marca como selección manual del usuario. */
  elegirMomento: (m: MealKey) => void;
  hora: string;
  setHora: (s: string) => void;
  foods: string;
  setFoods: (s: string) => void;
  /** Clasificación del valor actual (paso 1). Null si no hay valor. */
  st: EstadoRango;
  /** Totales del día para las tarjetas. */
  resumen: ResumenDia;
  /** true si los inputs son válidos y no se está guardando. */
  puedeGuardar: boolean;
  /** Persiste la lectura y resetea el wizard. */
  guardar: () => Promise<void>;
  /** Mensaje del rango clínico (para mostrar en mensajes de error). */
  RANGO_LABEL: string;
}

export function useGlucosaWizard({
  lecturas,
  onGuardar,
  guardando = false,
  hasDiabetes = false,
  isPregnant = false,
}: UseGlucosaWizardOpts): GlucosaWizard {
  const [step, setStepRaw] = useState(1);
  const [valor, setValor] = useState("");
  const [meal, setMeal] = useState<MealKey | null>(() => sugerirMomento());
  const [mealManual, setMealManual] = useState(false);
  const [hora, setHora] = useState("");

  const elegirMomento = (m: MealKey) => { setMeal(m); setMealManual(true); };
  const [foods, setFoods] = useState("");

  // setHora al montar — un solo lugar, un solo comentario de hidratación.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHora(horaActual()), []);

  const st = useMemo(
    () => estadoRango(valor, { hasDiabetes, isPregnant, readingType: meal ? MEAL_TO_TYPE[meal] : null }),
    [valor, meal, hasDiabetes, isPregnant]
  );
  const resumen = useMemo(
    () => resumenDia(lecturas, hasDiabetes, isPregnant),
    [lecturas, hasDiabetes, isPregnant]
  );

  const numeroActual = parseFloat(valor);
  const valorValido = esGlucosaValida(numeroActual);
  const puedeGuardar = valorValido && !!meal && !guardando;

  const setStep = setStepRaw; // re-exportado con la firma `Dispatch<SetStateAction<number>>`; el JSX usa (s) => s±1.

  const guardar = async () => {
    if (!valorValido || !meal || guardando) return;
    if (!esGlucosaValida(numeroActual)) {
      toast.error(`Valor fuera de rango (${GLUCOSA_MIN}–${GLUCOSA_MAX} mg/dL).`);
      return;
    }
    await onGuardar({
      readingType: MEAL_TO_TYPE[meal],
      valueMgDl: numeroActual,
      time: horaInputToApi(hora),
      foods: foods.trim() || null,
    });
    setStepRaw(1);
    setValor("");
    setMeal(sugerirMomento());
    setMealManual(false);
    setHora(horaActual());
    setFoods("");
  };

  return {
    step, setStep,
    valor, setValor,
    meal, setMeal,
    mealManual, elegirMomento,
    hora, setHora,
    foods, setFoods,
    st,
    resumen,
    puedeGuardar,
    guardar,
    RANGO_LABEL: `${GLUCOSA_MIN}–${GLUCOSA_MAX}`,
  };
}

/** Re-export del enum por conveniencia de los wizards (lectura del `readingType` para pintar en bitácora). */
export { GlucoseReadingType };
