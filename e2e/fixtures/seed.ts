import type { Page } from "@playwright/test";
import { makeLabRecord } from "../../src/features/metas/__fixtures__/make-lab-record";
import {
  makeDailyRecord,
  makeGlucoseReading,
} from "../../src/features/metas/__fixtures__/make-daily-record";
import { makeProfile } from "../../src/features/metas/__fixtures__/make-profile";
import { makeEvalResponse } from "../../src/features/metas/__fixtures__/make-eval-response";
import { GlucoseReadingType } from "../../src/types/daily-record";
import type { LabRecordResponse } from "../../src/types/lab-record";
import type { DailyRecordResponse } from "../../src/types/daily-record";
import type { PatientProfileResponse } from "../../src/types/patient-profile";

export const PATIENT_ID = "patient-1";

/**
 * Siembra la sesión para renderizar rutas de paciente sin login real:
 *  1. Cookie `_session` — el proxy de Next (`src/proxy.ts`) redirige a `/` en
 *     server-side si no existe (solo checa presencia, no el valor).
 *  2. Store de auth en localStorage (`ram-med-auth`) — el layout cliente gatea
 *     por `role === "PATIENT"` de Zustand.
 */
export async function seedAuth(page: Page) {
  await page.context().addCookies([
    {
      name: "_session",
      value: "e2e-dummy-session",
      url: "http://localhost:3000",
    },
  ]);
  await page.addInitScript((patientId) => {
    localStorage.setItem(
      "ram-med-auth",
      JSON.stringify({
        state: {
          role: "PATIENT",
          userId: patientId,
          patientId,
          doctorId: null,
          fullName: "Ana López",
          email: "ana@example.com",
        },
        version: 0,
      }),
    );
  }, PATIENT_ID);
}

export interface MetasApiData {
  labRecords?: LabRecordResponse[];
  dailyRecords?: DailyRecordResponse[];
  profile?: PatientProfileResponse | null;
}

/**
 * Intercepta las 4 llamadas API de la pantalla Metas con datos deterministas.
 * Sin backend real. La respuesta de evaluación se sirve en el POST.
 */
export async function stubMetasApi(page: Page, data: MetasApiData = {}) {
  const {
    labRecords = [],
    dailyRecords = [],
    profile = makeProfile(),
  } = data;

  const json = (body: unknown) => ({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ data: body }),
  });

  await page.route(`**/api/v1/patient/${PATIENT_ID}/get-all/records/lab`, (r) =>
    r.fulfill(json(labRecords)),
  );
  await page.route(`**/api/v1/patient/${PATIENT_ID}/get-all/records/daily`, (r) =>
    r.fulfill(json(dailyRecords)),
  );
  await page.route(`**/api/v1/patient/${PATIENT_ID}/profile`, (r) =>
    r.fulfill(json(profile)),
  );
  await page.route(
    `**/api/v1/patient/${PATIENT_ID}/goal-evaluations`,
    (r) => r.fulfill(json(makeEvalResponse())),
  );
}

// Re-export builders para los specs.
export {
  makeLabRecord,
  makeDailyRecord,
  makeGlucoseReading,
  makeProfile,
  GlucoseReadingType,
};
