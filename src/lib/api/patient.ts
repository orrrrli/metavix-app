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

// GET helper for the `body.data` envelope shared by every read endpoint below.
// `emptyOn404` controls what a 404 resolves to: a list endpoint wants `[]`,
// a single-resource endpoint wants `null` — both are "no data", not an error.
async function apiGet<T>(
  url: string,
  fnName: string,
  emptyOn404: 'array' | 'null' | 'throw' = 'throw',
): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (res.status === 404) {
    if (emptyOn404 === 'array') return [] as T;
    if (emptyOn404 === 'null') return null as T;
  }
  if (!res.ok) throw new Error(`[${fnName}] ${res.status}`);
  const body = await res.json();
  return body.data;
}

// === Doctor Discovery ===

export async function getAllDoctors(): Promise<DoctorOption[]> {
  return apiGet(`${API}/patient/get-all-doctors`, 'getAllDoctors');
}

export async function getLinkedDoctors(patientId: string): Promise<LinkedDoctorResponse[]> {
  return apiGet(`${API}/patient/${patientId}/get-linked-doctors`, 'getLinkedDoctors', 'array');
}

// === Link Requests ===

export async function getPendingSentRequests(patientId: string): Promise<SentPendingRequestResponse[]> {
  return apiGet(`${API}/patient/${patientId}/get-pending-requests`, 'getPendingSentRequests', 'array');
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
  return apiGet(`${API}/patient/${patientId}/summary`, 'getPatientResumen', 'null');
}

// === Daily Records ===

export async function getDailyRecords(patientId: string): Promise<DailyRecordResponse[]> {
  const data = await apiGet<DailyRecordResponse[]>(
    `${API}/patient/${patientId}/get-all/records/daily`,
    'getDailyRecords',
    'array',
  );
  return data.map(normalizeDailyRecord);
}

export async function getDailyRecordsInRange(
  patientId: string,
  from: string,
  to: string,
): Promise<DailyRecordResponse[]> {
  const params = new URLSearchParams({ from, to });
  const data = await apiGet<DailyRecordResponse[]>(
    `${API}/patient/${patientId}/get-all/records/daily?${params}`,
    'getDailyRecordsInRange',
    'array',
  );
  return data.map(normalizeDailyRecord);
}

export async function getDailyRecordById(
  patientId: string,
  recordId: string
): Promise<DailyRecordResponse | null> {
  const data = await apiGet<DailyRecordResponse | null>(
    `${API}/patient/${patientId}/record/daily/${recordId}`,
    'getDailyRecordById',
    'null',
  );
  return data ? normalizeDailyRecord(data) : null;
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
  return apiGet(`${API}/patient/${patientId}/get-all/records/lab`, 'getLabRecords', 'array');
}

export async function getLabRecordById(
  patientId: string,
  recordId: string
): Promise<LabRecordResponse> {
  return apiGet(`${API}/patient/${patientId}/records/lab/${recordId}`, 'getLabRecordById');
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
  return apiGet(`${API}/patient/${patientId}/insulin-dm1/profile`, 'getInsulinProfile', 'null');
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
  return apiGet(`${API}/patient/${patientId}/insulin-dm1/records`, 'getInsulinRecords', 'array');
}

export async function getInsulinRecordById(
  patientId: string,
  recordId: string
): Promise<InsulinRecordResponse> {
  return apiGet(`${API}/patient/${patientId}/insulin-dm1/records/${recordId}`, 'getInsulinRecordById');
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

export async function getPatientProfile(patientId: string): Promise<PatientProfileResponse | null> {
  return apiGet(`${API}/patient/${patientId}/profile`, 'getPatientProfile', 'null');
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
