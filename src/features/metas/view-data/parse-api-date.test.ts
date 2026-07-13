import { describe, it, expect } from "vitest";
import { parseApiDate } from "./parse-api-date";

describe("parseApiDate", () => {
  it("parsea dd/MM/yyyy a un Date local", () => {
    const d = parseApiDate("01/07/2026");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(6); // julio = índice 6
    expect(d.getDate()).toBe(1);
  });

  it("respeta el día y mes correctos (no confunde dd con MM)", () => {
    const d = parseApiDate("13/12/2025");
    expect(d.getDate()).toBe(13);
    expect(d.getMonth()).toBe(11); // diciembre
  });

  it("ordena correctamente dos fechas por getTime()", () => {
    const older = parseApiDate("01/01/2026").getTime();
    const newer = parseApiDate("31/12/2026").getTime();
    expect(newer).toBeGreaterThan(older);
  });
});
