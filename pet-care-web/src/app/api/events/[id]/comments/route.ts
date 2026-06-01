import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, parseRouteId, readJsonObject, requireApiUser } from "../../../api-utils";
import { createEventComment, listEventComments } from "@/services/comments/comment-service";
import { getEventForViewer } from "@/services/events/event-service";
import { getPageWindow, parsePage, resolvePageRows } from "@/services/pagination";
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

    const page = parsePage(request.nextUrl.searchParams.get("page") ?? undefined);
    const rows = await listEventComments(eventId, getPageWindow(page));
    const pageRows = resolvePageRows(rows, page, `/api/events/${eventId}/comments`);

    return NextResponse.json({ comments: pageRows.items, pagination: pageRows.pagination });
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
