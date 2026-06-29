"use client";

import { useMemo } from "react";
import { useDailyRecords } from "./use-daily-records";
import { useLabRecords } from "./use-lab-records";
import { usePatientProfile } from "./use-patient-profile";
import { MetavixIndicador, EstadoIndicador } from "../components/dashboard";

function parseDailyDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatHace(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 60) return `Medida hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Medida hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `Medida hace ${dias} ${dias === 1 ? "día" : "días"}`;
  const meses = Math.floor(dias / 30);
  return `Medida hace ${meses} ${meses === 1 ? "mes" : "meses"}`;
}

function clasificarPresion(sistolica: number, diastolica: number): { estadoLabel: string; estado: EstadoIndicador } {
  if (sistolica >= 140 || diastolica >= 90) return { estadoLabel: "Alta", estado: "bad" };
  if (sistolica >= 130 || diastolica >= 80) return { estadoLabel: "Elevada", estado: "warn" };
  if (sistolica < 90 || diastolica < 60) return { estadoLabel: "Baja", estado: "warn" };
  return { estadoLabel: "Normal", estado: "ok" };
}

function clasificarFrecuenciaCardiaca(hr: number): { estadoLabel: string; estado: EstadoIndicador } {
  if (hr < 60) return { estadoLabel: "Bradicardia", estado: "warn" };
  if (hr > 100) return { estadoLabel: "Taquicardia", estado: "bad" };
  return { estadoLabel: "Normal", estado: "info" };
}

function clasificarIMC(imc: number): { estadoLabel: string; estado: EstadoIndicador } {
  if (imc < 18.5) return { estadoLabel: "Bajo peso", estado: "warn" };
  if (imc < 25) return { estadoLabel: "Saludable", estado: "ok" };
  if (imc < 30) return { estadoLabel: "Sobrepeso", estado: "warn" };
  return { estadoLabel: "Obesidad", estado: "bad" };
}

function clasificarHbA1c(hba1c: number, hasDiabetes: boolean): { estadoLabel: string; estado: EstadoIndicador } {
  if (hasDiabetes) {
    if (hba1c > 7) return { estadoLabel: "Alta", estado: "bad" };
    if (hba1c > 6.5) return { estadoLabel: "Revisar", estado: "warn" };
    return { estadoLabel: "En meta", estado: "ok" };
  }
  if (hba1c > 5.7) return { estadoLabel: "Prediabetes", estado: "warn" };
  return { estadoLabel: "Normal", estado: "ok" };
}

function clasificarColesterol(total: number | null, ldl: number | null, hdl: number | null): { estadoLabel: string; estado: EstadoIndicador } {
  if (total !== null && total > 240) return { estadoLabel: "Alto", estado: "bad" };
  if (total !== null && total > 200) return { estadoLabel: "Límite", estado: "warn" };
  if (ldl !== null && ldl > 160) return { estadoLabel: "LDL alto", estado: "bad" };
  if (hdl !== null && hdl < 40) return { estadoLabel: "HDL bajo", estado: "warn" };
  return { estadoLabel: "Normal", estado: "ok" };
}

export type IndicadorHref =
  | "/paciente/nuevo-registro"
  | "/paciente/perfil"
  | "/paciente/herramientas/calculadora-imc"
  | "/paciente/graficas/hba1c"
  | "/paciente/graficas/colesterol-total";

export interface IndicadorConHref extends Omit<MetavixIndicador, "onClick"> {
  href?: IndicadorHref;
}

export function useOtrosIndicadores(patientId: string | null) {
  const { data: profile } = usePatientProfile(patientId ?? "");
  const { data: daily } = useDailyRecords(patientId ?? "");
  const { data: lab } = useLabRecords(patientId ?? "");

  const hasDiabetes = (profile?.diabetesType ?? "None") !== "None";

  return useMemo<{ indicadores: IndicadorConHref[]; loading: boolean }>(() => {
    const now = new Date();
    const inds: IndicadorConHref[] = [];

    const sortedDaily = [...(daily ?? [])].sort(
      (a, b) => parseDailyDate(b.recordDate).getTime() - parseDailyDate(a.recordDate).getTime()
    );
    const sortedLab = [...(lab ?? [])].sort(
      (a, b) => parseDailyDate(b.sampleDate).getTime() - parseDailyDate(a.sampleDate).getTime()
    );

    // 1) Presión arterial
    const lastBP = sortedDaily.find((r) => r.systolicPressure !== null && r.diastolicPressure !== null);
    if (lastBP && lastBP.systolicPressure !== null && lastBP.diastolicPressure !== null) {
      const { estadoLabel, estado } = clasificarPresion(lastBP.systolicPressure, lastBP.diastolicPressure);
      inds.push({
        label: "Presión arterial",
        meta: formatHace(parseDailyDate(lastBP.recordDate), now),
        valor: (
          <>
            {lastBP.systolicPressure}
            <span style={{ fontSize: 14, color: "var(--soft)", fontWeight: 500 }}>/{lastBP.diastolicPressure}</span>
          </>
        ),
        estadoLabel,
        estado,
        icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
        href: "/paciente/nuevo-registro",
      });
    } else {
      inds.push({
        label: "Presión arterial",
        meta: "Aún sin registros",
        estado: "vacio",
        icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
        href: "/paciente/nuevo-registro",
      });
    }

    // 2) Frecuencia cardíaca
    const lastHR = sortedDaily.find((r) => r.heartRate !== null);
    if (lastHR && lastHR.heartRate !== null) {
      const { estadoLabel, estado } = clasificarFrecuenciaCardiaca(lastHR.heartRate);
      inds.push({
        label: "Frecuencia cardíaca",
        meta: formatHace(parseDailyDate(lastHR.recordDate), now),
        valor: (
          <>
            {lastHR.heartRate}<span style={{ fontSize: 13, color: "var(--soft)", fontWeight: 500 }}> lpm</span>
          </>
        ),
        estadoLabel,
        estado,
        icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
        href: "/paciente/nuevo-registro",
      });
    } else {
      inds.push({
        label: "Frecuencia cardíaca",
        meta: "Aún sin registros",
        estado: "vacio",
        icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
        href: "/paciente/nuevo-registro",
      });
    }

    // 3) IMC
    const heightCm = profile?.heightCm ?? null;
    const lastWeight = sortedDaily.find((r) => r.weightKg !== null);
    if (lastWeight && lastWeight.weightKg !== null && heightCm !== null) {
      const peso = Number(lastWeight.weightKg);
      const imc = Math.round((peso / Math.pow(heightCm / 100, 2)) * 10) / 10;
      const { estadoLabel, estado } = clasificarIMC(imc);
      inds.push({
        label: "Índice de masa corporal",
        meta: formatHace(parseDailyDate(lastWeight.recordDate), now),
        valor: imc.toFixed(1),
        estadoLabel,
        estado,
        icon: (
          <>
            <path d="M12 3v6" />
            <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z" />
          </>
        ),
        href: "/paciente/herramientas/calculadora-imc",
      });
    } else {
      inds.push({
        label: "Índice de masa corporal",
        meta: heightCm === null ? "Falta tu estatura en el perfil" : "Sin registros",
        estado: "vacio",
        icon: (
          <>
            <path d="M12 3v6" />
            <path d="M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5z" />
          </>
        ),
        href: "/paciente/perfil",
      });
    }

    // 4) HbA1c
    const lastLabWithA1c = sortedLab.find((r) => r.hba1c !== null);
    if (lastLabWithA1c && lastLabWithA1c.hba1c !== null) {
      const { estadoLabel, estado } = clasificarHbA1c(Number(lastLabWithA1c.hba1c), hasDiabetes);
      inds.push({
        label: "HbA1c",
        meta: formatHace(parseDailyDate(lastLabWithA1c.sampleDate), now),
        valor: (
          <>
            {Number(lastLabWithA1c.hba1c)}<span style={{ fontSize: 13, color: "var(--soft)", fontWeight: 500 }}> %</span>
          </>
        ),
        estadoLabel,
        estado,
        icon: (
          <>
            <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
            <path d="M8 3h8" />
          </>
        ),
        href: "/paciente/graficas/hba1c",
      });
    } else {
      inds.push({
        label: "HbA1c",
        meta: "Aún sin registros este trimestre",
        estado: "vacio",
        icon: (
          <>
            <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
            <path d="M8 3h8" />
          </>
        ),
        href: "/paciente/nuevo-registro",
      });
    }

    // 5) Colesterol
    const lastLabWithLipids = sortedLab.find(
      (r) => r.totalCholesterol !== null || r.ldl !== null || r.hdl !== null
    );
    if (lastLabWithLipids) {
      const total = lastLabWithLipids.totalCholesterol !== null ? Number(lastLabWithLipids.totalCholesterol) : null;
      const ldl = lastLabWithLipids.ldl !== null ? Number(lastLabWithLipids.ldl) : null;
      const hdl = lastLabWithLipids.hdl !== null ? Number(lastLabWithLipids.hdl) : null;
      const { estadoLabel, estado } = clasificarColesterol(total, ldl, hdl);
      inds.push({
        label: "Colesterol",
        meta: formatHace(parseDailyDate(lastLabWithLipids.sampleDate), now),
        valor: total !== null ? (
          <>
            {total}<span style={{ fontSize: 13, color: "var(--soft)", fontWeight: 500 }}> mg/dL</span>
          </>
        ) : null,
        estadoLabel,
        estado,
        icon: (
          <>
            <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
            <path d="M8 3h8" />
          </>
        ),
        href: "/paciente/graficas/colesterol-total",
      });
    } else {
      inds.push({
        label: "Colesterol",
        meta: "Aún sin registros este trimestre",
        estado: "vacio",
        icon: (
          <>
            <path d="M9 3v6l-5 8a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-5-8V3" />
            <path d="M8 3h8" />
          </>
        ),
        href: "/paciente/nuevo-registro",
      });
    }

    return { indicadores: inds, loading: false };
  }, [daily, lab, profile, hasDiabetes]);
}
