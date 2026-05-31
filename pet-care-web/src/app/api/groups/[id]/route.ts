import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, parseRouteId, requireApiUser } from "../../api-utils";
import { listEventsForGroupForViewer } from "@/services/events/event-service";
import { getGroupForViewer, listGroupMembers } from "@/services/groups/group-service";
import { ValidationError } from "@/services/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

async function getGroupId(context: RouteContext) {
  const groupId = parseRouteId((await context.params).id);

  if (!groupId) {
    throw new ValidationError("Невалиден ID на група.");
  }

  return groupId;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const groupId = await getGroupId(context);
    const group = await getGroupForViewer(groupId, user);

    if (!group) {
      return NextResponse.json({ error: "Групата не е намерена." }, { status: 404 });
    }

    const [members, events] = await Promise.all([
      listGroupMembers(groupId),
      listEventsForGroupForViewer(user, groupId),
    ]);

    return NextResponse.json({ group, members, events });
  } catch (error) {
    return apiErrorResponse(error);
  }
}