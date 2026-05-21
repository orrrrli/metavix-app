export interface OpcionFINDRISC {
  texto: string;
  puntos: number;
}

export interface PreguntaFINDRISC {
  id: number;
  titulo: string;
  opciones: OpcionFINDRISC[];
}

export const PREGUNTAS_FINDRISC: PreguntaFINDRISC[] = [
  {
    id: 1,
    titulo: "1. ¿Qué edad tienes?",
    opciones: [
      { texto: "Menos de 45 años", puntos: 0 },
      { texto: "45 a 54 años", puntos: 2 },
      { texto: "55 a 64 años", puntos: 3 },
      { texto: "Más de 64 años", puntos: 4 }
    ]
  },
  {
    id: 2,
    titulo: "2. Índice de Masa Corporal (IMC)",
    opciones: [
      { texto: "Menos de 25 (peso normal)", puntos: 0 },
      { texto: "25 a 30 (sobrepeso)", puntos: 1 },
      { texto: "Más de 30 (obesidad)", puntos: 3 }
    ]
  },
  {
    id: 3,
    titulo: "3. Perímetro de cintura medido por debajo de las costillas (normalmente a nivel del ombligo)",
    opciones: [
      { texto: "Hombre < 94 cm / Mujer < 80 cm", puntos: 0 },
      { texto: "Hombre 94–102 cm / Mujer 80–88 cm", puntos: 3 },
      { texto: "Hombre > 102 cm / Mujer > 88 cm", puntos: 4 }
    ]
  },
  {
    id: 4,
    titulo: "4. ¿Realizas habitualmente al menos 30 minutos de actividad física en el trabajo o durante tu tiempo libre?",
    opciones: [
      { texto: "Sí, regularmente", puntos: 0 },
      { texto: "No o muy poco", puntos: 2 }
    ]
  },
  {
    id: 5,
    titulo: "5. ¿Con qué frecuencia comes verduras o frutas?",
    opciones: [
      { texto: "Todos los días", puntos: 0 },
      { texto: "No todos los días", puntos: 1 }
    ]
  },
  {
    id: 6,
    titulo: "6. ¿Tomas alguna vez medicamentos para la presión arterial alta?",
    opciones: [
      { texto: "No", puntos: 0 },
      { texto: "Sí", puntos: 2 }
    ]
  },
  {
    id: 7,
    titulo: "7. ¿Alguna vez te han encontrado valores altos de glucosa en sangre (en un examen médico, durante una enfermedad o en el embarazo)?",
    opciones: [
      { texto: "No", puntos: 0 },
      { texto: "Sí", puntos: 5 }
    ]
  },
  {
    id: 8,
    titulo: "8. ¿Alguien de tu familia biológica o parientes cercanos ha sido diagnosticado con diabetes (tipo 1 o tipo 2)?",
    opciones: [
      { texto: "No", puntos: 0 },
      { texto: "Sí: abuelos, tías, tíos o primos hermanos", puntos: 3 },
      { texto: "Sí: padres, hermanos o hijos", puntos: 5 }
    ]
  }
];
