import { describe, it, expect } from 'vitest';
import { acceptRequestSchema, MRN_REGEX } from './accept-request-schema';

describe('acceptRequestSchema', () => {
  describe('casos válidos', () => {
    it('acepta un MRN bien formado con fecha y hora', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-20260711-153045123' });
      expect(r.success).toBe(true);
    });

    it('acepta ceros en la hora', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-20260711-000000000' });
      expect(r.success).toBe(true);
    });

    it('acepta el valor máximo de hora (235959999)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-20260711-235959999' });
      expect(r.success).toBe(true);
    });

    it('acepta cadena vacía (backend auto-asignará)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: '' });
      expect(r.success).toBe(true);
    });

    it('acepta undefined (backend auto-asignará)', () => {
      const r = acceptRequestSchema.safeParse({});
      expect(r.success).toBe(true);
    });

    it('acepta solo espacios (se trimean y queda vacío)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: '   ' });
      expect(r.success).toBe(true);
    });
  });

  describe('casos inválidos', () => {
    it('rechaza formato sin prefijo MRN-', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: '20260711-153045123' });
      expect(r.success).toBe(false);
    });

    it('rechaza fecha con dígitos no numéricos', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-abcdefgh-153045123' });
      expect(r.success).toBe(false);
    });

    it('rechaza hora con dígitos no numéricos', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-20260711-abcdefghi' });
      expect(r.success).toBe(false);
    });

    it('rechaza fecha con 4 dígitos (deben ser 8)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-2026-153045123' });
      expect(r.success).toBe(false);
    });

    it('rechaza hora con 6 dígitos (deben ser 9)', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-20260711-153045' });
      expect(r.success).toBe(false);
    });

    it('rechaza minúsculas en el prefijo', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'mrn-20260711-153045123' });
      expect(r.success).toBe(false);
    });

    it('rechaza espacios en blanco', () => {
      const r = acceptRequestSchema.safeParse({ medicalRecordNumber: 'MRN-20260711- 53045123' });
      expect(r.success).toBe(false);
    });
  });
});

describe('MRN_REGEX', () => {
  it('matchea exactamente el formato esperado', () => {
    expect(MRN_REGEX.test('MRN-20260711-153045123')).toBe(true);
    expect(MRN_REGEX.test('MRN-20260711-235959999')).toBe(true);
    expect(MRN_REGEX.test('MRN-20260711-000000000')).toBe(true);
  });

  it('no matchea longitudes incorrectas', () => {
    expect(MRN_REGEX.test('MRN-20260711-15304')).toBe(false);
    expect(MRN_REGEX.test('MRN-20260711-1530451234')).toBe(false);
    expect(MRN_REGEX.test('MRN-2026071-153045123')).toBe(false);
  });
});
