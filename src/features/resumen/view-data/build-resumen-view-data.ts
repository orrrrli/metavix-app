import type {
  PatientMetricasResponse,
  PatientResumenResponse,
} from "@/types/patient-resumen";
import {
  calcularEstadoMetrica,
  type EstadoMetrica,
} from "../utils/interpretacionADA";

type MetricaKey = keyof PatientMetricasResponse;

/** Definición estática de una métrica dentro de una sección del resumen. */
interface MetricaDef {
  id: MetricaKey;
  nombre: string;
  unidad: string;
  /** `false` = sólo informativa (p.ej. peso): no se evalúa estado/meta. */
  withStatus: boolean;
}

interface SeccionDef {
  titulo: string;
  metricas: MetricaDef[];
}

/**
 * Estructura de las 5 secciones clínicas del resumen. Fuente única de verdad
 * del orden y agrupación (antes estaba desperdigada en el JSX con 9 llamadas
 * a `calcularEstadoMetrica`).
 */
const SECCIONES: SeccionDef[] = [
  {
    titulo: "Control Glucémico",
    metricas: [
      { id: "glucosaAyuno", nombre: "Glucosa en ayuno", unidad: "mg/dL", withStatus: true },
      { id: "hba1c", nombre: "Hemoglobina Glicosilada (HbA1c)", unidad: "%", withStatus: true },
    ],
  },
  {
    titulo: "Presión Arterial y Corazón",
    metricas: [
      { id: "presionSistolica", nombre: "Presión Sistólica", unidad: "mmHg", withStatus: true },
      { id: "presionDiastolica", nombre: "Presión Diastólica", unidad: "mmHg", withStatus: true },
      { id: "frecuenciaCardiaca", nombre: "Frecuencia Cardiaca", unidad: "lpm", withStatus: true },
    ],
  },
  {
    titulo: "Peso y Composición Corporal",
    metricas: [
      { id: "peso", nombre: "Peso", unidad: "kg", withStatus: false },
      { id: "imc", nombre: "Índice de Masa Corporal (IMC)", unidad: "", withStatus: true },
      { id: "cintura", nombre: "Circunferencia de Cintura", unidad: "cm", withStatus: true },
    ],
  },
  {
    titulo: "Perfil de Lípidos",
    metricas: [
      { id: "colesterolTotal", nombre: "Colesterol Total", unidad: "mg/dL", withStatus: true },
      { id: "colesterolLdl", nombre: "Colesterol LDL (Malo)", unidad: "mg/dL", withStatus: true },
      { id: "colesterolHdl", nombre: "Colesterol HDL (Bueno)", unidad: "mg/dL", withStatus: true },
      { id: "trigliceridos", nombre: "Triglicéridos", unidad: "mg/dL", withStatus: true },
    ],
  },
  {
    titulo: "Función Renal",
    metricas: [
      { id: "creatinina", nombre: "Creatinina", unidad: "mg/dL", withStatus: true },
      { id: "bun", nombre: "Nitrógeno Ureico (BUN)", unidad: "mg/dL", withStatus: true },
    ],
  },
];

export interface MetricaView {
  id: string;
  nombre: string;
  valor: number | null;
  unidad: string;
  fecha: string | null;
  /** Sólo presentes si la métrica se evalúa (`withStatus`). */
  estado?: EstadoMetrica;
  meta?: string;
}

export interface SeccionView {
  titulo: string;
  metricas: MetricaView[];
}

export interface ResumenViewData {
  nombrePaciente: string;
  secciones: SeccionView[];
  /** true si todas las métricas están vacías (estado "sin registros"). */
  todasNulas: boolean;
}

/**
 * Compone el view data del resumen clínico: recorre las 5 secciones UNA vez,
 * resuelve valor/fecha desde `data.metricas` y evalúa `estado`/`meta` con
 * `calcularEstadoMetrica` para las métricas con status. Puro y testeable — el
 * fetch y el PDF viven en el hook/Control.
 */
export function buildResumenViewData(
  data: PatientResumenResponse,
): ResumenViewData {
  const { perfil, metricas } = data;
  const perfilNorm = { ...perfil, sexo: perfil.sexo as "M" | "F" };

  const todasNulas = Object.values(metricas).every((m) => m.valor === null);

  const secciones: SeccionView[] = SECCIONES.map((seccion) => ({
    titulo: seccion.titulo,
    metricas: seccion.metricas
      .map((def): MetricaView | null => {
        const m = metricas[def.id];
        if (!m) return null;
        const base: MetricaView = {
          id: def.id,
          nombre: def.nombre,
          valor: m.valor,
          unidad: def.unidad,
          fecha: m.fecha,
        };
        if (!def.withStatus) return base;
        const { estado, meta } = calcularEstadoMetrica(def.id, m.valor, perfilNorm);
        return { ...base, estado, meta };
      })
      .filter((m): m is MetricaView => m !== null),
  }));

  return { nombrePaciente: perfil.nombre, secciones, todasNulas };
}
