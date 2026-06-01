import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  apiErrorResponse,
  parseRouteId,
  readJsonObject,
  requireApiUser,
} from "../../../api-utils";
import { joinEvent, leaveEvent } from "@/services/events/event-service";
import { ValidationError } from "@/services/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

async function getEventId(context: RouteContext) {
  const eventId = parseRouteId((await context.params).id);

  if (!eventId) {
    throw new ValidationError("Невалиден ID на събитие.");
  }

  return eventId;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    let petId: number | null = null;

    if ((request.headers.get("content-length") ?? "0") !== "0") {
      const body = await readJsonObject(request);
      petId =
        body.petId === undefined || body.petId === null || body.petId === ""
          ? null
          : Number(body.petId);
    }

    const participant = await joinEvent(await getEventId(context), user, petId);

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const participant = await leaveEvent(await getEventId(context), user);

    return NextResponse.json({ participant });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
