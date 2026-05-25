'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Pencil, Check, Phone, Ruler, Baby, Mail, Calendar, User, Activity, Hash, Venus, Mars } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { usePatientProfile, useUpdatePatientProfile } from '@/features/patient/hooks/use-patient-profile';
import { useAuthStore } from '@/features/auth/store';

const DIABETES_LABELS: Record<string, string> = {
  None: 'Sin diabetes',
  Type1: 'Diabetes tipo 1',
  Type2: 'Diabetes tipo 2',
  Prediabetes: 'Prediabetes',
};

const profileSchema = z.object({
  heightCm: z.string().optional(),
  phone: z.string().max(20).optional(),
  isPregnant: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}

export function PatientProfileCard() {
  const { patientId } = useAuthStore();
  const [editing, setEditing] = useState(false);

  const { data: profile, isLoading, isError } = usePatientProfile(patientId ?? '');
  const { mutate: updateProfile, isPending } = useUpdatePatientProfile(patientId ?? '');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const isPregnantValue = watch('isPregnant');

  const handleEdit = (): void => {
    reset({
      heightCm: profile?.heightCm?.toString() ?? '',
      phone: profile?.phone ?? '',
      isPregnant: profile?.isPregnant ?? false,
    });
    setEditing(true);
  };

  const handleCancel = (): void => {
    setEditing(false);
    reset();
  };

  const onSubmit = (data: ProfileFormData): void => {
    const payload = {
      ...(data.heightCm !== '' && data.heightCm !== undefined && { heightCm: Number(data.heightCm) }),
      ...(data.phone !== '' && data.phone !== undefined && { phone: data.phone }),
      isPregnant: data.isPregnant,
    };

    updateProfile(payload, {
      onSuccess: () => {
        toast.success('Perfil actualizado correctamente.');
        setEditing(false);
      },
      onError: () => {
        toast.error('No se pudo actualizar el perfil. Intenta de nuevo.');
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">Cargando perfil...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive text-center">No se pudo cargar el perfil.</p>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = [profile.firstName[0], profile.lastName[0]].join('').toUpperCase();

  const parseSafe = (value: string): Date | null => {
    const d = parseISO(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const dobDate = parseSafe(profile.dateOfBirth);
  const createdDate = parseSafe(profile.createdAt);
  const formattedDob = dobDate ? format(dobDate, "d 'de' MMMM, yyyy", { locale: es }) : '—';
  const memberSince = createdDate ? format(createdDate, "MMMM yyyy", { locale: es }) : '—';

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary font-bold text-xl shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{fullName}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Hash className="size-3.5" />
                {profile.medicalRecordNumber}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Paciente desde {memberSince}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {DIABETES_LABELS[profile.diabetesType] ?? profile.diabetesType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Read-only personal info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información personal</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-0">
            <ProfileRow
              icon={<Mail className="size-4" />}
              label="Correo electrónico"
              value={profile.email ?? <span className="text-muted-foreground italic">No registrado</span>}
            />
            <ProfileRow
              icon={<Calendar className="size-4" />}
              label="Fecha de nacimiento"
              value={formattedDob}
            />
            <ProfileRow
              icon={profile.gender === 'Female' ? <Venus className="size-4" /> : <Mars className="size-4" />}
              label="Género"
              value={
                profile.gender === 'Female' ? 'Femenino'
                : profile.gender === 'Male' ? 'Masculino'
                : <span className="text-muted-foreground italic">No especificado</span>
              }
            />
            <ProfileRow
              icon={<Activity className="size-4" />}
              label="Tipo de diabetes"
              value={DIABETES_LABELS[profile.diabetesType] ?? profile.diabetesType}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Editable fields */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Datos de salud</CardTitle>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Pencil className="size-4 mr-1" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="heightCm">
                  <Ruler className="inline size-3.5 mr-1 mb-0.5" />
                  Estatura (cm)
                </Label>
                <Input
                  id="heightCm"
                  type="number"
                  placeholder="Ej. 165"
                  {...register('heightCm')}
                />
                {errors.heightCm && (
                  <p className="text-xs text-destructive">{errors.heightCm.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  <Phone className="inline size-3.5 mr-1 mb-0.5" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej. +52 664 123 4567"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Baby className="size-4 text-muted-foreground" />
                  <Label htmlFor="isPregnant" className="cursor-pointer text-sm font-medium leading-none">
                    ¿Embarazada actualmente?
                  </Label>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPregnantValue}
                  onClick={() => setValue('isPregnant', !isPregnantValue)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isPregnantValue ? 'bg-primary' : 'bg-input'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                      isPregnantValue ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="ghost" className="flex-1" onClick={handleCancel} disabled={isPending}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                  <Check className="size-4 mr-1.5" />
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-0">
              <ProfileRow
                icon={<Ruler className="size-4" />}
                label="Estatura"
                value={profile.heightCm ? `${profile.heightCm} cm` : <span className="text-muted-foreground italic">No registrada</span>}
              />
              <ProfileRow
                icon={<Phone className="size-4" />}
                label="Teléfono"
                value={profile.phone ?? <span className="text-muted-foreground italic">No registrado</span>}
              />
              <ProfileRow
                icon={<Baby className="size-4" />}
                label="Embarazo activo"
                value={
                  <Badge variant={profile.isPregnant ? 'default' : 'secondary'}>
                    {profile.isPregnant ? 'Sí' : 'No'}
                  </Badge>
                }
              />
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
