import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/services/auth/session";
import { softDeletePetForUser } from "@/services/pets/pet-service";

export const runtime = "nodejs";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Не си влязъл в системата." }, { status: 401 });
  }

  const petId = Number((await params).id);
  if (!Number.isInteger(petId) || petId <= 0) {
    return NextResponse.json({ error: "Невалиден ID." }, { status: 400 });
  }

  const pet = await softDeletePetForUser(petId, user.id);
  if (!pet) {
    return NextResponse.json({ error: "Любимецът не е намерен." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
