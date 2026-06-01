import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  apiErrorResponse,
  parseRouteId,
  readJsonObject,
  requireApiUser,
} from "../../../../api-utils";
import {
  softDeleteEventComment,
  updateEventComment,
} from "@/services/comments/comment-service";
import { getEventForViewer } from "@/services/events/event-service";
import { ValidationError } from "@/services/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string; commentId: string }> };

async function getRouteIds(context: RouteContext) {
  const params = await context.params;
  const eventId = parseRouteId(params.id);
  const commentId = parseRouteId(params.commentId);

  if (!eventId) {
    throw new ValidationError("Невалиден ID на събитие.");
  }

  if (!commentId) {
    throw new ValidationError("Невалиден ID на коментар.");
  }

  return { eventId, commentId };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const { eventId, commentId } = await getRouteIds(context);
    const event = await getEventForViewer(eventId, user);

    if (!event) {
      return NextResponse.json(
        { error: "Събитието не е намерено." },
        { status: 404 },
      );
    }

    const body = await readJsonObject(request);
    const comment = await updateEventComment(
      commentId,
      user,
      String(body.text ?? ""),
      eventId,
    );

    if (!comment) {
      return NextResponse.json(
        { error: "Коментарът не е намерен." },
        { status: 404 },
      );
    }

    return NextResponse.json({ comment });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const { eventId, commentId } = await getRouteIds(context);
    const event = await getEventForViewer(eventId, user);

    if (!event) {
      return NextResponse.json(
        { error: "Събитието не е намерено." },
        { status: 404 },
      );
    }

    const comment = await softDeleteEventComment(commentId, user, eventId);

    if (!comment) {
      return NextResponse.json(
        { error: "Коментарът не е намерен." },
        { status: 404 },
      );
    }

    return NextResponse.json({ comment });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
