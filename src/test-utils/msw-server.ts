import { setupServer } from "msw/node";

/**
 * Servidor MSW compartido por toda la suite. Se inicia/resetea/cierra en
 * `vitest.setup.ts`. Los handlers concretos se registran por test con
 * `server.use(...)` o por feature en los fixtures de cada módulo.
 */
export const server = setupServer();
