import { clearAuthCookieResponse } from "../route-utils";

export const runtime = "nodejs";

export function POST() {
  return clearAuthCookieResponse();
}
