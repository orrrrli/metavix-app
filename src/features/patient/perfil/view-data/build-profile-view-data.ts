import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { PatientProfileResponse } from "@/types/patient-profile";
import { parseApiDate } from "@/features/patient/utils/parse-api-date";
import { formatDiabetesLabel } from "./format-diabetes-label";
import { formatGenderLabel, type GenderLabel } from "./format-gender-label";
import {
  formatDateOrPlaceholder,
  type DateOrPlaceholder,
} from "./format-date-or-placeholder";

const EM_DASH = "—";

export interface ProfileViewData {
  /** Nombre completo o "—" si falta. */
  fullName: string;
  /** Iniciales en mayúscula o "?" si faltan. */
  initials: string;
  medicalRecordNumber: string;
  /** "Paciente desde <mes año>" ya formateado (sin el prefijo). */
  memberSince: string;
  diabetesLabel: string;
  email: string | null;
  /** Fecha de nacimiento legible o "—". */
  formattedDob: string;
  gender: GenderLabel;
  /** Estatura ya formateada ("165 cm") o null si no hay. */
  heightLabel: string | null;
  phone: string | null;
  isPregnant: boolean;
  /** Fechas de embarazo (sólo relevantes si isPregnant). */
  pregnancyStartDate: DateOrPlaceholder;
  pregnancyDueDate: DateOrPlaceholder;
}

/**
 * Compone los datos ya resueltos del perfil que consume `PatientProfileScreen`
 * en modo lectura: nombre, iniciales, fechas formateadas, etiquetas de
 * diabetes/género y estatura. Puro y testeable — sin JSX, sin React.
 */
export function buildProfileViewData(
  profile: PatientProfileResponse,
): ProfileViewData {
  const fullName =
    `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || EM_DASH;
  const initials =
    [profile.firstName?.[0], profile.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  const createdDate = parseApiDate(profile.createdAt);
  const memberSince = createdDate
    ? format(createdDate, "MMMM yyyy", { locale: es })
    : EM_DASH;

  const dob = formatDateOrPlaceholder(profile.dateOfBirth);

  return {
    fullName,
    initials,
    medicalRecordNumber: profile.medicalRecordNumber,
    memberSince,
    diabetesLabel: formatDiabetesLabel(profile.diabetesType),
    email: profile.email,
    formattedDob: dob.type === "date" ? dob.value : EM_DASH,
    gender: formatGenderLabel(profile.gender),
    heightLabel: profile.heightCm ? `${profile.heightCm} cm` : null,
    phone: profile.phone,
    isPregnant: profile.isPregnant,
    pregnancyStartDate: formatDateOrPlaceholder(profile.pregnancyStartDate),
    pregnancyDueDate: formatDateOrPlaceholder(profile.pregnancyDueDate),
  };
}
