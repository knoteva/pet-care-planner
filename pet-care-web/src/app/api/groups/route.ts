import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, readJsonObject, requireApiUser } from "../api-utils";
import { createGroup, listGroupsForViewer } from "@/services/groups/group-service";
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
  const rows = await listGroupsForViewer(user, getPageWindow(page));
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
      description: nullableText(body.description),
      area: nullableText(body.area),
      inviteCode: String(body.inviteCode ?? ""),
      createdById: user.id,
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}