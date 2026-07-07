"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store";
import { useCreateLabRecord } from "@/features/patient/hooks/use-lab-records";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const numOrNull = (v: string): number | null => (v.trim() !== "" ? Number(v) : null);
const strOrNull = (v: string): string | null => (v.trim() !== "" ? v.trim() : null);

export default function LaboratorioPage() {
  const { patientId } = useAuthStore();
  const { mutate: createLab, isPending } = useCreateLabRecord(patientId ?? "");

  const [sampleDate, setSampleDate] = useState(new Date().toISOString().split("T")[0]);
  const [hba1c, setHba1c] = useState("");
  const [totalCholesterol, setTotalCholesterol] = useState("");
  const [ldl, setLdl] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglycerides, setTriglycerides] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [bun, setBun] = useState("");
  const [egoProteins, setEgoProteins] = useState("");
  const [egoGlucose, setEgoGlucose] = useState("");
  const [notas, setNotas] = useState("");

  const reset = () => {
    setHba1c("");
    setTotalCholesterol("");
    setLdl("");
    setHdl("");
    setTriglycerides("");
    setCreatinine("");
    setBun("");
    setEgoProteins("");
    setEgoGlucose("");
    setNotas("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      toast.error("No hay sesión de paciente activa.");
      return;
    }

    const payload = {
      sampleDate,
      hba1c: numOrNull(hba1c),
      totalCholesterol: numOrNull(totalCholesterol),
      ldl: numOrNull(ldl),
      hdl: numOrNull(hdl),
      triglycerides: numOrNull(triglycerides),
      creatinine: numOrNull(creatinine),
      bun: numOrNull(bun),
      egoProteins: strOrNull(egoProteins),
      egoGlucose: strOrNull(egoGlucose),
      notes: strOrNull(notas),
    };

    const algunValor = [
      payload.hba1c, payload.totalCholesterol, payload.ldl, payload.hdl,
      payload.triglycerides, payload.creatinine, payload.bun,
      payload.egoProteins, payload.egoGlucose,
    ].some((v) => v !== null);

    if (!algunValor) {
      toast.error("Ingresa al menos un resultado de laboratorio.");
      return;
    }

    createLab(payload, {
      onSuccess: () => {
        toast.success("Resultados de laboratorio registrados correctamente");
        reset();
      },
      onError: () => toast.error("Error al guardar los resultados"),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold" style={{ color: "var(--text)" }}>
          Laboratorio y EGO
        </h2>
        <p className="mt-1" style={{ color: "var(--mut)" }}>
          Registra los resultados de tus estudios de laboratorio y examen general de orina. Todos los campos son opcionales; llena los que tengas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="sampleDate">Fecha de la muestra</Label>
          <Input
            id="sampleDate"
            type="date"
            required
            max={new Date().toISOString().split("T")[0]}
            value={sampleDate}
            onChange={(e) => setSampleDate(e.target.value)}
            className="sm:max-w-xs"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Perfil metabólico y lipídico</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hba1c">HbA1c (%)</Label>
              <Input id="hba1c" type="number" step="0.1" min="3" max="20" placeholder="Ej. 6.5" value={hba1c} onChange={(e) => setHba1c(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCholesterol">Colesterol total (mg/dL)</Label>
              <Input id="totalCholesterol" type="number" min="50" max="600" placeholder="Ej. 190" value={totalCholesterol} onChange={(e) => setTotalCholesterol(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ldl">Colesterol LDL (mg/dL)</Label>
              <Input id="ldl" type="number" min="20" max="400" placeholder="Ej. 110" value={ldl} onChange={(e) => setLdl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hdl">Colesterol HDL (mg/dL)</Label>
              <Input id="hdl" type="number" min="10" max="200" placeholder="Ej. 50" value={hdl} onChange={(e) => setHdl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triglycerides">Triglicéridos (mg/dL)</Label>
              <Input id="triglycerides" type="number" min="20" max="3000" placeholder="Ej. 150" value={triglycerides} onChange={(e) => setTriglycerides(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Función renal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creatinine">Creatinina (mg/dL)</Label>
              <Input id="creatinine" type="number" step="0.01" min="0.1" max="30" placeholder="Ej. 0.9" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bun">BUN (mg/dL)</Label>
              <Input id="bun" type="number" step="0.1" min="0" max="300" placeholder="Ej. 15" value={bun} onChange={(e) => setBun(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">EGO — Examen General de Orina</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="egoProteins">Proteínas en orina</Label>
              <Input id="egoProteins" type="text" maxLength={40} placeholder="Ej. Negativo, +, ++" value={egoProteins} onChange={(e) => setEgoProteins(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="egoGlucose">Glucosa en orina</Label>
              <Input id="egoGlucose" type="text" maxLength={40} placeholder="Ej. Negativo, +, ++" value={egoGlucose} onChange={(e) => setEgoGlucose(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notas">
            Notas <span className="text-muted-foreground font-normal">— opcional</span>
          </Label>
          <Input id="notas" type="text" maxLength={280} placeholder="Ej. Laboratorio Chopo, en ayunas" value={notas} onChange={(e) => setNotas(e.target.value)} />
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-12 text-lg">
          {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
          {isPending ? "Guardando..." : "Guardar resultados"}
        </Button>
      </form>
    </div>
  );
}
