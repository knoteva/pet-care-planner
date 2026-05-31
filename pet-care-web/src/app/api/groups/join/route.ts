import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { apiErrorResponse, readJsonObject, requireApiUser } from "../../api-utils";
import { joinGroupByInviteCode } from "@/services/groups/group-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  try {
    const body = await readJsonObject(request);
    const membership = await joinGroupByInviteCode(user.id, String(body.inviteCode ?? ""));

    return NextResponse.json({ membership }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}