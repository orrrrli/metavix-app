import { DefParametro, EvaluacionMeta } from "../data/parametros";
import { CheckCircle2, AlertCircle, XCircle, MinusCircle } from "lucide-react";

interface ResultadoParametro {
  param: DefParametro;
  valor: string;
  evaluacion: EvaluacionMeta;
}

interface ResumenControlProps {
  resultados: ResultadoParametro[];
}

type EstadoClave = "en_meta" | "cuidado" | "fuera_meta" | "sin_dato";

const TILE_BG: Record<EstadoClave, React.CSSProperties> = {
  en_meta:    { background: "var(--ok-bg)",    borderColor: "var(--ok)",    color: "var(--ok)" },
  cuidado:    { background: "var(--warn-bg)",  borderColor: "var(--warn)",  color: "var(--warn)" },
  fuera_meta: { background: "var(--bad-bg)",   borderColor: "var(--bad)",   color: "var(--bad)" },
  sin_dato:   { background: "var(--ph)",       borderColor: "var(--bd)",    color: "var(--soft)" },
};

const ALERT_ICON: Record<EstadoClave, { color: string; bg: string; Icon: typeof CheckCircle2 }> = {
  en_meta:    { color: "var(--ok)",   bg: "var(--ok-bg)",   Icon: CheckCircle2 },
  cuidado:    { color: "var(--warn)", bg: "var(--warn-bg)", Icon: AlertCircle  },
  fuera_meta: { color: "var(--bad)",  bg: "var(--bad-bg)",  Icon: XCircle      },
  sin_dato:   { color: "var(--mut)",  bg: "var(--ph)",      Icon: MinusCircle  },
};

export function ResumenControl({ resultados }: ResumenControlProps) {
  const conteos = {
    enMeta: 0,
    cuidado: 0,
    fuera: 0,
    sinDato: 0
  };

  resultados.forEach(r => {
    if (r.evaluacion.estado === "en_meta") conteos.enMeta++;
    else if (r.evaluacion.estado === "cuidado") conteos.cuidado++;
    else if (r.evaluacion.estado === "fuera_meta") conteos.fuera++;
    else conteos.sinDato++;
  });

  return (
    <div id="resumen-metas" className="animate-in slide-in-from-bottom-8 duration-700 mt-12 space-y-8">

      <div className="bg-card border rounded-xl p-6 sm:p-10 shadow-md" style={{ borderColor: "var(--bd)" }}>
        <h3 className="text-xl font-display font-semibold mb-6" style={{ color: "var(--text)" }}>Tu Estado Actual</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resultados.map((r, idx) => {
            const tile = TILE_BG[r.evaluacion.estado as EstadoClave] ?? TILE_BG.sin_dato;
            return (
              <div
                key={idx}
                className="p-4 rounded-lg border-2 flex flex-col justify-center items-center text-center"
                style={tile}
              >
                <span className="text-2xl font-bold font-mono" style={{ color: "var(--text)" }}>
                  {r.valor || "—"}
                </span>
                <span className="text-sm font-medium mt-1" style={{ color: "var(--mut)" }}>
                  {r.param.nombre}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 space-y-4">
          {conteos.enMeta > 0 && (() => {
            const a = ALERT_ICON.en_meta;
            return (
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: a.bg }}>
                <a.Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: a.color }} />
                <p style={{ color: "var(--text)" }}>
                  <strong className="font-bold">{conteos.enMeta} parámetro(s) en meta</strong> — Excelente trabajo, continúe así.
                </p>
              </div>
            );
          })()}
          {conteos.cuidado > 0 && (() => {
            const a = ALERT_ICON.cuidado;
            return (
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: a.bg }}>
                <a.Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: a.color }} />
                <p style={{ color: "var(--text)" }}>
                  <strong className="font-bold">{conteos.cuidado} parámetro(s) por mejorar</strong> — Están cerca de la meta pero requieren atención.
                </p>
              </div>
            );
          })()}
          {conteos.fuera > 0 && (() => {
            const a = ALERT_ICON.fuera_meta;
            return (
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: a.bg }}>
                <a.Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: a.color }} />
                <p style={{ color: "var(--text)" }}>
                  <strong className="font-bold">{conteos.fuera} parámetro(s) fuera de meta</strong> — Se recomienda consulta médica para ajustar el tratamiento.
                </p>
              </div>
            );
          })()}
          {conteos.sinDato > 0 && (() => {
            const a = ALERT_ICON.sin_dato;
            return (
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ background: a.bg }}>
                <a.Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: a.color }} />
                <p style={{ color: "var(--text)" }}>
                  <strong className="font-bold">{conteos.sinDato} dato(s) sin ingresar</strong> — Solicite estos estudios en su próxima consulta.
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
