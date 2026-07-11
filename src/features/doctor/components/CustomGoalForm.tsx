'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  customGoalFormSchema,
  valuesToApiPayload,
  goalToFormValues,
} from '../utils/clinical-goal-schema';
import type { ClinicalGoal, ClinicalGoalPayload, CustomGoalFormValues } from '@/types/clinical-goal';

interface CustomGoalFormProps {
  /** Meta personalizada existente para este parámetro. `null` si nunca se
   *  ha creado — el form hace POST en lugar de PUT al guardar. */
  existing: ClinicalGoal | null;
  /** Unidad del parámetro (ej. "mg/dL", "%", "mmHg") — se muestra como
   *  pista en cada input. */
  unit: string;
  /** Paso del input (ej. "0.1" para HbA1c, "1" para mg/dL) — viene de
   *  `PARAMETROS_META[i].step`. */
  step: string;
  /** `true` mientras la mutación create/update está en vuelo. */
  isSaving: boolean;
  /** Llamado cuando el form pasa la validación. Recibe el payload
   *  normalizado listo para enviar al backend. */
  onSubmit: (payload: ClinicalGoalPayload) => void;
  /** Llamado cuando el usuario cancela la edición — útil para replegar
   *  el form sin guardar. */
  onCancel?: () => void;
}

const FIELD_LABELS: Record<keyof CustomGoalFormValues, string> = {
  customOutOfRangeLow: 'Fuera de meta — bajo',
  customAtRiskLow: 'Revisar — bajo',
  customAtRiskHigh: 'Revisar — alto',
  customOutOfRangeHigh: 'Fuera de meta — alto',
};

const FIELD_HINTS: Record<keyof CustomGoalFormValues, string> = {
  customOutOfRangeLow: 'Límite por debajo del cual el valor se considera fuera de meta',
  customAtRiskLow: 'Límite por debajo del cual el valor entra en la zona de revisión',
  customAtRiskHigh: 'Límite por arriba del cual el valor entra en la zona de revisión',
  customOutOfRangeHigh: 'Límite por arriba del cual el valor se considera fuera de meta',
};

/**
 * Form RHF + Zod para editar la meta clínica personalizada de un parámetro.
 * Cuatro inputs numéricos opcionales; vacío = "usar default del catálogo".
 *
 * El form es controlado: las props `existing` y `isSaving` mandan. Si el
 * padre pasa un `existing` distinto (ej. tras una mutación exitosa),
 * `useEffect` resetea los valores para que el form refleje la fuente de
 * verdad (el resultado de la API).
 */
export function CustomGoalForm({
  existing,
  unit,
  step,
  isSaving,
  onSubmit,
  onCancel,
}: CustomGoalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomGoalFormValues>({
    // El tipo del resolver de Zod 4 infiere `input: unknown` cuando hay
    // `coerce.number()` en la cadena; el runtime es correcto (los tests
    // lo cubren) y el form trabaja con strings como entrada. Cast seguro.
    resolver: zodResolver(customGoalFormSchema) as unknown as Resolver<CustomGoalFormValues>,
    defaultValues: goalToFormValues(existing),
  });

  // Si cambia `existing` (ej. tras guardar) o se desmonta/reabre, sincronizamos.
  useEffect(() => {
    reset(goalToFormValues(existing));
  }, [existing, reset]);

  const handleValid = (values: CustomGoalFormValues) => {
    const payload = valuesToApiPayload(values);
    onSubmit(payload);
  };

  const handleInvalid = () => {
    toast.error('Revisa los umbrales: deben ser coherentes y al menos uno debe estar definido.');
  };

  return (
    <form
      onSubmit={handleSubmit(handleValid, handleInvalid)}
      noValidate
      className="space-y-4"
      aria-label="Formulario de meta clínica personalizada"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(FIELD_LABELS) as (keyof CustomGoalFormValues)[]).map((field) => {
          const err = errors[field]?.message;
          return (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={field} className="text-sm font-medium">
                {FIELD_LABELS[field]}
              </Label>
              <div className="relative">
                <Input
                  id={field}
                  type="number"
                  inputMode="decimal"
                  step={step}
                  min="0"
                  placeholder="—"
                  aria-invalid={!!err}
                  aria-describedby={err ? `${field}-error` : `${field}-hint`}
                  className="pr-12"
                  {...register(field)}
                />
                {unit && (
                  <span
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground"
                    aria-hidden="true"
                  >
                    {unit}
                  </span>
                )}
              </div>
              {err ? (
                <p id={`${field}-error`} role="alert" className="text-xs text-destructive">
                  {err}
                </p>
              ) : (
                <p id={`${field}-hint`} className="text-xs text-muted-foreground">
                  {FIELD_HINTS[field]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Button type="submit" disabled={isSaving || !isDirty} className="min-w-[10rem]">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {existing ? 'Actualizar meta' : 'Guardar meta'}
            </>
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
        )}
        {existing && (
          <p className="text-xs text-muted-foreground ml-auto">
            Creada el {new Date(existing.createdAt).toLocaleDateString('es-MX')}
          </p>
        )}
      </div>
    </form>
  );
}
