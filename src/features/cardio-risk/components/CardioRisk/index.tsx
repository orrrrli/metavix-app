"use client";

import { useState } from "react";
import { FormularioRiesgoCV } from "../FormularioRiesgoCV";
import { ResultadoRiesgoCV } from "../ResultadoRiesgoCV";
import { FACTORES_RIESGO, obtenerNivelRiesgo } from "../../data/factores";

interface ResumenCalculo {
  puntaje: number;
  nivel: string;
  color: string;
  llavesTextos: string[];
}

export function CardioRisk() {
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [pas, setPas] = useState("");
  const [ldl, setLdl] = useState("");
  const [factoresActivos, setFactoresActivos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [resultado, setResultado] = useState<ResumenCalculo | null>(null);

  const toggleFactor = (id: string) => {
    setFactoresActivos(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    // Limpiar resultado al modificar algo
    setResultado(null);
  };

  const calcularRiesgo = () => {
    if (!edad || !sexo) {
      setError("Por favor complete su edad y sexo biológico.");
      return;
    }
    setError(null);

    let puntaje = 0;
    const llavesDetectadas: string[] = [];

    const numEdad = Number(edad);
    if (sexo === "M" && numEdad >= 45) {
      puntaje += 2;
      llavesDetectadas.push("edad_sexo_h");
    } else if (sexo === "F" && numEdad >= 55) {
      puntaje += 2;
      llavesDetectadas.push("edad_sexo_m");
    }

    if (pas) {
      const numPas = Number(pas);
      if (numPas >= 140) {
        puntaje += 3;
        llavesDetectadas.push("pas_140");
      } else if (numPas >= 130 && numPas <= 139) {
        puntaje += 1;
        llavesDetectadas.push("pas_130");
      }
    }

    if (ldl) {
      const numLdl = Number(ldl);
      if (numLdl >= 160) {
        puntaje += 3;
        llavesDetectadas.push("ldl_160");
      } else if (numLdl >= 130 && numLdl <= 159) {
        puntaje += 2;
        llavesDetectadas.push("ldl_130");
      }
    }

    factoresActivos.forEach(fid => {
      const f = FACTORES_RIESGO.find(x => x.id === fid);
      if (f) {
        puntaje += f.puntos;
        llavesDetectadas.push(fid);
      }
    });

    const infoNivel = obtenerNivelRiesgo(puntaje);

    setResultado({
      puntaje,
      nivel: infoNivel.nivel,
      color: infoNivel.color,
      llavesTextos: llavesDetectadas
    });

    // Scroll al resultado después de un pequeño delay para permitir el renderizado
    setTimeout(() => {
      document.getElementById("resultado-cardio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      
      <FormularioRiesgoCV 
        edad={edad} setEdad={(v) => { setEdad(v); setResultado(null); }}
        sexo={sexo} setSexo={(v) => { setSexo(v || ""); setResultado(null); }}
        pas={pas} setPas={(v) => { setPas(v); setResultado(null); }}
        ldl={ldl} setLdl={(v) => { setLdl(v); setResultado(null); }}
        factoresActivos={factoresActivos}
        toggleFactor={toggleFactor}
        onCalcular={calcularRiesgo}
        error={error}
      />

      {resultado && (
        <ResultadoRiesgoCV 
          puntaje={resultado.puntaje}
          nivel={resultado.nivel}
          color={resultado.color}
          factoresEncontrados={resultado.llavesTextos}
        />
      )}

    </div>
  );
}
