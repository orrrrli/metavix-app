"use client";

import { useAuthStore } from "@/features/auth/store";
import { Aprender } from "../tabs/Aprender";
import { CalcularDosisControl } from "../../tabs/calcular-dosis/components/CalcularDosisControl";
import { MisDatosControl } from "../../tabs/mis-datos/components/MisDatosControl";
import { RegistroDiarioControl } from "../../tabs/registro-diario/components/RegistroDiarioControl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export function InsulinaDM1() {
  const { patientId } = useAuthStore();

  if (!patientId) return null;

  return (
    <Tabs defaultValue="aprender" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
        <TabsTrigger value="aprender">Aprender</TabsTrigger>
        <TabsTrigger value="calcular">Calcular Dosis</TabsTrigger>
        <TabsTrigger value="perfil">Mis Datos</TabsTrigger>
        <TabsTrigger value="registros">Registro Diario</TabsTrigger>
      </TabsList>

      <TabsContent value="aprender">
        <Aprender />
      </TabsContent>

      <TabsContent value="calcular">
        <CalcularDosisControl patientId={patientId} />
      </TabsContent>

      <TabsContent value="perfil">
        <MisDatosControl patientId={patientId} />
      </TabsContent>

      <TabsContent value="registros">
        <RegistroDiarioControl patientId={patientId} />
      </TabsContent>
    </Tabs>
  );
}
