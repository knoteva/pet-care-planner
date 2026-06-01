import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  apiErrorResponse,
  parseRouteId,
  readJsonObject,
  requireApiUser,
} from "../../api-utils";
import {
  getPetForUser,
  softDeletePetForUser,
  updatePetForUser,
} from "@/services/pets/pet-service";
import { ValidationError } from "@/services/validation";
import type { PetType } from "@/types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function nullableText(value: unknown) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

async function getPetId(context: RouteContext) {
  const petId = parseRouteId((await context.params).id);

  if (!petId) {
    throw new ValidationError("Невалиден ID на любимец.");
  }

  return petId;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const pet = await getPetForUser(await getPetId(context), user.id);

    if (!pet) {
      return NextResponse.json(
        { error: "Любимецът не е намерен." },
        { status: 404 },
      );
    }

    return NextResponse.json({ pet });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const body = await readJsonObject(request);
    const pet = await updatePetForUser(await getPetId(context), user.id, {
      name: body.name === undefined ? undefined : String(body.name),
      type:
        body.type === undefined ? undefined : (String(body.type) as PetType),
      breed: body.breed === undefined ? undefined : nullableText(body.breed),
      age:
        body.age === undefined
          ? undefined
          : body.age === null || body.age === ""
            ? null
            : Number(body.age),
      size: body.size === undefined ? undefined : nullableText(body.size),
      notes: body.notes === undefined ? undefined : nullableText(body.notes),
      photoUrl:
        body.photoUrl === undefined ? undefined : nullableText(body.photoUrl),
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Любимецът не е намерен." },
        { status: 404 },
      );
    }

    return NextResponse.json({ pet });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const pet = await softDeletePetForUser(await getPetId(context), user.id);

    if (!pet) {
      return NextResponse.json(
        { error: "Любимецът не е намерен." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
