import { describe, it, expect } from "vitest";
import {
  getMetasGlucosaAyuno,
  getMetaGlucosaPostprandial,
  estadoValorConBanda,
} from "./semaforo";

describe("getMetasGlucosaAyuno + estadoValorConBanda", () => {
  it("dm1/dm2: 70-79 fuera_de_meta (baja), 80-130 en_meta, 131-179 revisar, >179 fuera_de_meta", () => {
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
    expect(estadoValorConBanda(120, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });
});

describe("getMetaGlucosaPostprandial + estadoValorConBanda", () => {
  it("dm1/dm2: 70-79 fuera_de_meta, 80-179 en_meta, 180-250 revisar, >250 fuera_de_meta", () => {
    const m = getMetaGlucosaPostprandial("dm1");
    expect(estadoValorConBanda(75, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
    expect(estadoValorConBanda(150, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("en_meta");
    expect(estadoValorConBanda(200, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("revisar");
    expect(estadoValorConBanda(260, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });

  it("embarazo: 70-99 fuera_de_meta, 100-120 en_meta, 121-139 revisar, >=140 fuera_de_meta", () => {
    const m = getMetaGlucosaPostprandial("embarazo");
    expect(estadoValorConBanda(85, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
    expect(estadoValorConBanda(110, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("en_meta");
    expect(estadoValorConBanda(130, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("revisar");
    expect(estadoValorConBanda(140, m.min, m.max, m.enMetaMin, m.enMetaMax)).toBe("fuera_de_meta");
  });
});
