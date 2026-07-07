"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { useAuthStore } from "@/features/auth/store";
import { useGlucosaResumen } from "@/features/patient/hooks/use-glucosa-resumen";
import { useOtrosIndicadores } from "@/features/patient/hooks/use-otros-indicadores";
import {
  MetavixEstadoVacio,
  MetavixOtrosIndicadores,
  MetavixProgresoDia,
  MetavixTendenciaCard,
  MetavixUltimaLectura,
} from "@/features/patient/components/dashboard";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";

const RANGO_DAYS: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30 };

export default function PatientDashboard() {
  const { patientId } = useAuthStore();
  const router = useRouter();
  const resumen = useGlucosaResumen(patientId);
  const { indicadores } = useOtrosIndicadores(patientId);
  const [rango, setRango] = useState("7d");

  const handleRegistrar = () => router.push("/paciente/nuevo-registro");
  const handleHistorial = () => router.push("/paciente/historial");
  const handleEstadoVacioRegistrar = handleRegistrar;

  const indicadoresConClick = useMemo(
    () => indicadores.map((ind) => ({
      ...ind,
      onClick: ind.href ? () => router.push(ind.href as string) : undefined,
    })),
    [indicadores, router]
  );

  const datosGrafica = useMemo(() => {
    const dias = RANGO_DAYS[rango] ?? 7;
    return resumen.serieGrafica.slice(-dias);
  }, [rango, resumen.serieGrafica]);

  if (resumen.loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  if (!resumen.tieneRegistros) {
    return <MetavixEstadoVacio onRegistrar={handleEstadoVacioRegistrar} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {resumen.valor !== null && resumen.estado && resumen.estadoLabel && resumen.contexto && resumen.registradaHace && (
        <MetavixUltimaLectura
          valor={resumen.valor}
          estado={resumen.estado}
          estadoLabel={resumen.estadoLabel}
          contexto={resumen.contexto}
          registradaHace={resumen.registradaHace}
          rangoObjetivo={resumen.rangoObjetivo}
          proximaMedicion={resumen.proximaMedicion ?? "Cuando puedas — te toca una nueva lectura"}
          onRegistrar={handleRegistrar}
          onHistorial={handleHistorial}
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
        promedio={resumen.promedio30d ?? 0}
        porcentajeEnRango={resumen.porcentajeEnRango}
        rango={rango}
        onRangoChange={setRango}
      >
        {datosGrafica.length >= 2 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosGrafica} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
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
                  const d = payload[0].payload as { fecha: string; promedio: number; min: number; max: number; lecturas: number };
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
                        <span style={{ fontWeight: 600, color: "var(--accent)" }}>{d.promedio} mg/dL</span>
                      </p>
                      <p style={{ color: "var(--mut)" }}>Mín: {d.min} · Máx: {d.max}</p>
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
            Aún no hay suficientes días para mostrar tu tendencia.
          </div>
        )}
      </MetavixTendenciaCard>

      <MetavixOtrosIndicadores indicadores={indicadoresConClick} />
    </div>
  );
}
