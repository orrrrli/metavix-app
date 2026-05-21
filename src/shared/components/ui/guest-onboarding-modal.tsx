"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useAuthStore } from "@/features/auth/store";
import { useGuestStore } from "@/features/guest/store";
import { DiabetesType } from "@/features/patient/types";

interface GuestOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DIABETES_OPTIONS: { value: DiabetesType; label: string }[] = [
  { value: "Tipo 1", label: "Diabetes Tipo 1" },
  { value: "Tipo 2", label: "Diabetes Tipo 2" },
  { value: "Prediabetes", label: "Prediabetes" },
  { value: "Ninguna", label: "Sin diagnóstico / No sé" },
];

export function GuestOnboardingModal({ open, onOpenChange }: GuestOnboardingModalProps) {
  const router = useRouter();
  const { loginAsGuest } = useAuthStore();
  const { setProfile } = useGuestStore();

  const [firstName, setFirstName] = useState("");
  const [diabetesType, setDiabetesType] = useState<DiabetesType>("Ninguna");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!firstName.trim()) {
      setError("Por favor ingresa tu nombre.");
      return;
    }

    const guestId = `guest-${crypto.randomUUID()}`;

    setProfile({
      id: guestId,
      firstName: firstName.trim(),
      lastName: "",
      dateOfBirth: "",
      gender: "O",
      diabetesType,
      heightCm: 0,
      weightKg: 0,
      pregnancyStatus: false,
      assignedDoctorId: "",
    });

    loginAsGuest(guestId);
    onOpenChange(false);
    router.push("/paciente/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Ingresar como invitado</DialogTitle>
          <DialogDescription>
            Tus datos se guardarán solo en este dispositivo. No se crea ninguna cuenta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="guest-name">¿Cómo te llamas?</Label>
            <Input
              id="guest-name"
              placeholder="Tu nombre"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-diabetes">Condición</Label>
            <Select value={diabetesType} onValueChange={(v) => setDiabetesType(v as DiabetesType)}>
              <SelectTrigger id="guest-diabetes">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIABETES_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Entrar al panel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
