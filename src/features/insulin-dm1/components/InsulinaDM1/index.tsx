"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { InsulinaProvider, useInsulina } from "../../context";
import { Aprender } from "../tabs/Aprender";
import { CalcularDosis } from "../tabs/CalcularDosis";
import { MisDatos } from "../tabs/MisDatos";
import { RegistroDiario } from "../tabs/RegistroDiario";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

function InsulinaApp() {
  const { refreshPerfil } = useInsulina();

  useEffect(() => {
    refreshPerfil();
  }, [refreshPerfil]);

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
        <CalcularDosis />
      </TabsContent>
      
      <TabsContent value="perfil">
        <MisDatos />
      </TabsContent>
      
      <TabsContent value="registros">
        <RegistroDiario />
      </TabsContent>
    </Tabs>
  );
}

export function InsulinaDM1() {
  const { token } = useAuthStore();
  
  if (!token) return null;

  return (
    <InsulinaProvider token={token}>
      <InsulinaApp />
    </InsulinaProvider>
  );
}
