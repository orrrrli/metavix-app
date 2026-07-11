import { z } from 'zod';

/**
 * Schema Zod para la solicitud de aceptación de un link request.
 *
 * El campo `medicalRecordNumber` es opcional:
 * - Si el doctor lo deja vacío, el backend asigna el siguiente MRN
 *   disponible (GET /mrn-suggestion sugiere uno para conveniencia).
 * - Si el doctor escribe un valor, debe cumplir `MRN-AAAA-NNNNNN`,
 *   alineado con el validador server en
 *   `Application/UseCases/LinkRequest/Validators/AcceptLinkRequestCommandValidator.cs`.
 *
 * Esta validación es client-side: refleja la regla para feedback inmediato
 * en el input. La unicidad se valida en backend tras el POST.
 */

export const MRN_REGEX = /^MRN-\d{4}-\d{6}$/;

export const acceptRequestSchema = z.object({
  medicalRecordNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || MRN_REGEX.test(v),
      'Formato inválido. Use MRN-AAAA-NNNNNN (ej. MRN-2026-000001)',
    ),
});

export type AcceptRequestFormValues = z.infer<typeof acceptRequestSchema>;
