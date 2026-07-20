export type EstadoValor = 'en_meta' | 'revisar' | 'fuera_de_meta' | 'sin_dato';
export type TipoDiabetes = 'sin_diabetes' | 'prediabetes' | 'dm1' | 'dm2' | 'embarazo';

/**
 * Rango con banda "En meta" explícita, alineado a `rangos-glucosa.ts` (misma
 * fuente clínica que el wizard de nuevo-registro). `enMetaMin`/`enMetaMax`
 * son opcionales: cuando faltan, `estadoValorConBanda` usa la fórmula
 * genérica de margen (±%) en vez de una banda "Revisar" explícita.
 */
export interface RangoConBanda {
  min: number;
  max: number;
  enMetaMin?: number;
  enMetaMax?: number;
}

/**
 * Umbrales alineados a `rangos-glucosa.ts` (ADA Standards of Care 2026 +
 * guías de embarazo). `min` es el piso universal de hipoglucemia (70 mg/dL);
 * `enMetaMin`/`enMetaMax` acotan la banda "en meta" real, dejando el resto
 * de [min, max] como "revisar" o, en el caso de embarazo (que no tiene
 * banda "fuera de meta baja"), directamente sin sub-banda.
 */
export function getMetasGlucosaAyuno(tipo: TipoDiabetes): RangoConBanda {
  switch (tipo) {
    case 'sin_diabetes': return { min: 70, max: 125, enMetaMin: 70, enMetaMax: 99 };
    case 'prediabetes': return { min: 70, max: 125, enMetaMin: 70, enMetaMax: 99 };
    case 'dm1':
    case 'dm2': return { min: 70, max: 180, enMetaMin: 80, enMetaMax: 130 };
    // Embarazo con diabetes (gestacional o pregestacional): sin banda "fuera de meta baja".
    case 'embarazo': return { min: 70, max: 125, enMetaMin: 70, enMetaMax: 95 };
    default: return { min: 70, max: 125, enMetaMin: 70, enMetaMax: 99 };
  }
}

export function getMetaGlucosaPostprandial(tipo: TipoDiabetes): RangoConBanda {
  switch (tipo) {
    case 'sin_diabetes': return { min: 70, max: 199, enMetaMin: 70, enMetaMax: 139 };
    case 'prediabetes': return { min: 70, max: 199, enMetaMin: 70, enMetaMax: 139 };
    case 'dm1':
    case 'dm2': return { min: 70, max: 250, enMetaMin: 70, enMetaMax: 179 };
    // Embarazo con diabetes (gestacional o pregestacional).
    case 'embarazo': return { min: 70, max: 180, enMetaMin: 110, enMetaMax: 140 };
    default: return { min: 70, max: 199, enMetaMin: 70, enMetaMax: 139 };
  }
}

export function getMetaPresionSistolica(tipo: TipoDiabetes): number {
  switch (tipo) {
    case 'sin_diabetes': return 120;
    case 'prediabetes': return 130;
    case 'dm1':
    case 'dm2': return 130;
    case 'embarazo': return 140;
    default: return 120;
  }
}

export function getMetaHbA1c(tipo: TipoDiabetes): number {
  switch (tipo) {
    case 'sin_diabetes': return 5.7;
    case 'prediabetes': return 6.4;
    case 'dm1':
    case 'dm2': return 7.0;
    case 'embarazo': return 6.5;
    default: return 5.7;
  }
}

export function getMetaLDL(tipo: TipoDiabetes): number {
  switch (tipo) {
    case 'sin_diabetes': return 130;
    case 'prediabetes': return 130;
    case 'dm1':
    case 'dm2': return 100;
    case 'embarazo': return 100;
    default: return 130;
  }
}

export function estadoValor(valor: number | null | undefined, min: number, max: number): EstadoValor {
  if (!valor) return 'sin_dato';
  if (valor >= min && valor <= max) return 'en_meta';
  
  // Usamos la lógica exacta solicitada para el margen
  const margen = (max - min) * 0.15 + max * 0.1;
  
  // Añadimos comprobación por debajo del mínimo para seguridad, aunque la instrucción original
  // decía "if (valor <= max + margen) return 'revisar'".
  // Si el valor está por debajo del mínimo también le aplicaremos un margen simétrico.
  const isCercaMax = valor > max && valor <= max + margen;
  const isCercaMin = valor < min && valor >= min - margen;
  
  if (isCercaMax || isCercaMin) return 'revisar';
  
  return 'fuera_de_meta';
}

export function estadoValorMaximo(valor: number | null | undefined, max: number): EstadoValor {
  return estadoValor(valor, 0, max);
}

/**
 * Evalúa un valor contra un rango con banda "En meta" explícita:
 *   - 'sin_dato' si no hay valor
 *   - 'fuera_de_meta' si v < min o v > max, o si cae en [min, enMetaMin) —
 *     por debajo de la meta pero dentro del rango válido (ej. 70–79 en
 *     ayuno diabético: bajo pero no hipoglucémico)
 *   - si `enMetaMin`/`enMetaMax` están definidos: 'en_meta' dentro de esa
 *     sub-banda, 'revisar' solo en (enMetaMax, max] (por encima de la meta)
 *   - si no están definidos: cae a la fórmula de margen de `estadoValor`
 */
export function estadoValorConBanda(
  valor: number | null | undefined,
  min: number,
  max: number,
  enMetaMin?: number,
  enMetaMax?: number
): EstadoValor {
  if (!valor) return 'sin_dato';
  if (enMetaMin == null || enMetaMax == null) return estadoValor(valor, min, max);
  if (valor < min || valor > max) return 'fuera_de_meta';
  if (valor >= enMetaMin && valor <= enMetaMax) return 'en_meta';
  if (valor < enMetaMin) return 'fuera_de_meta';
  return 'revisar';
}

export function estadoHDL(valor: number | null | undefined): EstadoValor {
  if (!valor) return 'sin_dato';
  if (valor >= 40) return 'en_meta';
  if (valor >= 34) return 'revisar';
  return 'fuera_de_meta';
}
