import type { PatientProfileResponse } from "@/types/patient-profile";
import { parseApiDate } from "./parse-api-date";

export interface PregnancyBanners {
  /** `profile.isPregnant` — banner "Estás en modo embarazo". */
  showPregnancyMode: boolean;
  /** `!isPregnant && pregnancyStartDate` — nota "metas de embarazo desactivadas". */
  pregnancyDeactivated: boolean;
  /** `isPregnant && dueDate && dueDate <= now` — nota "FPP alcanzada". */
  dueDateReached: boolean;
}

/**
 * Deriva qué banners de embarazo mostrar. Devuelve sólo booleans; los textos
 * viven en `strings/es.ts`. `now` es inyectable para tests deterministas.
 * Extraído de `MetasControl` (T4/FE-CHIPS-2 + banner de embarazo).
 */
export function buildPregnancyBanners(
  profile: PatientProfileResponse | null,
  now: Date = new Date(),
): PregnancyBanners {
  const isPregnant = Boolean(profile?.isPregnant);
  return {
    showPregnancyMode: isPregnant,
    pregnancyDeactivated: Boolean(
      !isPregnant && profile?.pregnancyStartDate,
    ),
    dueDateReached: Boolean(
      isPregnant &&
        profile?.pregnancyDueDate &&
        parseApiDate(profile.pregnancyDueDate) <= now,
    ),
  };
}
