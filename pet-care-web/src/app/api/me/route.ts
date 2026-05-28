import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCurrentUserFromToken } from "@/services/auth/auth-service";
import { AUTH_COOKIE_NAME } from "@/services/auth/tokens";

export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice("bearer ".length).trim();
}

export async function GET(request: NextRequest) {
  const token = getBearerToken(request) ?? request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
  const user = await getCurrentUserFromToken(token);

  if (!user) {
    return NextResponse.json({ error: "Не си влязъл в профила." }, { status: 401 });
  }

  return NextResponse.json({ user });
}
