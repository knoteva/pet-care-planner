import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  apiErrorResponse,
  parseRouteId,
  readJsonObject,
  requireApiUser,
} from "../../api-utils";
import { listEventComments } from "@/services/comments/comment-service";
import {
  cancelEventForAuthorizedUser,
  deleteEventForAuthorizedUser,
  getEventForViewer,
  updateEventForAuthorizedUser,
  type UpdateEventInput,
} from "@/services/events/event-service";
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
      return NextResponse.json(
        { error: "Събитието не е намерено." },
        { status: 404 },
      );
    }

    const comments = await listEventComments(eventId);

    return NextResponse.json({ event, comments });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
function eventUpdateInputFromBody(body: Record<string, unknown>): UpdateEventInput {
  const input: UpdateEventInput = {};

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    input.title = String(body.title ?? "");
  }

  if (Object.prototype.hasOwnProperty.call(body, "eventType")) {
    input.eventType = String(body.eventType ?? "") as UpdateEventInput["eventType"];
  }

  if (Object.prototype.hasOwnProperty.call(body, "startsAt")) {
    input.startsAt = String(body.startsAt ?? "");
  }

  if (Object.prototype.hasOwnProperty.call(body, "durationMinutes")) {
    input.durationMinutes = Number(body.durationMinutes);
  }

  if (Object.prototype.hasOwnProperty.call(body, "location")) {
    input.location = String(body.location ?? "");
  }

  if (Object.prototype.hasOwnProperty.call(body, "capacity")) {
    input.capacity = Number(body.capacity);
  }

  if (Object.prototype.hasOwnProperty.call(body, "notes")) {
    input.notes = body.notes === null ? null : String(body.notes ?? "");
  }

  if (Object.prototype.hasOwnProperty.call(body, "status")) {
    input.status = String(body.status ?? "") as UpdateEventInput["status"];
  }

  return input;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const eventId = await getEventId(context);
    const body = await readJsonObject(request);

    const event =
      body.action === "cancel" || body.status === "canceled"
        ? await cancelEventForAuthorizedUser(user, eventId)
        : await updateEventForAuthorizedUser(
            user,
            eventId,
            eventUpdateInputFromBody(body),
          );

    return NextResponse.json({ event });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const eventId = await getEventId(context);
    const event = await deleteEventForAuthorizedUser(user, eventId);

    return NextResponse.json({ event });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
