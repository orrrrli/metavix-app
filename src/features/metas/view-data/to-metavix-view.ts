import type { EvaluacionMeta } from "../data/parametros";
import type { MetasViewData } from "./build-metas-view-data";

export type EstadoMeta = "ok" | "warn" | "bad" | "vacio";

export interface MetavixMetaParametro {
  id: string;
  label: string;
  estado: EstadoMeta;
  valor: string | null;
  unidad?: string;
  metaTexto: string;
  nota?: { texto: string; tono?: "info" | "warn" };
  razonNoEvaluable?: "especialista" | "no_embarazo";
}

export interface MetavixNoEvaluado {
  id: string;
  label: string;
  razon: "especialista" | "no_embarazo";
  nota?: { texto: string; tono?: "info" | "warn" };
}

/** Traduce `EvaluacionMeta.estado` (dominio interno) al vocabulario del
 *  diseño Metavix. Un parámetro sin dato es "vacio" independientemente de
 *  si ya se evaluó o no. */
const ESTADO_MAP: Record<EvaluacionMeta["estado"], EstadoMeta> = {
  en_meta: "ok",
  cuidado: "warn",
  fuera_meta: "bad",
  sin_dato: "vacio",
};

const RAZON_MAP: Partial<Record<string, "especialista" | "no_embarazo">> = {
  "requires-specialist-evaluation": "especialista",
  "not-evaluated-in-pregnancy": "no_embarazo",
};

/**
 * Construye la lista de parámetros en el vocabulario del diseño Metavix a
 * partir del `MetasViewData` ya resuelto (sin re-derivar nada clínico). Antes
 * de evaluar (`hasEvalResult === false`) no hay `views` con `note`/`reason`
 * por parámetro, así que esos campos quedan ausentes — el grid pre-evaluación
 * del diseño solo pinta valor + label.
 */
export function buildMetavixParametros(viewData: MetasViewData): MetavixMetaParametro[] {
  const viewsByParam = new Map(viewData.views.map((v) => [v.parameterId, v]));

  return viewData.resultados.map(({ param, valor, evaluacion }) => {
    const view = viewsByParam.get(param.id);

    let nota: MetavixMetaParametro["nota"];
    if (view?.criticalAlert) {
      nota = { texto: view.criticalAlert, tono: "warn" };
    } else if (view?.note) {
      nota = { texto: view.note, tono: "info" };
    }

    const razonNoEvaluable = view?.reason ? RAZON_MAP[reasonKeyFor(view.reason)] : undefined;

    return {
      id: param.id,
      label: param.nombre,
      estado: ESTADO_MAP[evaluacion.estado],
      valor: valor || null,
      unidad: param.unidad,
      metaTexto: param.metaMostrada,
      nota,
      razonNoEvaluable,
    };
  });
}

/**
 * `view.reason` ya viene traducido a texto en español (ver `goal-eval-to-view.ts`
 * → `formatNoDataReason`). Para recuperar el código y mapearlo a la categoría
 * del diseño, comparamos contra los mismos textos que emite esa función.
 */
function reasonKeyFor(reasonText: string): string {
  switch (reasonText) {
    case "Requiere evaluación con especialista":
      return "requires-specialist-evaluation";
    case "No se evalúa en el embarazo":
      return "not-evaluated-in-pregnancy";
    default:
      return "";
  }
}

/**
 * Lista de "no evaluados con razón" para `NoDataReasonsTable`, directamente
 * desde la respuesta cruda (no desde `views`, que ya perdió el código de
 * razón al traducirlo a texto). Excluye "no-recent-data": el diseño no tiene
 * una tercera categoría para ese caso, ya cubierto por "Sin registrar".
 */
export function buildMetavixNoEvaluados(viewData: MetasViewData): MetavixNoEvaluado[] {
  const items = viewData.evalResult?.items ?? [];
  const paramNota = new Map(viewData.views.map((v) => [v.parameterId, v]));

  const result: MetavixNoEvaluado[] = [];
  for (const item of items) {
    if (item.status !== "NoData" || !item.reason) continue;
    const razon = RAZON_MAP[item.reason];
    if (!razon) continue;

    const view = paramNota.get(item.parameterId);
    const resultado = viewData.resultados.find((r) => r.param.id === item.parameterId);
    result.push({
      id: item.parameterId,
      label: resultado?.param.nombre ?? item.parameterId,
      razon,
      nota: view?.note ? { texto: view.note, tono: "info" } : undefined,
    });
  }
  return result;
}

/** Acción por defecto sugerida según severidad (usada en la sección
 *  "Necesita tu atención" del diseño). */
export const ACCION_DEFAULT: Record<"warn" | "bad", string> = {
  warn: "Vigilar",
  bad: "Consultar a tu médico",
};

export interface ResumenMetas {
  total: number;
  ok: number;
  warn: number;
  bad: number;
  vacio: number;
  porcentajeEnMeta: number;
}

/** Resumen agregado de la lista de parámetros, para el hero con anillo. */
export function resumenMetas(parametros: MetavixMetaParametro[]): ResumenMetas {
  const total = parametros.length;
  const ok = parametros.filter((p) => p.estado === "ok").length;
  const warn = parametros.filter((p) => p.estado === "warn").length;
  const bad = parametros.filter((p) => p.estado === "bad").length;
  const vacio = parametros.filter((p) => p.estado === "vacio").length;
  const evaluados = ok + warn + bad;
  const porcentajeEnMeta = evaluados > 0 ? Math.round((ok / evaluados) * 100) : 0;

  return { total, ok, warn, bad, vacio, porcentajeEnMeta };
}
