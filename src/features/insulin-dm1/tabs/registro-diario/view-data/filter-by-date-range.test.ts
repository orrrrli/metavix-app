import { describe, it, expect } from "vitest";
import { makeInsulinRecord } from "@/features/insulin-dm1/__fixtures__/make-insulin-record";
import { filterByDateRange } from "./filter-by-date-range";
import { buildRegistroViewData } from "./build-registro-view-data";

const registros = [
  makeInsulinRecord({ id: "a", recordDate: "01/07/2026" }),
  makeInsulinRecord({ id: "b", recordDate: "10/07/2026" }),
  makeInsulinRecord({ id: "c", recordDate: "20/07/2026" }),
];

describe("filterByDateRange", () => {
  it("sin filtros devuelve todos los registros (misma referencia)", () => {
    expect(filterByDateRange(registros, "", "")).toBe(registros);
  });

  it("filtra por 'desde' inclusive", () => {
    const r = filterByDateRange(registros, "2026-07-10", "");
    expect(r.map((x) => x.id)).toEqual(["b", "c"]);
  });

  it("filtra por 'hasta' inclusive (incluye el día completo)", () => {
    const r = filterByDateRange(registros, "", "2026-07-10");
    expect(r.map((x) => x.id)).toEqual(["a", "b"]);
  });

  it("filtra por rango [desde, hasta]", () => {
    const r = filterByDateRange(registros, "2026-07-05", "2026-07-15");
    expect(r.map((x) => x.id)).toEqual(["b"]);
  });

  it("rango sin coincidencias devuelve vacío", () => {
    expect(filterByDateRange(registros, "2026-08-01", "2026-08-31")).toEqual([]);
  });
});

describe("buildRegistroViewData", () => {
  it("expone conteo y bandera hayRegistros", () => {
    const vd = buildRegistroViewData({ registros, desde: "", hasta: "" });
    expect(vd.totalCount).toBe(3);
    expect(vd.hayRegistros).toBe(true);
  });

  it("hayRegistros false cuando el filtro deja 0", () => {
    const vd = buildRegistroViewData({
      registros,
      desde: "2026-08-01",
      hasta: "2026-08-31",
    });
    expect(vd.totalCount).toBe(0);
    expect(vd.hayRegistros).toBe(false);
  });
});
