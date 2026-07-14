import { describe, it, expect } from "vitest";
import { makeDoctorProfile } from "@/features/doctor/__fixtures__/make-doctor-profile";
import { buildDoctorProfileViewData } from "./build-doctor-profile-view-data";

describe("buildDoctorProfileViewData", () => {
  it("perfil completo → nombre, iniciales, memberSince y verificación", () => {
    const vd = buildDoctorProfileViewData(
      makeDoctorProfile({
        firstName: "Carlos",
        lastName: "Ramírez",
        createdAt: "2026-01-15T00:00:00Z",
        isVerified: true,
      }),
    );
    expect(vd.fullName).toBe("Carlos Ramírez");
    expect(vd.initials).toBe("CR");
    expect(vd.memberSince).toBe("enero 2026");
    expect(vd.isVerified).toBe(true);
  });

  it("sin nombre → fullName '—' e iniciales '?'", () => {
    const vd = buildDoctorProfileViewData(
      makeDoctorProfile({ firstName: "", lastName: "" }),
    );
    expect(vd.fullName).toBe("—");
    expect(vd.initials).toBe("?");
  });

  it("createdAt inválido → memberSince '—'", () => {
    const vd = buildDoctorProfileViewData(makeDoctorProfile({ createdAt: "no-date" }));
    expect(vd.memberSince).toBe("—");
  });

  it("cédula/especialidad vacías → null para el placeholder", () => {
    const vd = buildDoctorProfileViewData(
      makeDoctorProfile({ licenseNumber: "", speciality: "" }),
    );
    expect(vd.licenseNumber).toBeNull();
    expect(vd.specialityValue).toBeNull();
  });

  it("no verificado se refleja en isVerified", () => {
    const vd = buildDoctorProfileViewData(makeDoctorProfile({ isVerified: false }));
    expect(vd.isVerified).toBe(false);
  });
});
