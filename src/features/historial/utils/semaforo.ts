export type EstadoValor = 'en_meta' | 'revisar' | 'fuera_de_meta' | 'sin_dato';
export type TipoDiabetes = 'sin_diabetes' | 'prediabetes' | 'dm1' | 'dm2' | 'embarazo';

export function getMetasGlucosaAyuno(tipo: TipoDiabetes): { min: number; max: number } {
  switch (tipo) {
    case 'sin_diabetes': return { min: 70, max: 100 };
    case 'prediabetes': return { min: 70, max: 125 };
    case 'dm1':
    case 'dm2': return { min: 80, max: 130 };
    case 'embarazo': return { min: 60, max: 95 };
    default: return { min: 70, max: 100 };
  }
}

export function getMetaGlucosaPostprandial(tipo: TipoDiabetes): number {
  switch (tipo) {
    case 'sin_diabetes': return 140;
    case 'prediabetes': return 140;
    case 'dm1':
    case 'dm2': return 180;
    case 'embarazo': return 120;
    default: return 140;
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

export function estadoHDL(valor: number | null | undefined): EstadoValor {
  if (!valor) return 'sin_dato';
  if (valor >= 40) return 'en_meta';
  if (valor >= 34) return 'revisar';
  return 'fuera_de_meta';
}
