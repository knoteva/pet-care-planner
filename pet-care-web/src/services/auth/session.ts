import { cookies } from "next/headers";

import { getCurrentUserFromToken } from "./auth-service";
import { AUTH_COOKIE_NAME } from "./tokens";

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return getCurrentUserFromToken(token);
}