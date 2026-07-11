import type { ClinicalGoal, ClinicalGoalPayload } from '@/types/clinical-goal';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const API = `${BASE}/api/v1/doctor`;

/**
 * Lista las metas clínicas personalizadas que el doctor autenticado tiene
 * configuradas para un paciente. Devuelve un array vacío si el paciente no
 * tiene metas (200 sin metas ≠ 404).
 */
export async function getClinicalGoals(
  doctorId: string,
  patientId: string,
): Promise<ClinicalGoal[]> {
  const res = await fetch(`${API}/${doctorId}/patients/${patientId}/goals`, {
    credentials: 'include',
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`[getClinicalGoals] ${res.status}`);
  const body = await res.json();
  return body.data ?? [];
}

/**
 * Crea una nueva meta clínica para un parámetro. Falla con 409 si ya existe
 * una meta para ese `(patientId, parameterId)` — en ese caso el caller debe
 * llamar a `updateClinicalGoal` con el `id` existente en su lugar.
 */
export async function createClinicalGoal(
  doctorId: string,
  patientId: string,
  parameterId: string,
  payload: ClinicalGoalPayload,
): Promise<ClinicalGoal> {
  const res = await fetch(`${API}/${doctorId}/patients/${patientId}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ parameterId, ...payload }),
  });
  if (!res.ok) throw new Error(`[createClinicalGoal] ${res.status}`);
  const body = await res.json();
  return body.data;
}

/**
 * Reemplaza los 4 umbrales de una meta existente. Falla con 404 si la meta
 * no existe para ese paciente.
 */
export async function updateClinicalGoal(
  doctorId: string,
  patientId: string,
  goalId: string,
  payload: ClinicalGoalPayload,
): Promise<ClinicalGoal> {
  const res = await fetch(`${API}/${doctorId}/patients/${patientId}/goals/${goalId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`[updateClinicalGoal] ${res.status}`);
  const body = await res.json();
  return body.data;
}
