import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, readJsonObject, requireApiUser } from "../api-utils";
import { createGroup, listGroupsForUser } from "@/services/groups/group-service";
import { getPageWindow, parsePage, resolvePageRows } from "@/services/pagination";

export const runtime = "nodejs";

function nullableText(value: unknown) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const page = parsePage(request.nextUrl.searchParams.get("page") ?? undefined);
  const rows = await listGroupsForUser(user.id, getPageWindow(page));
  const pageRows = resolvePageRows(rows, page, "/api/groups");

  return NextResponse.json({ groups: pageRows.items, pagination: pageRows.pagination });
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const body = await readJsonObject(request);
    const group = await createGroup({
      title: String(body.title ?? ""),
      inviteCode: String(body.inviteCode ?? "").toUpperCase(),
      createdById: user.id,
      area: nullableText(body.area),
      description: nullableText(body.description),
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}