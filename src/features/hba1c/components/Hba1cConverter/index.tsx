"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { ConversorHbA1c } from "../ConversorHbA1c";
import { ResultadoHbA1c } from "../ResultadoHbA1c";
import { TablaEquivalencias } from "../TablaEquivalencias";
import { 
  InterpretacionHba1c, 
  convertirHba1cAGlucosa, 
  convertirGlucosaAHba1c, 
  interpretarHba1c 
} from "../../utils/calculadora";

export function Hba1cConverter() {
  const [modo, setModo] = useState<"hba1c_to_glucosa" | "glucosa_to_hba1c">("hba1c_to_glucosa");
  const [resultado, setResultado] = useState<number | null>(null);
  const [interpretacion, setInterpretacion] = useState<InterpretacionHba1c | null>(null);

  const handleTabChange = (value: string) => {
    setModo(value as any);
    setResultado(null);
    setInterpretacion(null);
  };

  const handleCalcular = (valorInput: number) => {
    if (modo === "hba1c_to_glucosa") {
      const glucosaCalc = convertirHba1cAGlucosa(valorInput);
      setResultado(glucosaCalc);
      setInterpretacion(interpretarHba1c(valorInput));
    } else {
      const hba1cCalc = convertirGlucosaAHba1c(valorInput);
      setResultado(hba1cCalc);
      setInterpretacion(interpretarHba1c(hba1cCalc));
    }
  };

  const unidadResultado = modo === "hba1c_to_glucosa" ? "mg/dL" : "%";

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <Tabs value={modo} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 p-1 h-12">
          <TabsTrigger value="hba1c_to_glucosa" className="text-sm sm:text-base">HbA1c → Glucosa</TabsTrigger>
          <TabsTrigger value="glucosa_to_hba1c" className="text-sm sm:text-base">Glucosa → HbA1c</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TabsContent value="hba1c_to_glucosa" className="m-0 h-full">
              <ConversorHbA1c modo="hba1c_to_glucosa" onCalcular={handleCalcular} />
            </TabsContent>
            <TabsContent value="glucosa_to_hba1c" className="m-0 h-full">
              <ConversorHbA1c modo="glucosa_to_hba1c" onCalcular={handleCalcular} />
            </TabsContent>
          </div>
          
          <div>
            <ResultadoHbA1c 
              valor={resultado} 
              unidad={unidadResultado} 
              interpretacion={interpretacion} 
            />
          </div>
        </div>
      </Tabs>

      <TablaEquivalencias />
      
      <div className="text-xs text-muted-foreground text-center pt-8 border-t">
        <p>Fórmula: Glucosa (mg/dL) = (HbA1c × 28.7) − 46.7 · Fuente: Nathan et al., ADAG Study 2008</p>
        <p className="mt-1 opacity-80">Este resultado es una estimación. Los valores pueden variar según el método de laboratorio utilizado.</p>
      </div>
    </div>
  );
}
