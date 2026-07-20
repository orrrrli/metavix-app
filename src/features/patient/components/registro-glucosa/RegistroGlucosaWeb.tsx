"use client";

import React, { useEffect, useState } from "react";
import { useGlucosaWizard } from "../../hooks/use-glucosa-wizard";
import {
  MealKey, MEAL_LABEL, MEAL_ICON, MEAL_TO_TYPE,
  GlucosaLectura, NuevaLectura,
  markerPct, estadoRango, horaActual, barraRango,
  GLUCOSA_MIN, GLUCOSA_MAX,
} from "../../utils/glucosa";

/**
 * RegistroGlucosaWeb — versión escritorio (2A).
 * Wizard controlado de 2 pasos al centro, resumen del día en el encabezado y
 * bitácora de lecturas de hoy en la barra lateral. El estado de la lista vive en
 * el padre (React Query); este componente emite `onGuardar` con la nueva lectura.
 *
 * Paso 1 fusiona valor + momento del día + hora: el momento llega preseleccionado
 * por `useGlucosaWizard` (según la hora del dispositivo) y "Cambiar" revela una
 * línea de tiempo del día en vez de la cuadrícula de 8 chips del paso 2 anterior.
 * Paso 2 es el contexto opcional (alimentos, actividad, síntomas, foto).
 *
 * Colores vía variables de tema del dashboard (`.mvx-dash`), con fallback al
 * tono claro original para renders fuera del dashboard. Fuente esperada: 'Sora'.
 */

export interface RegistroGlucosaWebProps {
  /** Lecturas de hoy (fuente de verdad en el padre). */
  lecturas: GlucosaLectura[];
  /** Etiqueta de fecha del encabezado. */
  fecha?: string;
  /** Se dispara al guardar una lectura completa. */
  onGuardar: (lectura: NuevaLectura) => void | Promise<void>;
  /** Deshabilita el botón mientras se persiste. */
  guardando?: boolean;
  /** Si el paciente tiene diagnóstico de diabetes (mismo umbral que el dashboard). */
  hasDiabetes?: boolean;
  /** Si la paciente está embarazada (ajusta metas de ayuno cuando hasDiabetes). */
  isPregnant?: boolean;
}

const F = "'Sora', sans-serif";
const CSS = `
.mvxg-lift{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;}
.mvxg-chip{transition:all .16s ease;}
.mvxg-soft:hover{border-color:var(--accent,#00c9a7) !important;color:var(--nav-active,#0a8c77) !important;}
.mvxg-warn:hover{border-color:#e8836e !important;color:var(--bad,#c14a2c) !important;}
.mvxg-cta:hover{transform:translateY(-2px);}
.mvxg-web input:focus,.mvxg-web textarea:focus{outline:none;border-color:var(--accent,#00c9a7) !important;box-shadow:0 0 0 4px rgba(0,201,167,.14);}
.mvxg-web ::placeholder{color:var(--faint,#b0a89b);}
.mvxg-num::-webkit-outer-spin-button,.mvxg-num::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
.mvxg-num{-moz-appearance:textfield;}
`;

let injected = false;
function useStyles() {
  useEffect(() => {
    if (injected || typeof document === "undefined") return;
    const t = document.createElement("style");
    t.setAttribute("data-mvx-glucosa-web", "");
    t.textContent = CSS;
    document.head.appendChild(t);
    injected = true;
  }, []);
}

const caption: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--soft,#9aa39c)",
};
const cardBase: React.CSSProperties = {
  background: "var(--card,#fff)", border: "1.5px solid var(--card-bd,#eee3d4)", borderRadius: 24,
  boxShadow: "0 18px 44px rgba(20,40,30,.07)", overflow: "hidden",
};

/** Orden cronológico del día para la línea de tiempo del selector de momento. */
const TIMELINE_KEYS: MealKey[] = ["madrugada", "ayuno", "postDesayuno", "preComida", "postComida", "preCena", "postCena"];

function chipStyle(sel: boolean): React.CSSProperties {
  return {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 8, padding: "14px 5px", borderRadius: 14, cursor: "pointer", fontFamily: F,
    fontSize: 11.5, fontWeight: sel ? 700 : 600, textAlign: "center", width: "100%",
    border: sel ? "1.5px solid var(--accent,#00c9a7)" : "1.5px solid var(--card-bd,#efe7db)",
    background: sel ? "var(--accent,#00c9a7)" : "var(--mvxg-field,#faf7f1)",
    color: sel ? "#03251d" : "var(--mut,#647069)",
    boxShadow: sel ? "0 8px 18px rgba(0,201,167,.28)" : "none",
  };
}
function timelineDotStyle(sel: boolean): React.CSSProperties {
  return {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer",
    flex: 1, minWidth: 0, background: "transparent", border: "none", padding: 2,
    color: sel ? "var(--nav-active,#0a8c77)" : "var(--soft,#9aa39c)", fontWeight: sel ? 700 : 600, fontFamily: F, fontSize: 11.5,
  };
}
function timelineCircleStyle(sel: boolean): React.CSSProperties {
  return {
    width: sel ? 13 : 9, height: sel ? 13 : 9, borderRadius: "50%",
    background: sel ? "currentColor" : "transparent",
    border: sel ? "none" : "1.5px solid currentColor",
    boxShadow: sel ? "0 0 0 4px var(--nav-active-bg,#e6faf6)" : "none", transition: "all .16s ease",
  };
}

function MealIcon({ k, size = 21 }: { k: MealKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: MEAL_ICON[k] }} />
  );
}

function RangeBar({ v, meal, hasDiabetes, isPregnant }: { v: string; meal: MealKey | null; hasDiabetes: boolean; isPregnant: boolean }) {
  const { segmentos, bajo, objetivo, alto, escala } = barraRango(meal ? MEAL_TO_TYPE[meal] : null, hasDiabetes, isPregnant);
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ height: 11, borderRadius: 999, overflow: "hidden", display: "flex" }}>
        {segmentos.map((s, i) => (
          <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ position: "relative", height: 0 }}>
        <div style={{
          position: "absolute", left: `${markerPct(v, escala)}%`, top: -15, transform: "translateX(-50%)",
          width: 3, height: 19, background: "var(--text,#15201b)", borderRadius: 2, boxShadow: "0 0 0 3px var(--card,#fff)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 11.5, color: "var(--soft,#9aa39c)", fontWeight: 500 }}>
        <span>{bajo}</span><span style={{ color: "var(--ok,#1f9d6b)", fontWeight: 700 }}>{objetivo}</span><span>{alto}</span>
      </div>
    </div>
  );
}

const chipsAct = ["Ninguna", "Ligera", "Moderada", "Intensa"];
const chipsSint = ["Mareo", "Temblor", "Sudoración", "Visión borrosa"];

export default function RegistroGlucosaWeb({
  lecturas,
  fecha = "hoy",
  onGuardar,
  guardando = false,
  hasDiabetes = false,
  isPregnant = false,
}: RegistroGlucosaWebProps) {
  useStyles();
  const w = useGlucosaWizard({ lecturas, onGuardar, guardando, hasDiabetes, isPregnant });
  const { step, setStep, valor, setValor, meal, mealManual, elegirMomento, hora, setHora, foods, setFoods, st, resumen, puedeGuardar, guardar } = w;
  const { total, enRango, promedio } = resumen;
  const [expanded, setExpanded] = useState(false);
  const [timeEdit, setTimeEdit] = useState(false);

  const seleccionarMomento = (k: MealKey) => { elegirMomento(k); setExpanded(false); };

  const recBadge = (
    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".04em", color: "var(--nav-active,#0a8c77)", background: "var(--nav-active-bg,#e6faf6)", padding: "2px 9px", borderRadius: 999 }}>Recomendado</span>
  );
  const label = (): React.CSSProperties => ({ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--mut,#647069)", marginBottom: 7 });

  return (
    <div className="mvxg-web" style={{ width: "100%", maxWidth: 1160, ...cardBase, fontFamily: F }}>
      {/* encabezado + resumen */}
      <div style={{ padding: "24px 34px", borderBottom: "1.5px solid var(--bd,#f0e9dd)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
        <div>
          <div style={caption}>Monitoreo de glucosa</div>
          <div style={{ fontSize: 21, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", marginTop: 4 }}>Registro de hoy · {fecha}</div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[["Lecturas", total, "var(--text,#15201b)"], ["En rango", enRango, "var(--ok,#1f9d6b)"], ["Promedio", promedio, "var(--text,#15201b)"]].map(([l, n, c]) => (
            <div key={l as string}>
              <div style={{ fontSize: 11, color: "var(--soft,#9aa39c)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>{l}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: c as string }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* cuerpo: wizard + bitácora */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px" }}>
        {/* MAIN */}
        <div style={{ padding: "30px 36px 26px", minHeight: 560, display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={caption}>Nueva lectura</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--mut,#647069)" }}>Paso {step} de 2</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: "var(--skel,#efe7db)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(step / 2) * 100}%`, background: "var(--accent,#00c9a7)", borderRadius: 99, transition: "width .35s cubic-bezier(.2,.85,.25,1)" }} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: 23, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", margin: "4px 0 4px" }}>Registra tu lectura</h3>
                <p style={{ fontSize: 14, color: "var(--soft,#8a938c)", margin: 0 }}>Valor, momento y hora en un solo paso.</p>

                <div style={{ maxWidth: 480, margin: "20px auto 0", textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8 }}>
                    <input className="mvxg-num" type="number" inputMode="numeric" placeholder="0" min={GLUCOSA_MIN} max={GLUCOSA_MAX} value={valor} onChange={(e) => setValor(e.target.value)}
                      style={{ width: 200, fontSize: 80, fontWeight: 800, textAlign: "center", border: "none", background: "transparent", color: "var(--text,#15201b)", letterSpacing: "-.045em", caretColor: "var(--accent,#00c9a7)", padding: 0, fontFamily: F }} />
                    <span style={{ fontSize: 17, color: "var(--soft,#9aa39c)", fontWeight: 600, marginBottom: 18 }}>mg/dL</span>
                  </div>
                  {st.estado && (
                    <div style={{ margin: "8px 0 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: st.bg, color: st.color, fontSize: 13, fontWeight: 700, padding: "7px 15px", borderRadius: 999 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor" }} />{st.label}
                      </span>
                    </div>
                  )}
                  <RangeBar v={valor} meal={meal} hasDiabetes={hasDiabetes} isPregnant={isPregnant} />
                </div>

                {/* momento — sugerido, con línea de tiempo al cambiar */}
                <div style={{ maxWidth: 680, margin: "26px auto 0", background: "var(--nav-active-bg,#f2fbf8)", border: "1.5px solid var(--card-bd,#cdeee5)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--accent,#00c9a7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {meal && <MealIcon k={meal} size={17} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--nav-active,#0a8c77)", fontWeight: 600 }}>{mealManual ? "Momento" : "Momento sugerido"} · {hora || horaActual()}</div>
                        <div style={{ fontSize: 16.5, fontWeight: 800, color: "var(--text,#15201b)" }}>{meal ? MEAL_LABEL[meal] : "—"}</div>
                      </div>
                    </div>
                    <button onClick={() => setExpanded((e) => !e)} className="mvxg-soft"
                      style={{ background: "transparent", border: "1.5px solid var(--card-bd,#a9e0d4)", color: "var(--nav-active,#0a8c77)", fontSize: 12.5, fontWeight: 700, padding: "9px 16px", borderRadius: 10, cursor: "pointer", fontFamily: F }}>
                      {expanded ? "Cerrar" : "Cambiar"}
                    </button>
                  </div>
                  {expanded && (
                    <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1.5px dashed var(--card-bd,#cdeee5)" }}>
                      <div style={{ position: "relative", padding: "0 6px" }}>
                        <div style={{ position: "absolute", left: 6, right: 6, top: 6, height: 2, background: "var(--card-bd,#bfe6da)" }} />
                        <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
                          {TIMELINE_KEYS.map((k) => (
                            <button key={k} onClick={() => seleccionarMomento(k)} style={timelineDotStyle(meal === k)}>
                              <span style={timelineCircleStyle(meal === k)} />
                              <span>{MEAL_LABEL[k]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                        <button onClick={() => seleccionarMomento("colacion")} className="mvxg-chip" style={chipStyle(meal === "colacion")}>
                          <MealIcon k="colacion" size={16} /><span>Fue una colación, no ligado a comida</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* hora — "ahora" por defecto, editable */}
                <div style={{ maxWidth: 640, margin: "14px auto 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12.5, color: "var(--mut,#647069)" }}>Hora: <strong style={{ color: "var(--text,#15201b)" }}>{hora || horaActual()}</strong></span>
                  <button onClick={() => setTimeEdit((e) => !e)} style={{ background: "transparent", border: "none", color: "var(--nav-active,#0a8c77)", fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: 4, fontFamily: F }}>¿Fue antes? Editar</button>
                </div>
                {timeEdit && (
                  <div style={{ maxWidth: 640, margin: "8px auto 0" }}>
                    <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 12, background: "var(--mvxg-field,#faf7f1)", fontSize: 15, color: "var(--text,#15201b)", fontFamily: F }} />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontSize: 23, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", margin: "4px 0" }}>Agrega contexto</h3>
                <p style={{ fontSize: 14, color: "var(--soft,#8a938c)", margin: "0 0 20px" }}>Opcional, pero ayuda mucho a tu médico.</p>
                <div style={{ maxWidth: 740 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 8 }}>
                    <label style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text,#15201b)" }}>Alimentos consumidos</label>{recBadge}
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--soft,#8a938c)", margin: "0 0 9px" }}>Lo más útil para tu médico: qué y cuánto comiste antes de esta medición.</p>
                  <textarea value={foods} onChange={(e) => setFoods(e.target.value)} placeholder="Ej. 2 tortillas y 2 huevos con jamón" style={{ width: "100%", minHeight: 96, padding: "14px 16px", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 14, background: "var(--mvxg-field,#faf7f1)", fontSize: 15, color: "var(--text,#15201b)", resize: "vertical", lineHeight: 1.55, fontFamily: F }} />

                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 11 }}>
                      <label style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text,#15201b)" }}>Actividad física</label>{recBadge}
                    </div>
                    <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                      {chipsAct.map((c) => (
                        <button key={c} className="mvxg-soft" style={{ padding: "11px 19px", borderRadius: 12, border: "1.5px solid var(--card-bd,#e7dfd2)", background: "var(--mvxg-field,#faf7f1)", color: "var(--mut,#3d453f)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{c}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1.5px solid var(--bd,#f0e9dd)" }}>
                    <div style={{ ...caption, color: "var(--faint,#b0a89b)", marginBottom: 15 }}>Adicional · opcional</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
                      <div>
                        <label style={{ ...label(), color: "var(--soft,#8a938c)", marginBottom: 9 }}>Síntomas</label>
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                          {chipsSint.map((c) => (
                            <button key={c} className="mvxg-warn" style={{ padding: "8px 13px", borderRadius: 999, border: "1.5px solid var(--card-bd,#ece4d6)", background: "var(--mvxg-panel,#fcfaf6)", color: "var(--soft,#8a938c)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{c}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ ...label(), color: "var(--soft,#8a938c)", marginBottom: 9 }}>Foto del glucómetro</label>
                        <div className="mvxg-soft" style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", border: "1.5px dashed var(--card-bd,#ddd3c3)", borderRadius: 12, background: "var(--mvxg-panel,#fcfaf6)", cursor: "pointer" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--skel,#f0ece3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--soft,#8a938c)" }}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mut,#647069)" }}>Sube una foto</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* nav */}
          <div style={{ paddingTop: 22, marginTop: 8, borderTop: "1.5px solid var(--bd,#f0e9dd)", display: "flex", gap: 12 }}>
            <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="mvxg-soft"
              style={{ flex: "0 0 auto", background: "transparent", color: "var(--mut,#647069)", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 13, padding: "15px 26px", fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: F, opacity: step === 1 ? 0.45 : 1 }}>Atrás</button>
            {step < 2 ? (
              <button onClick={() => setStep((s) => Math.min(2, s + 1))} className="mvxg-cta"
                style={{ flex: 1, background: "var(--accent,#00c9a7)", color: "#03251d", border: "none", borderRadius: 13, padding: 15, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "var(--btn-glow)", fontFamily: F }}>Siguiente</button>
            ) : (
              <button onClick={() => guardar()} className="mvxg-cta" disabled={!puedeGuardar}
                style={{ flex: 1, background: "var(--accent,#00c9a7)", color: "#03251d", border: "none", borderRadius: 13, padding: 15, fontSize: 15, fontWeight: 700, cursor: puedeGuardar ? "pointer" : "default", boxShadow: "var(--btn-glow)", fontFamily: F, opacity: puedeGuardar ? 1 : 0.55 }}>{guardando ? "Guardando…" : "Guardar lectura"}</button>
            )}
          </div>
        </div>

        {/* SIDEBAR — bitácora */}
        <div style={{ padding: "28px 28px", background: "var(--mvxg-panel,#fcfaf6)", borderLeft: "1.5px solid var(--bd,#f0e9dd)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
            <span style={caption}>Lecturas de hoy</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--nav-active,#0a8c77)", background: "var(--nav-active-bg,#e6faf6)", padding: "4px 11px", borderRadius: 999 }}>{total}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {lecturas.length === 0 && (
              <div style={{ textAlign: "center", padding: "34px 16px", color: "var(--faint,#b0a89b)", fontSize: 13, lineHeight: 1.5 }}>Aún no hay lecturas hoy. Completa el registro y aparecerá aquí.</div>
            )}
            {lecturas.map((r) => {
              const b = estadoRango(r.v, { hasDiabetes, isPregnant, readingType: r.readingType });
              return (
                <div key={r.id} style={{ background: "var(--card,#fff)", border: "1.5px solid var(--card-bd,#efe7db)", borderRadius: 14, padding: "13px 15px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text,#15201b)" }}>{r.t}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: b.bg, color: b.color, fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999 }}>{b.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--mut,#647069)" }}>{r.label}</span>
                    <span style={{ fontSize: 21, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em" }}>{r.v}<span style={{ fontSize: 11, color: "var(--soft,#9aa39c)", fontWeight: 500 }}> mg/dL</span></span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1.5px dashed var(--card-bd,#e7dfd2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--mut,#647069)", marginBottom: 9 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--nav-active,#0a8c77)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <span><strong style={{ color: "var(--text,#15201b)" }}>{enRango} de {total}</strong> dentro de objetivo</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--mut,#647069)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--soft,#9aa39c)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>
              <span>Promedio del día <strong style={{ color: "var(--text,#15201b)" }}>{promedio} mg/dL</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
