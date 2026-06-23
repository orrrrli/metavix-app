"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Stethoscope, Search, UserCheck, UserMinus, Send, Link2Off } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store";
import {
  useAllDoctors,
  useLinkedDoctors,
  useSendLinkRequest,
  useRevokeLinkRequest,
} from "@/features/patient/hooks/use-link-requests";
import { DoctorOption, LinkedDoctorResponse } from "@/types/link-request";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";

export default function DoctoresPage(): React.ReactElement {
  const { patientId } = useAuthStore();
  const [search, setSearch] = useState("");
  const [pendingDoctorIds, setPendingDoctorIds] = useState<Set<string>>(new Set());

  const { data: linkedDoctors = [], isLoading: loadingLinked } = useLinkedDoctors(patientId ?? "");
  const { data: allDoctors = [], isLoading: loadingAll } = useAllDoctors();

  const { mutate: sendRequest, isPending: sending } = useSendLinkRequest(patientId ?? "");
  const { mutate: revokeLink, isPending: revoking } = useRevokeLinkRequest(patientId ?? "");

  const linkedDoctorIds = new Set(linkedDoctors.map((d) => d.doctorId));

  const availableDoctors: DoctorOption[] = allDoctors.filter(
    (d) => !linkedDoctorIds.has(d.id) && !pendingDoctorIds.has(d.id)
  );

  const filteredAvailable: DoctorOption[] = search
    ? availableDoctors.filter(
        (d) =>
          `${d.firstName} ${d.paternalLastName}`.toLowerCase().includes(search.toLowerCase()) ||
          d.speciality.toLowerCase().includes(search.toLowerCase())
      )
    : availableDoctors;

  function handleSendRequest(doctor: DoctorOption): void {
    if (!patientId) return;
    sendRequest(
      { patientId, doctorId: doctor.id },
      {
        onSuccess: () => {
          setPendingDoctorIds((prev) => new Set(prev).add(doctor.id));
          toast.success(`Solicitud enviada al Dr. ${doctor.paternalLastName}`);
        },
        onError: (err) => {
          const msg = err.message.includes("409")
            ? "Ya existe una solicitud pendiente con este médico."
            : "No se pudo enviar la solicitud. Intenta de nuevo.";
          toast.error(msg);
        },
      }
    );
  }

  function handleRevoke(linked: LinkedDoctorResponse): void {
    revokeLink(linked.requestId, {
      onSuccess: () => toast.success(`Vinculación con Dr. ${linked.doctorPaternalLastName} eliminada`),
      onError: () => toast.error("No se pudo eliminar la vinculación"),
    });
  }

  if (loadingLinked || loadingAll) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Mis Médicos</h2>
        <p className="text-muted-foreground mt-1">
          Gestiona los médicos que tienen acceso a tu expediente clínico.
        </p>
      </div>

      {/* Linked doctors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="size-5 text-primary" />
            Médicos vinculados
          </CardTitle>
          <CardDescription>
            Estos médicos tienen acceso a tus registros de salud.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkedDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <Stethoscope className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">
                Aún no tienes médicos vinculados. Envía una solicitud a tu médico.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedDoctors.map((linked) => (
                <div
                  key={linked.requestId}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Stethoscope className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        Dr. {linked.doctorFirstName} {linked.doctorPaternalLastName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{linked.speciality}</p>
                      <p className="text-xs text-muted-foreground">{linked.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        Vinculado
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        desde {format(parseISO(linked.linkedAt), "MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={revoking}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRevoke(linked)}
                    >
                      <Link2Off className="size-4 mr-1" />
                      Desvincular
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor search + link request */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Send className="size-5" />
              Agregar médico
            </CardTitle>
            <CardDescription>
              Busca a tu médico y envíale una solicitud de vinculación.
            </CardDescription>
          </div>
          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o especialidad..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAvailable.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              {allDoctors.length === 0
                ? "No hay médicos registrados en el sistema."
                : linkedDoctors.length === allDoctors.length
                ? "Ya estás vinculado con todos los médicos disponibles."
                : "No se encontraron médicos con ese criterio."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAvailable.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Stethoscope className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        Dr. {doctor.firstName} {doctor.paternalLastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
                      <p className="text-xs text-muted-foreground">{doctor.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={sending}
                    onClick={() => handleSendRequest(doctor)}
                  >
                    <UserMinus className="size-4 mr-1" />
                    Solicitar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending requests (local state) */}
      {pendingDoctorIds.size > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-primary">Solicitudes enviadas esta sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allDoctors
                .filter((d) => pendingDoctorIds.has(d.id))
                .map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">Pendiente</Badge>
                    <span>Dr. {d.firstName} {d.paternalLastName} — {d.speciality}</span>
                  </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              El médico debe aceptar la solicitud para que tenga acceso a tu expediente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
