"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { useLabRecords } from "@/features/patient/hooks/use-lab-records";
import { useDailyRecords } from "@/features/patient/hooks/use-daily-records";
import { usePatientProfile } from "@/features/patient/hooks/use-patient-profile";
import { useEvaluateGoals } from "@/features/patient/hooks/use-evaluate-goals";
import { ParametroMeta } from "../ParametroMeta";
import { ResumenControl } from "../ResumenControl";
import { GoalEvaluationCard } from "../GoalEvaluationCard";
import { goalEvalToViews } from "../../utils/goal-eval-to-view";
import { PARAMETROS_META, EvaluacionMeta } from "../../data/parametros";
import { GlucoseReadingType } from "@/types/daily-record";
import { GoalStatus, GoalEvaluationResponse } from "@/types/goal-evaluation";

const DEFAULT_EVALUACIONES: Record<string, EvaluacionMeta> = PARAMETROS_META.reduce(
  (acc, p) => ({ ...acc, [p.id]: { estado: "sin_dato", color: "var(--ph)" } }),
  {} as Record<string, EvaluacionMeta>,
);

function parseApiDate(dateStr: string): Date {
  const [d, m, y] = dateStr.split("/").map(Number);
  return new Date(y, m - 1, d);
}

function mapGoalStatus(status: GoalStatus): EvaluacionMeta {
  switch (status) {
    case "InRange":    return { estado: "en_meta",    color: "var(--ok)" };
    case "AtRisk":     return { estado: "cuidado",    color: "var(--warn)" };
    case "OutOfRange": return { estado: "fuera_meta", color: "var(--bad)" };
    case "NoData":     return { estado: "sin_dato",   color: "var(--ph)" };
  }
}

export function MetasControl() {
  const { patientId } = useAuthStore();

  // T2: fetch all data needed for pre-population
  const { data: labRecords,    isLoading: loadingLab     } = useLabRecords(patientId ?? "");
  const { data: dailyRecords,  isLoading: loadingDaily   } = useDailyRecords(patientId ?? "");
  const { data: profile,       isLoading: loadingProfile } = usePatientProfile(patientId ?? "");
  const { mutateAsync: evaluate, isPending: isEvaluating } = useEvaluateGoals(patientId ?? "");

  const [evaluaciones, setEvaluaciones] = useState<Record<string, EvaluacionMeta>>(DEFAULT_EVALUACIONES);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [evalResult, setEvalResult] = useState<GoalEvaluationResponse | null>(null);

  const isLoading = loadingLab || loadingDaily || loadingProfile;

  // T3: sort daily records newest-first, derive fasting glucose from most recent fasting reading
  const sortedDailyRecords = [...(dailyRecords ?? [])].sort(
    (a, b) => parseApiDate(b.recordDate).getTime() - parseApiDate(a.recordDate).getTime(),
  );

  let fastingGlucose: number | null = null;
  for (const record of sortedDailyRecords) {
    const reading = record.glucoseReadings.find(
      (r) => r.readingType === GlucoseReadingType.Fasting,
    );
    if (reading) {
      fastingGlucose = reading.valueMgDl;
      break;
    }
  }

  // T4: compute IMC from most recent weight + profile height
  const latestWeightKg = sortedDailyRecords.find((r) => r.weightKg !== null)?.weightKg ?? null;
  const heightCm = profile?.heightCm ?? null;
  const imc =
    latestWeightKg !== null && heightCm !== null
      ? latestWeightKg / Math.pow(heightCm / 100, 2)
      : null;

  const latestSBP = sortedDailyRecords.find((r) => r.systolicPressure !== null)?.systolicPressure ?? null;

  const sortedLabRecords = [...(labRecords ?? [])].sort(
    (a, b) => parseApiDate(b.sampleDate).getTime() - parseApiDate(a.sampleDate).getTime(),
  );

  // T5: derived read-only values — no manual input
  const valores: Record<string, string> = {
    hba1c:  sortedLabRecords.find((r) => r.hba1c !== null)?.hba1c?.toString() ?? "",
    glucosa: fastingGlucose?.toString() ?? "",
    pas:    latestSBP?.toString() ?? "",
    ldl:    sortedLabRecords.find((r) => r.ldl !== null)?.ldl?.toString() ?? "",
    imc:    imc !== null ? imc.toFixed(1) : "",
  };

  // T6: call evaluation API; T7: map GoalStatus → EvaluacionMeta
  const handleEvaluar = async () => {
    try {
      const result = await evaluate();
      setEvalResult(result);
      const newEvaluaciones: Record<string, EvaluacionMeta> = {};
      PARAMETROS_META.forEach((param) => {
        const item = result.items.find((i) => i.parameterId === param.id);
        newEvaluaciones[param.id] = item
          ? mapGoalStatus(item.status)
          : { estado: "sin_dato", color: "var(--ph)" };
      });
      setEvaluaciones(newEvaluaciones);
      setMostrarResumen(true);
      setTimeout(() => {
        document.getElementById("resumen-metas")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      toast.error("No se pudo evaluar las metas. Inténtalo de nuevo.");
    }
  };

  const resultadosFormateados = PARAMETROS_META.map((param) => ({
    param,
    valor: valores[param.id] ?? "",
    evaluacion: evaluaciones[param.id],
  }));

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20"
        style={{ color: "var(--mut)" }}
      >
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Cargando tus datos clínicos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      {profile?.isPregnant && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 p-4 rounded-lg border-2"
          style={{ background: 'var(--info-bg)', borderColor: 'var(--info)' }}
        >
          <div
            className="flex items-center justify-center size-9 rounded-full shrink-0"
            style={{ background: 'var(--info)' }}
          >
            <Info className="size-5" style={{ color: '#fff' }} aria-hidden="true" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-base font-semibold" style={{ color: 'var(--text)' }}>
              Estás en modo embarazo
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
              Las metas clínicas que ves están ajustadas para el embarazo. Las metas personalizadas
              que tenías antes quedan en pausa y se reactivarán cuando se desactive el embarazo.
            </p>
          </div>
        </div>
      )}

      <p className="text-lg mb-8" style={{ color: "var(--mut)" }}>
        Tus últimos resultados disponibles han sido cargados automáticamente. Los parámetros sin datos no cuentan con registros recientes.
      </p>

      <div className="space-y-4">
        {PARAMETROS_META.map((param) => (
          <ParametroMeta
            key={param.id}
            param={param}
            valor={valores[param.id] ?? ""}
            colorActual={evaluaciones[param.id].color}
            readOnly
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          onClick={handleEvaluar}
          disabled={isEvaluating}
          className="w-full sm:w-auto h-14 px-10 text-lg shadow-md"
        >
          {isEvaluating && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
          Evaluar mis metas
        </Button>
      </div>

      {mostrarResumen && <ResumenControl resultados={resultadosFormateados} />}

      {evalResult && (
        <div className="mt-8">
          <GoalEvaluationCard
            items={goalEvalToViews(evalResult)}
            evaluatedAt={evalResult.evaluatedAt}
          />
        </div>
      )}

      <div
        className="mt-12 pt-6 border-t text-center text-sm"
        style={{ borderColor: "var(--bd)", color: "var(--mut)" }}
      >
        <p>Valores de referencia basados en los estándares de atención médica de la ADA (Standards of Care 2026).</p>
      </div>
    </div>
  );
}
