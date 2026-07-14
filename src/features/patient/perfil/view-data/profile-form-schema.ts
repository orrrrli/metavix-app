import { z } from "zod";

/**
 * Esquema del formulario de datos de salud del perfil. Vive en `view-data/`
 * para que el parser del payload y el domain hook compartan la misma fuente
 * de verdad del tipo.
 */
export const profileSchema = z.object({
  heightCm: z.string().optional(),
  phone: z.string().max(20).optional(),
  isPregnant: z.boolean(),
  pregnancyStartDate: z.string().optional(),
  pregnancyDueDate: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
