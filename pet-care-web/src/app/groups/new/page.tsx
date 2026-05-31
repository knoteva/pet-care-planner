import { redirect } from "next/navigation";

import { GroupFormView } from "@/components/app-ui";
import { requireCurrentSessionUser } from "@/services/auth/session";
import { createGroup } from "@/services/groups/group-service";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  return text.length > 0 ? text : null;
}

export default async function NewGroupPage() {
  await requireCurrentSessionUser("/groups/new");

  async function createGroupAction(formData: FormData) {
    "use server";

    const user = await requireCurrentSessionUser("/groups/new");
    const title = String(formData.get("title") ?? "").trim();
    const inviteCode = String(formData.get("inviteCode") ?? "").trim().toUpperCase();

    if (!title || !inviteCode) {
      redirect("/groups/new");
    }

    await createGroup({
      title,
      inviteCode,
      createdById: user.id,
      area: optionalText(formData.get("area")),
      description: optionalText(formData.get("description")),
    });

    redirect("/groups");
  }

  return <GroupFormView action={createGroupAction} />;
}