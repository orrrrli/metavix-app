'use client';

import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Pencil, Check, Phone, Ruler, Baby, Mail, Calendar, Activity, Hash, Venus, Mars } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, MetavixButton, MetavixInput, MetavixLabel, MetavixBadge } from '@/shared/components/ui/metavix';
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

function ProfileRow({ icon, label, value, last }: { icon: ReactNode; label: string; value: ReactNode; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={last ? undefined : { borderBottom: '1px solid var(--bd)' }}
    >
      <dt className="flex items-center gap-2 text-sm" style={{ color: 'var(--mut)' }}>
        {icon}
        {label}
      </dt>
      <dd className="text-sm font-medium text-right" style={{ color: 'var(--text)' }}>{value}</dd>
    </div>
  );
}

function Muted({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--mut)' }} className="italic">{children}</span>;
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
        <CardContent>
          <p className="text-sm text-center" style={{ color: 'var(--mut)' }}>Cargando perfil...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent>
          <p className="text-sm text-center" style={{ color: 'var(--bad)' }}>No se pudo cargar el perfil.</p>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || '—';
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';

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
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center size-16 rounded-full font-bold text-xl shrink-0"
              style={{ background: 'var(--nav-active-bg)', color: 'var(--nav-active)' }}
            >
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{fullName}</h3>
              <p className="text-sm flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--mut)' }}>
                <Hash className="size-3.5" />
                {profile.medicalRecordNumber}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--mut)' }}>Paciente desde {memberSince}</p>
            </div>
            <MetavixBadge variant="neutral" className="ml-auto">
              {DIABETES_LABELS[profile.diabetesType] ?? profile.diabetesType}
            </MetavixBadge>
          </div>
        </CardContent>
      </Card>

      {/* Read-only personal info */}
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-0">
            <ProfileRow
              icon={<Mail className="size-4" />}
              label="Correo electrónico"
              value={profile.email ?? <Muted>No registrado</Muted>}
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
                : <Muted>No especificado</Muted>
              }
            />
            <ProfileRow
              icon={<Activity className="size-4" />}
              label="Tipo de diabetes"
              value={DIABETES_LABELS[profile.diabetesType] ?? profile.diabetesType}
              last
            />
          </dl>
        </CardContent>
      </Card>

      {/* Editable fields */}
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Datos de salud</CardTitle>
            {!editing && (
              <MetavixButton variant="ghost" size="sm" onClick={handleEdit}>
                <Pencil className="size-4 mr-1" />
                Editar
              </MetavixButton>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <MetavixLabel htmlFor="heightCm">
                  <Ruler className="inline size-3.5 mr-1 mb-0.5" />
                  Estatura (cm)
                </MetavixLabel>
                <MetavixInput
                  id="heightCm"
                  type="number"
                  placeholder="Ej. 165"
                  {...register('heightCm')}
                />
                {errors.heightCm && (
                  <p className="text-xs" style={{ color: 'var(--bad)' }}>{errors.heightCm.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <MetavixLabel htmlFor="phone">
                  <Phone className="inline size-3.5 mr-1 mb-0.5" />
                  Teléfono
                </MetavixLabel>
                <MetavixInput
                  id="phone"
                  type="tel"
                  placeholder="Ej. +52 664 123 4567"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-xs" style={{ color: 'var(--bad)' }}>{errors.phone.message}</p>
                )}
              </div>

              <div
                className="flex items-center justify-between rounded-lg p-3"
                style={{ border: '1px solid var(--bd)' }}
              >
                <div className="flex items-center gap-2">
                  <Baby className="size-4" style={{ color: 'var(--mut)' }} />
                  <MetavixLabel htmlFor="isPregnant" className="cursor-pointer text-sm font-medium leading-none">
                    ¿Embarazada actualmente?
                  </MetavixLabel>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPregnantValue}
                  onClick={() => setValue('isPregnant', !isPregnantValue)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2"
                  style={{
                    background: isPregnantValue ? 'var(--accent)' : 'var(--ph)',
                  }}
                >
                  <span
                    className="pointer-events-none inline-block size-5 rounded-full shadow-lg ring-0 transition-transform"
                    style={{
                      background: 'var(--card)',
                      transform: isPregnantValue ? 'translateX(20px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-1">
                <MetavixButton type="button" variant="ghost" className="flex-1" onClick={handleCancel} disabled={isPending}>
                  Cancelar
                </MetavixButton>
                <MetavixButton type="submit" variant="primary" className="flex-1" disabled={isPending}>
                  <Check className="size-4 mr-1.5" />
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </MetavixButton>
              </div>
            </form>
          ) : (
            <dl className="space-y-0">
              <ProfileRow
                icon={<Ruler className="size-4" />}
                label="Estatura"
                value={profile.heightCm ? `${profile.heightCm} cm` : <Muted>No registrada</Muted>}
              />
              <ProfileRow
                icon={<Phone className="size-4" />}
                label="Teléfono"
                value={profile.phone ?? <Muted>No registrado</Muted>}
              />
              <ProfileRow
                icon={<Baby className="size-4" />}
                label="Embarazo activo"
                value={
                  <MetavixBadge variant={profile.isPregnant ? 'ok' : 'neutral'}>
                    {profile.isPregnant ? 'Sí' : 'No'}
                  </MetavixBadge>
                }
                last
              />
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
