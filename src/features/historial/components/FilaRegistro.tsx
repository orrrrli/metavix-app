import React from 'react';
import { BadgeValor } from './BadgeValor';
import { 
  TipoDiabetes,
  getMetasGlucosaAyuno, 
  getMetaGlucosaPostprandial, 
  getMetaPresionSistolica, 
  getMetaHbA1c, 
  getMetaLDL,
  estadoValor,
  estadoValorMaximo,
  estadoHDL
} from '../utils/semaforo';

export interface GlucosaComida {
  tipo: string;
  valor: number;
  hora: string;
  alimentos: string;
}

export interface Registro {
  id: string;
  fecha: string;
  glucosa_ayuno?: number;
  glucosas_comidas?: GlucosaComida[];
  presion_sistolica?: number;
  presion_diastolica?: number;
  frecuencia_cardiaca?: number;
  peso?: number;
  cintura?: number;
  hba1c?: number;
  colesterol_total?: number;
  colesterol_ldl?: number;
  colesterol_hdl?: number;
  trigliceridos?: number;
  bun?: number;
  creatinina?: number;
  ego_proteinas?: string;
  ego_glucosa?: string;
  notas?: string;
}

interface FilaRegistroProps {
  registro: Registro;
  tipoDiabetes: TipoDiabetes;
}

const TIPO_COMIDA_ABBR: Record<string, string> = {
  // API returns English enum values
  Fasting: 'Ayuno',
  PostBreakfast: 'Después Desayuno',
  PreLunch: 'Antes Comida',
  PostLunch: 'Después Comida',
  PreDinner: 'Antes Cena',
  PostDinner: 'Después Cena',
  Snack: 'Colación',
  Overnight: 'Madrugada',
  // Spanish keys kept for future API alignment
  ayuno: 'Ayuno',
  antes_desayuno: 'Antes Desayuno',
  despues_desayuno: 'Después Desayuno',
  antes_comida: 'Antes Comida',
  despues_comida: 'Después Comida',
  antes_cena: 'Antes Cena',
  despues_cena: 'Después Cena',
  antes_colacion: 'Antes Colación',
  despues_colacion: 'Después Colación',
  madrugada: 'Madrugada',
};

export function FilaRegistro({ registro, tipoDiabetes }: FilaRegistroProps) {
  // Helpers para calcular el estado
  const metaAyuno = getMetasGlucosaAyuno(tipoDiabetes);
  const estadoAyuno = estadoValor(registro.glucosa_ayuno, metaAyuno.min, metaAyuno.max);
  
  const metaPost = getMetaGlucosaPostprandial(tipoDiabetes);
  
  const metaSistolica = getMetaPresionSistolica(tipoDiabetes);
  const estadoSistolica = estadoValorMaximo(registro.presion_sistolica, metaSistolica);
  
  const metaHbA1c = getMetaHbA1c(tipoDiabetes);
  const estadoHbA1c = estadoValorMaximo(registro.hba1c, metaHbA1c);
  
  const metaLDL = getMetaLDL(tipoDiabetes);
  const estadoLDL = estadoValorMaximo(registro.colesterol_ldl, metaLDL);
  
  const estHDL = estadoHDL(registro.colesterol_hdl);

  const fechaFormat = registro.fecha;

  const truncarNotas = (nota: string | undefined) => {
    if (!nota) return '—';
    return nota.length > 40 ? nota.substring(0, 40) + '...' : nota;
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle whitespace-nowrap text-sm font-medium">
        {fechaFormat}
      </td>
      <td className="p-4 align-middle">
        <BadgeValor valor={registro.glucosa_ayuno} estado={estadoAyuno} />
      </td>
      <td className="p-4 align-middle">
        {registro.glucosas_comidas && registro.glucosas_comidas.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {registro.glucosas_comidas.map((g, idx) => {
              // Glucosas comidas suelen ser postprandiales. Si es "antes_*" podríamos usar metas de ayuno, 
              // pero la instrucción indica una sola meta postprandial genérica o seguir la lógica simplificada.
              // Asumiremos que si es "antes" usamos la de ayuno, y si es "despues" la postprandial.
              const isAyuno = g.tipo.includes('antes') || g.tipo === 'ayuno' || g.tipo === 'madrugada';
              const estadoComida = isAyuno 
                ? estadoValor(g.valor, metaAyuno.min, metaAyuno.max)
                : estadoValorMaximo(g.valor, metaPost);
              
              const label = TIPO_COMIDA_ABBR[g.tipo] || g.tipo;
              return (
                <BadgeValor 
                  key={idx} 
                  valor={g.valor} 
                  estado={estadoComida} 
                  label={label} 
                />
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </td>
      <td className="p-4 align-middle">
        {registro.presion_sistolica && registro.presion_diastolica ? (
          <BadgeValor 
            valor={`${registro.presion_sistolica}/${registro.presion_diastolica}`} 
            estado={estadoSistolica} 
          />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </td>
      <td className="p-4 align-middle text-sm text-center">
        {registro.frecuencia_cardiaca || '—'}
      </td>
      <td className="p-4 align-middle text-sm text-center">
        {registro.peso || '—'}
      </td>
      <td className="p-4 align-middle text-sm text-center">
        {registro.cintura || '—'}
      </td>
      <td className="p-4 align-middle">
        <BadgeValor valor={registro.hba1c} estado={estadoHbA1c} suffix="%" />
      </td>
      <td className="p-4 align-middle text-sm text-center">
        {registro.colesterol_total || '—'}
      </td>
      <td className="p-4 align-middle">
        <BadgeValor valor={registro.colesterol_ldl} estado={estadoLDL} />
      </td>
      <td className="p-4 align-middle">
        <BadgeValor valor={registro.colesterol_hdl} estado={estHDL} />
      </td>
      <td className="p-4 align-middle text-sm text-center">
        {registro.trigliceridos || '—'}
      </td>
      <td className="p-4 align-middle text-sm text-center">
        {registro.creatinina || '—'}
      </td>
      <td className="p-4 align-middle text-sm max-w-[200px] truncate" title={registro.notas}>
        {truncarNotas(registro.notas)}
      </td>
    </tr>
  );
}
