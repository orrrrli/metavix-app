import { NextRequest, NextResponse } from "next/server";
import { recordsDb, InsulinaRegistroDb } from "@/features/insulin-dm1/server-db";

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

  // Get search params
  const { searchParams } = new URL(req.url);
  const desde = searchParams.get('desde');
  const hasta = searchParams.get('hasta');
  const limit = Number(searchParams.get('limit')) || 100;

  let userRecords = recordsDb.get(userId) || [];

  // Filter by date range if provided
  if (desde) {
    userRecords = userRecords.filter(r => r.fecha >= desde);
  }
  if (hasta) {
    userRecords = userRecords.filter(r => r.fecha <= hasta);
  }

  // Sort descending by date
  userRecords.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Limit
  userRecords = userRecords.slice(0, limit);

  return NextResponse.json(userRecords);
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  
  const newRecord: InsulinaRegistroDb = {
    id: crypto.randomUUID(),
    user_id: userId,
    fecha: body.fecha,
    glucosa_antes: Number(body.glucosa_antes),
    glucosa_despues: Number(body.glucosa_despues),
    hc_totales: Number(body.hc_totales),
    dosis_aplicada: Number(body.dosis_aplicada),
    que_comi: body.que_comi,
    como_me_senti: body.como_me_senti,
    creado_en: new Date().toISOString()
  };

  const userRecords = recordsDb.get(userId) || [];
  recordsDb.set(userId, [...userRecords, newRecord]);

  return NextResponse.json(newRecord, { status: 201 });
}
