"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import {
  MetavixEstadoVacio,
  MetavixOtrosIndicadores,
  MetavixProgresoDia,
  MetavixTendenciaCard,
  MetavixUltimaLectura,
  type MetavixIndicador,
} from "@/features/patient/components/dashboard";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";
import type { GlucosaResumen } from "@/features/patient/hooks/use-glucosa-resumen";
import type {
  IndicadorData,
  IndicadorIcon,
} from "@/features/patient/view-data/build-otros-indicadores-view-data";
import { dashboardStrings } from "./strings/es";

/** Iconos SVG (path/g 24x24) por clave. El view-data es puro; el JSX vive aquí. */
const INDICADOR_ICON: Record<IndicadorIcon, React.ReactNode> = {
  presion: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  ),
  corazon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  imc: (
    <>
      <path d="M12 3v6" />
      <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z" />
    </>
  ),
  lab: (
    <>
      <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
      <path d="M8 3h8" />
    </>
  ),
};

/** Ensambla el nodo `valor` de un indicador a partir de sus partes de texto. */
function renderValor(ind: IndicadorData): React.ReactNode {
  if (ind.valorPrincipal === undefined) return undefined;
  return (
    <>
      {ind.valorPrincipal}
      {ind.valorSecundario && (
        <span style={{ fontSize: 14, color: "var(--soft)", fontWeight: 500 }}>
          {ind.valorSecundario}
        </span>
      )}
      {ind.valorUnidad && (
        <span style={{ fontSize: 13, color: "var(--soft)", fontWeight: 500 }}>
          {ind.valorUnidad}
        </span>
      )}
    </>
  );
}

export interface DashboardScreenProps {
  resumen: GlucosaResumen;
  indicadores: IndicadorData[];
  rango: "7d" | "14d" | "30d";
  onRangoChange: (rango: "7d" | "14d" | "30d") => void;
  onRegistrar: () => void;
  onHistorial: () => void;
  onRetry: () => void;
  onIndicadorClick: (href: string) => void;
}

/**
 * UI pura del dashboard del paciente. Recibe el `GlucosaResumen` ya resuelto y
 * los `IndicadorData` — sin queries ni derivaciones. La lógica vive en
 * `view-data/` y `hooks/`.
 */
export function DashboardScreen({
  resumen,
  indicadores,
  rango,
  onRangoChange,
  onRegistrar,
  onHistorial,
  onRetry,
  onIndicadorClick,
}: DashboardScreenProps) {
  if (resumen.loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  // Issue #7: error de fetch NO debe mostrarse como "sin registros".
  if (resumen.error) {
    return (
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center"
        style={{ color: "var(--mut)" }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
          {dashboardStrings.errorTitle}
        </p>
        <p style={{ fontSize: 13.5, margin: 0 }}>{dashboardStrings.errorBody}</p>
        <button
          onClick={onRetry}
          className="mt-1 rounded-xl px-5 py-2 text-sm font-semibold transition-colors"
          style={{
            background: "var(--accent)",
            color: "#03251d",
            fontFamily: "'Sora', sans-serif",
            border: "none",
            cursor: "pointer",
          }}
        >
          {dashboardStrings.retryButton}
        </button>
      </div>
    );
  }

  if (!resumen.tieneRegistros) {
    return <MetavixEstadoVacio onRegistrar={onRegistrar} />;
  }

  const indicadoresUI: MetavixIndicador[] = indicadores.map((ind) => ({
    label: ind.label,
    meta: ind.meta,
    valor: renderValor(ind),
    estadoLabel: ind.estadoLabel,
    estado: ind.estado,
    icon: INDICADOR_ICON[ind.iconKey],
    onClick: () => onIndicadorClick(ind.href),
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {resumen.valor !== null &&
        resumen.estado &&
        resumen.estadoLabel &&
        resumen.contexto &&
        resumen.registradaHace && (
          <MetavixUltimaLectura
            valor={resumen.valor}
            estado={resumen.estado}
            estadoLabel={resumen.estadoLabel}
            contexto={resumen.contexto}
            registradaHace={resumen.registradaHace}
            rangoObjetivo={resumen.rangoObjetivo}
            proximaMedicion={resumen.proximaMedicion ?? dashboardStrings.proximaMedicionFallback}
            onRegistrar={onRegistrar}
            onHistorial={onHistorial}
          />
        )}

      <MetavixProgresoDia
        medicionesHoy={resumen.medicionesHoy}
        metaDiaria={resumen.metaDiaria}
        horasDesde={resumen.horasDesde}
        enMeta={resumen.enMeta}
        totalLecturas={resumen.totalLecturas}
      />

      <MetavixTendenciaCard
        promedio={resumen.promedioVentana ?? resumen.promedio30d ?? 0}
        porcentajeEnRango={resumen.porcentajeEnRango}
        rango={rango}
        onRangoChange={(id: string) => onRangoChange(id as "7d" | "14d" | "30d")}
      >
        {resumen.serieVentana.length >= 2 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={resumen.serieVentana} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="mvx-glucosa-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bd)" />
              <XAxis
                dataKey="fecha"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--soft)" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--soft)" }}
                dx={-8}
                domain={["dataMin - 20", "dataMax + 20"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as {
                    fecha: string;
                    promedio: number;
                    min: number;
                    max: number;
                    lecturas: number;
                  };
                  return (
                    <div
                      style={{
                        borderRadius: 10,
                        border: "1.5px solid var(--card-bd)",
                        background: "var(--card)",
                        boxShadow: "0 8px 20px rgba(20,40,30,.12)",
                        fontSize: 12,
                        padding: "8px 12px",
                        color: "var(--text)",
                      }}
                    >
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>{d.fecha}</p>
                      <p>
                        Promedio:{" "}
                        <span style={{ fontWeight: 600, color: "var(--accent)" }}>
                          {d.promedio} mg/dL
                        </span>
                      </p>
                      <p style={{ color: "var(--mut)" }}>
                        Mín: {d.min} · Máx: {d.max}
                      </p>
                      <p style={{ color: "var(--mut)" }}>Mediciones: {d.lecturas}</p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="promedio"
                stroke="var(--accent)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mvx-glucosa-grad)"
                dot={{ r: 3, strokeWidth: 0, fill: "var(--accent)" }}
                activeDot={{ r: 5, strokeWidth: 0, fill: "var(--accent)" }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 300,
              borderRadius: 14,
              background: "var(--ph)",
              border: "1.5px dashed var(--bd)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--soft)",
              fontSize: 13,
            }}
          >
            {dashboardStrings.sinTendencia}
          </div>
        )}
      </MetavixTendenciaCard>

      <MetavixOtrosIndicadores indicadores={indicadoresUI} />
    </div>
  );
}
