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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, MetavixButton, MetavixInput, MetavixBadge } from "@/shared/components/ui/metavix";
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
        <h2 className="text-3xl font-display font-bold" style={{ color: 'var(--text)' }}>Mis Médicos</h2>
        <p className="mt-1" style={{ color: 'var(--mut)' }}>
          Gestiona los médicos que tienen acceso a tu expediente clínico.
        </p>
      </div>

      {/* Linked doctors */}
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-2">
              <UserCheck className="size-5" style={{ color: 'var(--nav-active)' }} />
              Médicos vinculados
            </span>
          </CardTitle>
          <CardDescription>
            Estos médicos tienen acceso a tus registros de salud.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkedDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <Stethoscope className="size-12" style={{ color: 'var(--soft)' }} />
              <p className="text-sm" style={{ color: 'var(--mut)' }}>
                Aún no tienes médicos vinculados. Envía una solicitud a tu médico.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedDoctors.map((linked) => (
                <div
                  key={linked.requestId}
                  className="flex items-center justify-between p-4 rounded-xl gap-4"
                  style={{ border: '1px solid var(--card-bd)', background: 'var(--ph)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="size-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--nav-active-bg)' }}
                    >
                      <Stethoscope className="size-5" style={{ color: 'var(--nav-active)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>
                        Dr. {linked.doctorFirstName} {linked.doctorPaternalLastName}
                      </p>
                      <p className="text-sm truncate" style={{ color: 'var(--mut)' }}>{linked.speciality}</p>
                      <p className="text-xs" style={{ color: 'var(--mut)' }}>{linked.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <MetavixBadge variant="ok" className="text-xs">Vinculado</MetavixBadge>
                      <p className="text-xs mt-1" style={{ color: 'var(--mut)' }}>
                        desde {format(parseISO(linked.linkedAt), "MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <MetavixButton
                      variant="ghost"
                      size="sm"
                      disabled={revoking}
                      onClick={() => handleRevoke(linked)}
                      style={{ color: 'var(--bad)' }}
                    >
                      <Link2Off className="size-4 mr-1" />
                      Desvincular
                    </MetavixButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor search + link request */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Send className="size-5" />
                  Agregar médico
                </span>
              </CardTitle>
              <CardDescription>
                Busca a tu médico y envíale una solicitud de vinculación.
              </CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 size-4" style={{ color: 'var(--mut)' }} />
                <MetavixInput
                  placeholder="Buscar por nombre o especialidad..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAvailable.length === 0 ? (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--mut)' }}>
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
                  className="flex items-center justify-between p-4 rounded-xl gap-4"
                  style={{ border: '1px solid var(--card-bd)', background: 'var(--card)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="size-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'var(--ph)' }}
                    >
                      <Stethoscope className="size-5" style={{ color: 'var(--mut)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>
                        Dr. {doctor.firstName} {doctor.paternalLastName}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--mut)' }}>{doctor.speciality}</p>
                      <p className="text-xs" style={{ color: 'var(--mut)' }}>{doctor.email}</p>
                    </div>
                  </div>
                  <MetavixButton
                    size="sm"
                    variant="secondary"
                    disabled={sending}
                    onClick={() => handleSendRequest(doctor)}
                  >
                    <UserMinus className="size-4 mr-1" />
                    Solicitar
                  </MetavixButton>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending requests (local state) */}
      {pendingDoctorIds.size > 0 && (
        <Card style={{ border: '1px solid var(--nav-active)', background: 'var(--nav-active-bg)' }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 14, color: 'var(--nav-active)' }}>
              Solicitudes enviadas esta sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allDoctors
                .filter((d) => pendingDoctorIds.has(d.id))
                .map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-sm" style={{ color: 'var(--mut)' }}>
                    <MetavixBadge variant="warn" className="text-xs">Pendiente</MetavixBadge>
                    <span>Dr. {d.firstName} {d.paternalLastName} — {d.speciality}</span>
                  </div>
                ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--mut)' }}>
              El médico debe aceptar la solicitud para que tenga acceso a tu expediente.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
