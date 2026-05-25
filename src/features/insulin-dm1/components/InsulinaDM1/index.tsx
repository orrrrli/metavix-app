"use client";

import { useAuthStore } from "@/features/auth/store";
import { Aprender } from "../tabs/Aprender";
import { CalcularDosis } from "../tabs/CalcularDosis";
import { MisDatos } from "../tabs/MisDatos";
import { RegistroDiario } from "../tabs/RegistroDiario";
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
        <CalcularDosis patientId={patientId} />
      </TabsContent>

      <TabsContent value="perfil">
        <MisDatos patientId={patientId} />
      </TabsContent>

      <TabsContent value="registros">
        <RegistroDiario patientId={patientId} />
      </TabsContent>
    </Tabs>
  );
}
