import { NextResponse } from "next/server";

import { AuthError, type PublicUser } from "@/services/auth/auth-service";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS } from "@/services/auth/tokens";

export type AuthResult = {
  user: PublicUser;
  token: string;
};

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_TOKEN_TTL_SECONDS,
  });

  return response;
}

export function createAuthResponse(result: AuthResult, status = 200) {
  return setAuthCookie(NextResponse.json(result, { status }), result.token);
}

export function createAuthRedirectResponse(
  result: AuthResult,
  request: Request,
  fallbackPath = "/dashboard",
) {
  const requestUrl = new URL(request.url);
  const redirectParam = requestUrl.searchParams.get("redirect") ?? fallbackPath;
  let redirectUrl = new URL(redirectParam, requestUrl.origin);

  if (redirectUrl.origin !== requestUrl.origin) {
    redirectUrl = new URL(fallbackPath, requestUrl.origin);
  }

  return setAuthCookie(NextResponse.redirect(redirectUrl, { status: 303 }), result.token);
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

export function isFormRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  return (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  );
}

export async function readAuthRequestBody(request: Request) {
  if (!isFormRequest(request)) {
    return readJsonBody(request);
  }

  const formData = await request.formData();

  return Object.fromEntries(formData.entries());
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new AuthError("Заявката трябва да съдържа валиден JSON body.");
  }
}