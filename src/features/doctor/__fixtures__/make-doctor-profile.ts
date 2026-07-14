import type { DoctorProfileResponse } from "@/types/doctor";

export function makeDoctorProfile(
  overrides: Partial<DoctorProfileResponse> = {},
): DoctorProfileResponse {
  return {
    id: "doctor-1",
    firstName: "Carlos",
    lastName: "Ramírez",
    licenseNumber: "12345678",
    speciality: "Endocrinología",
    email: "carlos@example.com",
    phone: null,
    isVerified: true,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}
