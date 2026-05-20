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
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">Welcome back, {patientProfile.firstName}</h2>
          <p className="text-muted-foreground">Here is your clinical overview for today.</p>
        </div>
        <Link href="/patient/new-record">
          <Button size="lg" className="shadow-sm">Log New Reading</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Fasting Glucose</CardTitle>
            <Droplet className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.fastingGlucose || "--"} <span className="text-sm text-muted-foreground font-normal">mg/dL</span></div>
            <p className="text-xs text-muted-foreground mt-1">Recorded {latestRecord ? format(parseISO(latestRecord.timestamp), "MMM dd, HH:mm") : ""}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <HeartPulse className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.systolicBP || "--"}/{latestRecord?.diastolicBP || "--"} <span className="text-sm text-muted-foreground font-normal">mmHg</span></div>
            <p className="text-xs text-muted-foreground mt-1">Latest cardiovascular reading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resting Heart Rate</CardTitle>
            <Activity className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.heartRate || "--"} <span className="text-sm text-muted-foreground font-normal">bpm</span></div>
            <p className="text-xs text-muted-foreground mt-1">Within normal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Weight</CardTitle>
            <Weight className="size-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestRecord?.weightKg || patientProfile.weightKg} <span className="text-sm text-muted-foreground font-normal">kg</span></div>
            <p className="text-xs text-muted-foreground mt-1">Current logged weight</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Glucose Trends</CardTitle>
            <CardDescription>Fasting vs Postprandial (Last 10 entries)</CardDescription>
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
                  <Line type="monotone" name="Fasting (mg/dL)" dataKey="fasting" stroke="#00BFA5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
                  <Line type="monotone" name="Postprandial 1h (mg/dL)" dataKey="post1h" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No recent data</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Blood Pressure History</CardTitle>
            <CardDescription>Systolic & Diastolic Tracking</CardDescription>
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
                  <Line type="monotone" name="Systolic (mmHg)" dataKey="systolic" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" name="Diastolic (mmHg)" dataKey="diastolic" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No recent data</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
