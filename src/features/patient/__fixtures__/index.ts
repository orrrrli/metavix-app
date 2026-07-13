/**
 * Fixtures del dominio patient. Reusa los builders ya definidos para la
 * pantalla Metas (mismo tipo de respuesta de la API) en vez de duplicarlos.
 * Si un builder específico de patient diverge, se define aquí y se re-exporta.
 */
export {
  makeDailyRecord,
  makeDailyRecords,
  makeGlucoseReading,
} from "@/features/metas/__fixtures__/make-daily-record";
export {
  makeLabRecord,
  makeLabRecords,
} from "@/features/metas/__fixtures__/make-lab-record";
export { makeProfile } from "@/features/metas/__fixtures__/make-profile";
