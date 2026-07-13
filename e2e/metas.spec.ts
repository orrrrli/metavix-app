import { test, expect } from "@playwright/test";
import {
  seedAuth,
  stubMetasApi,
  makeLabRecord,
  makeDailyRecord,
  makeGlucoseReading,
  makeProfile,
  GlucoseReadingType,
} from "./fixtures/seed";

const METAS_URL = "/paciente/herramientas/metas";

test.beforeEach(async ({ page }) => {
  await seedAuth(page);
});

test("paciente normal — datos pre-poblados", async ({ page }) => {
  await stubMetasApi(page, {
    labRecords: [makeLabRecord({ hba1c: 7.2, ldl: 110 })],
    dailyRecords: [
      makeDailyRecord({
        weightKg: 70,
        glucoseReadings: [
          makeGlucoseReading({
            readingType: GlucoseReadingType.Fasting,
            valueMgDl: 108,
          }),
        ],
      }),
    ],
    profile: makeProfile({ heightCm: 165 }),
  });

  await page.goto(METAS_URL);
  await expect(
    page.getByRole("button", { name: "Evaluar mis metas" }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("metas-normal.png", { fullPage: true });
});

test("paciente embarazada — banner de embarazo", async ({ page }) => {
  await stubMetasApi(page, {
    profile: makeProfile({ isPregnant: true, heightCm: 165 }),
  });

  await page.goto(METAS_URL);
  await expect(page.getByText("Estás en modo embarazo")).toBeVisible();
  await expect(page).toHaveScreenshot("metas-embarazada.png", {
    fullPage: true,
  });
});

test("paciente sin datos — todo sin registros", async ({ page }) => {
  await stubMetasApi(page, {
    labRecords: [],
    dailyRecords: [],
    profile: makeProfile(),
  });

  await page.goto(METAS_URL);
  await expect(
    page.getByRole("button", { name: "Evaluar mis metas" }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("metas-sin-datos.png", {
    fullPage: true,
  });
});
