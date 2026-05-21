import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-patient-')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    perfil: {
      nombre: "Sarah Jenkins",
      tipoDiabetes: "tipo_2",
      embarazada: false,
      sexo: "F"
    },
    metricas: {
      glucosaAyuno:       { valor: 135,  fecha: "2026-05-21" },
      presionSistolica:   { valor: 140,  fecha: "2026-05-21" },
      presionDiastolica:  { valor: 88,   fecha: "2026-05-21" },
      frecuenciaCardiaca: { valor: 84,   fecha: "2026-05-21" },
      peso:               { valor: 78.5, fecha: "2026-05-21" },
      estaturasCm:        { valor: 165,  fecha: null },
      imc:                { valor: 28.8, fecha: "2026-05-21" },
      cintura:            { valor: 92,   fecha: "2026-05-21" },
      hba1c:              { valor: 7.4,  fecha: "2026-05-18" },
      colesterolTotal:    { valor: 205,  fecha: "2026-05-18" },
      colesterolLdl:      { valor: 125,  fecha: "2026-05-18" },
      colesterolHdl:      { valor: 44,   fecha: "2026-05-18" },
      trigliceridos:      { valor: 170,  fecha: "2026-05-18" },
      creatinina:         { valor: 1.0,  fecha: "2026-05-18" },
      bun:                { valor: 16,   fecha: "2026-05-18" }
    }
  });
}
