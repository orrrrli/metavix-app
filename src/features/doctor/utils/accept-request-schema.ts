import { z } from 'zod';

/**
 * Schema Zod para la solicitud de aceptación de un link request.
 *
 * El doctor es la fuente autoritativa del MRN — recibe un valor sugerido
 * por la UI y puede conservarlo o reemplazarlo por uno propio, siempre
 * que cumpla el formato `MRN-AAAA-NNNNNN` (alineado con el validador
 * server en `Application/UseCases/LinkRequest/Validators/AcceptLinkRequestCommandValidator.cs`).
 *
 * Esta validación es client-side: refleja la regla para feedback inmediato
 * en el input. La unicidad se valida en backend tras el POST.
 */

export const MRN_REGEX = /^MRN-\d{4}-\d{6}$/;

export const acceptRequestSchema = z.object({
  medicalRecordNumber: z
    .string()
    .min(1, 'El número de historia clínica es requerido')
    .regex(MRN_REGEX, 'Formato inválido. Use MRN-AAAA-NNNNNN (ej. MRN-2026-000001)'),
});

export type AcceptRequestFormValues = z.infer<typeof acceptRequestSchema>;
