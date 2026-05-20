import { NextRequest, NextResponse } from "next/server";
import { recordsDb } from "@/features/insulin-dm1/server-db";

function getUserIdFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer mock-jwt-patient-')) {
    return null;
  }
  return authHeader.replace('Bearer mock-jwt-patient-', '');
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRecords = recordsDb.get(userId) || [];
  const updatedRecords = userRecords.filter(r => r.id !== id);
  
  recordsDb.set(userId, updatedRecords);

  return NextResponse.json({ success: true });
}
