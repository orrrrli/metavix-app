"use client";

import { useState } from "react";
import { TarjetaPerfil } from "../TarjetaPerfil";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { useInsulinProfile, useUpsertInsulinProfile } from "@/features/patient/hooks/use-insulin-dm1";

interface MisDatosProps {
  patientId: string;
}

export function MisDatos({ patientId }: MisDatosProps) {
  const { data: perfil } = useInsulinProfile(patientId);
  const { mutate: upsertPerfil, isPending } = useUpsertInsulinProfile(patientId);

  const [formData, setFormData] = useState({
    nombre_insulina: "",
    ric: "",
    factor_sensibilidad: "",
    glucosa_meta: "",
    nombre_medico: "",
    telefono_medico: "",
  });

  // Pre-poblar el formulario con el perfil al llegar/cambiar: patrón "ajustar
  // estado en render" de React en vez de useEffect + setState (que dispara
  // renders en cascada). Ver react.dev/learn/you-might-not-need-an-effect.
  const [perfilAnterior, setPerfilAnterior] = useState(perfil);
  if (perfil && perfil !== perfilAnterior) {
    setPerfilAnterior(perfil);
    setFormData({
      nombre_insulina: perfil.insulinName ?? "",
      ric: perfil.ric?.toString() ?? "",
      factor_sensibilidad: perfil.sensitivityFactor?.toString() ?? "",
      glucosa_meta: perfil.targetGlucose?.toString() ?? "",
      nombre_medico: perfil.doctorName ?? "",
      telefono_medico: perfil.doctorPhone ?? "",
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertPerfil(
      {
        insulinName: formData.nombre_insulina || null,
        ric: Number(formData.ric) || null,
        sensitivityFactor: Number(formData.factor_sensibilidad) || null,
        targetGlucose: Number(formData.glucosa_meta) || null,
        doctorName: formData.nombre_medico || null,
        doctorPhone: formData.telefono_medico || null,
      },
      {
        onSuccess: () => toast.success("Perfil guardado exitosamente"),
        onError: () => toast.error("Error al guardar el perfil"),
      }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-5">
        <TarjetaPerfil perfil={perfil ?? null} />
      </div>

      <div className="lg:col-span-7 bg-card border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-display font-bold mb-6">Configurar Perfil Médico</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider border-b pb-2">Datos Clínicos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-insulina">Nombre de la Insulina</Label>
                <Input
                  id="p-insulina"
                  value={formData.nombre_insulina}
                  onChange={e => setFormData({ ...formData, nombre_insulina: e.target.value })}
                  placeholder="Ej. Novorapid, Humalog"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-meta">Glucosa Meta (mg/dL)</Label>
                <Input
                  id="p-meta"
                  type="number"
                  value={formData.glucosa_meta}
                  onChange={e => setFormData({ ...formData, glucosa_meta: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-ric">RIC (Relación I:C)</Label>
                <Input
                  id="p-ric"
                  type="number"
                  step="0.1"
                  value={formData.ric}
                  onChange={e => setFormData({ ...formData, ric: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-fs">Factor de Sensibilidad</Label>
                <Input
                  id="p-fs"
                  type="number"
                  value={formData.factor_sensibilidad}
                  onChange={e => setFormData({ ...formData, factor_sensibilidad: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider border-b pb-2">Datos de Contacto</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="p-medico">Nombre del Médico</Label>
                <Input
                  id="p-medico"
                  value={formData.nombre_medico}
                  onChange={e => setFormData({ ...formData, nombre_medico: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-telefono">Teléfono del Médico</Label>
                <Input
                  id="p-telefono"
                  type="tel"
                  value={formData.telefono_medico}
                  onChange={e => setFormData({ ...formData, telefono_medico: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Guardando..." : "Guardar Perfil"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
