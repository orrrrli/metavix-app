"use client";

import React, { useState } from "react";
import { useGlucosaWizard } from "../../hooks/use-glucosa-wizard";
import {
  MealKey, MEAL_LABEL, MEAL_ICON, MEAL_TO_TYPE,
  GlucosaLectura, NuevaLectura,
  markerPct, estadoRango, horaActual, barraRango,
  GLUCOSA_MIN, GLUCOSA_MAX,
} from "../../utils/glucosa";

/**
 * RegistroGlucosaMovil — versión móvil (7A).
 * Wizard controlado de 2 pasos en una sola columna: resumen del día en
 * tarjetas compactas arriba, wizard, y bitácora de lecturas de hoy abajo.
 *
 * Paso 1 fusiona valor + momento del día + hora: el momento llega
 * preseleccionado por `useGlucosaWizard` (según la hora del dispositivo) y
 * "Cambiar" revela una línea de tiempo del día en vez de la cuadrícula de 8
 * chips del paso anterior. Paso 2 es el contexto opcional. El estado de la
 * lista vive en el padre (React Query); este componente emite `onGuardar`
 * con la nueva lectura.
 *
 * Colores vía variables de tema del dashboard (`.mvx-dash`), con fallback al
 * tono claro original para renders fuera del dashboard. Fuente esperada: 'Sora'.
 */

export interface RegistroGlucosaMovilProps {
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
.mvxgm-soft:hover{border-color:var(--accent,#00c9a7) !important;color:var(--nav-active,#0a8c77) !important;}
.mvxgm-warn:hover{border-color:#e8836e !important;color:var(--bad,#c14a2c) !important;}
.mvxgm input:focus,.mvxgm textarea:focus{outline:none;border-color:var(--accent,#00c9a7) !important;box-shadow:0 0 0 4px rgba(0,201,167,.14);}
.mvxgm ::placeholder{color:var(--faint,#b0a89b);}
.mvxgm-num::-webkit-outer-spin-button,.mvxgm-num::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
.mvxgm-num{-moz-appearance:textfield;}
`;

let injected = false;
if (typeof document !== "undefined" && !injected) {
  const t = document.createElement("style");
  t.setAttribute("data-mvx-glucosa-movil", "");
  t.textContent = CSS;
  document.head.appendChild(t);
  injected = true;
}

const caption: React.CSSProperties = {
  fontSize: 10.5, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--soft,#9aa39c)",
};

function chipStyle(sel: boolean): React.CSSProperties {
  return {
    display: "flex", flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center",
    padding: "13px 10px", borderRadius: 12, cursor: "pointer", fontFamily: F,
    fontSize: 12.5, fontWeight: sel ? 700 : 600,
    border: sel ? "1.5px solid var(--accent,#00c9a7)" : "1.5px solid var(--card-bd,#efe7db)",
    background: sel ? "var(--accent,#00c9a7)" : "var(--mvxg-field,#faf7f1)",
    color: sel ? "#03251d" : "var(--mut,#647069)",
    boxShadow: sel ? "0 8px 18px rgba(0,201,167,.28)" : "none",
  };
}
function timelineDotStyle(sel: boolean): React.CSSProperties {
  return {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer",
    flex: 1, minWidth: 0, background: "transparent", border: "none", padding: 2,
    color: sel ? "var(--nav-active,#0a8c77)" : "var(--soft,#9aa39c)", fontWeight: sel ? 700 : 600, fontFamily: F, fontSize: 9.5,
  };
}
function timelineCircleStyle(sel: boolean): React.CSSProperties {
  return {
    width: sel ? 12 : 8, height: sel ? 12 : 8, borderRadius: "50%",
    background: sel ? "currentColor" : "transparent",
    border: sel ? "none" : "1.5px solid currentColor",
    boxShadow: sel ? "0 0 0 3px var(--nav-active-bg,#e6faf6)" : "none", transition: "all .16s ease",
  };
}

/** Orden cronológico del día para la línea de tiempo del selector de momento. */
const TIMELINE_KEYS: MealKey[] = ["madrugada", "ayuno", "postDesayuno", "preComida", "postComida", "preCena", "postCena"];
/** Etiquetas abreviadas — la línea de tiempo es angosta en móvil. */
const TIMELINE_SHORT: Record<MealKey, string> = {
  madrugada: "Madr.", ayuno: "Ayuno", postDesayuno: "P.Des", preComida: "Pre C",
  postComida: "Post C", preCena: "Pre Ce", postCena: "Post Ce", colacion: "Colac.",
};

function MealIcon({ k, size = 19 }: { k: MealKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: MEAL_ICON[k] }} />
  );
}

const chipsAct = ["Ninguna", "Ligera", "Moderada", "Intensa"];
const chipsSint = ["Mareo", "Temblor", "Sudoración"];

export default function RegistroGlucosaMovil({
  lecturas,
  fecha = "hoy",
  onGuardar,
  guardando = false,
  hasDiabetes = false,
  isPregnant = false,
}: RegistroGlucosaMovilProps) {
  const w = useGlucosaWizard({ lecturas, onGuardar, guardando, hasDiabetes, isPregnant });
  const { step, setStep, valor, setValor, meal, setMeal, hora, setHora, foods, setFoods, st, resumen, puedeGuardar, guardar } = w;
  const { total, enRango, promedio } = resumen;
  const [expanded, setExpanded] = useState(false);
  const [timeEdit, setTimeEdit] = useState(false);
  const [mealElegidoManual, setMealElegidoManual] = useState(false);

  const elegirMomento = (k: MealKey) => { setMeal(k); setMealElegidoManual(true); setExpanded(false); };

  const recBadge = (
    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--nav-active,#0a8c77)", background: "var(--nav-active-bg,#e6faf6)", padding: "2px 8px", borderRadius: 999 }}>Recomendado</span>
  );

  return (
    <div className="mvxgm" style={{ background: "var(--canvas,#faf4ec)", padding: "18px 18px 28px", fontFamily: F }}>
      {/* encabezado + stats */}
      <div style={{ marginBottom: 14 }}>
        <div style={caption}>Monitoreo de glucosa</div>
        <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", marginTop: 3 }}>Registro de hoy · {fecha}</div>
        <div style={{ display: "flex", gap: 9, marginTop: 13 }}>
          {[["Lecturas", total, "var(--text,#15201b)"], ["En rango", enRango, "var(--ok,#1f9d6b)"], ["Promedio", promedio, "var(--text,#15201b)"]].map(([l, n, c]) => (
            <div key={l as string} style={{ flex: 1, background: "var(--card,#fff)", border: "1.5px solid var(--card-bd,#eee3d4)", borderRadius: 14, padding: "11px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--soft,#9aa39c)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
              <div style={{ fontSize: 21, fontWeight: 800, color: c as string }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* tarjeta wizard */}
      <div style={{ background: "var(--card,#fff)", border: "1.5px solid var(--card-bd,#eee3d4)", borderRadius: 20, boxShadow: "0 12px 30px rgba(20,40,30,.06)", padding: "18px 18px 16px" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <span style={caption}>Nueva lectura</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mut,#647069)" }}>Paso {step} de 2</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "var(--skel,#efe7db)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(step / 2) * 100}%`, background: "var(--accent,#00c9a7)", borderRadius: 99, transition: "width .35s cubic-bezier(.2,.85,.25,1)" }} />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", margin: "2px 0 4px" }}>Registra tu lectura</h3>
            <p style={{ fontSize: 13, color: "var(--soft,#8a938c)", margin: "0 0 4px" }}>Valor, momento y hora en un solo paso.</p>
            <div style={{ textAlign: "center", padding: "10px 0 2px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 7 }}>
                <input className="mvxgm-num" type="number" inputMode="numeric" placeholder="0" min={GLUCOSA_MIN} max={GLUCOSA_MAX} value={valor} onChange={(e) => setValor(e.target.value)}
                  style={{ width: 150, fontSize: 62, fontWeight: 800, textAlign: "center", border: "none", background: "transparent", color: "var(--text,#15201b)", letterSpacing: "-.045em", caretColor: "var(--accent,#00c9a7)", padding: 0, fontFamily: F }} />
                <span style={{ fontSize: 15, color: "var(--soft,#9aa39c)", fontWeight: 600, marginBottom: 12 }}>mg/dL</span>
              </div>
              {st.estado && (
                <div style={{ margin: "4px 0 14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: st.bg, color: st.color, fontSize: 13, fontWeight: 700, padding: "7px 15px", borderRadius: 999 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor" }} />{st.label}
                  </span>
                </div>
              )}
              {(() => {
                const { segmentos, bajo, objetivo, alto, escala } = barraRango(meal ? MEAL_TO_TYPE[meal] : null, hasDiabetes, isPregnant);
                return (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 9, borderRadius: 999, overflow: "hidden", display: "flex" }}>
                      {segmentos.map((s, i) => (
                        <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />
                      ))}
                    </div>
                    <div style={{ position: "relative", height: 0 }}>
                      <div style={{ position: "absolute", left: `${markerPct(valor, escala)}%`, top: -13, transform: "translateX(-50%)", width: 3, height: 17, background: "var(--text,#15201b)", borderRadius: 2, boxShadow: "0 0 0 3px var(--card,#fff)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 10.5, color: "var(--soft,#9aa39c)", fontWeight: 500 }}>
                      <span>{bajo}</span><span style={{ color: "var(--ok,#1f9d6b)", fontWeight: 700 }}>{objetivo}</span><span>{alto}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* momento — sugerido, con línea de tiempo al cambiar */}
            <div style={{ marginTop: 16, background: "var(--nav-active-bg,#f2fbf8)", border: "1.5px solid var(--card-bd,#cdeee5)", borderRadius: 15, padding: "13px 15px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--accent,#00c9a7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {meal && <MealIcon k={meal} size={15} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "var(--nav-active,#0a8c77)", fontWeight: 600 }}>{mealElegidoManual ? "Momento" : "Sugerido"} · {hora || horaActual()}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text,#15201b)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal ? MEAL_LABEL[meal] : "—"}</div>
                  </div>
                </div>
                <button onClick={() => setExpanded((e) => !e)} className="mvxgm-soft"
                  style={{ flexShrink: 0, background: "transparent", border: "1.5px solid var(--card-bd,#a9e0d4)", color: "var(--nav-active,#0a8c77)", fontSize: 11.5, fontWeight: 700, padding: "8px 13px", borderRadius: 9, cursor: "pointer", fontFamily: F }}>
                  {expanded ? "Cerrar" : "Cambiar"}
                </button>
              </div>
              {expanded && (
                <div style={{ marginTop: 15, paddingTop: 15, borderTop: "1.5px dashed var(--card-bd,#cdeee5)" }}>
                  <div style={{ position: "relative", padding: "0 2px" }}>
                    <div style={{ position: "absolute", left: 2, right: 2, top: 5, height: 2, background: "var(--card-bd,#bfe6da)" }} />
                    <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
                      {TIMELINE_KEYS.map((k) => (
                        <button key={k} onClick={() => elegirMomento(k)} style={timelineDotStyle(meal === k)}>
                          <span style={timelineCircleStyle(meal === k)} />
                          <span>{TIMELINE_SHORT[k]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
                    <button onClick={() => elegirMomento("colacion")} style={chipStyle(meal === "colacion")}>
                      <MealIcon k="colacion" size={15} /><span>Fue una colación</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* hora — "ahora" por defecto, editable */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--mut,#647069)" }}>Hora: <strong style={{ color: "var(--text,#15201b)" }}>{hora || horaActual()}</strong></span>
              <button onClick={() => setTimeEdit((e) => !e)} style={{ background: "transparent", border: "none", color: "var(--nav-active,#0a8c77)", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 4, fontFamily: F }}>Editar</button>
            </div>
            {timeEdit && (
              <div style={{ marginTop: 8 }}>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 12, background: "var(--mvxg-field,#faf7f1)", fontSize: 15, color: "var(--text,#15201b)", fontFamily: F }} />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", margin: "2px 0 4px" }}>Agrega contexto</h3>
            <p style={{ fontSize: 13, color: "var(--soft,#8a938c)", margin: "0 0 14px" }}>Opcional, pero ayuda a tu médico.</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 7 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "var(--text,#15201b)" }}>Alimentos consumidos</label>{recBadge}
            </div>
            <textarea value={foods} onChange={(e) => setFoods(e.target.value)} placeholder="Ej. 2 tortillas y 2 huevos con jamón" style={{ width: "100%", minHeight: 70, padding: "12px 14px", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 13, background: "var(--mvxg-field,#faf7f1)", fontSize: 14, color: "var(--text,#15201b)", resize: "vertical", lineHeight: 1.5, fontFamily: F }} />

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "var(--text,#15201b)" }}>Actividad física</label>{recBadge}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {chipsAct.map((c) => (
                  <button key={c} className="mvxgm-soft" style={{ padding: "10px 16px", borderRadius: 12, border: "1.5px solid var(--card-bd,#e7dfd2)", background: "var(--mvxg-field,#faf7f1)", color: "var(--mut,#3d453f)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1.5px solid var(--bd,#f0e9dd)" }}>
              <div style={{ ...caption, color: "var(--faint,#b0a89b)", marginBottom: 11 }}>Adicional · opcional</div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--soft,#8a938c)", marginBottom: 8 }}>Síntomas</label>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {chipsSint.map((c) => (
                  <button key={c} className="mvxgm-warn" style={{ padding: "8px 12px", borderRadius: 999, border: "1.5px solid var(--card-bd,#ece4d6)", background: "var(--mvxg-panel,#fcfaf6)", color: "var(--soft,#8a938c)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{c}</button>
                ))}
              </div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--soft,#8a938c)", margin: "14px 0 8px" }}>Foto del glucómetro</label>
              <div className="mvxgm-soft" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", border: "1.5px dashed var(--card-bd,#ddd3c3)", borderRadius: 12, background: "var(--mvxg-panel,#fcfaf6)", cursor: "pointer" }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--skel,#f0ece3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--soft,#8a938c)" }}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mut,#647069)" }}>Sube una foto</div>
              </div>
            </div>
          </div>
        )}

        {/* nav */}
        <div style={{ paddingTop: 16, marginTop: 14, borderTop: "1.5px solid var(--bd,#f0e9dd)", display: "flex", gap: 10 }}>
          <button onClick={() => setStep((s) => Math.max(1, s - 1))}
            style={{ flex: "0 0 auto", background: "transparent", color: "var(--mut,#647069)", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 12, padding: "14px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F, opacity: step === 1 ? 0.45 : 1 }}>Atrás</button>
          {step < 2 ? (
            <button onClick={() => setStep((s) => Math.min(2, s + 1))}
              style={{ flex: 1, background: "var(--accent,#00c9a7)", color: "#03251d", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "var(--btn-glow)", fontFamily: F }}>Siguiente</button>
          ) : (
            <button onClick={() => { guardar(); setMealElegidoManual(false); }} disabled={!puedeGuardar}
              style={{ flex: 1, background: "var(--accent,#00c9a7)", color: "#03251d", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: puedeGuardar ? "pointer" : "default", boxShadow: "var(--btn-glow)", fontFamily: F, opacity: puedeGuardar ? 1 : 0.55 }}>{guardando ? "Guardando…" : "Guardar lectura"}</button>
          )}
        </div>
      </div>

      {/* bitácora */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
          <span style={caption}>Lecturas de hoy</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--nav-active,#0a8c77)", background: "var(--nav-active-bg,#e6faf6)", padding: "4px 10px", borderRadius: 999 }}>{total}</span>
        </div>
        {lecturas.length === 0 && (
          <div style={{ textAlign: "center", padding: "26px 16px", color: "var(--faint,#b0a89b)", fontSize: 13, lineHeight: 1.5, background: "var(--card,#fff)", border: "1.5px dashed var(--card-bd,#eee3d4)", borderRadius: 14 }}>Aún no hay lecturas hoy. Completa el registro y aparecerá aquí.</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {lecturas.map((r) => {
            const b = estadoRango(r.v, { hasDiabetes, isPregnant, readingType: r.readingType });
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--card,#fff)", border: "1.5px solid var(--card-bd,#eee3d4)", borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text,#15201b)", minWidth: 42 }}>{r.t}</div>
                <div style={{ width: 1.5, height: 28, background: "var(--bd,#f0e9dd)" }} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--mut,#647069)" }}>{r.label}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em" }}>{r.v}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: b.bg, color: b.color, fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, flexShrink: 0 }}>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
