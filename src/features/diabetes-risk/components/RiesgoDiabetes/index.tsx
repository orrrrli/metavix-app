"use client";

import { useState } from "react";
import { BarraProgreso } from "../BarraProgreso";
import { PreguntaFINDRISC } from "../PreguntaFINDRISC";
import { ResultadoFINDRISC } from "../ResultadoFINDRISC";
import { PREGUNTAS_FINDRISC } from "../../data/preguntas";
import { calcularNivelRiesgo } from "../../data/interpretacion";

export function RiesgoDiabetes() {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<(number | null)[]>(Array(PREGUNTAS_FINDRISC.length).fill(null));
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const handleSelect = (puntos: number) => {
    const nuevas = [...respuestas];
    nuevas[preguntaActual] = puntos;
    setRespuestas(nuevas);
  };

  const handleNext = () => {
    if (preguntaActual < PREGUNTAS_FINDRISC.length - 1) {
      setPreguntaActual(prev => prev + 1);
    } else {
      setMostrarResultado(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setPreguntaActual(0);
    setRespuestas(Array(PREGUNTAS_FINDRISC.length).fill(null));
    setMostrarResultado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (mostrarResultado) {
    const puntajeTotal = respuestas.reduce((acc, val) => (acc || 0) + (val || 0), 0) as number;
    const interpretacion = calcularNivelRiesgo(puntajeTotal);

    return (
      <ResultadoFINDRISC 
        puntaje={puntajeTotal} 
        interpretacion={interpretacion} 
        onReset={handleReset} 
      />
    );
  }

  const pregunta = PREGUNTAS_FINDRISC[preguntaActual];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <BarraProgreso 
        preguntaActual={preguntaActual} 
        totalPreguntas={PREGUNTAS_FINDRISC.length} 
      />
      
      <div className="min-h-[400px]">
        <PreguntaFINDRISC 
          pregunta={pregunta}
          respuestaSeleccionada={respuestas[preguntaActual]}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          esPrimera={preguntaActual === 0}
          esUltima={preguntaActual === PREGUNTAS_FINDRISC.length - 1}
        />
      </div>
    </div>
  );
}
