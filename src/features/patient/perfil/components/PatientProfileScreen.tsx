"use client";

import { type ReactNode } from "react";
import {
  Pencil,
  Check,
  Phone,
  Ruler,
  Baby,
  Mail,
  Calendar,
  Activity,
  Hash,
  Venus,
  Mars,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  MetavixButton,
  MetavixInput,
  MetavixLabel,
  MetavixBadge,
} from "@/shared/components/ui/metavix";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProfileViewData } from "../view-data/build-profile-view-data";
import type {
  ProfileFormData,
} from "../view-data/profile-form-schema";
import type { DateOrPlaceholder } from "../view-data/format-date-or-placeholder";
import { perfilStrings as S } from "../strings/es";
import { ProfileRow, Muted } from "@/shared/components/ProfileRow";

/** Renderiza una fecha-o-placeholder respetando el estilo atenuado. */
function DateValue({ value }: { value: DateOrPlaceholder }) {
  return value.type === "date" ? <>{value.value}</> : <Muted>{value.value}</Muted>;
}

export interface PatientProfileScreenProps {
  viewData: ProfileViewData;
  editing: boolean;
  isPregnantValue: boolean;
  isPending: boolean;
  form: {
    register: UseFormRegister<ProfileFormData>;
    setValue: (name: "isPregnant", value: boolean) => void;
    errors: FieldErrors<ProfileFormData>;
  };
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  /** Banner de embarazo, compuesto en el Control (side-effects con toast). */
  banner?: ReactNode;
}

/**
 * UI pura del perfil del paciente. Recibe un `ProfileViewData` ya resuelto +
 * el estado del form — sin queries, sin derivaciones. La lógica vive en
 * `view-data/` y `hooks/use-patient-profile-form.ts`.
 */
export function PatientProfileScreen({
  viewData: vd,
  editing,
  isPregnantValue,
  isPending,
  form: { register, setValue, errors },
  onEdit,
  onCancel,
  onSubmit,
  banner,
}: PatientProfileScreenProps) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {banner}

      {/* Profile header */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center size-16 rounded-full font-bold text-xl shrink-0"
              style={{ background: "var(--nav-active-bg)", color: "var(--nav-active)" }}
            >
              {vd.initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                {vd.fullName}
              </h3>
              <p
                className="text-sm flex items-center gap-1.5 mt-0.5"
                style={{ color: "var(--mut)" }}
              >
                <Hash className="size-3.5" />
                {vd.medicalRecordNumber}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--mut)" }}>
                {S.memberSincePrefix} {vd.memberSince}
              </p>
            </div>
            <MetavixBadge variant="neutral" className="ml-auto">
              {vd.diabetesLabel}
            </MetavixBadge>
          </div>
        </CardContent>
      </Card>

      {/* Read-only personal info */}
      <Card>
        <CardHeader>
          <CardTitle>{S.personalInfo}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-0">
            <ProfileRow
              icon={<Mail className="size-4" />}
              label={S.email}
              value={vd.email ?? <Muted>{S.emailEmpty}</Muted>}
            />
            <ProfileRow
              icon={<Calendar className="size-4" />}
              label={S.dob}
              value={vd.formattedDob}
            />
            <ProfileRow
              icon={
                vd.gender.label === "Femenino" ? (
                  <Venus className="size-4" />
                ) : (
                  <Mars className="size-4" />
                )
              }
              label={S.gender}
              value={vd.gender.known ? vd.gender.label : <Muted>{vd.gender.label}</Muted>}
            />
            <ProfileRow
              icon={<Activity className="size-4" />}
              label={S.diabetesType}
              value={vd.diabetesLabel}
              last
            />
          </dl>
        </CardContent>
      </Card>

      {/* Editable fields */}
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>{S.healthData}</CardTitle>
            {!editing && (
              <MetavixButton variant="ghost" size="sm" onClick={onEdit}>
                <Pencil className="size-4 mr-1" />
                {S.edit}
              </MetavixButton>
            )}
          </div>
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
                <MetavixLabel htmlFor="heightCm">
                  <Ruler className="inline size-3.5 mr-1 mb-0.5" />
                  {S.heightField}
                </MetavixLabel>
                <MetavixInput
                  id="heightCm"
                  type="number"
                  placeholder={S.heightPlaceholder}
                  {...register("heightCm")}
                />
                {errors.heightCm && (
                  <p className="text-xs" style={{ color: "var(--bad)" }}>
                    {errors.heightCm.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <MetavixLabel htmlFor="phone">
                  <Phone className="inline size-3.5 mr-1 mb-0.5" />
                  {S.phone}
                </MetavixLabel>
                <MetavixInput
                  id="phone"
                  type="tel"
                  placeholder={S.phonePlaceholder}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs" style={{ color: "var(--bad)" }}>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div
                className="flex items-center justify-between rounded-lg p-3"
                style={{ border: "1px solid var(--bd)" }}
              >
                <div className="flex items-center gap-2">
                  <Baby className="size-4" style={{ color: "var(--mut)" }} />
                  <MetavixLabel
                    htmlFor="isPregnant"
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    {S.pregnantQuestion}
                  </MetavixLabel>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPregnantValue}
                  onClick={() => setValue("isPregnant", !isPregnantValue)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2"
                  style={{ background: isPregnantValue ? "var(--accent)" : "var(--ph)" }}
                >
                  <span
                    className="pointer-events-none inline-block size-5 rounded-full shadow-lg ring-0 transition-transform"
                    style={{
                      background: "var(--card)",
                      transform: isPregnantValue ? "translateX(20px)" : "translateX(0)",
                    }}
                  />
                </button>
              </div>

              {isPregnantValue && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <MetavixLabel htmlFor="pregnancyStartDate">
                      <Calendar className="inline size-3.5 mr-1 mb-0.5" />
                      {S.pregnancyStart}
                    </MetavixLabel>
                    <MetavixInput
                      id="pregnancyStartDate"
                      type="date"
                      {...register("pregnancyStartDate")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <MetavixLabel htmlFor="pregnancyDueDate">
                      <Calendar className="inline size-3.5 mr-1 mb-0.5" />
                      {S.pregnancyDue}
                    </MetavixLabel>
                    <MetavixInput
                      id="pregnancyDueDate"
                      type="date"
                      {...register("pregnancyDueDate")}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <MetavixButton
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isPending}
                >
                  {S.cancel}
                </MetavixButton>
                <MetavixButton
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isPending}
                >
                  <Check className="size-4 mr-1.5" />
                  {isPending ? S.saving : S.save}
                </MetavixButton>
              </div>
            </form>
          ) : (
            <dl className="space-y-0">
              <ProfileRow
                icon={<Ruler className="size-4" />}
                label={S.height}
                value={vd.heightLabel ?? <Muted>{S.heightEmpty}</Muted>}
              />
              <ProfileRow
                icon={<Phone className="size-4" />}
                label={S.phone}
                value={vd.phone ?? <Muted>{S.phoneEmpty}</Muted>}
              />
              <ProfileRow
                icon={<Baby className="size-4" />}
                label={S.pregnantActive}
                value={
                  <MetavixBadge variant={vd.isPregnant ? "ok" : "neutral"}>
                    {vd.isPregnant ? S.yes : S.no}
                  </MetavixBadge>
                }
                last={!vd.isPregnant}
              />
              {vd.isPregnant && (
                <>
                  <ProfileRow
                    icon={<Calendar className="size-4" />}
                    label={S.pregnancyStart}
                    value={<DateValue value={vd.pregnancyStartDate} />}
                  />
                  <ProfileRow
                    icon={<Calendar className="size-4" />}
                    label={S.pregnancyDue}
                    value={<DateValue value={vd.pregnancyDueDate} />}
                    last
                  />
                </>
              )}
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
