import { NextResponse } from "next/server";

import { AuthError, type PublicUser } from "@/services/auth/auth-service";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS } from "@/services/auth/tokens";

export type AuthResult = {
  user: PublicUser;
  token: string;
};

export function createAuthResponse(result: AuthResult, status = 200) {
  const response = NextResponse.json(result, { status });

  response.cookies.set(AUTH_COOKIE_NAME, result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_TOKEN_TTL_SECONDS,
  });

  return response;
}

export function clearAuthCookieResponse() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);

  return NextResponse.json(
    { error: "Възникна неочаквана грешка. Моля опитай отново." },
    { status: 500 },
  );
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AuthError("Заявката трябва да съдържа валиден JSON body.");
  }
}
