"use client";

import {
  Pencil,
  Check,
  Mail,
  Stethoscope,
  BadgeCheck,
  BadgeAlert,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { ProfileRow, Muted } from "@/shared/components/ProfileRow";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { doctorPerfilStrings as S } from "../strings/es";
import type {
  DoctorProfileViewData,
  DoctorProfileFormData,
} from "../view-data/build-doctor-profile-view-data";

const NotRegistered = () => <Muted>{S.notRegistered}</Muted>;

export interface DoctorProfileScreenProps {
  viewData: DoctorProfileViewData;
  editing: boolean;
  isPending: boolean;
  form: {
    register: UseFormRegister<DoctorProfileFormData>;
    errors: FieldErrors<DoctorProfileFormData>;
  };
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

/** UI pura del perfil del doctor. Sin queries ni derivaciones. */
export function DoctorProfileScreen({
  viewData: vd,
  editing,
  isPending,
  form: { register, errors },
  onEdit,
  onCancel,
  onSubmit,
}: DoctorProfileScreenProps) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Profile header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary font-bold text-xl shrink-0">
              {vd.initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{vd.fullName}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{vd.speciality}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {S.memberSincePrefix} {vd.memberSince}
              </p>
            </div>
            <Badge
              variant={vd.isVerified ? "default" : "secondary"}
              className="ml-auto flex items-center gap-1"
            >
              {vd.isVerified ? (
                <>
                  <BadgeCheck className="size-3.5" /> {S.verified}
                </>
              ) : (
                <>
                  <BadgeAlert className="size-3.5" /> {S.pendingSep}
                </>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Read-only info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{S.accountInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-0">
            <ProfileRow icon={<Mail className="size-4" />} label={S.email} value={vd.email} />
            <ProfileRow
              icon={<Hash className="size-4" />}
              label={S.doctorId}
              value={<span className="font-mono text-xs">{vd.id}</span>}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Editable professional info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">{S.professionalInfo}</CardTitle>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="size-4 mr-1" />
              {S.edit}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label htmlFor="licenseNumber">
                  <Hash className="inline size-3.5 mr-1 mb-0.5" />
                  {S.license}
                </Label>
                <Input
                  id="licenseNumber"
                  placeholder={S.licensePlaceholder}
                  {...register("licenseNumber")}
                />
                {errors.licenseNumber && (
                  <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="speciality">
                  <Stethoscope className="inline size-3.5 mr-1 mb-0.5" />
                  {S.speciality}
                </Label>
                <Input
                  id="speciality"
                  placeholder={S.specialityPlaceholder}
                  {...register("speciality")}
                />
                {errors.speciality && (
                  <p className="text-xs text-destructive">{errors.speciality.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isPending}
                >
                  {S.cancel}
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                  <Check className="size-4 mr-1.5" />
                  {isPending ? S.saving : S.save}
                </Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-0">
              <ProfileRow
                icon={<Hash className="size-4" />}
                label={S.license}
                value={vd.licenseNumber ?? <NotRegistered />}
              />
              <ProfileRow
                icon={<Stethoscope className="size-4" />}
                label={S.speciality}
                value={vd.specialityValue ?? <NotRegistered />}
              />
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
