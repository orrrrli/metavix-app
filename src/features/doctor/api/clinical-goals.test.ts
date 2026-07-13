import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const baseUrl = 'http://localhost:3000/api/v1/doctor';

describe('clinical-goals API client', () => {

  beforeEach(async () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
    // El API cliente lee `process.env.NEXT_PUBLIC_API_URL` en su top-level
    // (const API = ...), así que necesitamos resetear el módulo antes de
    // cada test para que el cambio de env var se refleje.
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('getClinicalGoals', () => {
    it('devuelve [] en 404 (paciente sin metas)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
      const { getClinicalGoals } = await import('./clinical-goals');
      const result = await getClinicalGoals('doc-1', 'pat-1');
      expect(result).toEqual([]);
    });

    it('devuelve las metas parseadas de body.data en 200', async () => {
      const data = [
        {
          id: 'goal-1',
          patientId: 'pat-1',
          doctorId: 'doc-1',
          parameterId: 'hba1c',
          customOutOfRangeLow: null,
          customAtRiskLow: null,
          customAtRiskHigh: 7.0,
          customOutOfRangeHigh: 8.0,
          createdAt: '2026-07-10T00:00:00Z',
        },
      ];
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: { goals: data } }),
      }));
      const { getClinicalGoals } = await import('./clinical-goals');
      const result = await getClinicalGoals('doc-1', 'pat-1');
      expect(result).toEqual(data);
    });

    it('devuelve [] cuando body.data.goals está vacío', async () => {
      // Sin metas personalizadas, el backend responde `{ data: { goals: [] } }`.
      // El cliente debe devolver [] (no `{ goals: [] }`) para que `.map`
      // funcione en el editor.
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: { goals: [] } }),
      }));
      const { getClinicalGoals } = await import('./clinical-goals');
      const result = await getClinicalGoals('doc-1', 'pat-1');
      expect(result).toEqual([]);
    });

    it('lanza error en status no-ok y no-404', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
      const { getClinicalGoals } = await import('./clinical-goals');
      await expect(getClinicalGoals('doc-1', 'pat-1')).rejects.toThrow(
        '[getClinicalGoals] 500',
      );
    });

    it('usa la URL y credenciales correctas', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: { goals: [] } }) });
      vi.stubGlobal('fetch', fetchMock);
      const { getClinicalGoals } = await import('./clinical-goals');
      await getClinicalGoals('doc-1', 'pat-1');
      expect(fetchMock).toHaveBeenCalledWith(
        `${baseUrl}/doc-1/patients/pat-1/goals`,
        expect.objectContaining({ credentials: 'include' }),
      );
    });
  });

  describe('createClinicalGoal', () => {
    it('envía POST con parameterId y payload', async () => {
      const created = {
        id: 'goal-1',
        patientId: 'pat-1',
        doctorId: 'doc-1',
        parameterId: 'hba1c',
        customOutOfRangeLow: null,
        customAtRiskLow: null,
        customAtRiskHigh: 7.0,
        customOutOfRangeHigh: 8.0,
        createdAt: '2026-07-10T00:00:00Z',
      };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ data: created }),
      });
      vi.stubGlobal('fetch', fetchMock);
      const { createClinicalGoal } = await import('./clinical-goals');
      const result = await createClinicalGoal('doc-1', 'pat-1', 'hba1c', {
        customAtRiskHigh: 7.0,
        customOutOfRangeHigh: 8.0,
      });
      expect(result).toEqual(created);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(`${baseUrl}/doc-1/patients/pat-1/goals`);
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual({
        parameterId: 'hba1c',
        customAtRiskHigh: 7.0,
        customOutOfRangeHigh: 8.0,
      });
    });

    it('lanza error en 409 (meta duplicada)', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409 }));
      const { createClinicalGoal } = await import('./clinical-goals');
      await expect(
        createClinicalGoal('doc-1', 'pat-1', 'hba1c', { customAtRiskHigh: 7.0 }),
      ).rejects.toThrow('[createClinicalGoal] 409');
    });
  });

  describe('updateClinicalGoal', () => {
    it('envía PUT con el goalId en la URL', async () => {
      const updated = {
        id: 'goal-1',
        patientId: 'pat-1',
        doctorId: 'doc-1',
        parameterId: 'hba1c',
        customOutOfRangeLow: null,
        customAtRiskLow: null,
        customAtRiskHigh: 7.5,
        customOutOfRangeHigh: 8.5,
        createdAt: '2026-07-10T00:00:00Z',
      };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: updated }),
      });
      vi.stubGlobal('fetch', fetchMock);
      const { updateClinicalGoal } = await import('./clinical-goals');
      const result = await updateClinicalGoal('doc-1', 'pat-1', 'goal-1', {
        customAtRiskHigh: 7.5,
        customOutOfRangeHigh: 8.5,
      });
      expect(result).toEqual(updated);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(`${baseUrl}/doc-1/patients/pat-1/goals/goal-1`);
      expect(init.method).toBe('PUT');
    });
  });
});
