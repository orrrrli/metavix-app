"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ParametroMeta } from "../ParametroMeta";
import { ResumenControl } from "../ResumenControl";
import { PARAMETROS_META, evaluarParametro, EvaluacionMeta } from "../../data/parametros";

export function MetasControl() {
  // Estado de valores ingresados
  const [valores, setValores] = useState<Record<string, string>>({});
  
  // Estado de las evaluaciones (colores de semáforo). Por defecto todos grises.
  const [evaluaciones, setEvaluaciones] = useState<Record<string, EvaluacionMeta>>(
    PARAMETROS_META.reduce((acc, param) => {
      acc[param.id] = { estado: "sin_dato", color: "bg-muted-foreground/30" };
      return acc;
    }, {} as Record<string, EvaluacionMeta>)
  );

  const [mostrarResumen, setMostrarResumen] = useState(false);

  const handleChange = (id: string, val: string) => {
    setValores(prev => ({ ...prev, [id]: val }));
    // Esconder resumen y resetear color a gris al modificar
    if (mostrarResumen) setMostrarResumen(false);
    setEvaluaciones(prev => ({ 
      ...prev, 
      [id]: { estado: "sin_dato", color: "bg-muted-foreground/30" } 
    }));
  };

  const handleEvaluar = () => {
    const nuevasEvaluaciones: Record<string, EvaluacionMeta> = {};
    
    PARAMETROS_META.forEach(param => {
      nuevasEvaluaciones[param.id] = evaluarParametro(param.id, valores[param.id] || "");
    });

    setEvaluaciones(nuevasEvaluaciones);
    setMostrarResumen(true);

    setTimeout(() => {
      document.getElementById("resumen-metas")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const resultadosFormateados = PARAMETROS_META.map(param => ({
    param,
    valor: valores[param.id] || "",
    evaluacion: evaluaciones[param.id]
  }));

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      
      <p className="text-lg text-muted-foreground mb-8">
        Ingrese sus últimos resultados de laboratorio en los campos. Si no tiene algún dato, déjelo vacío.
      </p>

      <div className="space-y-4">
        {PARAMETROS_META.map(param => (
          <ParametroMeta 
            key={param.id}
            param={param}
            valor={valores[param.id] || ""}
            colorActual={evaluaciones[param.id].color}
            onChange={(val) => handleChange(param.id, val)}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button onClick={handleEvaluar} className="w-full sm:w-auto h-14 px-10 text-lg shadow-md">
          Ver mi resumen de control
        </Button>
      </div>

      {mostrarResumen && (
        <ResumenControl resultados={resultadosFormateados} />
      )}

      <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>Valores de referencia basados en los estándares de atención médica de la ADA (Standards of Care 2026).</p>
      </div>

    </div>
  );
}
