import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, parseRouteId, readJsonObject, requireApiUser } from "../../../api-utils";
import { createEventComment, listEventComments } from "@/services/comments/comment-service";
import { getEventForUser } from "@/services/events/event-service";
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

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const eventId = await getEventId(context);
    const event = await getEventForUser(eventId, user.id);

    if (!event) {
      return NextResponse.json({ error: "Събитието не е намерено." }, { status: 404 });
    }

    return NextResponse.json({ comments: await listEventComments(eventId) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const body = await readJsonObject(request);
    const comment = await createEventComment(user, await getEventId(context), String(body.text ?? ""));

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}