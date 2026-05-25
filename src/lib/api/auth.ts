import {
  LoginRequest,
  LoginResponseData,
  RegisterPatientRequest,
  RegisterDoctorRequest,
  RegisterResponseData,
} from '@/types/auth';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function loginUser(data: LoginRequest): Promise<LoginResponseData> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[loginUser] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function registerPatient(
  data: RegisterPatientRequest
): Promise<RegisterResponseData> {
  const res = await fetch(`${BASE}/api/auth/register/patient`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[registerPatient] ${res.status}`);
  const body = await res.json();
  return body.data;
}

export async function registerDoctor(
  data: RegisterDoctorRequest
): Promise<RegisterResponseData> {
  const res = await fetch(`${BASE}/api/auth/register/doctor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`[registerDoctor] ${res.status}`);
  const body = await res.json();
  return body.data;
}
