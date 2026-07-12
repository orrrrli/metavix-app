import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/metavix';
import type { CkdStage } from '@/types/goal-evaluation';
import { CKD_STAGES, getCkdStageMeta } from '../data/ckd-stages';

/**
 * Pure helper: mapea (etapa, ¿es la actual?) → tokens de color. La etapa actual
 * se resalta con el color de severidad (G1-G2 verde, G3a-G3b ámbar, G4-G5 rojo);
 * las demás filas se renderizan en color neutro. Exportado para unit testing
 * sin jsdom.
 */
export type CkdRowTone = 'currentOk' | 'currentWarn' | 'currentBad' | 'neutral';

export function getCkdStageRowVisual(stage: CkdStage, isCurrent: boolean): CkdRowTone {
  if (!isCurrent) return 'neutral';
  switch (stage) {
    case 'G1':
    case 'G2':
      return 'currentOk';
    case 'G3a':
    case 'G3b':
      return 'currentWarn';
    case 'G4':
    case 'G5':
      return 'currentBad';
  }
}

/** Tokens CSS para un tono dado. La key es la propiedad CSS a setear. */
export const CKD_ROW_TONE_TOKENS: Record<CkdRowTone, { bg: string; border: string; text: string }> = {
  currentOk:   { bg: 'var(--ok-bg)',   border: 'var(--ok)',   text: 'var(--ok)' },
  currentWarn: { bg: 'var(--warn-bg)', border: 'var(--warn)', text: 'var(--warn)' },
  currentBad:  { bg: 'var(--bad-bg)',  border: 'var(--bad)',  text: 'var(--bad)' },
  neutral:     { bg: 'var(--card)',    border: 'var(--bd)',   text: 'var(--text)' },
};

export interface CkdStageExplainerProps {
  /** Etapa actual del paciente (null si no hay eGFR numérico). */
  currentStage: CkdStage | null;
  /** Valor de eGFR en ml/min/1.73m² (null si no hay). Se muestra junto al
   *  nombre de la etapa actual; null cuando no hay valor numérico. */
  egfrValue: number | null;
}

/**
 * Tarjeta educativa sobre la etapa KDIGO de enfermedad renal crónica
 * correspondiente al eGFR. Aparece debajo del grid de chips en MetasControl
 * solo cuando el paciente tiene un eGFR numérico (la condición de montaje la
 * decide el caller — ver MetasControl/index.tsx).
 *
 * Estructura:
 *  - Header: icono + título + subtítulo (etapa actual + valor, o glosario).
 *  - Tabla de las 6 etapas (G1..G5) con nombre, rango y acción clínica.
 *    La fila de la etapa actual se resalta con el color de severidad.
 *
 * La card no clasifica nada — recibe la etapa ya calculada por el backend
 * (single source of truth) y la presenta. La descripción en español vive en
 * `data/ckd-stages.ts` (catálogo estático, fuente KDIGO 2024 + ADA 2026).
 */
export function CkdStageExplainer({ currentStage, egfrValue }: CkdStageExplainerProps) {
  const currentMeta = getCkdStageMeta(currentStage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center size-9 rounded-full shrink-0"
            style={{ background: 'var(--info)' }}
          >
            <Info className="size-5" style={{ color: '#fff' }} aria-hidden="true" />
          </div>
          <div className="flex-1">
            <CardTitle>Etapa de enfermedad renal (KDIGO 2024)</CardTitle>
            {currentMeta && egfrValue !== null ? (
              <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
                Tu eGFR de <strong>{egfrValue.toFixed(0)} ml/min/1.73m²</strong> corresponde a la{' '}
                <strong>{currentMeta.name}</strong>.
              </p>
            ) : (
              <p className="text-sm mt-1" style={{ color: 'var(--mut)' }}>
                Tabla de referencia KDIGO 2024 para interpretar el eGFR.
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {CKD_STAGES.map((stage) => {
            const isCurrent = stage.id === currentStage;
            const tone = getCkdStageRowVisual(stage.id, isCurrent);
            const tokens = CKD_ROW_TONE_TOKENS[tone];
            return (
              <div
                key={stage.id}
                data-testid="ckd-stage-row"
                data-stage={stage.id}
                data-current={isCurrent ? 'true' : 'false'}
                className="rounded-md border p-3 transition-colors"
                style={{
                  background: tokens.bg,
                  borderColor: tokens.border,
                }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: tone === 'neutral' ? 'var(--text)' : tokens.text }}
                  >
                    {stage.name}
                  </p>
                  <p
                    className="text-xs shrink-0"
                    style={{ color: tone === 'neutral' ? 'var(--mut)' : tokens.text }}
                  >
                    {stage.range}
                  </p>
                </div>
                <p
                  className="text-xs mt-1 leading-snug"
                  style={{ color: 'var(--text)' }}
                >
                  <span className="font-medium">Acción:</span> {stage.action}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
