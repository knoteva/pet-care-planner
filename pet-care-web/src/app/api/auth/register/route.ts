import type { NextRequest } from "next/server";

import { authErrorResponse, createAuthResponse, readJsonBody } from "../route-utils";
import { registerUser } from "@/services/auth/auth-service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request);
    const result = await registerUser({
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
    });

    return createAuthResponse(result, 201);
  } catch (error) {
    return authErrorResponse(error);
  }
}
