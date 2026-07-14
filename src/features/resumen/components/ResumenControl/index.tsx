"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useResumen } from "../../hooks/use-resumen";
import { resumenStrings as S } from "../../strings/es";
import { ResumenScreen } from "../ResumenScreen";

/**
 * Wrapper del resumen clínico: resuelve carga/error, mantiene el `pdfRef` y el
 * estado de exportación, y encapsula la carga dinámica de `html2pdf.js` (un
 * side-effect que pertenece al Control, no a la UI pura).
 */
export function ResumenControl() {
  const { viewData, isLoading, isError } = useResumen();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportarPDF = async () => {
    if (!pdfRef.current || !viewData) return;
    setIsExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const fechaStr = format(new Date(), "yyyy-MM-dd");
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `resumen-salud-${fechaStr}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
      };
      await html2pdf().set(opt).from(pdfRef.current).save();
    } catch (e) {
      console.error("[exportarPDF] Failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{S.loading}</p>
      </div>
    );
  }

  if (isError || !viewData) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-200 p-6 rounded-lg text-center border border-red-100 dark:border-red-900/50">
        <p>{S.error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          {S.retry}
        </Button>
      </div>
    );
  }

  return (
    <ResumenScreen
      viewData={viewData}
      pdfRef={pdfRef}
      isExporting={isExporting}
      onExport={exportarPDF}
    />
  );
}
