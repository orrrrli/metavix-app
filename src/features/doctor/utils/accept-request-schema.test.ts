import { describe, it, expect } from 'vitest';
import { acceptRequestSchema, MRN_REGEX } from './accept-request-schema';

describe('acceptRequestSchema', () => {
  describe('casos válidos', () => {
    it('acepta un MRN bien formado con year y secuencia', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026-000001' });
      expect(r.success).toBe(true);
    });

    it('acepta ceros en la secuencia', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026-000000' });
      expect(r.success).toBe(true);
    });

    it('acepta el valor máximo de secuencia (999999)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026-999999' });
      expect(r.success).toBe(true);
    });
  });

  describe('casos inválidos', () => {
    it('rechaza cadena vacía', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: '' });
      expect(r.success).toBe(false);
      if (!r.success) {
        const messages = r.error.issues.map((i) => i.message);
        expect(messages).toContain('El número de historia clínica es requerido');
      }
    });

    it('rechaza formato sin prefijo MRN-', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: '2026-000001' });
      expect(r.success).toBe(false);
    });

    it('rechaza año con dígitos no numéricos', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-abcd-000001' });
      expect(r.success).toBe(false);
    });

    it('rechaza secuencia con dígitos no numéricos', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026-abcdef' });
      expect(r.success).toBe(false);
    });

    it('rechaza año con 2 dígitos (deben ser 4)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-26-000001' });
      expect(r.success).toBe(false);
    });

    it('rechaza secuencia con 5 dígitos (deben ser 6)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026-00001' });
      expect(r.success).toBe(false);
    });

    it('rechaza minúsculas en el prefijo', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'mrn-2026-000001' });
      expect(r.success).toBe(false);
    });

    it('rechaza espacios en blanco', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026- 000001' });
      expect(r.success).toBe(false);
    });
  });
});

describe('MRN_REGEX', () => {
  it('matchea exactamente el formato esperado', () => {
    expect(MRN_REGEX.test('MRN-2026-000001')).toBe(true);
    expect(MRN_REGEX.test('MRN-2026-999999')).toBe(true);
    expect(MRN_REGEX.test('MRN-2026-000000')).toBe(true);
  });

  it('no matchea longitudes incorrectas', () => {
    expect(MRN_REGEX.test('MRN-2026-0001')).toBe(false);
    expect(MRN_REGEX.test('MRN-2026-0000001')).toBe(false);
    expect(MRN_REGEX.test('MRN-202-000001')).toBe(false);
  });
});
