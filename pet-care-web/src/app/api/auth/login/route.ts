import type { NextRequest } from "next/server";

import { authErrorResponse, createAuthResponse, readJsonBody } from "../route-utils";
import { loginUser } from "@/services/auth/auth-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    const result = await loginUser({
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    return createAuthResponse(result);
  } catch (error) {
    return authErrorResponse(error);
  }
}
