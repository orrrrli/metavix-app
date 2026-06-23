"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";

import { ChartDefinition, MetricStatus, getStatus, extractMetricValue, resolveLimit } from "@/features/patient/chart-config";
import { DiabetesType, HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface MiniChartCardProps {
  config: ChartDefinition;
  records: HealthRecordDto[];
  diabetesType: DiabetesType;
  gender?: string | null;
  companionField?: string;
  companionLabel?: string;
  companionUnit?: string;
}

const STATUS_MAP: Record<MetricStatus, { label: string; className: string }> = {
  en_meta: { label: "En meta", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  revisar: { label: "Revisar", className: "bg-amber-100 text-amber-700 border-amber-200" },
  fuera_de_meta: { label: "Fuera de meta", className: "bg-red-100 text-red-700 border-red-200" },
  sin_datos: { label: "Sin datos", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function MiniChartCard({ config, records, diabetesType, gender, companionField, companionLabel, companionUnit }: MiniChartCardProps) {
  const chartData = [...records]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(r => ({
      date: format(parseISO(r.timestamp), "MMM dd"),
      value: extractMetricValue(r, config.campo),
      companion: companionField ? ((r as unknown as Record<string, unknown>)[companionField] as number | null) ?? null : null,
    }))
    .filter(d => d.value != null)
    .slice(-21);

  const latestValue = chartData.length > 0 ? chartData[chartData.length - 1].value : null;
  const latestCompanion: number | null = companionField ? chartData.at(-1)?.companion ?? null : null;
  const status = getStatus(latestValue, config, diabetesType, gender);
  const statusInfo = STATUS_MAP[status];

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
          {companionLabel != null && latestCompanion != null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{companionLabel}:</span>
              <span className="font-medium text-foreground">{latestCompanion}{companionUnit}</span>
            </div>
          )}
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
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '4px 8px' }}
                  labelStyle={{ display: 'none' }}
                  itemStyle={{ color: config.color }}
                  formatter={(value: any) => [`${value} ${config.unidad}`, config.titulo]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${config.id})`}
                  dot={companionField ? { r: 3, fill: config.color, strokeWidth: 0 } : false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: config.color }}
                  connectNulls
                >
                  {companionField && (
                    <LabelList
                      dataKey="companion"
                      position="top"
                      style={{ fontSize: 9, fill: '#6A7B78' }}
                      formatter={(v: unknown) => (v != null ? `${v}cm` : '')}
                    />
                  )}
                </Area>
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
