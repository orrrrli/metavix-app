"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store";
import { FormularioIMC } from "../FormularioIMC";
import { ResultadoIMC } from "../ResultadoIMC";
import { HistorialIMC } from "../HistorialIMC";
import { TablaReferenciaIMC } from "../TablaReferenciaIMC";
import { toast } from "sonner";

export function BmiCalculator() {
  const { token } = useAuthStore();
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Current result to display
  const [currentImc, setCurrentImc] = useState<number | null>(null);
  const [currentCat, setCurrentCat] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    async function fetchHistorial() {
      try {
        const res = await fetch("/api/imc", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistorial(data);
          
          // Show most recent as current result if exists
          if (data.length > 0) {
            setCurrentImc(data[0].imc);
            setCurrentCat(data[0].categoria);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchHistorial();
  }, [token]);

  const handleCalcular = async (peso_kg: number, estatura_cm: number) => {
    if (!token) return;
    setLoading(true);
    
    // Optimistic UI calculation
    const estaturaM = estatura_cm / 100;
    const imc = peso_kg / (estaturaM * estaturaM);
    const imcRedondeado = Math.round(imc * 10) / 10;
    
    let categoria = "Normal";
    if (imcRedondeado < 18.5) categoria = "Bajo peso";
    else if (imcRedondeado < 25.0) categoria = "Normal";
    else if (imcRedondeado < 30.0) categoria = "Sobrepeso";
    else if (imcRedondeado < 35.0) categoria = "Obesidad grado I";
    else if (imcRedondeado < 40.0) categoria = "Obesidad grado II";
    else categoria = "Obesidad grado III";

    setCurrentImc(imcRedondeado);
    setCurrentCat(categoria);

    // Save to DB
    try {
      const res = await fetch("/api/imc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ peso_kg, estatura_cm })
      });

      if (res.ok) {
        const newRecord = await res.json();
        setHistorial(prev => [newRecord, ...prev]);
        toast.success("Medición guardada correctamente");
      } else {
        toast.error("Error al guardar la medición");
      }
    } catch (e) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <FormularioIMC onCalcular={handleCalcular} loading={loading} />
        </div>
        <div>
          <ResultadoIMC imc={currentImc} categoria={currentCat} />
        </div>
      </div>

      <HistorialIMC historial={historial} />
      
      <TablaReferenciaIMC />
    </div>
  );
}
