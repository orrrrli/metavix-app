import { DoctorProfileResponse, LinkedPatientResponse, PendingLinkRequestResponse, DoctorLinkRequestResponse } from '@/types/doctor';
import { PatientProfileResponse } from '@/types/patient-profile';
import { DailyRecordResponse } from '@/types/daily-record';
import { LabRecordResponse } from '@/types/lab-record';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

// === Doctor Profile ===

export async function getDoctorProfile(doctorId: string): Promise<DoctorProfileResponse> {
  const res = await fetch(`${BASE}/api/doctor/get-profile/${doctorId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getDoctorProfile] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Linked Patients ===

export async function getLinkedPatients(doctorId: string): Promise<LinkedPatientResponse[]> {
  const res = await fetch(`${BASE}/api/doctor/${doctorId}/get-all-patients`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getLinkedPatients] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Linked Patient Data ===

export async function getLinkedPatientProfile(
  doctorId: string,
  patientId: string
): Promise<PatientProfileResponse> {
  const res = await fetch(`${BASE}/api/doctor/${doctorId}/patients/${patientId}/profile`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getLinkedPatientProfile] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function getLinkedPatientDailyRecords(
  doctorId: string,
  patientId: string
): Promise<DailyRecordResponse[]> {
  const res = await fetch(`${BASE}/api/doctor/${doctorId}/patients/${patientId}/records/daily`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getLinkedPatientDailyRecords] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function getLinkedPatientLabResults(
  doctorId: string,
  patientId: string
): Promise<LabRecordResponse[]> {
  const res = await fetch(`${BASE}/api/doctor/${doctorId}/patients/${patientId}/records/lab`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getLinkedPatientLabResults] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Link Requests ===

export async function getPendingLinkRequests(doctorId: string): Promise<PendingLinkRequestResponse[]> {
  const res = await fetch(`${BASE}/api/doctor/requests/pending/${doctorId}`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getPendingLinkRequests] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function acceptLinkRequest(requestId: string): Promise<DoctorLinkRequestResponse> {
  const res = await fetch(`${BASE}/api/doctor/requests/${requestId}/accept`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[acceptLinkRequest] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function rejectLinkRequest(requestId: string): Promise<DoctorLinkRequestResponse> {
  const res = await fetch(`${BASE}/api/doctor/requests/${requestId}/reject`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[rejectLinkRequest] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function unlinkPatient(requestId: string): Promise<DoctorLinkRequestResponse> {
  const res = await fetch(`${BASE}/api/doctor/requests/${requestId}/unlink`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[unlinkPatient] ${res.status}`);
  const body = await res.json();
  return body.data;
}
