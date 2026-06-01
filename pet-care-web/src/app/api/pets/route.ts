import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, readJsonObject, requireApiUser } from "../api-utils";
import {
  getPageWindow,
  parsePage,
  resolvePageRows,
} from "@/services/pagination";
import { createPet, listPetsForUser } from "@/services/pets/pet-service";
import type { PetType } from "@/types";

export const runtime = "nodejs";

function nullableText(value: unknown) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const page = parsePage(request.nextUrl.searchParams.get("page") ?? undefined);
  const rows = await listPetsForUser(user.id, getPageWindow(page));
  const pageRows = resolvePageRows(rows, page, "/api/pets");

  return NextResponse.json({
    pets: pageRows.items,
    pagination: pageRows.pagination,
  });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const body = await readJsonObject(request);
    const pet = await createPet({
      ownerId: user.id,
      name: String(body.name ?? ""),
      type: String(body.type ?? "") as PetType,
      breed: nullableText(body.breed),
      age:
        body.age === undefined || body.age === null || body.age === ""
          ? null
          : Number(body.age),
      size: nullableText(body.size),
      notes: nullableText(body.notes),
      photoUrl: nullableText(body.photoUrl),
    });

    return NextResponse.json({ pet }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
