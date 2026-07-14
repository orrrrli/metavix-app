"use client";

import { Callout } from "../../../components/Callout";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { calcularDosisStrings as S } from "../strings/es";
import type { CalcularDosisFields } from "../hooks/use-calcular-dosis";
import type { DosisResultado } from "../view-data/calcular-dosis";

export interface CalcularDosisScreenProps {
  fields: CalcularDosisFields;
  setField: (name: keyof CalcularDosisFields, value: string) => void;
  resultado: DosisResultado | null;
  onCalcular: () => void;
}

/**
 * UI pura de "Calcular Dosis". Recibe los campos, el resultado ya calculado y
 * el handler; no contiene la fórmula (vive en `view-data/calcular-dosis.ts`)
 * ni queries (en `hooks/use-calcular-dosis.ts`).
 */
export function CalcularDosisScreen({
  fields,
  setField,
  resultado,
  onCalcular,
}: CalcularDosisScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCalcular();
          }}
          className="space-y-5"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-display border-b pb-2">
              {S.sectionDatos}
            </h3>

            <div className="space-y-2">
              <Label htmlFor="c-hc">{S.hcLabel}</Label>
              <Input
                id="c-hc"
                type="number"
                step="1"
                required
                value={fields.hc}
                onChange={(e) => setField("hc", e.target.value)}
                placeholder={S.hcPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-glucosa">{S.glucosaLabel}</Label>
              <Input
                id="c-glucosa"
                type="number"
                step="1"
                required
                value={fields.glucosa}
                onChange={(e) => setField("glucosa", e.target.value)}
                placeholder={S.glucosaPlaceholder}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-semibold font-display border-b pb-2">
              {S.sectionConfig}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-ric">{S.ricLabel}</Label>
                <Input
                  id="c-ric"
                  type="number"
                  step="0.1"
                  required
                  value={fields.ric}
                  onChange={(e) => setField("ric", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="c-fs">{S.fsLabel}</Label>
                <Input
                  id="c-fs"
                  type="number"
                  step="1"
                  required
                  value={fields.fs}
                  onChange={(e) => setField("fs", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-meta">{S.metaLabel}</Label>
              <Input
                id="c-meta"
                type="number"
                step="1"
                required
                value={fields.meta}
                onChange={(e) => setField("meta", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg">
            {S.submit}
          </Button>
        </form>
      </div>

      <div>
        {resultado ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold font-display">{S.resultTitle}</h3>

            {resultado.alerta && (
              <Callout variant={resultado.alerta.variant}>{resultado.alerta.msg}</Callout>
            )}

            {resultado.total > 0 && (
              <Card className="border-primary/20 shadow-md bg-primary/5">
                <CardContent className="p-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    {S.dosisTotalLabel}
                  </p>
                  <p className="text-5xl font-bold text-primary font-display">
                    {resultado.total}{" "}
                    <span className="text-2xl text-muted-foreground font-normal">
                      {S.unidad}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{S.redondeoNota}</p>
                </CardContent>
              </Card>
            )}

            {resultado.total > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm">
                <h4 className="font-semibold border-b pb-2">{S.desgloseTitle}</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {S.porComidaPrefix} ({fields.hc}g ÷ {fields.ric}):
                  </span>
                  <span className="font-medium">
                    {resultado.dosisComida} {S.unidad}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{S.porCorreccion}</span>
                  <span className="font-medium">
                    {resultado.dosisCorreccion > 0 ? resultado.dosisCorreccion : 0}{" "}
                    {S.unidad}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
            <div className="bg-muted p-4 rounded-full mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 17 4 4 4-4" />
              </svg>
            </div>
            <h4 className="font-semibold text-lg text-foreground mb-2">{S.emptyTitle}</h4>
            <p className="text-sm">{S.emptyBody}</p>
          </div>
        )}
      </div>
    </div>
  );
}
