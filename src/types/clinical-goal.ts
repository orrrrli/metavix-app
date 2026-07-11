/**
 * Tipos compartidos para `ClinicalGoal` (meta clínica personalizada que un
 * doctor asigna a un paciente para un parámetro específico).
 *
 * El contrato backend vive en
 * `metavix-api/src/Application/UseCases/ClinicalGoals/Common/ClinicalGoalResult.cs`
 * y los endpoints en `metavix-api/src/API/Modules/DoctorModule.cs`:
 *   - GET    /doctor/{doctorId}/patients/{patientId}/goals
 *   - POST   /doctor/{doctorId}/patients/{patientId}/goals
 *   - PUT    /doctor/{doctorId}/patients/{patientId}/goals/{goalId}
 *   - DELETE /doctor/{doctorId}/patients/{patientId}/goals/{goalId}
 */

export interface ClinicalGoal {
  id: string;
  patientId: string;
  doctorId: string;
  parameterId: string;
  customOutOfRangeLow: number | null;
  customAtRiskLow: number | null;
  customAtRiskHigh: number | null;
  customOutOfRangeHigh: number | null;
  createdAt: string;
}

export type ClinicalGoals = ClinicalGoal[];

/**
 * Forma del formulario de edición de una meta personalizada.
 *
 * Los 4 umbrales se mantienen como `string` en el form (React Hook Form los
 * serializa a texto) y se convierten a `number | null` en el momento de
 * enviar — esto permite que un campo vacío represente "usar default del
 * catálogo" sin tener que tocar `null` en el DOM. La coerción vive en
 * `src/features/doctor/utils/clinical-goal-schema.ts::valuesToApiPayload`.
 */
export type CustomGoalFormValues = {
  customOutOfRangeLow: string;
  customAtRiskLow: string;
  customAtRiskHigh: string;
  customOutOfRangeHigh: string;
};

/**
 * Payload que se envía a POST/PUT. Sólo se incluyen los umbrales que el
 * doctor dejó con valor — un campo `null` significa "no override, usar el
 * default del catálogo" y `undefined` (ausente) no se serializa para no
 * pisar valores previos en PUT.
 */
export type ClinicalGoalPayload = {
  customOutOfRangeLow?: number | null;
  customAtRiskLow?: number | null;
  customAtRiskHigh?: number | null;
  customOutOfRangeHigh?: number | null;
};
