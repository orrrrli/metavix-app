"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Info } from "lucide-react";
import { ClinicalNote } from "./ClinicalNote";
import { CkdStageExplainer } from "./CkdStageExplainer";
import { NoDataReasonsTable } from "./NoDataReasonsTable";
import { EvaluacionMetasGrid } from "./EvaluacionMetasGrid";
import { EvaluationInvite } from "./EvaluationInvite";
import { EvaluatingMetas } from "./EvaluatingMetas";
import { formatEvaluatedAt } from "../utils/format-evaluated-at";
import { metasStrings } from "../strings/es";
import {
  buildMetavixParametros,
  buildMetavixNoEvaluados,
  resumenMetas,
  ACCION_DEFAULT,
} from "../view-data/to-metavix-view";
import type { MetasViewData } from "../view-data/build-metas-view-data";

export interface MetasScreenProps {
  viewData: MetasViewData;
  onEvaluate: () => void;
  isEvaluating: boolean;
  isLoading: boolean;
}

const MIN_EVALUATING_MS = 5000;

const ESTADO_COLOR: Record<"ok" | "warn" | "bad", { color: string; bg: string; border: string }> = {
  ok: { color: "var(--ok)", bg: "var(--ok-bg)", border: "var(--ok-bg)" },
  warn: { color: "var(--warn)", bg: "var(--warn-bg)", border: "var(--warn-bg)" },
  bad: { color: "var(--bad)", bg: "var(--bad-bg)", border: "var(--bad-bg)" },
};

function Ring({ pct, size = 108 }: { pct: number; size?: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 108 108" className="shrink-0">
      <circle cx="54" cy="54" r={r} fill="none" stroke="var(--bd)" strokeWidth="13" />
      <circle
        cx="54" cy="54" r={r} fill="none" stroke="var(--ok)" strokeWidth="13" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 54 54)"
      />
      <text x="54" y="51" textAnchor="middle" fontSize="24" fontWeight={800} fill="var(--text)">{pct}%</text>
      <text x="54" y="68" textAnchor="middle" fontSize="10" fill="var(--soft)">en meta</text>
    </svg>
  );
}

function headlineFor(resumen: ReturnType<typeof resumenMetas>) {
  if (resumen.bad > 0) {
    const n = resumen.bad + resumen.warn;
    return (
      <>Tienes <span style={{ color: "var(--bad)" }}>{n} valor{n === 1 ? "" : "es"}</span> que necesitan tu atención.</>
    );
  }
  if (resumen.warn > 0) {
    return (
      <>Vas bien, pero <span style={{ color: "var(--warn)" }}>{resumen.warn} valor{resumen.warn === 1 ? "" : "es"}</span> conviene vigilar.</>
    );
  }
  return <>Todos tus valores evaluados están en meta.</>;
}

/**
 * UI pura de la pantalla "Mis metas". Recibe un `MetasViewData` ya resuelto —
 * sin queries, sin sort, sin derivaciones. Toda esa lógica vive en
 * `view-data/` y `hooks/use-metas.ts`. El bloque pre/post-evaluación lo
 * decide `viewData.hasEvalResult` (no hay estado de UI propio para esto).
 */
export function MetasScreen({ viewData, onEvaluate, isEvaluating, isLoading }: MetasScreenProps) {
  const [showEvaluatingScreen, setShowEvaluatingScreen] = useState(false);
  const [scrollPending, setScrollPending] = useState(false);
  const isEvaluatingRef = useRef(isEvaluating);

  useEffect(() => {
    isEvaluatingRef.current = isEvaluating;
  }, [isEvaluating]);

  useEffect(() => {
    if (!showEvaluatingScreen) return;

    let cancelled = false;
    const closeWhenRequestSettles = () => {
      if (cancelled) return;
      if (isEvaluatingRef.current) {
        setTimeout(closeWhenRequestSettles, 100);
        return;
      }
      setShowEvaluatingScreen(false);
      setScrollPending(true);
    };
    const timer = setTimeout(closeWhenRequestSettles, MIN_EVALUATING_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [showEvaluatingScreen]);

  useEffect(() => {
    if (!scrollPending) return;
    document
      .getElementById("resumen-metas")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollPending]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20" style={{ color: "var(--mut)" }}>
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{metasStrings.loadingMessage}</p>
      </div>
    );
  }

  const { banners, hasEvalResult, evalResult, ckdStage } = viewData;
  const parametros = buildMetavixParametros(viewData);
  const noEvaluados = buildMetavixNoEvaluados(viewData);
  const resumen = resumenMetas(parametros);

  const atencion = parametros
    .filter((p) => p.estado === "bad" || p.estado === "warn")
    .sort((a, b) => (a.estado === b.estado ? 0 : a.estado === "bad" ? -1 : 1));
  const vasBien = parametros.filter((p) => p.estado === "ok");
  const sinRegistrar = parametros.filter((p) => p.estado === "vacio");

  const handleEvaluate = () => {
    setShowEvaluatingScreen(true);
    setScrollPending(false);
    onEvaluate();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>{metasStrings.title}</h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--mut)" }}>{metasStrings.subtitle}</p>
        </div>
        {banners.showPregnancyMode && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shrink-0"
            style={{ background: "var(--nav-active-bg)", color: "var(--nav-active)" }}
          >
            <span className="size-1.5 rounded-full shrink-0" style={{ background: "var(--nav-active)" }} />
            {metasStrings.pregnancyBadge}
          </span>
        )}
      </div>

      {banners.showPregnancyMode && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 p-4 rounded-lg border-2"
          style={{ background: "var(--info-bg)", borderColor: "var(--info)" }}
        >
          <div className="flex items-center justify-center size-9 rounded-full shrink-0" style={{ background: "var(--info)" }}>
            <Info className="size-5" style={{ color: "#fff" }} aria-hidden="true" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-base font-semibold" style={{ color: "var(--text)" }}>{metasStrings.pregnancyMode.title}</p>
            <p className="text-sm mt-1" style={{ color: "var(--text)" }}>{metasStrings.pregnancyMode.body}</p>
          </div>
        </div>
      )}

      {banners.pregnancyDeactivated && (
        <div className="mb-6">
          <ClinicalNote texto={metasStrings.pregnancyDeactivatedNote} />
        </div>
      )}

      {banners.dueDateReached && (
        <div className="mb-6">
          <ClinicalNote texto={metasStrings.dueDateReachedNote} />
        </div>
      )}

      {showEvaluatingScreen && <EvaluatingMetas />}

      {!hasEvalResult && !showEvaluatingScreen && (
        <EvaluationInvite
          onEvaluate={handleEvaluate}
          isEvaluating={isEvaluating}
          totalParametros={resumen.total}
          parametrosConDatos={parametros.filter((p) => p.valor != null).length}
        />
      )}

      {hasEvalResult && evalResult && !showEvaluatingScreen && (
        <div id="resumen-metas" className="space-y-6">
          <p className="text-xs" style={{ color: "var(--soft)" }}>
            Evaluación: {formatEvaluatedAt(evalResult.evaluatedAt)}
          </p>

          <div
            className="flex items-center gap-6 rounded-xl p-5 sm:p-6"
            style={{ background: "var(--card)", border: "1.5px solid var(--card-bd)", boxShadow: "0 12px 30px rgba(20,40,30,.05)" }}
          >
            <Ring pct={resumen.porcentajeEnMeta} />
            <div>
              <p className="text-base font-semibold mb-1.5" style={{ color: "var(--text)" }}>{headlineFor(resumen)}</p>
              <p className="text-sm" style={{ color: "var(--mut)" }}>
                {resumen.ok} en meta · {resumen.warn} por mejorar · {resumen.bad} fuera de meta · {resumen.vacio} sin registrar
              </p>
            </div>
          </div>

          {ckdStage && <CkdStageExplainer currentStage={ckdStage.stage} egfrValue={ckdStage.value} />}

          {atencion.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: "var(--text)" }}>
                <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--bad)" }} />
                Necesita tu atención
              </h2>
              <div className="flex flex-col gap-2.5">
                {atencion.map((p) => {
                  const v = ESTADO_COLOR[p.estado as "bad" | "warn"];
                  return (
                    <div key={p.id} className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: "var(--card)", border: `1.5px solid ${v.border}` }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.label}</span>
                            <span className="text-xl font-bold" style={{ color: v.color }}>
                              {p.valor}{p.unidad ? ` ${p.unidad}` : ""}
                            </span>
                          </div>
                          <p className="text-xs mt-1" style={{ color: "var(--mut)" }}>{p.metaTexto}</p>
                        </div>
                        <span className="text-xs font-bold rounded-full px-3 py-1.5 whitespace-nowrap" style={{ color: v.color, background: v.bg }}>
                          {ACCION_DEFAULT[p.estado as "warn" | "bad"]}
                        </span>
                      </div>
                      {p.nota && <ClinicalNote texto={p.nota.texto} tono={p.nota.tono} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {vasBien.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: "var(--text)" }}>
                <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--ok)" }} />
                Vas bien en esto
              </h2>
              <div className="flex flex-col gap-2.5">
                {vasBien.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-xl p-4" style={{ background: "var(--card)", border: "1.5px solid var(--ok-bg)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{p.label}</span>
                        <span className="text-xl font-bold" style={{ color: "var(--ok)" }}>
                          {p.valor}{p.unidad ? ` ${p.unidad}` : ""}
                        </span>
                      </div>
                      {p.metaTexto && <p className="text-xs mt-1" style={{ color: "var(--mut)" }}>{p.metaTexto}</p>}
                    </div>
                    <span className="text-xs font-bold rounded-full px-3 py-1.5 whitespace-nowrap" style={{ color: "var(--ok)", background: "var(--ok-bg)" }}>
                      En meta
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sinRegistrar.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold mb-2.5" style={{ color: "var(--text)" }}>
                <span className="size-2.5 rounded-full shrink-0" style={{ background: "var(--soft)" }} />
                Te faltan registros
              </h2>
              <div className="flex flex-col gap-2">
                {sinRegistrar.map((p) => (
                  <div key={p.id} className="flex items-center gap-3.5 rounded-xl p-3" style={{ background: "var(--card)", border: "1.5px dashed var(--bd)" }}>
                    <span className="flex-1 text-sm" style={{ color: "var(--mut)" }}>{p.label} — sin datos recientes</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <details className="group">
            <summary className="flex items-center gap-2 text-xs font-bold cursor-pointer list-none py-2.5" style={{ color: "var(--mut)" }}>
              <span className="group-open:rotate-90 transition-transform">▸</span>
              Ver los {resumen.total} parámetros y sus metas clínicas completas
            </summary>
            <div className="mt-2.5">
              <EvaluacionMetasGrid fechaTexto={formatEvaluatedAt(evalResult.evaluatedAt)} parametros={parametros} />
            </div>
          </details>

          <NoDataReasonsTable items={noEvaluados} />
        </div>
      )}

      <div className="mt-12 pt-6 border-t text-center text-sm" style={{ borderColor: "var(--bd)", color: "var(--mut)" }}>
        <p>{metasStrings.adaDisclaimer}</p>
      </div>
    </div>
  );
}
