'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Pencil, Check, Mail, Stethoscope, BadgeCheck, BadgeAlert, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { useMyDoctorProfile, useUpdateDoctorProfile } from '@/features/doctor/hooks/use-doctor';

const profileSchema = z.object({
  licenseNumber: z.string().min(1, 'La cédula profesional es requerida'),
  speciality: z.string().optional(),
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

export function DoctorProfileCard() {
  const [editing, setEditing] = useState(false);

  const { data: profile, isLoading, isError } = useMyDoctorProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateDoctorProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const handleEdit = (): void => {
    reset({
      licenseNumber: profile?.licenseNumber ?? '',
      speciality: profile?.speciality ?? '',
    });
    setEditing(true);
  };

  const handleCancel = (): void => {
    setEditing(false);
    reset();
  };

  const onSubmit = async (data: ProfileFormData): Promise<void> => {
    try {
      await updateProfile(data);
      toast.success('Perfil actualizado correctamente.');
      setEditing(false);
    } catch {
      toast.error('No se pudo actualizar el perfil. Intenta de nuevo.');
    }
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

  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || '—';
  const initials = [profile.firstName?.[0], profile.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';

  const parseSafe = (value: string): Date | null => {
    const d = parseISO(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const createdDate = parseSafe(profile.createdAt);
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
              <p className="text-sm text-muted-foreground mt-0.5">{profile.speciality}</p>
              <p className="text-xs text-muted-foreground mt-1">Médico desde {memberSince}</p>
            </div>
            <Badge
              variant={profile.isVerified ? 'default' : 'secondary'}
              className="ml-auto flex items-center gap-1"
            >
              {profile.isVerified
                ? <><BadgeCheck className="size-3.5" /> Verificado</>
                : <><BadgeAlert className="size-3.5" /> Pendiente SEP</>
              }
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Read-only info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información de cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-0">
            <ProfileRow
              icon={<Mail className="size-4" />}
              label="Correo electrónico"
              value={profile.email}
            />
            <ProfileRow
              icon={<Hash className="size-4" />}
              label="ID de médico"
              value={<span className="font-mono text-xs">{profile.id}</span>}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Editable professional info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Información profesional</CardTitle>
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
                <Label htmlFor="licenseNumber">
                  <Hash className="inline size-3.5 mr-1 mb-0.5" />
                  Cédula profesional
                </Label>
                <Input
                  id="licenseNumber"
                  placeholder="Ej. 12345678"
                  {...register('licenseNumber')}
                />
                {errors.licenseNumber && (
                  <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="speciality">
                  <Stethoscope className="inline size-3.5 mr-1 mb-0.5" />
                  Especialidad
                </Label>
                <Input
                  id="speciality"
                  placeholder="Ej. Endocrinología"
                  {...register('speciality')}
                />
                {errors.speciality && (
                  <p className="text-xs text-destructive">{errors.speciality.message}</p>
                )}
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
                icon={<Hash className="size-4" />}
                label="Cédula profesional"
                value={profile.licenseNumber || <span className="text-muted-foreground italic">No registrada</span>}
              />
              <ProfileRow
                icon={<Stethoscope className="size-4" />}
                label="Especialidad"
                value={profile.speciality || <span className="text-muted-foreground italic">No registrada</span>}
              />
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
