import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, parseRouteId, requireApiUser } from "../../api-utils";
import { listEventComments } from "@/services/comments/comment-service";
import { getEventForViewer } from "@/services/events/event-service";
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
    const event = await getEventForViewer(eventId, user);

    if (!event) {
      return NextResponse.json({ error: "Събитието не е намерено." }, { status: 404 });
    }

    const comments = await listEventComments(eventId);

    return NextResponse.json({ event, comments });
  } catch (error) {
    return apiErrorResponse(error);
  }
}