export type EstadoMetrica = "en_meta" | "revisar" | "fuera_de_meta";

export interface InterpretacionResult {
  estado: EstadoMetrica;
  meta: string;
}

export function calcularEstadoMetrica(
  metricaId: string,
  valor: number | null,
  perfil: { tipoDiabetes: string; embarazada: boolean; sexo?: "M" | "F" }
): InterpretacionResult {
  if (valor === null) return { estado: "fuera_de_meta", meta: "Sin registro" };

  const { tipoDiabetes, embarazada } = perfil;
  const hasDiabetes = tipoDiabetes === "tipo_1" || tipoDiabetes === "tipo_2";
  const sexo = perfil.sexo || "F";

  switch (metricaId) {
    case "glucosaAyuno":
      let metaGlucosa = "70 - 100 mg/dL";
      if (embarazada) metaGlucosa = "70 - 95 mg/dL";
      else if (hasDiabetes) metaGlucosa = "80 - 130 mg/dL";
      else if (tipoDiabetes === "prediabetes") metaGlucosa = "100 - 125 mg/dL";

      if (embarazada) {
        if (valor >= 70 && valor <= 95) return { estado: "en_meta", meta: metaGlucosa };
        if (valor < 70 || valor > 110) return { estado: "fuera_de_meta", meta: metaGlucosa };
        return { estado: "revisar", meta: metaGlucosa };
      } else if (hasDiabetes) {
        if (valor >= 80 && valor <= 130) return { estado: "en_meta", meta: metaGlucosa };
        if (valor >= 70 && valor <= 150) return { estado: "revisar", meta: metaGlucosa };
        return { estado: "fuera_de_meta", meta: metaGlucosa };
      } else if (tipoDiabetes === "prediabetes") {
        if (valor >= 100 && valor <= 125) return { estado: "en_meta", meta: metaGlucosa };
        if (valor < 70 || valor > 140) return { estado: "fuera_de_meta", meta: metaGlucosa };
        return { estado: "revisar", meta: metaGlucosa };
      } else {
        if (valor >= 70 && valor <= 100) return { estado: "en_meta", meta: metaGlucosa };
        if (valor >= 65 && valor <= 110) return { estado: "revisar", meta: metaGlucosa };
        return { estado: "fuera_de_meta", meta: metaGlucosa };
      }

    case "hba1c":
      let metaHba1c = "< 5.7%";
      if (embarazada) metaHba1c = "< 6.0%";
      else if (hasDiabetes) metaHba1c = "< 7.0%";
      else if (tipoDiabetes === "prediabetes") metaHba1c = "5.7 - 6.4%";

      if (embarazada) {
        if (valor < 6.0) return { estado: "en_meta", meta: metaHba1c };
        if (valor <= 6.5) return { estado: "revisar", meta: metaHba1c };
        return { estado: "fuera_de_meta", meta: metaHba1c };
      } else if (hasDiabetes) {
        if (valor < 7.0) return { estado: "en_meta", meta: metaHba1c };
        if (valor <= 8.0) return { estado: "revisar", meta: metaHba1c };
        return { estado: "fuera_de_meta", meta: metaHba1c };
      } else if (tipoDiabetes === "prediabetes") {
        if (valor >= 5.7 && valor <= 6.4) return { estado: "en_meta", meta: metaHba1c };
        if (valor < 5.7) return { estado: "revisar", meta: metaHba1c };
        return { estado: "fuera_de_meta", meta: metaHba1c };
      } else {
        if (valor < 5.7) return { estado: "en_meta", meta: metaHba1c };
        if (valor <= 6.0) return { estado: "revisar", meta: metaHba1c };
        return { estado: "fuera_de_meta", meta: metaHba1c };
      }

    case "presionSistolica":
      let metaSis = "< 120 mmHg";
      if (embarazada) metaSis = "< 140 mmHg";
      else if (hasDiabetes) metaSis = "< 130 mmHg";

      if (embarazada) {
        if (valor < 140) return { estado: "en_meta", meta: metaSis };
        if (valor <= 150) return { estado: "revisar", meta: metaSis };
        return { estado: "fuera_de_meta", meta: metaSis };
      } else if (hasDiabetes) {
        if (valor < 130) return { estado: "en_meta", meta: metaSis };
        if (valor <= 140) return { estado: "revisar", meta: metaSis };
        return { estado: "fuera_de_meta", meta: metaSis };
      } else {
        if (valor < 120) return { estado: "en_meta", meta: metaSis };
        if (valor <= 130) return { estado: "revisar", meta: metaSis };
        return { estado: "fuera_de_meta", meta: metaSis };
      }

    case "presionDiastolica":
      if (valor < 80) return { estado: "en_meta", meta: "< 80 mmHg" };
      if (valor <= 90) return { estado: "revisar", meta: "< 80 mmHg" };
      return { estado: "fuera_de_meta", meta: "< 80 mmHg" };

    case "colesterolLdl":
      const metaLdl = hasDiabetes ? "< 100 mg/dL" : "< 130 mg/dL";
      if (hasDiabetes) {
        if (valor < 100) return { estado: "en_meta", meta: metaLdl };
        if (valor <= 130) return { estado: "revisar", meta: metaLdl };
        return { estado: "fuera_de_meta", meta: metaLdl };
      } else {
        if (valor < 130) return { estado: "en_meta", meta: metaLdl };
        if (valor <= 160) return { estado: "revisar", meta: metaLdl };
        return { estado: "fuera_de_meta", meta: metaLdl };
      }

    case "frecuenciaCardiaca":
      if (valor >= 60 && valor <= 100) return { estado: "en_meta", meta: "60 - 100 lpm" };
      if ((valor >= 50 && valor < 60) || (valor > 100 && valor <= 110)) return { estado: "revisar", meta: "60 - 100 lpm" };
      return { estado: "fuera_de_meta", meta: "60 - 100 lpm" };

    case "imc":
      if (valor >= 18.5 && valor <= 24.9) return { estado: "en_meta", meta: "18.5 - 24.9" };
      if (valor >= 25.0 && valor <= 29.9) return { estado: "revisar", meta: "18.5 - 24.9" };
      return { estado: "fuera_de_meta", meta: "18.5 - 24.9" };

    case "cintura":
      const metaCintura = sexo === "M" ? "< 102 cm" : "< 88 cm";
      const limitC = sexo === "M" ? 102 : 88;
      if (valor < limitC) return { estado: "en_meta", meta: metaCintura };
      if (valor <= limitC + 5) return { estado: "revisar", meta: metaCintura };
      return { estado: "fuera_de_meta", meta: metaCintura };

    case "colesterolTotal":
      if (valor < 200) return { estado: "en_meta", meta: "< 200 mg/dL" };
      if (valor <= 240) return { estado: "revisar", meta: "< 200 mg/dL" };
      return { estado: "fuera_de_meta", meta: "< 200 mg/dL" };

    case "colesterolHdl":
      const metaHdl = sexo === "M" ? "> 40 mg/dL" : "> 50 mg/dL";
      const limitH = sexo === "M" ? 40 : 50;
      if (valor > limitH) return { estado: "en_meta", meta: metaHdl };
      if (valor >= limitH - 10) return { estado: "revisar", meta: metaHdl };
      return { estado: "fuera_de_meta", meta: metaHdl };

    case "trigliceridos":
      if (valor < 150) return { estado: "en_meta", meta: "< 150 mg/dL" };
      if (valor <= 200) return { estado: "revisar", meta: "< 150 mg/dL" };
      return { estado: "fuera_de_meta", meta: "< 150 mg/dL" };

    case "creatinina":
      if (valor >= 0.5 && valor <= 1.2) return { estado: "en_meta", meta: "0.5 - 1.2 mg/dL" };
      if (valor > 1.2 && valor <= 1.5) return { estado: "revisar", meta: "0.5 - 1.2 mg/dL" };
      return { estado: "fuera_de_meta", meta: "0.5 - 1.2 mg/dL" };

    case "bun":
      if (valor >= 7 && valor <= 20) return { estado: "en_meta", meta: "7 - 20 mg/dL" };
      if (valor > 20 && valor <= 30) return { estado: "revisar", meta: "7 - 20 mg/dL" };
      return { estado: "fuera_de_meta", meta: "7 - 20 mg/dL" };

    default:
      return { estado: "revisar", meta: "N/A" };
  }
}
