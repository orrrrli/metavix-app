"use client";

import { TarjetaPerfil } from "../../../components/TarjetaPerfil";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { misDatosStrings as S } from "../strings/es";
import type { MisDatosForm } from "../hooks/use-mis-datos";
import type { InsulinProfileResponse } from "@/types/insulin-dm1";

export interface MisDatosScreenProps {
  perfil: InsulinProfileResponse | null;
  form: MisDatosForm;
  setField: (name: keyof MisDatosForm, value: string) => void;
  isPending: boolean;
  onSubmit: () => void;
}

/** UI pura de "Mis Datos" (perfil de insulina). Sin queries ni mutaciones. */
export function MisDatosScreen({
  perfil,
  form,
  setField,
  isPending,
  onSubmit,
}: MisDatosScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-5">
        <TarjetaPerfil perfil={perfil} />
      </div>

      <div className="lg:col-span-7 bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-display font-bold mb-6">{S.title}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider border-b pb-2">
              {S.seccionClinicos}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-insulina">{S.insulina}</Label>
                <Input
                  id="p-insulina"
                  value={form.nombre_insulina}
                  onChange={(e) => setField("nombre_insulina", e.target.value)}
                  placeholder={S.insulinaPlaceholder}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-meta">{S.meta}</Label>
                <Input
                  id="p-meta"
                  type="number"
                  value={form.glucosa_meta}
                  onChange={(e) => setField("glucosa_meta", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-ric">{S.ric}</Label>
                <Input
                  id="p-ric"
                  type="number"
                  step="0.1"
                  value={form.ric}
                  onChange={(e) => setField("ric", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-fs">{S.fs}</Label>
                <Input
                  id="p-fs"
                  type="number"
                  value={form.factor_sensibilidad}
                  onChange={(e) => setField("factor_sensibilidad", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider border-b pb-2">
              {S.seccionContacto}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-medico">{S.medico}</Label>
                <Input
                  id="p-medico"
                  value={form.nombre_medico}
                  onChange={(e) => setField("nombre_medico", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-telefono">{S.telefono}</Label>
                <Input
                  id="p-telefono"
                  type="tel"
                  value={form.telefono_medico}
                  onChange={(e) => setField("telefono_medico", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? S.guardando : S.guardar}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
