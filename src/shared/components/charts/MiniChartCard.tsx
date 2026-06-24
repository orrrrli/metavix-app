"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import { ChartDefinition, MetricStatus, getStatus, extractMetricValue, resolveLimit } from "@/features/patient/chart-config";
import { DiabetesType, HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface MiniChartCardProps {
  config: ChartDefinition;
  records: HealthRecordDto[];
  diabetesType: DiabetesType;
}

const STATUS_MAP: Record<MetricStatus, { label: string; className: string }> = {
  en_meta: { label: "En meta", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  revisar: { label: "Revisar", className: "bg-amber-100 text-amber-700 border-amber-200" },
  fuera_de_meta: { label: "Fuera de meta", className: "bg-red-100 text-red-700 border-red-200" },
  sin_datos: { label: "Sin datos", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function MiniChartCard({ config, records, diabetesType }: MiniChartCardProps) {
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
      .slice(-21)
      .map(([dayKey, { values }]) => ({
        date: format(parseISO(dayKey), "MMM dd"),
        value: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      }));
  }, [records, config.campo]);

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : null;
  const status = getStatus(latestValue, config, diabetesType);
  const statusInfo = STATUS_MAP[status];

  const tooltipStyle = {
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: 'white',
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-1 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{config.titulo}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: latestValue != null ? config.color : undefined }}>
              {latestValue != null ? latestValue : "--"}
            </span>
            <span className="text-xs text-muted-foreground">{config.unidad}</span>
          </div>
        </div>
        {config.limites && (
          <Badge variant="outline" className={`text-[10px] shrink-0 ${statusInfo.className}`}>
            {statusInfo.label}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-2 pb-3 flex flex-col justify-between">
        <div className="mt-4 w-full">
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id={`grad-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6A7B78" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6A7B78" }} dx={-10} domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']} />
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
                        <p style={{ color: '#6A7B78' }}>Mín: {d.min} / Máx: {d.max}</p>
                        <p style={{ color: '#6A7B78' }}>Mediciones: {d.count}</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${config.id})`}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: config.color }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              Datos insuficientes
            </div>
          )}
        </div>
        <Link href={config.ruta} className="mt-2">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary h-7">
            Ver gráfica completa <ArrowRight className="size-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
