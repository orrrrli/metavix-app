export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  userId: string;
  patientId: string | null;
  doctorId: string | null;
  expiresAt: string;
  email: string;
  role: string;
  fullName: string;
}

export interface RegisterPatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponseData {
  userId: string;
  email: string;
  role: string;
}
