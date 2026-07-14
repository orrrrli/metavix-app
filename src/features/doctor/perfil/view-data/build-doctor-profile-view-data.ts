import { z } from "zod";
import type { DoctorProfileResponse } from "@/types/doctor";
import {
  buildProfileIdentity,
  formatMemberSince,
} from "@/shared/utils/profile-identity";

export const doctorProfileSchema = z.object({
  licenseNumber: z.string().min(1, "La cédula profesional es requerida"),
  speciality: z.string().optional(),
});

export type DoctorProfileFormData = z.infer<typeof doctorProfileSchema>;

export interface DoctorProfileViewData {
  fullName: string;
  initials: string;
  speciality: string;
  memberSince: string;
  isVerified: boolean;
  email: string;
  id: string;
  /** Cédula o null si no hay (la Screen muestra el placeholder atenuado). */
  licenseNumber: string | null;
  /** Especialidad o null. */
  specialityValue: string | null;
}

/**
 * Compone los datos ya resueltos del perfil del doctor que consume
 * `DoctorProfileScreen`. Puro y testeable — espejo de `buildProfileViewData`
 * del paciente. Sin JSX, sin React.
 */
export function buildDoctorProfileViewData(
  profile: DoctorProfileResponse,
): DoctorProfileViewData {
  const { fullName, initials } = buildProfileIdentity(
    profile.firstName,
    profile.lastName,
  );

  return {
    fullName,
    initials,
    speciality: profile.speciality,
    memberSince: formatMemberSince(profile.createdAt),
    isVerified: profile.isVerified,
    email: profile.email,
    id: profile.id,
    licenseNumber: profile.licenseNumber || null,
    specialityValue: profile.speciality || null,
  };
}
