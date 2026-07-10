export interface PatientProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string;     // "YYYY-MM-DD"
  heightCm: number | null;
  gender: string | null;   // "Male" | "Female" | null
  isPregnant: boolean;
  pregnancyStartDate: string | null; // "YYYY-MM-DD"
  pregnancyDueDate: string | null;   // "YYYY-MM-DD"
  diabetesType: string;    // "None" | "Type1" | "Type2" | "Prediabetes"
  medicalRecordNumber: string;
  createdAt: string;       // ISO 8601
}

export interface UpdatePatientProfileRequest {
  isPregnant?: boolean;
  heightCm?: number;
  phone?: string;
}
