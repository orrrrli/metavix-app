"use client";

import { useState, useEffect } from "react";
import { useInsulina } from "../../context";
import { Callout } from "../Callout";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function CalcularDosis() {
  const { perfil } = useInsulina();

  const [hc, setHc] = useState("");
  const [glucosa, setGlucosa] = useState("");
  const [meta, setMeta] = useState("");
  const [ric, setRic] = useState("");
  const [fs, setFs] = useState("");

  const [resultado, setResultado] = useState<{
    dosisComida: number;
    dosisCorreccion: number;
    total: number;
    alerta: { variant: "info" | "success" | "warning" | "danger"; msg: string } | null;
  } | null>(null);

  // Pre-fill from profile when available
  useEffect(() => {
    if (perfil) {
      setMeta(perfil.glucosa_meta.toString());
      setRic(perfil.ric.toString());
      setFs(perfil.factor_sensibilidad.toString());
    }
  }, [perfil]);

  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    const valHc = Number(hc);
    const valGluc = Number(glucosa);
    const valMeta = Number(meta);
    const valRic = Number(ric);
    const valFs = Number(fs);

    if (!valHc || !valGluc || !valMeta || !valRic || !valFs) return;

    let alerta: { variant: "info" | "success" | "warning" | "danger"; msg: string } | null = null;
    let dosisCorreccion = 0;

    if (valGluc < 70) {
      alerta = {
        variant: "danger",
        msg: "HIPOGLUCEMIA: Consume 15g de carbohidratos rápidos y espera 15 min. No apliques insulina todavía."
      };
      setResultado({ dosisComida: 0, dosisCorreccion: 0, total: 0, alerta });
      return;
    } 
    else if (valGluc > 250) {
      alerta = {
        variant: "danger",
        msg: "MUY ALTA: Revisa cetonas si es posible. Toma agua y considera contactar a tu médico."
      };
    }
    else if (valGluc > 130) {
      alerta = {
        variant: "warning",
        msg: "ALTA: Se ha añadido insulina de corrección a tu dosis."
      };
    }
    else {
      alerta = {
        variant: "success",
        msg: "EN META: Estás dentro de tu rango objetivo."
      };
    }

    const dosisComida = valHc / valRic;
    if (valGluc > valMeta) {
      dosisCorreccion = (valGluc - valMeta) / valFs;
    }

    const totalCalculado = dosisComida + dosisCorreccion;
    const totalRedondeado = Math.round(totalCalculado * 2) / 2; // Step 0.5

    setResultado({
      dosisComida: Number(dosisComida.toFixed(2)),
      dosisCorreccion: Number(dosisCorreccion.toFixed(2)),
      total: totalRedondeado,
      alerta
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <form onSubmit={calcular} className="space-y-5">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display border-b pb-2">1. Tus datos actuales</h3>
            
            <div className="space-y-2">
              <Label htmlFor="c-hc">Gramos de HC a comer</Label>
              <Input id="c-hc" type="number" step="1" required value={hc} onChange={e => setHc(e.target.value)} placeholder="Ej. 45" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="c-glucosa">Glucosa preprandial actual (mg/dL)</Label>
              <Input id="c-glucosa" type="number" step="1" required value={glucosa} onChange={e => setGlucosa(e.target.value)} placeholder="Ej. 110" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-semibold font-display border-b pb-2">2. Tu configuración médica</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-ric">RIC (g/U)</Label>
                <Input id="c-ric" type="number" step="0.1" required value={ric} onChange={e => setRic(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="c-fs">Factor S. (mg/dL)</Label>
                <Input id="c-fs" type="number" step="1" required value={fs} onChange={e => setFs(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="c-meta">Glucosa Meta (mg/dL)</Label>
              <Input id="c-meta" type="number" step="1" required value={meta} onChange={e => setMeta(e.target.value)} />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg">Calcular Dosis</Button>
        </form>
      </div>

      <div>
        {resultado ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold font-display">Resultado sugerido</h3>
            
            {resultado.alerta && (
              <Callout variant={resultado.alerta.variant}>
                {resultado.alerta.msg}
              </Callout>
            )}

            {resultado.total > 0 && (
              <Card className="border-primary/20 shadow-md bg-primary/5">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Dosis Total</p>
                  <p className="text-5xl font-bold text-primary font-display">{resultado.total} <span className="text-2xl text-muted-foreground font-normal">U</span></p>
                  <p className="text-xs text-muted-foreground">Redondeado a 0.5 unidades</p>
                </CardContent>
              </Card>
            )}

            {resultado.total > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm">
                <h4 className="font-semibold border-b pb-2">Desglose del cálculo</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Por comida ({hc}g ÷ {ric}):</span>
                  <span className="font-medium">{resultado.dosisComida} U</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Por corrección:</span>
                  <span className="font-medium">{resultado.dosisCorreccion > 0 ? resultado.dosisCorreccion : 0} U</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
            <div className="bg-muted p-4 rounded-full mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
            </div>
            <h4 className="font-semibold text-lg text-foreground mb-2">Ingresa tus datos</h4>
            <p className="text-sm">Llena el formulario a la izquierda con tus gramos de carbohidratos y glucosa actual para calcular tu dosis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
