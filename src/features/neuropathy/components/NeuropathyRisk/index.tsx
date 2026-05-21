"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { SintomaCheck } from "../SintomaCheck";
import { ResultadoNeuropatia } from "../ResultadoNeuropatia";
import { 
  SINTOMAS_NEUROPATIA, 
  interpretarNeuropatia, 
  InterpretacionNeuropatia, 
  SintomaNeuropatia
} from "../../data/sintomas";

export function NeuropathyRisk() {
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [resultadoVisible, setResultadoVisible] = useState(false);
  const [interpretacionActual, setInterpretacionActual] = useState<InterpretacionNeuropatia | null>(null);
  const [sintomasMarcadosActuales, setSintomasMarcadosActuales] = useState<SintomaNeuropatia[]>([]);

  const handleToggle = (id: string) => {
    setSeleccionados(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    // Limpiar resultado si el usuario vuelve a modificar sus respuestas
    if (resultadoVisible) {
      setResultadoVisible(false);
    }
  };

  const handleEvaluar = () => {
    let puntajeTotal = 0;
    const marcados: SintomaNeuropatia[] = [];

    SINTOMAS_NEUROPATIA.forEach(sintoma => {
      if (seleccionados.includes(sintoma.id)) {
        puntajeTotal += sintoma.puntos;
        marcados.push(sintoma);
      }
    });

    const interp = interpretarNeuropatia(puntajeTotal);
    
    setInterpretacionActual(interp);
    setSintomasMarcadosActuales(marcados);
    setResultadoVisible(true);

    setTimeout(() => {
      document.getElementById("resultado-neuropatia")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      
      <div className="bg-card border rounded-xl p-6 sm:p-10 shadow-sm">
        
        <div className="mb-8 border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
          <p className="text-orange-900 font-medium text-sm sm:text-base leading-relaxed">
            La neuropatía diabética afecta hasta el 50% de las personas con diabetes. Muchos casos no se detectan porque los síntomas se consideran normales con la edad. Este cuestionario le ayuda a identificarlos.
          </p>
        </div>

        <h3 className="text-xl font-display font-semibold mb-6">
          Marque todos los síntomas que ha experimentado en los últimos 3 meses:
        </h3>

        <div className="space-y-4">
          {SINTOMAS_NEUROPATIA.map(sintoma => (
            <SintomaCheck 
              key={sintoma.id}
              id={sintoma.id}
              titulo={sintoma.titulo}
              descripcion={sintoma.descripcion}
              seleccionado={seleccionados.includes(sintoma.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button onClick={handleEvaluar} className="w-full sm:w-auto h-14 px-10 text-lg shadow-md">
            Evaluar mis síntomas
          </Button>
        </div>

      </div>

      {resultadoVisible && interpretacionActual && (
        <ResultadoNeuropatia 
          interpretacion={interpretacionActual} 
          sintomasMarcados={sintomasMarcadosActuales} 
        />
      )}

    </div>
  );
}
