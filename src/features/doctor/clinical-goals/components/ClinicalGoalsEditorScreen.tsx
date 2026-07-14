"use client";

import { Loader2, ChevronDown, ChevronRight, Pencil, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { CustomGoalForm } from "../../components/CustomGoalForm";
import { clinicalGoalsStrings as S } from "../strings/es";
import type { ClinicalGoal, ClinicalGoalPayload } from "@/types/clinical-goal";
import type { ClinicalGoalsViewData } from "../view-data/build-clinical-goals-view-data";

export interface ClinicalGoalsEditorScreenProps {
  viewData: ClinicalGoalsViewData;
  isLoading: boolean;
  isSaving: boolean;
  isPregnant: boolean;
  openParamId: string | null;
  onToggleParam: (paramId: string) => void;
  onCancel: () => void;
  onSave: (
    parameterId: string,
    existing: ClinicalGoal | null,
    payload: ClinicalGoalPayload,
  ) => void;
}

/** UI pura del editor de metas clínicas. Sin queries; el estado abierto viene por props. */
export function ClinicalGoalsEditorScreen({
  viewData,
  isLoading,
  isSaving,
  isPregnant,
  openParamId,
  onToggleParam,
  onCancel,
  onSave,
}: ClinicalGoalsEditorScreenProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        {S.loading}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isPregnant && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 rounded-lg border-2"
          style={{ background: "var(--info-bg)", borderColor: "var(--info)" }}
        >
          <div
            className="flex items-center justify-center size-9 rounded-full shrink-0"
            style={{ background: "var(--info)" }}
          >
            <Info className="size-5" style={{ color: "#fff" }} aria-hidden="true" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-base font-semibold" style={{ color: "var(--text)" }}>
              {S.pregnancyTitle}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text)" }}>
              {S.pregnancyBody}
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">{S.intro}</p>

      {viewData.parametros.map(({ param, existing, customSummaryItems }) => {
        const isOpen = openParamId === param.id;
        return (
          <Card key={param.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {param.nombre}
                    {existing && (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {S.personalizadaBadge}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {S.defaultPrefix}{" "}
                    <span className="font-medium">{param.metaMostrada}</span>
                    {param.fuente && <> · {param.fuente}</>}
                  </CardDescription>
                  {customSummaryItems.length > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {S.actualPrefix} {customSummaryItems.join(" · ")}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleParam(param.id)}
                  aria-expanded={isOpen}
                  aria-controls={`form-${param.id}`}
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1" />
                  )}
                  {existing ? S.editar : S.personalizar}
                  {!isOpen && existing && <Pencil className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </CardHeader>
            {isOpen && (
              <CardContent id={`form-${param.id}`}>
                <CustomGoalForm
                  existing={existing}
                  unit={param.unidad}
                  step={param.step}
                  isSaving={isSaving}
                  onSubmit={(payload) => onSave(param.id, existing, payload)}
                  onCancel={onCancel}
                />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
