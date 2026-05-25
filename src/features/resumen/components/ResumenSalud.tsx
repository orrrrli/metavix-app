"use client";

import { useRef, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { usePatientResumen } from "@/features/patient/hooks/use-patient-resumen";
import { EncabezadoResumen } from "./EncabezadoResumen";
import { AvisoLegal, PieResumen } from "./AvisoLegal";
import { SeccionMetrica } from "./SeccionMetrica";
import { calcularEstadoMetrica } from "../utils/interpretacionADA";
import { Button } from "@/shared/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { PatientMetricasResponse } from "@/types/patient-resumen";

type MetricaKey = keyof PatientMetricasResponse;

export function ResumenSalud() {
  const { patientId } = useAuthStore();
  const { data, isLoading, isError } = usePatientResumen(patientId ?? '');
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportarPDF = async () => {
    if (!pdfRef.current || !data) return;
    setIsExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const fechaStr = format(new Date(), "yyyy-MM-dd");
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `resumen-salud-${fechaStr}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      await html2pdf().set(opt as any).from(pdfRef.current).save();
    } catch (e) {
      console.error('[exportarPDF] Failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Generando resumen clínico...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center">
        <p>Ocurrió un error al cargar el resumen clínico.</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  const { perfil, metricas } = data;
  const perfilNorm = { ...perfil, sexo: perfil.sexo as "M" | "F" };

  const todasNulas = Object.values(metricas).every((m) => m.valor === null);

  if (todasNulas) {
    return (
      <div className="bg-muted/40 text-muted-foreground p-10 rounded-xl text-center border">
        <p className="text-base font-medium">Aún no tienes registros.</p>
        <p className="text-sm mt-1">Comienza registrando tus mediciones del día.</p>
      </div>
    );
  }

  const renderMetrica = (id: MetricaKey, nombre: string, unidad: string) => {
    const m = metricas[id];
    if (!m) return null;
    const { estado, meta } = calcularEstadoMetrica(id, m.valor, perfilNorm);
    return (
      <SeccionMetrica
        key={id}
        nombre={nombre}
        valor={m.valor}
        fecha={m.fecha}
        unidad={unidad}
        estado={estado}
        meta={meta}
      />
    );
  };

  const renderMetricaInfo = (id: MetricaKey, nombre: string, unidad: string) => {
    const m = metricas[id];
    if (!m) return null;
    return (
      <SeccionMetrica
        key={id}
        nombre={nombre}
        valor={m.valor}
        fecha={m.fecha}
        unidad={unidad}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3 print:hidden">
        <Button onClick={exportarPDF} disabled={isExporting} className="gap-2">
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isExporting ? "Generando PDF..." : "Exportar PDF"}
        </Button>
      </div>

      <div className="bg-white text-black shadow-lg rounded-xl overflow-hidden border">
        <div ref={pdfRef} className="p-8 sm:p-12 max-w-4xl mx-auto bg-white" style={{ minHeight: '297mm' }}>

          <EncabezadoResumen nombrePaciente={perfil.nombre} />
          <AvisoLegal />

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-display font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4 uppercase tracking-wider">Control Glucémico</h3>
              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {renderMetrica("glucosaAyuno", "Glucosa en ayuno", "mg/dL")}
                {renderMetrica("hba1c", "Hemoglobina Glicosilada (HbA1c)", "%")}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-display font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4 uppercase tracking-wider">Presión Arterial y Corazón</h3>
              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {renderMetrica("presionSistolica", "Presión Sistólica", "mmHg")}
                {renderMetrica("presionDiastolica", "Presión Diastólica", "mmHg")}
                {renderMetrica("frecuenciaCardiaca", "Frecuencia Cardiaca", "lpm")}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-display font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4 uppercase tracking-wider">Peso y Composición Corporal</h3>
              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {renderMetricaInfo("peso", "Peso", "kg")}
                {renderMetrica("imc", "Índice de Masa Corporal (IMC)", "")}
                {renderMetrica("cintura", "Circunferencia de Cintura", "cm")}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-display font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4 uppercase tracking-wider">Perfil de Lípidos</h3>
              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {renderMetrica("colesterolTotal", "Colesterol Total", "mg/dL")}
                {renderMetrica("colesterolLdl", "Colesterol LDL (Malo)", "mg/dL")}
                {renderMetrica("colesterolHdl", "Colesterol HDL (Bueno)", "mg/dL")}
                {renderMetrica("trigliceridos", "Triglicéridos", "mg/dL")}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-display font-bold text-primary border-b-2 border-primary/20 pb-2 mb-4 uppercase tracking-wider">Función Renal</h3>
              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {renderMetrica("creatinina", "Creatinina", "mg/dL")}
                {renderMetrica("bun", "Nitrógeno Ureico (BUN)", "mg/dL")}
              </div>
            </section>

            <section className="bg-indigo-50/50 p-6 rounded-lg border border-indigo-100 mt-8">
              <h3 className="text-lg font-display font-bold text-indigo-900 border-b-2 border-indigo-200 pb-2 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="bg-indigo-200 text-indigo-800 p-1 rounded">IA</span>
                Análisis Inteligente
              </h3>
              <div className="text-indigo-800/70 italic text-center py-8">
                Aquí estará el análisis de IA
              </div>
            </section>
          </div>

          <PieResumen />
        </div>
      </div>
    </div>
  );
}
