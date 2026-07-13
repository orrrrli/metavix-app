import { describe, it, expect } from "vitest";
import { makeProfile } from "@/features/patient/__fixtures__";
import { buildProfileViewData } from "./build-profile-view-data";

describe("buildProfileViewData", () => {
  it("perfil completo → nombre, iniciales, dob y etiquetas resueltas", () => {
    const vd = buildProfileViewData(
      makeProfile({
        firstName: "Ana",
        lastName: "López",
        dateOfBirth: "01/01/1990",
        diabetesType: "Type2",
        gender: "Female",
        heightCm: 165,
      }),
    );
    expect(vd.fullName).toBe("Ana López");
    expect(vd.initials).toBe("AL");
    expect(vd.formattedDob).toBe("1 de enero, 1990");
    expect(vd.diabetesLabel).toBe("Diabetes tipo 2");
    expect(vd.gender).toEqual({ label: "Femenino", known: true });
    expect(vd.heightLabel).toBe("165 cm");
  });

  it("sin firstName/lastName → fullName '—' e iniciales '?'", () => {
    const vd = buildProfileViewData(
      makeProfile({ firstName: "", lastName: "" }),
    );
    expect(vd.fullName).toBe("—");
    expect(vd.initials).toBe("?");
  });

  it("dob que no parsea → formattedDob '—'", () => {
    const vd = buildProfileViewData(makeProfile({ dateOfBirth: "" }));
    expect(vd.formattedDob).toBe("—");
  });

  it("sin estatura → heightLabel null", () => {
    const vd = buildProfileViewData(makeProfile({ heightCm: null }));
    expect(vd.heightLabel).toBeNull();
  });

  it("género desconocido → No especificado (known:false)", () => {
    const vd = buildProfileViewData(makeProfile({ gender: null }));
    expect(vd.gender).toEqual({ label: "No especificado", known: false });
  });

  it("diabetesType desconocido → devuelve el valor crudo", () => {
    const vd = buildProfileViewData(makeProfile({ diabetesType: "Type3?" }));
    expect(vd.diabetesLabel).toBe("Type3?");
  });

  it("embarazada → fechas de embarazo formateadas", () => {
    const vd = buildProfileViewData(
      makeProfile({
        isPregnant: true,
        pregnancyStartDate: "01/02/2026",
        pregnancyDueDate: "01/11/2026",
      }),
    );
    expect(vd.isPregnant).toBe(true);
    expect(vd.pregnancyStartDate).toEqual({
      type: "date",
      value: "1 de febrero, 2026",
    });
    expect(vd.pregnancyDueDate.type).toBe("date");
  });

  it("sin fechas de embarazo → placeholder", () => {
    const vd = buildProfileViewData(
      makeProfile({ pregnancyStartDate: null, pregnancyDueDate: null }),
    );
    expect(vd.pregnancyStartDate).toEqual({
      type: "placeholder",
      value: "No registrada",
    });
  });
});
