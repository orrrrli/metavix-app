"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { useAuthStore } from "@/features/auth/store";
import { useDailyRecords, useCreateDailyRecord } from "@/features/patient/hooks/use-daily-records";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";
import { GlucosaLectura, NuevaLectura, readingToLectura, localTodayISO } from "@/features/patient/utils/glucosa";
import RegistroGlucosaMovil from "@/features/patient/components/registro-glucosa/RegistroGlucosaMovil";
import RegistroGlucosaWeb from "@/features/patient/components/registro-glucosa/RegistroGlucosaWeb";

// recordDate llega del API como "dd/MM/yyyy".
function esHoy(recordDate: string): boolean {
  const [day, month, year] = recordDate.split("/").map(Number);
  const now = new Date();
  return (
    day === now.getDate() &&
    month === now.getMonth() + 1 &&
    year === now.getFullYear()
  );
}

function fechaLabel(): string {
  const s = new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
  return s.replace(/\./g, "").replace(",", "");
}

export default function NewRecordPage() {
  const router = useRouter();
  const { patientId } = useAuthStore();

  const { data: records, isLoading } = useDailyRecords(patientId ?? "");
  const { mutateAsync: crearRegistro, isPending: guardando } = useCreateDailyRecord(patientId ?? "");

  // Lecturas de glucosa de hoy → modelo de la bitácora, ordenadas por hora.
  const lecturasHoy = useMemo<GlucosaLectura[]>(() => {
    if (!records) return [];
    return records
      .filter((r) => esHoy(r.recordDate))
      .flatMap((r) => r.glucoseReadings)
      .map(readingToLectura)
      .sort((a, b) => a.t.localeCompare(b.t));
  }, [records]);

  const todayISO = localTodayISO();

  const onGuardar = async (lectura: NuevaLectura) => {
    try {
      await crearRegistro({
        recordDate: todayISO,
        recordTime: null,
        systolicPressure: null,
        diastolicPressure: null,
        heartRate: null,
        weightKg: null,
        waistCm: null,
        notes: null,
        glucoseReadings: [lectura],
      });
      toast.success("Lectura de glucosa guardada.");
    } catch {
      toast.error("No se pudo guardar la lectura. Intenta de nuevo.");
      throw new Error("save failed"); // evita que el wizard se reinicie
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  const fecha = fechaLabel();

  return (
    <div className="mx-auto max-w-[1160px] pb-12">
      <button
        type="button"
        onClick={() => router.push("/paciente/dashboard")}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver al panel
      </button>

      {/* Móvil */}
      <div className="lg:hidden -mx-4 sm:mx-0 sm:overflow-hidden sm:rounded-3xl sm:border sm:border-[#eee3d4]">
        <RegistroGlucosaMovil
          lecturas={lecturasHoy}
          fecha={fecha}
          onGuardar={onGuardar}
          guardando={guardando}
        />
      </div>

      {/* Escritorio */}
      <div className="hidden lg:flex lg:justify-center">
        <RegistroGlucosaWeb
          lecturas={lecturasHoy}
          fecha={fecha}
          onGuardar={onGuardar}
          guardando={guardando}
        />
      </div>
    </div>
  );
}
