import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUserFromToken } from "./auth-service";
import { AUTH_COOKIE_NAME } from "./tokens";

export async function getCurrentSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return getCurrentUserFromToken(token);
}

export async function requireCurrentSessionUser(returnTo = "/dashboard") {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(returnTo)}`);
  }

  return user;
}

export async function requireAdminSessionUser(returnTo = "/admin") {
  const user = await requireCurrentSessionUser(returnTo);

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}