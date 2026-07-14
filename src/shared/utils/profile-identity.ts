import { format, parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

export const EM_DASH = "—";

export interface ProfileIdentity {
  /** Nombre completo o "—" si falta. */
  fullName: string;
  /** Iniciales en mayúscula o "?" si faltan. */
  initials: string;
}

/**
 * Deriva nombre completo e iniciales a partir de nombre/apellido. Compartido
 * entre el perfil del paciente y el del doctor — antes estaba duplicado
 * palabra por palabra en ambos `buildXxxProfileViewData`.
 */
export function buildProfileIdentity(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): ProfileIdentity {
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim() || EM_DASH;
  const initials =
    [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() ||
    "?";
  return { fullName, initials };
}

/**
 * Formatea `createdAt` como "mes año" en español (p.ej. "enero 2026"), o "—"
 * si la fecha no es válida. Acepta ISO 8601 completo (el formato de `createdAt`).
 */
export function formatMemberSince(createdAt: string | null | undefined): string {
  if (!createdAt) return EM_DASH;
  const date = parseISO(createdAt);
  return isValid(date) ? format(date, "MMMM yyyy", { locale: es }) : EM_DASH;
}
