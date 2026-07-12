import { describe, it, expect } from 'vitest';
import { getCkdStageRowVisual, CKD_ROW_TONE_TOKENS } from './CkdStageExplainer';
import { getCkdStageMeta, CKD_STAGES } from '../data/ckd-stages';
import type { CkdStage } from '@/types/goal-evaluation';

describe('getCkdStageRowVisual', () => {
  it('returns "neutral" for any stage when isCurrent is false', () => {
    const stages: CkdStage[] = ['G1', 'G2', 'G3a', 'G3b', 'G4', 'G5'];
    for (const s of stages) {
      expect(getCkdStageRowVisual(s, false)).toBe('neutral');
    }
  });

  it('returns "currentOk" for G1 and G2 when current', () => {
    expect(getCkdStageRowVisual('G1', true)).toBe('currentOk');
    expect(getCkdStageRowVisual('G2', true)).toBe('currentOk');
  });

  it('returns "currentWarn" for G3a and G3b when current', () => {
    expect(getCkdStageRowVisual('G3a', true)).toBe('currentWarn');
    expect(getCkdStageRowVisual('G3b', true)).toBe('currentWarn');
  });

  it('returns "currentBad" for G4 and G5 when current', () => {
    expect(getCkdStageRowVisual('G4', true)).toBe('currentBad');
    expect(getCkdStageRowVisual('G5', true)).toBe('currentBad');
  });
});

describe('CKD_ROW_TONE_TOKENS', () => {
  it('has a unique token set per tone (drift guard against silent visual regression)', () => {
    const tones = new Set(Object.values(CKD_ROW_TONE_TOKENS).map((t) => JSON.stringify(t)));
    expect(tones.size).toBe(4);
  });
});

describe('getCkdStageMeta', () => {
  it('returns the catalog entry for a known stage', () => {
    const meta = getCkdStageMeta('G3a');
    expect(meta?.id).toBe('G3a');
    expect(meta?.range).toBe('45–59 ml/min/1.73m²');
  });

  it('returns null for null or undefined', () => {
    expect(getCkdStageMeta(null)).toBeNull();
    expect(getCkdStageMeta(undefined)).toBeNull();
  });
});

describe('CKD_STAGES catalog', () => {
  it('has exactly 6 stages in KDIGO order (G1..G5)', () => {
    expect(CKD_STAGES.map((s) => s.id)).toEqual(['G1', 'G2', 'G3a', 'G3b', 'G4', 'G5']);
  });

  it('every entry has non-empty name, range and action', () => {
    for (const s of CKD_STAGES) {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.range.length).toBeGreaterThan(0);
      expect(s.action.length).toBeGreaterThan(0);
    }
  });
});
