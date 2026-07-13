import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw-server";

// Origen fijo para que los api clients (que usan NEXT_PUBLIC_API_URL) emitan
// URLs absolutas resolubles por MSW en node. Los handlers de fixtures usan el
// mismo origen (ver __fixtures__/msw-handlers.ts).
process.env.NEXT_PUBLIC_API_URL = "http://localhost";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
