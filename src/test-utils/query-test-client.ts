import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient para tests: sin retries y sin cache persistente entre tests, para
 * que cada test parta de un estado limpio y los fallos de red no se reintenten
 * (haciendo los tests lentos/flaky).
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}
