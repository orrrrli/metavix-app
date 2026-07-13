import type { UpdatePatientProfileRequest } from "@/types/patient-profile";
import type { ProfileFormData } from "./profile-form-schema";

/**
 * Convierte los datos del formulario RHF en el payload que espera la API.
 *
 * Regla clave (previene el bug "campo vacío se manda como null/0"): los campos
 * de texto vacíos o `undefined` se OMITEN del payload — no se envían. Sólo
 * `isPregnant` se envía siempre (es un booleano explícito del switch).
 * `heightCm` se castea a número; las fechas ya vienen como "yyyy-MM-dd" del
 * input type="date", formato que la API acepta.
 */
export function parseFormDataToPayload(
  data: ProfileFormData,
): UpdatePatientProfileRequest {
  return {
    ...(data.heightCm !== "" &&
      data.heightCm !== undefined && { heightCm: Number(data.heightCm) }),
    ...(data.phone !== "" && data.phone !== undefined && { phone: data.phone }),
    isPregnant: data.isPregnant,
    ...(data.pregnancyStartDate !== "" &&
      data.pregnancyStartDate !== undefined && {
        pregnancyStartDate: data.pregnancyStartDate,
      }),
    ...(data.pregnancyDueDate !== "" &&
      data.pregnancyDueDate !== undefined && {
        pregnancyDueDate: data.pregnancyDueDate,
      }),
  };
}
