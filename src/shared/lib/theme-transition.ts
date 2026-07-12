/**
 * Espera a que next-themes aplique (o quite) la clase `dark` en <html>.
 * Necesario porque next-themes cambia el atributo de forma asíncrona; sin esto,
 * el callback de startViewTransition retorna antes de que el DOM cambie y Chrome
 * captura dos snapshots idénticos → no hay animación.
 */
export function waitForThemeClass(next: "light" | "dark"): Promise<void> {
  const root = document.documentElement;
  const isReady = () =>
    next === "dark" ? root.classList.contains("dark") : !root.classList.contains("dark");

  if (isReady()) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (isReady()) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    // Fallback por si el observer no dispara (máx. un frame extra).
    requestAnimationFrame(() => {
      if (isReady()) {
        observer.disconnect();
        resolve();
      }
    });
  });
}
