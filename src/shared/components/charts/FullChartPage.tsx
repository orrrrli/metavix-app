"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ChartDefinition, extractMetricValue, resolveLimit, getStatus } from "@/features/patient/chart-config";
import { DiabetesType, HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardHeader, CardTitle, MetavixButton, MetavixBadge, type MetavixBadgeProps } from "@/shared/components/ui/metavix";

interface FullChartPageProps {
  config: ChartDefinition;
  records: HealthRecordDto[];
  diabetesType: DiabetesType;
}

const STATUS_LABEL: Record<string, string> = {
  en_meta: "En meta",
  revisar: "Revisar",
  fuera_de_meta: "Fuera de meta",
  sin_datos: "Sin datos",
};

const STATUS_VARIANT: Record<string, MetavixBadgeProps["variant"]> = {
  en_meta: "ok",
  revisar: "warn",
  fuera_de_meta: "bad",
  sin_datos: "neutral",
};

export function FullChartPage({ config, records, diabetesType }: FullChartPageProps) {
  const chartData = useMemo(() => {
    const groups = new Map<string, { values: number[]; timestamp: Date }>();

    for (const r of records) {
      const value = extractMetricValue(r, config.campo);
      if (value == null) continue;
      const dayKey = format(parseISO(r.timestamp), "yyyy-MM-dd");
      const existing = groups.get(dayKey);
      if (existing) {
        existing.values.push(value);
      } else {
        groups.set(dayKey, { values: [value], timestamp: parseISO(r.timestamp) });
      }
    }

    return Array.from(groups.entries())
      .sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime())
      .map(([dayKey, { values }]) => ({
        date: format(parseISO(dayKey), "MMM dd, yyyy"),
        value: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      }));
  }, [records, config.campo]);

  const values = chartData.map(d => d.value).filter(v => v != null) as number[];
  const latestValue = values.length > 0 ? values[values.length - 1] : null;
  const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length) : null;
  const max = values.length > 0 ? Math.max(...values) : null;

  const supLimit = config.limites?.superior ? resolveLimit(config.limites.superior, diabetesType) : null;
  const infLimit = config.limites?.inferior ? resolveLimit(config.limites.inferior, diabetesType) : null;

  const status = getStatus(latestValue, config, diabetesType);

  const tooltipStyle: React.CSSProperties = {
    borderRadius: '8px',
    border: '1px solid var(--bd)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: 'var(--card)',
    color: 'var(--text)',
  };
  const tooltipMuted: React.CSSProperties = { color: 'var(--mut)' };

  // Calculate Y domain to include reference lines
  const allVals = [...values];
  if (supLimit != null) allVals.push(supLimit);
  if (infLimit != null) allVals.push(infLimit);
  const yMin = allVals.length > 0 ? Math.min(...allVals) : 0;
  const yMax = allVals.length > 0 ? Math.max(...allVals) : 100;
  const padding = (yMax - yMin) * 0.15 || 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/paciente/dashboard">
          <MetavixButton
            variant="secondary"
            size="sm"
            className="shrink-0"
            style={{ width: 36, height: 36, padding: 0 }}
            aria-label="Volver al dashboard"
          >
            <ArrowLeft className="size-4" />
          </MetavixButton>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>{config.titulo}</h2>
            <MetavixBadge variant={STATUS_VARIANT[status]}>
              {STATUS_LABEL[status]}
            </MetavixBadge>
          </div>
          <p className="mt-1" style={{ color: 'var(--mut)' }}>
            Historial completo de {config.titulo} ({config.unidad})
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mut)', fontWeight: 600 }}>
              Último valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: config.color }}>
              {latestValue != null ? latestValue : "--"}
              <span className="text-sm font-normal ml-1" style={{ color: 'var(--mut)' }}>{config.unidad}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mut)', fontWeight: 600 }}>
              Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
              {avg != null ? Number(avg.toFixed(1)) : "--"}
              <span className="text-sm font-normal ml-1" style={{ color: 'var(--mut)' }}>{config.unidad}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mut)', fontWeight: 600 }}>
              Máximo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: 'var(--bad)' }}>
              {max != null ? max : "--"}
              <span className="text-sm font-normal ml-1" style={{ color: 'var(--mut)' }}>{config.unidad}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--mut)', fontWeight: 600 }}>
              Registros totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{values.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Full Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{config.titulo} — Análisis Longitudinal</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--bd)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--mut)" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--mut)" }}
                  dx={-10}
                  domain={[Math.floor(yMin - padding), Math.ceil(yMax + padding)]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={tooltipStyle}>
                        <p style={{ fontWeight: 600, marginBottom: '4px' }}>{d.date}</p>
                        <p>
                          Promedio:{" "}
                          <span style={{ fontWeight: 500, color: config.color }}>
                            {d.value} {config.unidad}
                          </span>
                        </p>
                        <p style={tooltipMuted}>Mín: {d.min} / Máx: {d.max}</p>
                        <p style={tooltipMuted}>Mediciones: {d.count}</p>
                      </div>
                    );
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                {/* Main data line */}
                <Line
                  type="monotone"
                  name={`${config.titulo} (${config.unidad})`}
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />

                {/* Reference Lines */}
                {supLimit != null && (
                  <ReferenceLine
                    y={supLimit}
                    stroke="var(--bad)"
                    strokeDasharray="8 4"
                    strokeWidth={2}
                    label={{ value: `Límite sup. ${supLimit}`, position: 'insideTopRight', fontSize: 11, fill: 'var(--bad)' }}
                  />
                )}
                {infLimit != null && (
                  <ReferenceLine
                    y={infLimit}
                    stroke="var(--info)"
                    strokeDasharray="8 4"
                    strokeWidth={2}
                    label={{ value: `Límite inf. ${infLimit}`, position: 'insideBottomRight', fontSize: 11, fill: 'var(--info)' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center" style={{ color: 'var(--mut)' }}>
              No hay registros de {config.titulo}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
