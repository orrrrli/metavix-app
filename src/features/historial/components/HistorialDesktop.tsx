import React, { useState } from 'react';
import { Registro } from '../types';
import { labelMomento, readingTypeDe, nombreDia } from '../utils/momentos';
import { ChipGlucosa } from './ChipGlucosa';
import { BadgeValor } from './BadgeValor';
import { GlucoseReadingType } from '@/types/daily-record';
import {
  TipoDiabetes,
  getMetaPresionSistolica,
  getMetaHbA1c,
  getMetaLDL,
  estadoValorMaximo,
  estadoHDL,
} from '../utils/semaforo';

interface HistorialDesktopProps {
  registros: Registro[];
  tipoDiabetes: TipoDiabetes;
  hasDiabetes: boolean;
  isPregnant: boolean;
}

type Tab = 'glucosa' | 'vitales' | 'labs';

const F = "'Sora', sans-serif";

function TabChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: 'pointer', userSelect: 'none', fontSize: 13, fontWeight: 700, padding: '8px 16px',
        borderRadius: 999, background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#03251d' : 'var(--mut)', border: '1.5px solid var(--bd)', fontFamily: F,
      }}
    >
      {children}
    </button>
  );
}

/**
 * HistorialDesktop — "Mi Historial" para escritorio. Agrupa las columnas en
 * tres pestañas (Glucosa / Vitales / Laboratorios) para evitar scroll
 * horizontal; Fecha y Notas quedan siempre visibles. Los chips de glucosa usan
 * los colores del wizard (`ChipGlucosa`, respeta tipo de diabetes / embarazo);
 * los demás valores usan el semáforo de metas (`BadgeValor`).
 */
export function HistorialDesktop({ registros, tipoDiabetes, hasDiabetes, isPregnant }: HistorialDesktopProps) {
  const [tab, setTab] = useState<Tab>('glucosa');

  const metaSistolica = getMetaPresionSistolica(tipoDiabetes);
  const metaHbA1c = getMetaHbA1c(tipoDiabetes);
  const metaLDL = getMetaLDL(tipoDiabetes);

  return (
    <section
      style={{
        fontFamily: F, background: 'var(--card)', border: '1px solid var(--card-bd)',
        borderRadius: 20, padding: '26px 30px 30px',
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <TabChip active={tab === 'glucosa'} onClick={() => setTab('glucosa')}>Glucosa</TabChip>
        <TabChip active={tab === 'vitales'} onClick={() => setTab('vitales')}>Vitales</TabChip>
        <TabChip active={tab === 'labs'} onClick={() => setTab('labs')}>Laboratorios</TabChip>
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--bd)', borderRadius: 16, overflow: 'hidden' }}>
        {/* encabezado */}
        <div style={{ display: 'flex', background: 'var(--ph)', fontSize: 11, fontWeight: 700, color: 'var(--soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <div style={{ width: 118, flexShrink: 0, padding: '12px 16px' }}>Fecha</div>
          {tab === 'glucosa' && (
            <>
              <div style={{ width: 90, flexShrink: 0, padding: '12px 16px' }}>Ayuno</div>
              <div style={{ flex: 1, padding: '12px 16px' }}>Después de comer</div>
            </>
          )}
          {tab === 'vitales' && (
            <>
              <div style={{ width: 130, flexShrink: 0, padding: '12px 16px' }}>Presión</div>
              <div style={{ width: 90, flexShrink: 0, padding: '12px 16px' }}>FC</div>
              <div style={{ width: 90, flexShrink: 0, padding: '12px 16px' }}>Peso</div>
              <div style={{ width: 100, flexShrink: 0, padding: '12px 16px' }}>Cintura</div>
              <div style={{ flex: 1, padding: '12px 16px' }} />
            </>
          )}
          {tab === 'labs' && (
            <>
              <div style={{ width: 90, flexShrink: 0, padding: '12px 16px' }}>HbA1c</div>
              <div style={{ width: 100, flexShrink: 0, padding: '12px 16px' }}>Col. Total</div>
              <div style={{ width: 80, flexShrink: 0, padding: '12px 16px' }}>LDL</div>
              <div style={{ width: 80, flexShrink: 0, padding: '12px 16px' }}>HDL</div>
              <div style={{ width: 80, flexShrink: 0, padding: '12px 16px' }}>TG</div>
              <div style={{ width: 100, flexShrink: 0, padding: '12px 16px' }}>Creatinina</div>
            </>
          )}
          <div style={{ width: 220, flexShrink: 0, padding: '12px 16px' }}>Notas</div>
        </div>

        {/* filas */}
        {registros.map((row) => (
          <div key={row.fecha} style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid var(--bd)' }}>
            <div style={{ width: 118, flexShrink: 0, padding: '14px 16px' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{nombreDia(row.fecha)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--mut)' }}>{row.fecha}</div>
            </div>

            {tab === 'glucosa' && (
              <>
                <div style={{ width: 90, flexShrink: 0, padding: '14px 16px' }}>
                  <ChipGlucosa valor={row.glucosa_ayuno} readingType={GlucoseReadingType.Fasting} hasDiabetes={hasDiabetes} isPregnant={isPregnant} />
                </div>
                <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {row.glucosas_comidas && row.glucosas_comidas.length > 0 ? (
                    row.glucosas_comidas.map((m, i) => (
                      <ChipGlucosa
                        key={i}
                        valor={m.valor}
                        readingType={readingTypeDe(m)}
                        hasDiabetes={hasDiabetes}
                        isPregnant={isPregnant}
                        label={labelMomento(m.tipo)}
                      />
                    ))
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--mut)' }}>—</span>
                  )}
                </div>
              </>
            )}

            {tab === 'vitales' && (
              <>
                <div style={{ width: 130, flexShrink: 0, padding: '14px 16px' }}>
                  {row.presion_sistolica != null && row.presion_diastolica != null ? (
                    <BadgeValor valor={`${row.presion_sistolica}/${row.presion_diastolica}`} estado={estadoValorMaximo(row.presion_sistolica, metaSistolica)} />
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--mut)' }}>—</span>
                  )}
                </div>
                <div style={{ width: 90, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--text)' }}>{row.frecuencia_cardiaca ?? '—'}</div>
                <div style={{ width: 90, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--text)' }}>{row.peso ?? '—'}</div>
                <div style={{ width: 100, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--text)' }}>{row.cintura ?? '—'}</div>
                <div style={{ flex: 1 }} />
              </>
            )}

            {tab === 'labs' && (
              <>
                <div style={{ width: 90, flexShrink: 0, padding: '14px 16px' }}>
                  <BadgeValor valor={row.hba1c} estado={estadoValorMaximo(row.hba1c, metaHbA1c)} suffix="%" />
                </div>
                <div style={{ width: 100, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--text)' }}>{row.colesterol_total ?? '—'}</div>
                <div style={{ width: 80, flexShrink: 0, padding: '14px 16px' }}>
                  <BadgeValor valor={row.colesterol_ldl} estado={estadoValorMaximo(row.colesterol_ldl, metaLDL)} />
                </div>
                <div style={{ width: 80, flexShrink: 0, padding: '14px 16px' }}>
                  <BadgeValor valor={row.colesterol_hdl} estado={estadoHDL(row.colesterol_hdl)} />
                </div>
                <div style={{ width: 80, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--text)' }}>{row.trigliceridos ?? '—'}</div>
                <div style={{ width: 100, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--text)' }}>{row.creatinina ?? '—'}</div>
              </>
            )}

            <div style={{ width: 220, flexShrink: 0, padding: '14px 16px', fontSize: 13, color: 'var(--mut)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.notas}>
              {row.notas ?? '—'}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
