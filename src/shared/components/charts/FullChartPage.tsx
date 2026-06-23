"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ChartDefinition, extractMetricValue, resolveLimit, getStatus } from "@/features/patient/chart-config";
import { DiabetesType, HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

interface FullChartPageProps {
  config: ChartDefinition;
  records: HealthRecordDto[];
  diabetesType: DiabetesType;
  gender?: string | null;
}

export function FullChartPage({ config, records, diabetesType, gender }: FullChartPageProps) {
  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(r => ({
        date: format(parseISO(r.timestamp), "MMM dd, yyyy"),
        value: extractMetricValue(r, config.campo),
      }))
      .filter(d => d.value != null);
  }, [records, config.campo]);

  const values = chartData.map(d => d.value).filter(v => v != null) as number[];
  const latestValue = values.length > 0 ? values[values.length - 1] : null;
  const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length) : null;
  const max = values.length > 0 ? Math.max(...values) : null;
  const min = values.length > 0 ? Math.min(...values) : null;

  const supLimit = config.limites?.superior ? resolveLimit(config.limites.superior, diabetesType, gender) : null;
  const infLimit = config.limites?.inferior ? resolveLimit(config.limites.inferior, diabetesType, gender) : null;

  const status = getStatus(latestValue, config, diabetesType, gender);
  const statusMap = {
    en_meta: { label: "En meta", cls: "bg-emerald-100 text-emerald-700" },
    revisar: { label: "Revisar", cls: "bg-amber-100 text-amber-700" },
    fuera_de_meta: { label: "Fuera de meta", cls: "bg-red-100 text-red-700" },
    sin_datos: { label: "Sin datos", cls: "bg-gray-100 text-gray-500" },
  };

  const tooltipStyle = { borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

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
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-display font-bold text-foreground">{config.titulo}</h2>
            <Badge variant="outline" className={statusMap[status].cls}>
              {statusMap[status].label}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Historial completo de {config.titulo} ({config.unidad})
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Último valor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: config.color }}>
              {latestValue != null ? latestValue : "--"}
              <span className="text-sm font-normal text-muted-foreground ml-1">{config.unidad}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {avg != null ? Number(avg.toFixed(1)) : "--"}
              <span className="text-sm font-normal text-muted-foreground ml-1">{config.unidad}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Máximo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {max != null ? max : "--"}
              <span className="text-sm font-normal text-muted-foreground ml-1">{config.unidad}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Registros totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{values.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Full Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{config.titulo} — Análisis Longitudinal</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6A7B78" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6A7B78" }}
                  dx={-10}
                  domain={[Math.floor(yMin - padding), Math.ceil(yMax + padding)]}
                />
                <Tooltip contentStyle={tooltipStyle} />
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
                    stroke="#EF4444"
                    strokeDasharray="8 4"
                    strokeWidth={2}
                    label={{ value: `Límite sup. ${supLimit}`, position: 'insideTopRight', fontSize: 11, fill: '#EF4444' }}
                  />
                )}
                {infLimit != null && (
                  <ReferenceLine
                    y={infLimit}
                    stroke="#3B82F6"
                    strokeDasharray="8 4"
                    strokeWidth={2}
                    label={{ value: `Límite inf. ${infLimit}`, position: 'insideBottomRight', fontSize: 11, fill: '#3B82F6' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No hay registros de {config.titulo}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
