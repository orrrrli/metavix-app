"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store";
import { useCreateDailyRecord } from "@/features/patient/hooks/use-daily-records";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

function horaActual(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function PresionArterialPage() {
  const { patientId } = useAuthStore();
  const { mutate: createRecord, isPending } = useCreateDailyRecord(patientId ?? "");

  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [notas, setNotas] = useState("");

  const reset = () => {
    setSistolica("");
    setDiastolica("");
    setFrecuencia("");
    setNotas("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error("No hay sesión de paciente activa.");
      return;
    }

    createRecord(
      {
        recordDate: new Date().toISOString().split("T")[0],
        recordTime: horaActual(),
        systolicPressure: Number(sistolica),
        diastolicPressure: Number(diastolica),
        heartRate: frecuencia !== "" ? Number(frecuencia) : null,
        weightKg: null,
        waistCm: null,
        notes: notas.trim() !== "" ? notas.trim() : null,
        glucoseReadings: null,
      },
      {
        onSuccess: () => {
          toast.success("Presión arterial registrada correctamente");
          reset();
        },
        onError: () => toast.error("Error al guardar la medición"),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: "var(--text)" }}>
          Presión arterial
        </h2>
        <p className="mt-1" style={{ color: "var(--mut)" }}>
          Registra tu presión arterial y frecuencia cardíaca para dar seguimiento junto a tu médico.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sistolica">Sistólica (mmHg)</Label>
            <Input
              id="sistolica"
              type="number"
              min="60"
              max="260"
              required
              placeholder="Ej. 120"
              value={sistolica}
              onChange={(e) => setSistolica(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diastolica">Diastólica (mmHg)</Label>
            <Input
              id="diastolica"
              type="number"
              min="40"
              max="160"
              required
              placeholder="Ej. 80"
              value={diastolica}
              onChange={(e) => setDiastolica(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frecuencia">
            Frecuencia cardíaca (lpm) <span className="text-muted-foreground font-normal">— opcional</span>
          </Label>
          <Input
            id="frecuencia"
            type="number"
            min="30"
            max="220"
            placeholder="Ej. 72"
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notas">
            Notas <span className="text-muted-foreground font-normal">— opcional</span>
          </Label>
          <Input
            id="notas"
            type="text"
            maxLength={280}
            placeholder="Ej. En reposo, antes del desayuno"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-12 text-lg">
          {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
          {isPending ? "Guardando..." : "Guardar medición"}
        </Button>
      </form>
    </div>
  );
}
