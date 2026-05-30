import type { NextRequest } from "next/server";

import {
  authErrorResponse,
  createAuthRedirectResponse,
  createAuthResponse,
  isFormRequest,
  readAuthRequestBody,
} from "../route-utils";
import { loginUser } from "@/services/auth/auth-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const shouldRedirect = isFormRequest(request);
    const body = await readAuthRequestBody(request);
    const result = await loginUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    return shouldRedirect
      ? createAuthRedirectResponse(result, request)
      : createAuthResponse(result);
  } catch (error) {
    return authErrorResponse(error);
  }
}