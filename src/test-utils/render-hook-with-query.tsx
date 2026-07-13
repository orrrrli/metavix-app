import { renderHook, type RenderHookOptions } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createTestQueryClient } from "./query-test-client";

/**
 * `renderHook` con un `QueryClientProvider` real alrededor. Ejercita el flujo
 * completo hook → QueryClient → fetch (interceptado por MSW), sin mockear
 * TanStack Query. Cada llamada crea un client fresco.
 */
export function renderHookWithQuery<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper">,
) {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, ...renderHook(hook, { wrapper, ...options }) };
}
