import { http, HttpResponse } from "msw";
import type { LabRecordResponse } from "@/types/lab-record";
import type { DailyRecordResponse } from "@/types/daily-record";
import type { PatientProfileResponse } from "@/types/patient-profile";
import type { GoalEvaluationResponse } from "@/types/goal-evaluation";
import { makeProfile } from "./make-profile";
import { makeEvalResponse } from "./make-eval-response";

/**
 * PatientId por defecto usado en los tests. Debe coincidir con el que se
 * inyecta en `useAuthStore` (o el que se pasa a los hooks base).
 */
export const patientId = "patient-1";

// El api client compone las URLs como `${NEXT_PUBLIC_API_URL}/api/v1/...`.
// En tests, `NEXT_PUBLIC_API_URL = "http://localhost"` (ver vitest.setup.ts),
// así que replicamos exactamente esos paths aquí.
const base = (path: string) =>
  `http://localhost/api/v1/patient/${patientId}${path}`;

export interface MetasHandlerData {
  labRecords?: LabRecordResponse[];
  dailyRecords?: DailyRecordResponse[];
  profile?: PatientProfileResponse | null;
  evalResponse?: GoalEvaluationResponse;
}

/**
 * Construye los 4 handlers de la pantalla Metas con datos inyectables. Sin
 * argumentos devuelve arrays vacíos, un perfil por defecto y una evaluación
 * mínima — suficiente para el happy path.
 */
export function metasHandlers(data: MetasHandlerData = {}) {
  const {
    labRecords = [],
    dailyRecords = [],
    profile = makeProfile(),
    evalResponse = makeEvalResponse(),
  } = data;

  return [
    http.get(base("/get-all/records/lab"), () =>
      HttpResponse.json({ data: labRecords }),
    ),
    http.get(base("/get-all/records/daily"), () =>
      HttpResponse.json({ data: dailyRecords }),
    ),
    http.get(base("/profile"), () => HttpResponse.json({ data: profile })),
    http.post(base("/goal-evaluations"), () =>
      HttpResponse.json({ data: evalResponse }),
    ),
  ];
}
