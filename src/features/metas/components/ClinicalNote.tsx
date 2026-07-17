import { Info, AlertTriangle } from "lucide-react";

export interface ClinicalNoteProps {
  texto: string;
  tono?: "info" | "warn";
}

/**
 * Nota clínica compacta de una línea, con icono. Reutilizable para banners de
 * embarazo (desactivado / fecha de parto) y para notas por parámetro
 * (advertencias, alertas críticas). `tono: "warn"` cubre tanto avisos como lo
 * que antes manejaba `CriticalAlert` (T2) — mismo slot visual, distinto color.
 */
export function ClinicalNote({ texto, tono = "info" }: ClinicalNoteProps) {
  const isWarn = tono === "warn";
  const Icon = isWarn ? AlertTriangle : Info;
  return (
    <div
      role={isWarn ? "alert" : "status"}
      className="flex items-start gap-2 mt-1 p-2 rounded-md border"
      style={{
        background: isWarn ? "var(--bad-bg)" : "var(--info-bg)",
        borderColor: isWarn ? "var(--bad)" : "var(--info)",
      }}
    >
      <Icon
        className="size-4 shrink-0 mt-0.5"
        style={{ color: isWarn ? "var(--bad)" : "var(--info)" }}
        aria-hidden="true"
      />
      <p
        className="text-xs leading-snug"
        style={{ color: isWarn ? "var(--bad)" : "var(--text)", fontWeight: isWarn ? 500 : undefined }}
      >
        {texto}
      </p>
    </div>
  );
}
