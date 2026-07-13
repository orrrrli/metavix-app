import type { PatientProfileResponse } from "@/types/patient-profile";

export function makeProfile(
  overrides: Partial<PatientProfileResponse> = {},
): PatientProfileResponse {
  return {
    id: "patient-1",
    firstName: "Ana",
    lastName: "López",
    email: "ana@example.com",
    phone: null,
    dateOfBirth: "01/01/1990",
    heightCm: 165,
    gender: "Female",
    isPregnant: false,
    pregnancyStartDate: null,
    pregnancyDueDate: null,
    diabetesType: "Type2",
    medicalRecordNumber: "MRN-001",
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}
