import {
  CreateDailyRecordRequest,
  DailyRecordResponse,
  normalizeDailyRecord,
} from '@/types/daily-record';
import { CreateLabRecordRequest, LabRecordResponse } from '@/types/lab-record';
import { DoctorOption, LinkedDoctorResponse, SendLinkRequestBody, LinkRequestResponse, SentPendingRequestResponse } from '@/types/link-request';
import { PatientResumenResponse } from '@/types/patient-resumen';
import { UpsertInsulinProfileRequest, InsulinProfileResponse, CreateInsulinRecordRequest, InsulinRecordResponse } from '@/types/insulin-dm1';
import { PatientProfileResponse, UpdatePatientProfileRequest } from '@/types/patient-profile';
import { GoalEvaluationResponse } from '@/types/goal-evaluation';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const API  = `${BASE}/api/v1`;

// === Doctor Discovery ===

export async function getAllDoctors(): Promise<DoctorOption[]> {
  const res = await fetch(`${API}/patient/get-all-doctors`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getAllDoctors] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function getLinkedDoctors(patientId: string): Promise<LinkedDoctorResponse[]> {
  const res = await fetch(`${API}/patient/${patientId}/get-linked-doctors`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getLinkedDoctors] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Link Requests ===

export async function getPendingSentRequests(patientId: string): Promise<SentPendingRequestResponse[]> {
  const res = await fetch(`${API}/patient/${patientId}/get-pending-requests`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getPendingSentRequests] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function sendLinkRequest(data: SendLinkRequestBody): Promise<LinkRequestResponse> {
  const res = await fetch(`${API}/patient/requests-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[sendLinkRequest] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function revokeLinkRequest(requestId: string): Promise<LinkRequestResponse> {
  const res = await fetch(`${API}/patient/requests/${requestId}/revoke`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[revokeLinkRequest] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Patient Resumen ===

export async function getPatientResumen(patientId: string): Promise<PatientResumenResponse | null> {
  const res = await fetch(`${API}/patient/${patientId}/summary`, {
    credentials: 'include',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`[getPatientResumen] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Daily Records ===

export async function getDailyRecords(patientId: string): Promise<DailyRecordResponse[]> {
  const res = await fetch(`${API}/patient/${patientId}/get-all/records/daily`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getDailyRecords] ${res.status}`);
  const body = await res.json();
  const data: DailyRecordResponse[] = body.data ?? [];
  return data.map(normalizeDailyRecord);
}

export async function getDailyRecordsInRange(
  patientId: string,
  from: string,
  to: string,
): Promise<DailyRecordResponse[]> {
  const params = new URLSearchParams({ from, to });
  const res = await fetch(`${API}/patient/${patientId}/get-all/records/daily?${params}`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getDailyRecordsInRange] ${res.status}`);
  const body = await res.json();
  const data: DailyRecordResponse[] = body.data ?? [];
  return data.map(normalizeDailyRecord);
}

export async function getDailyRecordById(
  patientId: string,
  recordId: string
): Promise<DailyRecordResponse> {
  const res = await fetch(`${API}/patient/${patientId}/record/daily/${recordId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getDailyRecordById] ${res.status}`);
  const body = await res.json();
  return normalizeDailyRecord(body.data);
}

export async function createDailyRecord(
  patientId: string,
  data: CreateDailyRecordRequest
): Promise<DailyRecordResponse> {
  const res = await fetch(`${API}/patient/${patientId}/records/daily`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[createDailyRecord] ${res.status}`);
  const body = await res.json();
  return normalizeDailyRecord(body.data);
}

// === Lab Records ===

export async function getLabRecords(patientId: string): Promise<LabRecordResponse[]> {
  const res = await fetch(`${API}/patient/${patientId}/get-all/records/lab`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getLabRecords] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function getLabRecordById(
  patientId: string,
  recordId: string
): Promise<LabRecordResponse> {
  const res = await fetch(`${API}/patient/${patientId}/records/lab/${recordId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getLabRecordById] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function createLabRecord(
  patientId: string,
  data: CreateLabRecordRequest
): Promise<LabRecordResponse> {
  const res = await fetch(`${API}/patient/${patientId}/records/lab`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[createLabRecord] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Insulin DM1 ===

export async function getInsulinProfile(patientId: string): Promise<InsulinProfileResponse | null> {
  const res = await fetch(`${API}/patient/${patientId}/insulin-dm1/profile`, {
    credentials: 'include',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`[getInsulinProfile] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function upsertInsulinProfile(
  patientId: string,
  data: UpsertInsulinProfileRequest
): Promise<InsulinProfileResponse> {
  const res = await fetch(`${API}/patient/${patientId}/insulin-dm1/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[upsertInsulinProfile] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function getInsulinRecords(patientId: string): Promise<InsulinRecordResponse[]> {
  const res = await fetch(`${API}/patient/${patientId}/insulin-dm1/records`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getInsulinRecords] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function getInsulinRecordById(
  patientId: string,
  recordId: string
): Promise<InsulinRecordResponse> {
  const res = await fetch(`${API}/patient/${patientId}/insulin-dm1/records/${recordId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getInsulinRecordById] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function createInsulinRecord(
  patientId: string,
  data: CreateInsulinRecordRequest
): Promise<InsulinRecordResponse> {
  const res = await fetch(`${API}/patient/${patientId}/insulin-dm1/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[createInsulinRecord] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function deleteInsulinRecord(
  patientId: string,
  recordId: string
): Promise<void> {
  const res = await fetch(`${API}/patient/${patientId}/insulin-dm1/records/${recordId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[deleteInsulinRecord] ${res.status}`);
}

// === Goal Evaluations ===

export async function evaluateGoals(patientId: string): Promise<GoalEvaluationResponse> {
  const res = await fetch(`${API}/patient/${patientId}/goal-evaluations`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[evaluateGoals] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Patient Profile ===

export async function getPatientProfile(patientId: string): Promise<PatientProfileResponse> {
  const res = await fetch(`${API}/patient/${patientId}/profile`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`[getPatientProfile] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function updatePatientProfile(
  patientId: string,
  data: UpdatePatientProfileRequest
): Promise<PatientProfileResponse> {
  const res = await fetch(`${API}/patient/${patientId}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[updatePatientProfile] ${res.status}`);
  const body = await res.json();
  return body.data;
}
