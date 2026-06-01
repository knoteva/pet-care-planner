import type { NextRequest } from "next/server";

import {
  clearAuthCookieRedirectResponse,
  clearAuthCookieResponse,
  isFormRequest,
} from "../route-utils";

export const runtime = "nodejs";

export function POST(request: NextRequest) {
  return isFormRequest(request)
    ? clearAuthCookieRedirectResponse(request)
    : clearAuthCookieResponse();
}
