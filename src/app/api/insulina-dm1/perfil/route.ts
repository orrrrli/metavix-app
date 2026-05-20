import { NextRequest, NextResponse } from "next/server";
import { profilesDb, InsulinaPerfilDb } from "@/features/insulin-dm1/server-db";

function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-patient-')) {
    return null;
  }
  return authHeader.replace('Bearer mock-jwt-patient-', '');
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = profilesDb.get(userId);
  if (!profile) {
    return NextResponse.json(null); // No profile yet
  }

  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  
  const updatedProfile: InsulinaPerfilDb = {
    id: profilesDb.get(userId)?.id || crypto.randomUUID(),
    user_id: userId,
    nombre_insulina: body.nombre_insulina,
    ric: Number(body.ric),
    factor_sensibilidad: Number(body.factor_sensibilidad),
    glucosa_meta: Number(body.glucosa_meta),
    nombre_medico: body.nombre_medico,
    telefono_medico: body.telefono_medico,
    creado_en: profilesDb.get(userId)?.creado_en || new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  };

  profilesDb.set(userId, updatedProfile);

  return NextResponse.json(updatedProfile);
}
