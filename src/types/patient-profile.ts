export interface PatientProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string;     // "dd/MM/yyyy" (API DateOnlyJsonConverter); el frontend lo parsea con parseApiDate
  heightCm: number | null;
  gender: string | null;   // "Male" | "Female" | null
  isPregnant: boolean;
  pregnancyStartDate: string | null; // "dd/MM/yyyy" (mismo converter que dateOfBirth)
  pregnancyDueDate: string | null;   // "dd/MM/yyyy"
  diabetesType: string;    // "None" | "Type1" | "Type2" | "Prediabetes"
  medicalRecordNumber: string;
  createdAt: string;       // ISO 8601
}

export interface UpdatePatientProfileRequest {
  isPregnant?: boolean;
  heightCm?: number;
  phone?: string;
  pregnancyStartDate?: string; // "yyyy-MM-dd" (input type="date"); la API también acepta "dd/MM/yyyy"
  pregnancyDueDate?: string;   // "yyyy-MM-dd"
}
