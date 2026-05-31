import { redirect } from "next/navigation";

import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function LegacyGroupDemoPage() {
  await requireCurrentSessionUser("/groups/yuzhen-park");

  redirect("/groups");
}
