import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, readJsonObject, requireApiUser } from "../api-utils";
import { createEventAsManager, listEventsForViewer } from "@/services/events/event-service";
import { getPageWindow, parsePage, resolvePageRows } from "@/services/pagination";
import type { EventType } from "@/types";

export const runtime = "nodejs";

function nullableText(value: unknown) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const page = parsePage(request.nextUrl.searchParams.get("page") ?? undefined);
  const rows = await listEventsForViewer(user, getPageWindow(page));
  const pageRows = resolvePageRows(rows, page, "/api/events");

  return NextResponse.json({ events: pageRows.items, pagination: pageRows.pagination });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const body = await readJsonObject(request);
    const event = await createEventAsManager(user, {
      groupId: Number(body.groupId),
      createdById: user.id,
      title: String(body.title ?? ""),
      eventType: String(body.eventType ?? "") as EventType,
      startsAt: new Date(String(body.startsAt ?? "")),
      durationMinutes: Number(body.durationMinutes),
      location: String(body.location ?? ""),
      capacity: Number(body.capacity),
      notes: nullableText(body.notes),
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}