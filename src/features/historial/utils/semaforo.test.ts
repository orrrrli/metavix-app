import { describe, it, expect } from "vitest";
import {
  getMetasGlucosaAyuno,
  getMetaGlucosaPostprandial,
  estadoValorConBanda,
} from "./semaforo";

describe("getMetasGlucosaAyuno + estadoValorConBanda", () => {
  it("dm1/dm2: 70-79 fuera_de_meta (baja), 80-130 en_meta, 131-180 revisar, >180 fuera_de_meta", () => {
    const m = getMetasGlucosaAyuno("dm1");
    expect(estadoValorConBanda(75, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
    expect(estadoValorConBanda(100, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("en_meta");
    expect(estadoValorConBanda(150, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("revisar");
    expect(estadoValorConBanda(200, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });

  it("embarazo: sin banda fuera-de-meta-baja — 70-95 en_meta directo", () => {
    const m = getMetasGlucosaAyuno("embarazo");
    expect(estadoValorConBanda(70, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("en_meta");
    expect(estadoValorConBanda(100, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("revisar");
    expect(estadoValorConBanda(130, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });
});

describe("getMetaGlucosaPostprandial + estadoValorConBanda", () => {
  it("dm1/dm2: <70 fuera_de_meta, 70-179 en_meta, 180-250 revisar, >250 fuera_de_meta", () => {
    const m = getMetaGlucosaPostprandial("dm1");
    expect(estadoValorConBanda(65, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
    expect(estadoValorConBanda(150, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("en_meta");
    expect(estadoValorConBanda(200, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("revisar");
    expect(estadoValorConBanda(260, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });

  it("embarazo: <110 fuera_de_meta, 110-140 en_meta, 141-180 revisar, >180 fuera_de_meta", () => {
    const m = getMetaGlucosaPostprandial("embarazo");
    expect(estadoValorConBanda(100, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
    expect(estadoValorConBanda(120, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("en_meta");
    expect(estadoValorConBanda(160, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("revisar");
    expect(estadoValorConBanda(190, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });
});
