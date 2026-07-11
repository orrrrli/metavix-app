export interface DoctorProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  speciality: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string; // ISO 8601
}

export interface LinkedPatientResponse {
  id: string;
  name: string;
  lastName: string;
  /** MRN assigned by a doctor when accepting the link request. `null` for
   *  patients that have been linked historically before MRN was required. */
  medicalRecordNumber: string | null;
}

export interface PendingLinkRequestResponse {
  requestId: string;
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  createdAt: string; // ISO 8601
}

export interface DoctorLinkRequestResponse {
  requestId: string;
  patientId: string;
  doctorId: string;
  status: string;
  createdAt: string; // ISO 8601
}
