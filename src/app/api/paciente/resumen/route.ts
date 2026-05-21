import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-patient-')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    perfil: {
      nombre: "Paciente Demo",
      tipoDiabetes: "tipo_2",
      embarazada: false,
      sexo: "F"
    },
    metricas: {
      glucosaAyuno:       { valor: 118,  fecha: "2026-05-18" },
      presionSistolica:   { valor: 128,  fecha: "2026-05-18" },
      presionDiastolica:  { valor: 82,   fecha: "2026-05-18" },
      frecuenciaCardiaca: { valor: 74,   fecha: "2026-05-18" },
      peso:               { valor: 72.5, fecha: "2026-05-18" },
      estaturasCm:        { valor: 165,  fecha: null },
      imc:                { valor: 26.6, fecha: "2026-05-18" },
      cintura:            { valor: 88,   fecha: "2026-05-18" },
      hba1c:              { valor: 7.1,  fecha: "2026-05-10" },
      colesterolTotal:    { valor: 198,  fecha: "2026-05-10" },
      colesterolLdl:      { valor: 112,  fecha: "2026-05-10" },
      colesterolHdl:      { valor: 48,   fecha: "2026-05-10" },
      trigliceridos:      { valor: 145,  fecha: "2026-05-10" },
      creatinina:         { valor: 0.9,  fecha: "2026-05-10" },
      bun:                { valor: 14,   fecha: "2026-05-10" }
    }
  });
}
