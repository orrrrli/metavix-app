import { describe, it, expect } from "vitest";
import { parseFormDataToPayload } from "./parse-form-data-to-payload";

describe("parseFormDataToPayload", () => {
  it("omite campos de texto vacíos (no los manda como null/0)", () => {
    const payload = parseFormDataToPayload({
      heightCm: "",
      phone: "",
      isPregnant: false,
      pregnancyStartDate: "",
      pregnancyDueDate: "",
    });
    expect(payload).toEqual({ isPregnant: false });
    expect("heightCm" in payload).toBe(false);
    expect("phone" in payload).toBe(false);
  });

  it("omite campos undefined", () => {
    const payload = parseFormDataToPayload({ isPregnant: true });
    expect(payload).toEqual({ isPregnant: true });
  });

  it("castea heightCm a número cuando hay valor", () => {
    const payload = parseFormDataToPayload({
      heightCm: "165",
      isPregnant: false,
    });
    expect(payload.heightCm).toBe(165);
    expect(typeof payload.heightCm).toBe("number");
  });

  it("incluye teléfono y fechas de embarazo cuando están presentes", () => {
    const payload = parseFormDataToPayload({
      heightCm: "170",
      phone: "+52 664 123 4567",
      isPregnant: true,
      pregnancyStartDate: "2026-01-01",
      pregnancyDueDate: "2026-10-01",
    });
    expect(payload).toEqual({
      heightCm: 170,
      phone: "+52 664 123 4567",
      isPregnant: true,
      pregnancyStartDate: "2026-01-01",
      pregnancyDueDate: "2026-10-01",
    });
  });

  it("isPregnant siempre se incluye (true o false)", () => {
    expect(parseFormDataToPayload({ isPregnant: true }).isPregnant).toBe(true);
    expect(parseFormDataToPayload({ isPregnant: false }).isPregnant).toBe(false);
  });
});
