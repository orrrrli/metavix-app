import { describe, it, expect } from "vitest";
import { metasStrings } from "./es";

describe("metasStrings", () => {
  it("expone las keys que consume MetasScreen", () => {
    expect(Object.keys(metasStrings).sort()).toEqual(
      [
        "adaDisclaimer",
        "dueDateReachedNote",
        "evaluateButton",
        "evaluateError",
        "loadingMessage",
        "preEvaluationBanner",
        "pregnancyBadge",
        "pregnancyDeactivatedNote",
        "pregnancyMode",
        "subtitle",
        "title",
      ].sort(),
    );
  });

  it("mantiene el texto del botón de evaluación", () => {
    expect(metasStrings.evaluateButton).toBe("Evaluar mis metas");
  });

  it("el banner de embarazo tiene título y cuerpo", () => {
    expect(metasStrings.pregnancyMode.title).toBe("Estás en modo embarazo");
    expect(metasStrings.pregnancyMode.body.length).toBeGreaterThan(0);
  });
});
