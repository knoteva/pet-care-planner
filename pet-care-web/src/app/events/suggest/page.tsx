import { redirect } from "next/navigation";

import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function SuggestEventPage() {
  await requireCurrentSessionUser("/events/suggest");

  redirect("/events/new");
}