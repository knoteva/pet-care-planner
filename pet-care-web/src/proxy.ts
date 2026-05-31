import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isAllowedApiOrigin(origin: string | null) {
  if (!origin) {
    return false;
  }

  if (origin === "https://pet-care-web-rose.vercel.app") {
    return true;
  }

  return /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):\d+$/.test(origin);
}

function setCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get("origin");

  if (isAllowedApiOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin ?? "");
    response.headers.set("Vary", "Origin");
  }

  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (request.method === "OPTIONS") {
    return setCorsHeaders(new NextResponse(null, { status: 204 }), request);
  }

  return setCorsHeaders(NextResponse.next(), request);
}

export const config = {
  matcher: "/api/:path*",
};