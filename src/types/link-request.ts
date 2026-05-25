export interface DoctorOption {
  id: string;
  firstName: string;
  lastName: string;
  speciality: string;
  email: string;
}

export interface LinkedDoctorResponse {
  requestId: string;
  doctorId: string;
  doctorFirstName: string;
  doctorLastName: string;
  speciality: string;
  email: string;
  linkedAt: string; // ISO 8601
}

export interface SendLinkRequestBody {
  patientId: string;
  doctorId: string;
}

export interface LinkRequestResponse {
  requestId: string;
  patientId: string;
  doctorId: string;
  status: string;
  createdAt: string; // ISO 8601
}
