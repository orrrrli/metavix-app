"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, HeartPulse, Droplet, Weight } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useMockDb } from "@/features/mock-db/store";
import { HealthRecordDto } from "@/features/patient/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function PatientDashboard() {
  const { userId } = useAuthStore();
  const { records, patients } = useMockDb();
  
  const [patientRecords, setPatientRecords] = useState<HealthRecordDto[]>([]);
  const [patientProfile, setPatientProfile] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      const filtered = records.filter(r => r.patientId === userId).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setPatientRecords(filtered);
      
      const profile = patients.find(p => p.id === userId);
      setPatientProfile(profile);
    }
  }, [userId, records, patients]);

  if (!patientProfile) return null;

  const latestRecord = patientRecords[0];

  const chartData = [...patientRecords].reverse().map(record => ({
    date: format(parseISO(record.timestamp), "MMM dd"),
    fasting: record.fastingGlucose,
    post1h: record.postprandial1hGlucose,
    systolic: record.systolicBP,
    diastolic: record.diastolicBP
  })).slice(-10); // Last 10 records for chart

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">Bienvenido(a), {patientProfile.firstName}</h2>
          <p className="text-muted-foreground">Aquí está tu resumen clínico del día de hoy.</p>
        </div>
        <Link href="/patient/new-record">
          <Button size="lg" className="shadow-sm">Registrar Nueva Lectura</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Glucosa en Ayunas</CardTitle>
            <Droplet className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.fastingGlucose || "--"} <span className="text-sm text-muted-foreground font-normal">mg/dL</span></div>
            <p className="text-xs text-muted-foreground mt-1">Registrado {latestRecord ? format(parseISO(latestRecord.timestamp), "MMM dd, HH:mm") : ""}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presión Arterial</CardTitle>
            <HeartPulse className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.systolicBP || "--"}/{latestRecord?.diastolicBP || "--"} <span className="text-sm text-muted-foreground font-normal">mmHg</span></div>
            <p className="text-xs text-muted-foreground mt-1">Última lectura cardiovascular</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frecuencia Cardíaca</CardTitle>
            <Activity className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.heartRate || "--"} <span className="text-sm text-muted-foreground font-normal">lpm</span></div>
            <p className="text-xs text-muted-foreground mt-1">Dentro del rango normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Corporal</CardTitle>
            <Weight className="size-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.weightKg || patientProfile.weightKg} <span className="text-sm text-muted-foreground font-normal">kg</span></div>
            <p className="text-xs text-muted-foreground mt-1">Peso actual registrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tendencias de Glucosa</CardTitle>
            <CardDescription>Ayunas vs Posprandial (Últimas 10 lecturas)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10} domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" name="Ayunas (mg/dL)" dataKey="fasting" stroke="#00BFA5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
                  <Line type="monotone" name="Posprandial 1h (mg/dL)" dataKey="post1h" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No hay datos recientes</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Historial de Presión Arterial</CardTitle>
            <CardDescription>Seguimiento Sistólico y Diastólico</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8DFD4" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6A7B78" }} dx={-10} domain={[40, 200]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" name="Sistólica (mmHg)" dataKey="systolic" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" name="Diastólica (mmHg)" dataKey="diastolic" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No hay datos recientes</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
