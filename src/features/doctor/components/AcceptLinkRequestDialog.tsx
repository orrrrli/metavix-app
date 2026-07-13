'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle, Check, RefreshCw } from 'lucide-react';
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
import { acceptRequestSchema, MRN_REGEX, type AcceptRequestFormValues } from '../utils/accept-request-schema';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
}

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
  /**
   * Refetches the suggested MRN from the backend. Wired to the "Generar
   * otro" action so the doctor gets a fresh timestamp-derived value without
   * manually clearing the input.
   */
  onRegenerateMrn?: () => void;
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
  onRegenerateMrn,
}: AcceptLinkRequestDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<AcceptRequestFormValues>({
    // Zod 4's resolver infers `input: unknown` when chaining string regex;
    // the runtime is correct (covered by tests) and the form works with
    // strings as input. Cast mirrors CustomGoalForm.
    resolver: zodResolver(acceptRequestSchema) as unknown as Resolver<AcceptRequestFormValues>,
    defaultValues: { medicalRecordNumber: suggestedMrn },
    mode: 'onChange',
  });

  const mrnValue = watch('medicalRecordNumber');
  const mrnIsValidFormat = !!mrnValue && MRN_REGEX.test(mrnValue);

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
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
              style={{ backgroundColor: '#e7f6ee', color: '#1f9d6b' }}
              aria-hidden="true"
            >
              {getInitials(patientName)}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nueva solicitud
              </span>
              <DialogTitle>Aceptar solicitud de {patientName}</DialogTitle>
            </div>
          </div>
          <DialogDescription>
            Asigna o confirma el número de historia clínica (MRN) para este paciente.
            El sistema sugiere el siguiente valor disponible; puedes editarlo si lo necesitas.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleValid, handleInvalid)}
          noValidate
          className="space-y-6"
          aria-label="Formulario de asignación de MRN"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="medicalRecordNumber" className="text-base font-semibold">
                Número de historia clínica
              </Label>
              {onRegenerateMrn && (
                <button
                  type="button"
                  onClick={onRegenerateMrn}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="size-3.5" />
                  Generar otro
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="medicalRecordNumber"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="MRN-AAAAMMDD-HHMMSSmmm"
                aria-invalid={!!errors.medicalRecordNumber}
                aria-describedby={errors.medicalRecordNumber ? 'mrn-error' : 'mrn-hint'}
                className="h-11 bg-[#faf7f1] font-mono text-base font-semibold pr-9 dark:bg-input/30 aria-invalid:border-[#dd5236] aria-invalid:ring-[#dd5236]/20"
                {...register('medicalRecordNumber')}
              />
              {mrnIsValidFormat && (
                <Check
                  className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#1f9d6b]"
                  aria-hidden="true"
                />
              )}
            </div>
            {errors.medicalRecordNumber ? (
              <p id="mrn-error" role="alert" className="text-sm" style={{ color: '#dd5236' }}>
                {errors.medicalRecordNumber.message}
              </p>
            ) : (
              <p id="mrn-hint" className="text-sm leading-relaxed text-muted-foreground">
                Formato: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">MRN-AAAAMMDD-HHMMSSmmm</code>{' '}
                (ej. <code className="rounded bg-muted px-1.5 py-0.5 font-mono">MRN-20260711-153045123</code>)
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !isValid}
              className="hover:bg-primary/90"
            >
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
