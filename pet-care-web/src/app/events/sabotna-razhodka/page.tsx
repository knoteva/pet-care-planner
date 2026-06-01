import { redirect } from "next/navigation";

import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function LegacyEventDemoPage() {
  await requireCurrentSessionUser("/events/sabotna-razhodka");

  redirect("/dashboard");
}
