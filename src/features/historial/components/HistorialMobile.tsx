import React, { useState } from 'react';
import { Registro } from '../types';
import { labelMomento, readingTypeDe, nombreDia } from '../utils/momentos';
import { ChipGlucosa } from './ChipGlucosa';
import { GlucoseReadingType } from '@/types/daily-record';
import { estadoRango } from '@/features/patient/utils/glucosa';

interface HistorialMobileProps {
  registros: Registro[];
  hasDiabetes: boolean;
  isPregnant: boolean;
}

type Filtro = 'comidas' | 'vitales' | 'labs';

const F = "'Sora', sans-serif";

function FiltroChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: 'pointer', userSelect: 'none', fontSize: 12, fontWeight: 700, padding: '6px 12px',
        borderRadius: 999, background: active ? 'var(--accent)' : 'transparent',
        color: active ? '#03251d' : 'var(--mut)', border: '1.5px solid var(--bd)', fontFamily: F,
      }}
    >
      {children}
    </button>
  );
}

function teaserFor(row: Registro, filtro: Filtro): string {
  if (filtro === 'vitales') {
    const parts: string[] = [];
    if (row.presion_sistolica != null && row.presion_diastolica != null) parts.push(`PA ${row.presion_sistolica}/${row.presion_diastolica}`);
    if (row.frecuencia_cardiaca != null) parts.push(`FC ${row.frecuencia_cardiaca} lpm`);
    if (row.peso != null) parts.push(`${row.peso} kg`);
    return parts.length ? parts.join(' · ') : 'Sin datos de vitales';
  }
  if (filtro === 'labs') {
    const parts: string[] = [];
    if (row.hba1c != null) parts.push(`HbA1c ${row.hba1c}%`);
    if (row.colesterol_total != null) parts.push(`Col. total ${row.colesterol_total}`);
    return parts.length ? parts.join(' · ') : 'Sin laboratorios';
  }
  const n = row.glucosas_comidas?.length ?? 0;
  return n ? `${n} lectura${n === 1 ? '' : 's'} después de comer` : 'Sin lecturas adicionales';
}

/**
 * HistorialMobile — "Mi Historial" para móvil. Cada día es una card: glucosa de
 * ayuno grande + un teaser corto según el filtro activo. "Ver más detalles"
 * expande comidas, vitales, laboratorios y notas. Los chips de glucosa usan los
 * colores del wizard (respeta tipo de diabetes / embarazo vía `estadoRango`).
 */
export function HistorialMobile({ registros, hasDiabetes, isPregnant }: HistorialMobileProps) {
  const [filtro, setFiltro] = useState<Filtro>('comidas');
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  return (
    <div style={{ fontFamily: F }}>
      <div style={{ padding: '0 4px 12px', display: 'flex', gap: 7 }}>
        <FiltroChip active={filtro === 'comidas'} onClick={() => setFiltro('comidas')}>Comidas</FiltroChip>
        <FiltroChip active={filtro === 'vitales'} onClick={() => setFiltro('vitales')}>Vitales</FiltroChip>
        <FiltroChip active={filtro === 'labs'} onClick={() => setFiltro('labs')}>Laboratorios</FiltroChip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {registros.map((row) => {
          const isOpen = !!expandido[row.fecha];
          const ayuno = estadoRango(row.glucosa_ayuno ?? '', { hasDiabetes, isPregnant, readingType: GlucoseReadingType.Fasting });

          return (
            <div key={row.fecha} style={{ background: 'var(--card)', border: '1px solid var(--card-bd)', borderRadius: 16, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{nombreDia(row.fecha)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--mut)' }}>{row.fecha}</div>
                </div>
                {row.glucosa_ayuno != null ? (
                  <span style={{ padding: '6px 12px', borderRadius: 10, fontSize: 15, fontWeight: 800, background: ayuno.bg, color: ayuno.color }}>
                    {row.glucosa_ayuno} <span style={{ fontSize: 9.5, fontWeight: 600, opacity: 0.7 }}>ayuno</span>
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--mut)' }}>Sin ayuno</span>
                )}
              </div>

              <div style={{ fontSize: 12, color: 'var(--mut)', marginBottom: 8 }}>{teaserFor(row, filtro)}</div>

              {isOpen && (
                <>
                  {row.glucosas_comidas && row.glucosas_comidas.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {row.glucosas_comidas.map((m, i) => (
                        <ChipGlucosa
                          key={i}
                          valor={m.valor}
                          readingType={readingTypeDe(m)}
                          hasDiabetes={hasDiabetes}
                          isPregnant={isPregnant}
                          label={labelMomento(m.tipo)}
                        />
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 10px', fontSize: 11.5, color: 'var(--text)', background: 'var(--canvas)', borderRadius: 10, padding: '10px 12px' }}>
                    <div>Presión: <b>{row.presion_sistolica != null && row.presion_diastolica != null ? `${row.presion_sistolica}/${row.presion_diastolica}` : '—'}</b></div>
                    <div>FC: <b>{row.frecuencia_cardiaca ?? '—'}</b></div>
                    <div>Peso: <b>{row.peso ?? '—'}</b></div>
                    <div>Cintura: <b>{row.cintura ?? '—'}</b></div>
                    <div>HbA1c: <b>{row.hba1c != null ? `${row.hba1c}%` : '—'}</b></div>
                    <div>Col. Total: <b>{row.colesterol_total ?? '—'}</b></div>
                    <div>LDL: <b>{row.colesterol_ldl ?? '—'}</b></div>
                    <div>HDL: <b>{row.colesterol_hdl ?? '—'}</b></div>
                    <div>TG: <b>{row.trigliceridos ?? '—'}</b></div>
                    <div>Creatinina: <b>{row.creatinina ?? '—'}</b></div>
                    <div style={{ gridColumn: '1/-1' }}>Notas: {row.notas ?? '—'}</div>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => setExpandido((s) => ({ ...s, [row.fecha]: !s[row.fecha] }))}
                style={{ marginTop: 10, width: '100%', background: 'transparent', border: '1px solid var(--bd)', borderRadius: 10, padding: 9, fontSize: 12, fontWeight: 700, color: 'var(--mut)', fontFamily: F, cursor: 'pointer' }}
              >
                {isOpen ? 'Ocultar detalles ▲' : 'Ver más detalles ▾'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
