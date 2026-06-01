import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  AuthError,
  getCurrentUserFromToken,
  type PublicUser,
} from "@/services/auth/auth-service";
import { AUTH_COOKIE_NAME } from "@/services/auth/tokens";
import { ValidationError } from "@/services/validation";

export function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice("bearer ".length).trim();
}

export async function getApiUser(
  request: NextRequest,
): Promise<PublicUser | null> {
  const token =
    getBearerToken(request) ??
    request.cookies.get(AUTH_COOKIE_NAME)?.value ??
    null;

  return getCurrentUserFromToken(token);
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Не си влязъл в профила." },
    { status: 401 },
  );
}

export async function requireApiUser(request: NextRequest) {
  const user = await getApiUser(request);

  if (!user) {
    return { user: null, response: unauthorizedResponse() };
  }

  return { user, response: null };
}

export async function readJsonObject(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ValidationError("Заявката трябва да съдържа JSON object.");
    }

    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new ValidationError("Заявката трябва да съдържа валиден JSON body.");
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.error(error);

  return NextResponse.json(
    { error: "Възникна неочаквана грешка. Моля опитай отново." },
    { status: 500 },
  );
}

export function parseRouteId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}
