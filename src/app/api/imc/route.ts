import { NextRequest, NextResponse } from "next/server";
import { bmiRecordsDb, BmiRecordDb } from "@/features/bmi/server-db";

function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-patient-')) {
    return null;
  }
  return authHeader.replace('Bearer mock-jwt-patient-', '');
}

function getCategoria(imc: number): string {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25.0) return "Normal";
  if (imc < 30.0) return "Sobrepeso";
  if (imc < 35.0) return "Obesidad grado I";
  if (imc < 40.0) return "Obesidad grado II";
  return "Obesidad grado III";
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRecords = bmiRecordsDb.get(userId) || [];
  
  // Sort descending by date
  userRecords.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return NextResponse.json(userRecords);
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const peso_kg = Number(body.peso_kg);
  const estatura_cm = Number(body.estatura_cm);

  if (!peso_kg || !estatura_cm || peso_kg < 20 || peso_kg > 300 || estatura_cm < 100 || estatura_cm > 250) {
    return NextResponse.json({ error: "Valores inválidos" }, { status: 400 });
  }

  const estaturaM = estatura_cm / 100;
  const imcCalc = peso_kg / (estaturaM * estaturaM);
  const imcRedondeado = Math.round(imcCalc * 10) / 10;

  const newRecord: BmiRecordDb = {
    id: crypto.randomUUID(),
    user_id: userId,
    peso_kg,
    estatura_cm,
    imc: imcRedondeado,
    categoria: getCategoria(imcRedondeado),
    fecha: new Date().toISOString()
  };

  const userRecords = bmiRecordsDb.get(userId) || [];
  bmiRecordsDb.set(userId, [...userRecords, newRecord]);

  return NextResponse.json(newRecord, { status: 201 });
}
