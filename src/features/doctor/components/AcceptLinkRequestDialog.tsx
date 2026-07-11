'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { acceptRequestSchema, type AcceptRequestFormValues } from '../utils/accept-request-schema';

interface AcceptLinkRequestDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Patient display name (e.g. "Juan Pérez") — shown in the title. */
  patientName: string;
  /**
   * Suggested MRN, pre-filled in the input. The doctor may keep or replace
   * it. Re-applied every time the dialog opens so a new accept always
   * re-suggests a fresh value.
   */
  suggestedMrn: string;
  /** `true` while the parent mutation is in flight — disables confirm. */
  isSubmitting: boolean;
  /** Called with the validated MRN when the doctor confirms. */
  onConfirm: (medicalRecordNumber: string) => void;
  /** Called when the dialog is closed (cancel / X / backdrop). */
  onClose: () => void;
}

/**
 * Dialog RHF + Zod que pide al doctor confirmar (o reemplazar) el MRN
 * sugerido antes de aceptar una solicitud de vinculación. El único input
 * es el MRN — el resto del flujo (POST al backend, toasts, invalidación
 * de queries) lo maneja el padre.
 */
export function AcceptLinkRequestDialog({
  open,
  patientName,
  suggestedMrn,
  isSubmitting,
  onConfirm,
  onClose,
}: AcceptLinkRequestDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AcceptRequestFormValues>({
    // Zod 4's resolver infers `input: unknown` when chaining string regex;
    // the runtime is correct (covered by tests) and the form works with
    // strings as input. Cast mirrors CustomGoalForm.
    resolver: zodResolver(acceptRequestSchema) as unknown as Resolver<AcceptRequestFormValues>,
    defaultValues: { medicalRecordNumber: suggestedMrn },
    mode: 'onChange',
  });

  // Cada vez que el dialog se abre, resetea al valor sugerido actual.
  // Sin esto, abrir → cancelar → abrir dejaría el valor editado anterior.
  useEffect(() => {
    if (open) {
      reset({ medicalRecordNumber: suggestedMrn });
    }
  }, [open, suggestedMrn, reset]);

  const handleValid = (values: AcceptRequestFormValues) => {
    // Pass through undefined when the doctor clears the field — the parent
    // sends null to the backend, which triggers auto-assignment.
    const mrn = values.medicalRecordNumber?.trim();
    onConfirm(mrn && mrn.length > 0 ? mrn : "");
  };

  const handleInvalid = () => {
    // Zod ya pinta el error bajo el input; no hace falta toast aquí.
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aceptar solicitud de {patientName}</DialogTitle>
          <DialogDescription>
            Asigna o confirma el número de historia clínica (MRN) para este paciente.
            El sistema sugiere el siguiente valor disponible; puedes editarlo si lo necesitas.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleValid, handleInvalid)}
          noValidate
          className="space-y-3"
          aria-label="Formulario de asignación de MRN"
        >
          <div className="space-y-1.5">
            <Label htmlFor="medicalRecordNumber" className="text-sm font-medium">
              Número de historia clínica
            </Label>
            <Input
              id="medicalRecordNumber"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="MRN-AAAA-NNNNNN"
              aria-invalid={!!errors.medicalRecordNumber}
              aria-describedby={errors.medicalRecordNumber ? 'mrn-error' : 'mrn-hint'}
              className="font-mono"
              {...register('medicalRecordNumber')}
            />
            {errors.medicalRecordNumber ? (
              <p id="mrn-error" role="alert" className="text-xs text-destructive">
                {errors.medicalRecordNumber.message}
              </p>
            ) : (
              <p id="mrn-hint" className="text-xs text-muted-foreground">
                Formato: <span className="font-mono">MRN-AAAA-NNNNNN</span> (ej. MRN-2026-000001)
              </p>
            )}
          </div>

          <DialogFooter className="-mx-4 -mb-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aceptando…
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aceptar y asignar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
