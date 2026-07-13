"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";


import { Search, Users, Bell, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth/store";
import {
  useLinkedPatients,
  usePendingLinkRequests,
  useAcceptLinkRequest,
  useRejectLinkRequest,
  useMyDoctorProfile,
  useMrnSuggestion,
} from "@/features/doctor/hooks/use-doctor";
import { LinkedPatientResponse } from "@/types/doctor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { GooeyLoader } from "@/shared/components/ui/gooey-loader";
import { AcceptLinkRequestDialog } from "@/features/doctor/components/AcceptLinkRequestDialog";

export default function DoctorDashboard(): React.ReactElement {
  const { doctorId, _hasHydrated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // State for the MRN-assignment dialog. `null` = dialog closed.
  const [pendingAccept, setPendingAccept] = useState<{
    requestId: string;
    patientName: string;
  } | null>(null);

  const { data: myProfile } = useMyDoctorProfile();
  const { data: patients = [], isLoading: loadingPatients } = useLinkedPatients(doctorId ?? "");
  const { data: pendingRequests = [], isLoading: loadingRequests } = usePendingLinkRequests(doctorId ?? "");

  const { mutate: accept, isPending: accepting } = useAcceptLinkRequest(doctorId ?? "");
  const { mutate: reject, isPending: rejecting } = useRejectLinkRequest(doctorId ?? "");

  // Only ask the backend for an MRN suggestion while the dialog is open.
  // The hook is enabled lazily so we don't fire the request on page load.
  const { data: suggestedMrn = "", refetch: refetchMrnSuggestion } = useMrnSuggestion(
    pendingAccept ? new Date().getFullYear() : undefined,
  );

  // Wait for Zustand store rehydration before firing doctor-scoped queries.
  if (!_hasHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  const showVerificationBanner =
    !bannerDismissed &&
    myProfile !== undefined &&
    !myProfile.isVerified &&
    myProfile.licenseNumber !== "";

  const filteredPatients: LinkedPatientResponse[] = search
    ? patients.filter(p =>
        `${p.name} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        (p.medicalRecordNumber ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : patients;

  function openAcceptDialog(requestId: string, patientName: string): void {
    setPendingAccept({ requestId, patientName });
  }

  function handleConfirmAccept(mrn: string): void {
    if (!pendingAccept) return;
    const { requestId, patientName } = pendingAccept;
    accept(
      { requestId, medicalRecordNumber: mrn },
      {
        onSuccess: () => {
          toast.success(`Solicitud de ${patientName} aceptada`);
          setPendingAccept(null);
        },
        onError: () => {
          toast.error("No se pudo aceptar la solicitud. Verifica el MRN e inténtalo de nuevo.");
        },
      }
    );
  }

  function handleReject(requestId: string, patientName: string): void {
    reject(requestId, {
      onSuccess: () => toast.success(`Solicitud de ${patientName} rechazada`),
      onError: () => toast.error("No se pudo rechazar la solicitud"),
    });
  }

  if (loadingPatients || loadingRequests) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <GooeyLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showVerificationBanner && (
        <div
          className="flex items-start gap-3 rounded-lg border p-4 text-sm"
          style={{ backgroundColor: 'var(--warn-bg)', borderColor: 'var(--warn)', color: 'var(--warn)' }}
        >
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium" style={{ color: 'var(--text)' }}>Verificación SEP pendiente</p>
            <p className="mt-0.5" style={{ color: 'var(--text)' }}>
              Tu cédula profesional está registrada y puedes atender pacientes. La verificación con el registro SEP puede tardar unos días hábiles.
            </p>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Cerrar aviso"
            className="shrink-0 rounded p-0.5 hover:opacity-70"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">Panel Clínico</h2>
          <p className="text-muted-foreground mt-1">Supervise a sus pacientes vinculados e identifique solicitudes pendientes.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Vinculados</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card className={pendingRequests.length > 0 ? "border-primary/50 bg-primary/5" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
            <Bell className={`size-4 ${pendingRequests.length > 0 ? "text-primary" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pendingRequests.length > 0 ? "text-primary" : ""}`}>
              {pendingRequests.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Solicitudes de Vinculación
            </CardTitle>
            <CardDescription>Pacientes que solicitan vincularse a su panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.requestId}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <div>
                    <p className="font-medium text-foreground">{req.patientFirstName} {req.patientLastName}</p>
                    <p className="text-sm text-muted-foreground">{req.patientEmail}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      disabled={rejecting}
                      onClick={() => handleReject(req.requestId, `${req.patientFirstName} ${req.patientLastName}`)}
                    >
                      <XCircle className="size-4 mr-1" />
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      disabled={accepting}
                      onClick={() => openAcceptDialog(req.requestId, `${req.patientFirstName} ${req.patientLastName}`)}
                    >
                      <CheckCircle className="size-4 mr-1" />
                      Aceptar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient List */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Registro de Pacientes</CardTitle>
            <CardDescription>Seleccione un paciente para ver sus datos clínicos.</CardDescription>
          </div>
          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nombre o expediente..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-center text-muted-foreground">
              {patients.length === 0
                ? "No tiene pacientes vinculados aún."
                : "No se encontraron pacientes."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const mrn = patient.medicalRecordNumber?.trim();
                const profileHref = mrn ? `/doctor/patients/${mrn}` : "#";
                return (
                  <div
                    key={patient.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-border bg-card"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <p className="font-semibold text-base text-foreground truncate">
                        {patient.name} {patient.lastName}
                      </p>
                      <Badge variant="secondary" className="font-mono">{patient.medicalRecordNumber || "—"}</Badge>
                    </div>
                    <Link
                      href={profileHref}
                      onClick={(e) => {
                        if (profileHref === "#") e.preventDefault();
                      }}
                      className="shrink-0"
                    >
                      <Button variant="outline" size="sm" disabled={profileHref === "#"} className="w-full sm:w-auto">
                        Ver Perfil
                        <ChevronRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AcceptLinkRequestDialog
        open={pendingAccept !== null}
        patientName={pendingAccept?.patientName ?? ""}
        suggestedMrn={suggestedMrn}
        isSubmitting={accepting}
        onConfirm={handleConfirmAccept}
        onClose={() => setPendingAccept(null)}
        onRegenerateMrn={() => refetchMrnSuggestion()}
      />
    </div>
  );
}
