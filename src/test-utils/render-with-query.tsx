import { render, type RenderOptions } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement, ReactNode } from "react";
import { createTestQueryClient } from "./query-test-client";

/**
 * `render` con un `QueryClientProvider` real alrededor — la contraparte de
 * `renderHookWithQuery` para componentes. Ejercita el flujo completo componente
 * → QueryClient → fetch (interceptado por MSW), sin mockear TanStack Query.
 * Cada llamada crea un client fresco.
 */
export function renderWithQuery(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, ...render(ui, { wrapper, ...options }) };
}
