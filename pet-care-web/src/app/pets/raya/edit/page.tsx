import { redirect } from "next/navigation";

import { requireCurrentSessionUser } from "@/services/auth/session";

export default async function LegacyPetEditDemoPage() {
  await requireCurrentSessionUser("/pets/raya/edit");

  redirect("/pets");
}
