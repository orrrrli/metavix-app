"use client";

import React from "react";
import { useGlucosaWizard } from "../../hooks/use-glucosa-wizard";
import {
  MealKey, MEAL_KEYS, MEAL_LABEL, MEAL_ICON, MEAL_TO_TYPE,
  GlucosaLectura, NuevaLectura,
  markerPct, estadoRango, horaActual, barraRango,
  GLUCOSA_MIN, GLUCOSA_MAX, esGlucosaValida,
} from "../../utils/glucosa";

/**
 * RegistroGlucosaMovil — versión móvil (3A).
 * Wizard controlado de 3 pasos en una sola columna: resumen del día arriba,
 * wizard, y bitácora de lecturas de hoy abajo. El estado de la lista vive en el
 * padre (React Query); este componente emite `onGuardar` con la nueva lectura.
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
  // fila (ícono + etiqueta), 2 columnas — más escaneable en móvil
  return {
    display: "flex", flexDirection: "row", alignItems: "center", gap: 11, justifyContent: "flex-start",
    padding: "13px 14px", borderRadius: 13, cursor: "pointer", fontFamily: F,
    fontSize: 13.5, fontWeight: sel ? 700 : 600, width: "100%",
    border: sel ? "1.5px solid var(--accent,#00c9a7)" : "1.5px solid var(--card-bd,#efe7db)",
    background: sel ? "var(--accent,#00c9a7)" : "var(--mvxg-field,#faf7f1)",
    color: sel ? "#03251d" : "var(--mut,#647069)",
    boxShadow: sel ? "0 8px 18px rgba(0,201,167,.28)" : "none",
  };
}

function MealIcon({ k }: { k: MealKey }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
  const { step, setStep, valor, setValor, meal, setMeal, hora, setHora, foods, setFoods, st, resumen, guardar } = w;
  const { total, enRango, promedio } = resumen;

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
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mut,#647069)" }}>Paso {step} de 3</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "var(--skel,#efe7db)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(step / 3) * 100}%`, background: "var(--accent,#00c9a7)", borderRadius: 99, transition: "width .35s cubic-bezier(.2,.85,.25,1)" }} />
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", margin: "2px 0 4px" }}>¿Cuánto marcó tu glucómetro?</h3>
            <p style={{ fontSize: 13, color: "var(--soft,#8a938c)", margin: "0 0 4px" }}>Escribe el valor de la pantalla.</p>
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
                const { segmentos, bajo, objetivo, alto } = barraRango(meal ? MEAL_TO_TYPE[meal] : null, hasDiabetes, isPregnant);
                return (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 9, borderRadius: 999, overflow: "hidden", display: "flex" }}>
                      {segmentos.map((s, i) => (
                        <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />
                      ))}
                    </div>
                    <div style={{ position: "relative", height: 0 }}>
                      <div style={{ position: "absolute", left: `${markerPct(valor)}%`, top: -13, transform: "translateX(-50%)", width: 3, height: 17, background: "var(--text,#15201b)", borderRadius: 2, boxShadow: "0 0 0 3px var(--card,#fff)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 10.5, color: "var(--soft,#9aa39c)", fontWeight: 500 }}>
                      <span>{bajo}</span><span style={{ color: "var(--ok,#1f9d6b)", fontWeight: 700 }}>{objetivo}</span><span>{alto}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 800, color: "var(--text,#15201b)", letterSpacing: "-.02em", margin: "2px 0 4px" }}>¿En qué momento mediste?</h3>
            <p style={{ fontSize: 13, color: "var(--soft,#8a938c)", margin: "0 0 14px" }}>Relaciona la lectura con tu comida.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {MEAL_KEYS.map((k) => (
                <button key={k} style={chipStyle(meal === k)} onClick={() => setMeal(k)}>
                  <MealIcon k={k} /><span>{MEAL_LABEL[k]}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "var(--mut,#647069)" }}>Hora</label>
                <button type="button" onClick={() => setHora(horaActual())} style={{ fontSize: 12, fontWeight: 700, color: "var(--nav-active,#0a8c77)", background: "var(--nav-active-bg,#e6faf6)", border: "none", padding: "4px 10px", borderRadius: 999, cursor: "pointer", fontFamily: F }}>Ahora</button>
              </div>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--card-bd,#e7dfd2)", borderRadius: 12, background: "var(--mvxg-field,#faf7f1)", fontSize: 15, color: "var(--text,#15201b)", fontFamily: F }} />
            </div>
          </div>
        )}

        {step === 3 && (
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
          {step < 3 ? (
            <button onClick={() => setStep((s) => Math.min(3, s + 1))}
              style={{ flex: 1, background: "var(--accent,#00c9a7)", color: "#03251d", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "var(--btn-glow)", fontFamily: F }}>Siguiente</button>
          ) : (
            <button onClick={guardar} disabled={guardando || !esGlucosaValida(parseFloat(valor)) || !meal}
              style={{ flex: 1, background: "var(--accent,#00c9a7)", color: "#03251d", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: guardando ? "default" : "pointer", boxShadow: "var(--btn-glow)", fontFamily: F, opacity: (guardando || !esGlucosaValida(parseFloat(valor)) || !meal) ? 0.55 : 1 }}>{guardando ? "Guardando…" : "Guardar lectura"}</button>
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
