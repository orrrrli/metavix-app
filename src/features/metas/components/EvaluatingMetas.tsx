import { useEffect, useState } from "react";
import { metasStrings } from "../strings/es";

type PasoEstado = "completado" | "en-progreso" | "pendiente";

const PASOS = metasStrings.evaluatingMetas.pasos;
const PASO_DURACION_MS = 1250;

function estadoDePaso(index: number, pasoActivo: number): PasoEstado {
  if (index < pasoActivo) return "completado";
  if (index === pasoActivo) return "en-progreso";
  return "pendiente";
}

function StepIcon({ estado }: { estado: PasoEstado }) {
  if (estado === "completado") {
    return (
      <div className="flex items-center justify-center size-[22px] rounded-full shrink-0" style={{ background: "var(--ok)" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    );
  }
  if (estado === "en-progreso") {
    return (
      <div className="relative size-[22px] rounded-full shrink-0" style={{ border: "2px solid var(--ok)" }}>
        <div className="absolute -inset-0.5 rounded-full animate-spin" style={{ border: "2px solid var(--ok)", borderTopColor: "transparent", borderRightColor: "transparent" }} />
      </div>
    );
  }
  return <div className="size-[22px] rounded-full shrink-0" style={{ border: "2px solid var(--bd)" }} />;
}

/**
 * Pantalla de progreso mostrada al presionar "Evaluar mis metas". Los 4 pasos
 * avanzan con timing simulado (no hay señales reales del backend por paso);
 * el llamador controla cuánto tiempo permanece montado este componente.
 */
export function EvaluatingMetas() {
  const [pasoActivo, setPasoActivo] = useState(0);

  useEffect(() => {
    if (pasoActivo >= PASOS.length - 1) return;
    const timer = setTimeout(() => setPasoActivo((p) => p + 1), PASO_DURACION_MS);
    return () => clearTimeout(timer);
  }, [pasoActivo]);

  return (
    <section
      className="flex flex-col items-center justify-center rounded-[22px] px-6 py-16 sm:px-10 min-h-[420px]"
      style={{ background: "var(--card)", border: "1.5px solid var(--card-bd)", boxShadow: "0 12px 30px rgba(20,40,30,.05)" }}
    >
      <div className="relative flex items-center justify-center size-24 mb-7">
        <div className="absolute inset-2.5 rounded-full" style={{ background: "var(--card)", boxShadow: "0 6px 18px rgba(20,40,30,.08)" }} />
        <div className="absolute inset-2.5 rounded-full animate-spin" style={{ border: "4px solid var(--ok-bg)", borderTopColor: "var(--ok)" }} />
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
          <path d="M3 12h4l2 8 4-16 2 8h6" />
        </svg>
      </div>

      <h2 className="font-display text-lg font-extrabold mb-2 text-center" style={{ color: "var(--text)" }}>
        {metasStrings.evaluatingMetas.title}
      </h2>
      <p className="text-sm mb-7 text-center max-w-md leading-relaxed" style={{ color: "var(--mut)" }}>
        {metasStrings.evaluatingMetas.description}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-md">
        {PASOS.map((etiqueta, i) => {
          const estado = estadoDePaso(i, pasoActivo);
          return (
            <div key={etiqueta} className="flex items-center gap-3" style={{ opacity: estado === "pendiente" ? 0.45 : 1 }}>
              <StepIcon estado={estado} />
              <span className="text-sm" style={{ color: estado === "pendiente" ? "var(--mut)" : "var(--text)", fontWeight: estado === "en-progreso" ? 700 : 600 }}>
                {etiqueta}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
