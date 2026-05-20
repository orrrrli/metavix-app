"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface InsulinaPerfil {
  id?: string;
  nombre_insulina: string;
  ric: number;
  factor_sensibilidad: number;
  glucosa_meta: number;
  nombre_medico: string;
  telefono_medico: string;
}

interface InsulinaContextType {
  perfil: InsulinaPerfil | null;
  setPerfil: (perfil: InsulinaPerfil | null) => void;
  refreshPerfil: () => Promise<void>;
}

const InsulinaContext = createContext<InsulinaContextType | undefined>(undefined);

export function InsulinaProvider({ children, token }: { children: ReactNode; token: string | null }) {
  const [perfil, setPerfil] = useState<InsulinaPerfil | null>(null);

  const refreshPerfil = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/insulina-dm1/perfil", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPerfil(data);
      }
    } catch (e) {
      console.error("Error fetching perfil:", e);
    }
  };

  return (
    <InsulinaContext.Provider value={{ perfil, setPerfil, refreshPerfil }}>
      {children}
    </InsulinaContext.Provider>
  );
}

export function useInsulina() {
  const context = useContext(InsulinaContext);
  if (context === undefined) {
    throw new Error("useInsulina must be used within an InsulinaProvider");
  }
  return context;
}
