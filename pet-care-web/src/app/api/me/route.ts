import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getApiUser, unauthorizedResponse } from "../api-utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);

  if (!user) {
    return unauthorizedResponse();
  }

  return NextResponse.json({ user });
}